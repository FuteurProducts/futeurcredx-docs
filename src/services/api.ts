/**
 * Centralized API Service
 * Handles all HTTP requests with authentication, error handling, and interceptors
 */

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

export interface ApiError {
  message: string;
  status?: number;
  statusText?: string;
  data?: any;
}

export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
}

export interface ApiConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  enableLogging: boolean;
}

class ApiService {
  private config: ApiConfig;
  private requestInterceptors: Array<(config: RequestConfig) => RequestConfig> = [];
  private responseInterceptors: Array<(response: Response) => Response> = [];
  private errorInterceptors: Array<(error: ApiError) => ApiError> = [];

  constructor(config?: Partial<ApiConfig>) {
    this.config = {
      baseURL: import.meta.env.VITE_API_BASE_URL || 'https://futeur.app',
      timeout: 10000,
      retries: 3,
      enableLogging: import.meta.env.DEV,
      ...config
    };
  }

  /**
   * Add request interceptor
   */
  addRequestInterceptor(interceptor: (config: RequestConfig) => RequestConfig) {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Add response interceptor
   */
  addResponseInterceptor(interceptor: (response: Response) => Response) {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * Add error interceptor
   */
  addErrorInterceptor(interceptor: (error: ApiError) => ApiError) {
    this.errorInterceptors.push(interceptor);
  }

  /**
   * Get authentication token from localStorage
   */
  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Get API key from localStorage or context
   */
  private getApiKey(): string | null {
    // This will be set by the dashboard service when needed
    return localStorage.getItem('currentApiKey');
  }

  /**
   * Apply request interceptors
   */
  private applyRequestInterceptors(config: RequestConfig): RequestConfig {
    let processedConfig = { ...config };

    // Add default headers
    processedConfig.headers = {
      'Content-Type': 'application/json',
      ...processedConfig.headers,
    };

    // Add authentication headers
    const token = this.getAuthToken();
    if (token) {
      processedConfig.headers['Authorization'] = `Bearer ${token}`;
    }

    // Apply custom interceptors
    for (const interceptor of this.requestInterceptors) {
      processedConfig = interceptor(processedConfig);
    }

    return processedConfig;
  }

  /**
   * Apply response interceptors
   */
  private applyResponseInterceptors(response: Response): Response {
    let processedResponse = response;

    for (const interceptor of this.responseInterceptors) {
      processedResponse = interceptor(processedResponse);
    }

    return processedResponse;
  }

  /**
   * Apply error interceptors
   */
  private applyErrorInterceptors(error: ApiError): ApiError {
    let processedError = error;

    for (const interceptor of this.errorInterceptors) {
      processedError = interceptor(processedError);
    }

    return processedError;
  }

  /**
   * Create timeout promise
   */
  private createTimeoutPromise(timeout: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Request timeout after ${timeout}ms`));
      }, timeout);
    });
  }

  /**
   * Retry logic
   */
  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    retries: number,
    delay: number = 1000
  ): Promise<T> {
    try {
      return await requestFn();
    } catch (error) {
      if (retries > 0) {
        if (this.config.enableLogging) {
          console.log(`Request failed, retrying in ${delay}ms... (${retries} retries left)`);
        }
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.retryRequest(requestFn, retries - 1, delay * 2);
      }
      throw error;
    }
  }

  /**
   * Make HTTP request
   */
  async request<T = any>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.config.baseURL}${endpoint}`;
    const requestConfig = this.applyRequestInterceptors(config);

    // Attempt to attach Clerk session token if available and no Authorization header present
    try {
      const currentHeaders: Record<string, string> = requestConfig.headers || {};
      const hasAuthorizationHeader = !!currentHeaders['Authorization'];
      const clerk = (window as any)?.Clerk;

      if (!hasAuthorizationHeader && clerk?.session?.getToken) {
        // Prefer a specific JWT template if configured; fall back to default token
        const jwtTemplate = (import.meta as any)?.env?.VITE_CLERK_JWT_TEMPLATE;
        let jwt: string | null = null;
        if (jwtTemplate) {
          try {
            jwt = await clerk.session.getToken({ template: jwtTemplate });
          } catch (_) {
            jwt = null;
          }
        }
        if (!jwt) {
          jwt = await clerk.session.getToken();
        }
        if (jwt) {
          requestConfig.headers = {
            ...currentHeaders,
            Authorization: `Bearer ${jwt}`,
          };
        }
      }
    } catch (tokenError) {
      if (this.config.enableLogging) {
        console.warn('Unable to attach Clerk token to request:', tokenError);
      }
    }

    if (this.config.enableLogging) {
      console.log(`🚀 API Request: ${requestConfig.method || 'GET'} ${url}`, {
        headers: requestConfig.headers,
        body: requestConfig.body
      });
    }

    const makeRequest = async (): Promise<ApiResponse<T>> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), requestConfig.timeout || this.config.timeout);

      try {
        const response = await fetch(url, {
          method: requestConfig.method || 'GET',
          headers: requestConfig.headers,
          body: requestConfig.body ? JSON.stringify(requestConfig.body) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const processedResponse = this.applyResponseInterceptors(response);

        if (!processedResponse.ok) {
          const errorText = await processedResponse.text();
          let errorData;
          
          try {
            errorData = JSON.parse(errorText);
          } catch {
            errorData = errorText;
          }

          const apiError: ApiError = {
            message: errorText || processedResponse.statusText,
            status: processedResponse.status,
            statusText: processedResponse.statusText,
            data: errorData,
          };

          throw this.applyErrorInterceptors(apiError);
        }

        const data = await processedResponse.json();

        if (this.config.enableLogging) {
          console.log(`✅ API Response: ${processedResponse.status} ${url}`, data);
        }

        return {
          data,
          status: processedResponse.status,
          statusText: processedResponse.statusText,
          headers: processedResponse.headers,
        };
      } catch (error) {
        clearTimeout(timeoutId);
        
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            throw this.applyErrorInterceptors({
              message: `Request timeout after ${requestConfig.timeout || this.config.timeout}ms`,
              status: 408,
            });
          }
          
          throw this.applyErrorInterceptors({
            message: error.message,
            status: 0,
          });
        }
        
        throw error;
      }
    };

    const retries = requestConfig.retries ?? this.config.retries;
    return this.retryRequest(makeRequest, retries);
  }

  /**
   * GET request
   */
  async get<T = any>(endpoint: string, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T = any>(endpoint: string, data?: any, config?: Omit<RequestConfig, 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'POST', body: data });
  }

  /**
   * PUT request
   */
  async put<T = any>(endpoint: string, data?: any, config?: Omit<RequestConfig, 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body: data });
  }

  /**
   * DELETE request
   */
  async delete<T = any>(endpoint: string, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  /**
   * PATCH request
   */
  async patch<T = any>(endpoint: string, data?: any, config?: Omit<RequestConfig, 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', body: data });
  }

  /**
   * Set API key for requests
   */
  setApiKey(apiKey: string | null) {
    if (apiKey) {
      localStorage.setItem('currentApiKey', apiKey);
    } else {
      localStorage.removeItem('currentApiKey');
    }
  }

  /**
   * Clear authentication data
   */
  clearAuth() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUserEmail');
    localStorage.removeItem('currentApiKey');
  }
}

// Create default instance
const apiService = new ApiService();

// Add default interceptors
apiService.addRequestInterceptor((config) => {
  // Add API key header if available
  const apiKey = apiService.getApiKey();
  if (apiKey && config.headers) {
    config.headers['X-API-Key'] = apiKey;
  }
  return config;
});

apiService.addErrorInterceptor((error) => {
  // Handle common error cases
  if (error.status === 401) {
    // Clear auth data on unauthorized
    apiService.clearAuth();
    error.message = 'Authentication failed. Please sign in again.';
  } else if (error.status === 403) {
    error.message = 'Access forbidden. Please check your permissions.';
  } else if (error.status === 404) {
    error.message = 'Resource not found.';
  } else if (error.status === 500) {
    error.message = 'Internal server error. Please try again later.';
  }
  
  return error;
});

export default apiService;
export { ApiService };


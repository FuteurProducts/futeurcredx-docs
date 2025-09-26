/**
 * Services Index
 * Centralized export for all API services
 */

export { default as apiService, ApiService } from './api'
export { default as authService } from './authService'
export { default as dashboardService } from './dashboardService'

// Re-export types for convenience
export type { User, AuthError, LoginCredentials, RegisterCredentials, AuthResponse } from './authService'
export type { ApiKey, ApiKeyConfig, ApiStats, CreateApiKeyRequest, ApiKeyError } from './dashboardService'
export type { ApiResponse, ApiError, RequestConfig, ApiConfig } from './api'

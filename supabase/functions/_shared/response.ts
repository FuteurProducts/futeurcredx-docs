// Standard BFF Response Envelope
import { corsHeaders } from './cors.ts';

export interface DataSource {
  name: string;
  type: string;
  pulledAt: string;
  coveragePct?: number;
  freshnessHours?: number;
}

export interface ResponseMeta {
  requestId: string;
  timestamp: string;
  lastUpdated?: string;
  dataSources?: DataSource[];
  coveragePct?: number;
  pagination?: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

export interface BffResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta: ResponseMeta;
}

// Generate unique request ID
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Success response
export function successResponse<T>(
  data: T,
  options: {
    lastUpdated?: string;
    dataSources?: DataSource[];
    coveragePct?: number;
    pagination?: ResponseMeta['pagination'];
  } = {}
): Response {
  const response: BffResponse<T> = {
    success: true,
    data,
    meta: {
      requestId: generateRequestId(),
      timestamp: new Date().toISOString(),
      lastUpdated: options.lastUpdated,
      dataSources: options.dataSources,
      coveragePct: options.coveragePct,
      pagination: options.pagination
    }
  };

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

// Error response
export function errorResponse(
  code: string,
  message: string,
  status: number = 400,
  details?: unknown
): Response {
  const response: BffResponse<null> = {
    success: false,
    error: { code, message, details },
    meta: {
      requestId: generateRequestId(),
      timestamp: new Date().toISOString()
    }
  };

  return new Response(JSON.stringify(response), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

// Not found response
export function notFoundResponse(resource: string): Response {
  return errorResponse('NOT_FOUND', `${resource} not found`, 404);
}

// Unauthorized response
export function unauthorizedResponse(message: string = 'Unauthorized'): Response {
  return errorResponse('UNAUTHORIZED', message, 401);
}

// Forbidden response
export function forbiddenResponse(message: string = 'Access denied'): Response {
  return errorResponse('FORBIDDEN', message, 403);
}

// Validation error response
export function validationErrorResponse(message: string, details?: unknown): Response {
  return errorResponse('VALIDATION_ERROR', message, 422, details);
}

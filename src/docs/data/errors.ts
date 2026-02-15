// =============================================================================
// Lumiq Developer Docs — Error Reference & Response Envelope Documentation
// =============================================================================

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface HttpStatusDoc {
  status: number;
  title: string;
  description: string;
  commonCauses: string[];
  resolution: string;
  example: Record<string, unknown>;
}

export interface ResponseEnvelopeField {
  field: string;
  type: string;
  description: string;
  nullable: boolean;
}

// ---------------------------------------------------------------------------
// Response Envelope Documentation
// ---------------------------------------------------------------------------

export const responseEnvelopeFields: ResponseEnvelopeField[] = [
  {
    field: 'success',
    type: 'boolean',
    description:
      'Indicates whether the request was processed successfully. Always present in every response.',
    nullable: false,
  },
  {
    field: 'data',
    type: 'T | T[] | null',
    description:
      'The response payload. Contains a single object (BffResponse) or array (BffListResponse) on success. Null on error.',
    nullable: true,
  },
  {
    field: 'error',
    type: 'object | null',
    description:
      'Error details when the request fails. Null on success. Contains code, message, and optional details array.',
    nullable: true,
  },
  {
    field: 'error.code',
    type: 'string',
    description:
      'Machine-readable error code (e.g., UNAUTHORIZED, VALIDATION_ERROR, NOT_FOUND). Use this for programmatic error handling.',
    nullable: false,
  },
  {
    field: 'error.message',
    type: 'string',
    description:
      'Human-readable error message suitable for logging. Do not display to end users without sanitization.',
    nullable: false,
  },
  {
    field: 'error.details',
    type: 'Array<{ field: string; issue: string }> | undefined',
    description:
      'Optional array of field-level validation errors. Present on 400 and 422 responses.',
    nullable: true,
  },
  {
    field: 'meta',
    type: 'object',
    description:
      'Request metadata including data sources, pagination info, and timestamps.',
    nullable: false,
  },
  {
    field: 'meta.requestId',
    type: 'string',
    description:
      'Unique request identifier for tracing and support. Include this in bug reports.',
    nullable: false,
  },
  {
    field: 'meta.dataSources',
    type: 'string[]',
    description:
      'Array of data sources consulted for the response (e.g., ["prisma"]).',
    nullable: false,
  },
  {
    field: 'meta.lastUpdated',
    type: 'string (ISO 8601)',
    description:
      'Timestamp of when the underlying data was last refreshed.',
    nullable: false,
  },
  {
    field: 'meta.page',
    type: 'number | undefined',
    description:
      'Current page number (1-indexed). Present in paginated list responses.',
    nullable: true,
  },
  {
    field: 'meta.pageSize',
    type: 'number | undefined',
    description:
      'Number of items per page. Present in paginated list responses.',
    nullable: true,
  },
  {
    field: 'meta.total',
    type: 'number | undefined',
    description:
      'Total number of items matching the query. Present in paginated list responses.',
    nullable: true,
  },
  {
    field: 'meta.totalPages',
    type: 'number | undefined',
    description:
      'Total number of pages. Present in paginated list responses.',
    nullable: true,
  },
];

export const successEnvelopeExample: Record<string, unknown> = {
  success: true,
  data: {
    id: '33ae8a27-8718-4a96-8cd5-f472de6a77ee',
    name: 'Chase SMB National',
    code: 'CHASE-SMB-NAT',
  },
  error: null,
  meta: {
    requestId: 'req_01abc123def456',
    dataSources: ['prisma'],
    lastUpdated: '2026-02-15T22:27:27.323Z',
  },
};

export const paginatedEnvelopeExample: Record<string, unknown> = {
  success: true,
  data: [
    { id: 'biz_001', name: 'Apex Manufacturing LLC' },
    { id: 'biz_002', name: 'Bright Path Consulting' },
  ],
  error: null,
  meta: {
    requestId: 'req_02def456ghi789',
    dataSources: ['prisma'],
    lastUpdated: '2026-02-15T22:27:27.323Z',
    page: 1,
    pageSize: 20,
    total: 6000000,
    totalPages: 300000,
  },
};

export const errorEnvelopeExample: Record<string, unknown> = {
  success: false,
  data: null,
  error: {
    code: 'VALIDATION_ERROR',
    message: 'portfolioId is required',
    details: [
      { field: 'portfolioId', issue: 'Required query parameter missing' },
    ],
  },
  meta: {
    requestId: 'req_03ghi789jkl012',
  },
};

// ---------------------------------------------------------------------------
// HTTP Status Reference
// ---------------------------------------------------------------------------

export const httpStatuses: HttpStatusDoc[] = [
  {
    status: 200,
    title: 'OK',
    description:
      'The request succeeded. The response body contains the requested data wrapped in the standard envelope.',
    commonCauses: [
      'Normal successful request',
      'GET, POST, PUT, PATCH, and DELETE operations that complete without error',
    ],
    resolution: 'No action needed. Parse the data field from the response envelope.',
    example: {
      success: true,
      data: {
        status: 'ok',
        timestamp: '2026-02-15T22:27:27.323Z',
        version: '1.0.0',
      },
      error: null,
      meta: {
        dataSources: ['prisma'],
        lastUpdated: '2026-02-15T22:27:27.323Z',
      },
    },
  },
  {
    status: 400,
    title: 'Bad Request',
    description:
      'The request was malformed or contained invalid parameters. The error details will indicate which fields failed validation.',
    commonCauses: [
      'Missing required query parameter (e.g., portfolioId)',
      'Invalid parameter format (e.g., non-UUID portfolioId)',
      'Invalid page or pageSize values',
      'Malformed JSON in request body',
    ],
    resolution:
      'Check the error.details array for specific field-level issues. Ensure all required parameters are present and correctly formatted.',
    example: {
      success: false,
      data: null,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'portfolioId is required',
        details: [
          { field: 'portfolioId', issue: 'Required query parameter missing' },
        ],
      },
      meta: {
        requestId: 'req_bad400_001',
      },
    },
  },
  {
    status: 401,
    title: 'Unauthorized',
    description:
      'Authentication failed. The API key is missing, invalid, expired, or revoked.',
    commonCauses: [
      'Missing X-API-Key header',
      'Invalid or malformed API key',
      'Revoked API key',
      'Expired JWT token',
      'Using a development key against production endpoints (or vice versa)',
    ],
    resolution:
      'Verify your API key is correct and active. Check the X-API-Key header is present. For JWT auth, ensure the token has not expired and refresh if needed.',
    example: {
      success: false,
      data: null,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid or missing API key',
      },
      meta: {
        requestId: 'req_auth401_001',
      },
    },
  },
  {
    status: 403,
    title: 'Forbidden',
    description:
      'The authenticated user does not have permission to access the requested resource. The API key is valid but lacks the required scope.',
    commonCauses: [
      'API key does not have access to the requested portfolio',
      'Insufficient role permissions (e.g., readonly user attempting a write operation)',
      'Tenant isolation violation (accessing another tenant\'s data)',
      'Attempting to access production data with a sandbox key',
    ],
    resolution:
      'Verify your API key has the correct scopes and tenant association. Contact your administrator to adjust permissions if needed.',
    example: {
      success: false,
      data: null,
      error: {
        code: 'FORBIDDEN',
        message: 'You do not have permission to access this portfolio',
      },
      meta: {
        requestId: 'req_forbid403_001',
      },
    },
  },
  {
    status: 404,
    title: 'Not Found',
    description:
      'The requested resource does not exist or is not accessible within the current tenant scope.',
    commonCauses: [
      'Invalid resource ID (business, portfolio, report, etc.)',
      'Resource was deleted or archived',
      'Typo in the URL path',
      'Accessing a resource from a different tenant',
    ],
    resolution:
      'Verify the resource ID is correct. Use the corresponding list endpoint to confirm the resource exists within your portfolio.',
    example: {
      success: false,
      data: null,
      error: {
        code: 'NOT_FOUND',
        message: 'Business not found',
      },
      meta: {
        requestId: 'req_notfound404_001',
      },
    },
  },
  {
    status: 422,
    title: 'Unprocessable Entity',
    description:
      'The request was well-formed but the server could not process it due to semantic validation failures. The request syntax is correct but the data is logically invalid.',
    commonCauses: [
      'Invalid report type or format combination',
      'Webhook URL is not HTTPS',
      'Empty events array in webhook subscription',
      'Date range where startDate is after endDate',
      'Requesting a report for a portfolio with insufficient data',
    ],
    resolution:
      'Review the error.details array for specific field issues. Ensure all values conform to the documented enum options and business rules.',
    example: {
      success: false,
      data: null,
      error: {
        code: 'UNPROCESSABLE_ENTITY',
        message: 'Invalid report configuration',
        details: [
          { field: 'type', issue: 'Must be one of: risk, compliance, performance' },
          { field: 'format', issue: 'Must be one of: pdf, csv' },
        ],
      },
      meta: {
        requestId: 'req_unproc422_001',
      },
    },
  },
  {
    status: 429,
    title: 'Too Many Requests',
    description:
      'Rate limit exceeded. The client has sent too many requests in a given time window. Sandbox environments have a limit of 100 requests per minute per API key.',
    commonCauses: [
      'Exceeding the rate limit (100 req/min for sandbox, 1000 req/min for production)',
      'Polling too aggressively for report status',
      'Automated scripts without rate limiting or backoff',
      'Maximum API key count reached (for key creation)',
    ],
    resolution:
      'Implement exponential backoff with jitter. Check the Retry-After header for the recommended wait time. For production workloads, contact sales for higher limits.',
    example: {
      success: false,
      data: null,
      error: {
        code: 'RATE_LIMITED',
        message: 'Rate limit exceeded. Try again in 45 seconds.',
        details: [
          { field: 'retryAfter', issue: '45' },
        ],
      },
      meta: {
        requestId: 'req_ratelimit429_001',
      },
    },
  },
  {
    status: 500,
    title: 'Internal Server Error',
    description:
      'An unexpected error occurred on the server. This indicates a bug or infrastructure issue on our side.',
    commonCauses: [
      'Temporary database connectivity issues',
      'Unhandled edge case in business logic',
      'Third-party service dependency failure',
      'Infrastructure scaling event',
    ],
    resolution:
      'Retry the request with exponential backoff. If the error persists, contact support with the meta.requestId value. Do not retry non-idempotent operations (POST, DELETE) without confirming the original request did not succeed.',
    example: {
      success: false,
      data: null,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred. Please try again later.',
      },
      meta: {
        requestId: 'req_internal500_001',
      },
    },
  },
];

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------

export const httpStatusByCode: Record<number, HttpStatusDoc> = httpStatuses.reduce<
  Record<number, HttpStatusDoc>
>((acc, status) => {
  acc[status.status] = status;
  return acc;
}, {});

/** Error codes used across the API */
export const errorCodes = [
  { code: 'UNAUTHORIZED', httpStatus: 401, description: 'Authentication failed or missing' },
  { code: 'FORBIDDEN', httpStatus: 403, description: 'Insufficient permissions' },
  { code: 'NOT_FOUND', httpStatus: 404, description: 'Resource does not exist' },
  { code: 'VALIDATION_ERROR', httpStatus: 400, description: 'Request parameter validation failed' },
  { code: 'UNPROCESSABLE_ENTITY', httpStatus: 422, description: 'Semantic validation failed' },
  { code: 'RATE_LIMITED', httpStatus: 429, description: 'Too many requests' },
  { code: 'INTERNAL_ERROR', httpStatus: 500, description: 'Unexpected server error' },
] as const;

export type ErrorCode = (typeof errorCodes)[number]['code'];

/** Rate limit tiers */
export const rateLimits = [
  {
    environment: 'sandbox' as const,
    requestsPerMinute: 100,
    requestsPerDay: 10000,
    concurrentConnections: 10,
    description: 'Suitable for development and testing',
  },
  {
    environment: 'production' as const,
    requestsPerMinute: 1000,
    requestsPerDay: 1000000,
    concurrentConnections: 100,
    description: 'Production workloads with auto-scaling',
  },
];

/** Headers returned in error responses */
export const errorHeaders = [
  {
    header: 'X-Request-Id',
    description: 'Unique request identifier. Matches meta.requestId in the response body.',
    example: 'req_01abc123def456',
  },
  {
    header: 'Retry-After',
    description: 'Seconds to wait before retrying. Only present on 429 responses.',
    example: '45',
  },
  {
    header: 'X-RateLimit-Limit',
    description: 'Maximum requests allowed in the current window.',
    example: '100',
  },
  {
    header: 'X-RateLimit-Remaining',
    description: 'Requests remaining in the current window.',
    example: '23',
  },
  {
    header: 'X-RateLimit-Reset',
    description: 'Unix timestamp when the rate limit window resets.',
    example: '1739661600',
  },
];

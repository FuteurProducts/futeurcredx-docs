export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"

export interface ApiParameter {
  name: string
  type: string
  description: string
}

export interface ApiResponse {
  status: number;
  description: string;
  schema?: Record<string, unknown>;
  headers?: Record<string, string>;
}

export type ContentBlock = 
  | { type: 'paragraph'; content: string } 
  | { type: 'code'; language: string; content: string }
  | { type: 'image'; src: string; alt: string }
  | { type: 'heading'; level: 2 | 3 | 4; content: string }
  | { type: 'list'; items: string[] };

export interface InfoSection {
  type: 'info';
  path: string;
  description: string;
  longDescription?: string; // Kept for simplicity for items not yet updated
  content?: ContentBlock[];
}

export interface ApiEndpoint {
  type: 'endpoint';
  method: HttpMethod
  path: string
  protected: boolean
  description: string
  longDescription?: string
  parameters?: ApiParameter[]
  bodySchema?: Record<string, unknown>
  responses?: ApiResponse[]
}

export interface ApiCategory {
  id: string
  name: string
  endpoints: (ApiEndpoint | InfoSection)[]
}

export const apiData: ApiCategory[] = [
  {
    id: "overview",
    name: "Overview",
    endpoints: [
      {
        type: 'info',
        path: "/authentication",
        description: "Authentication",
        content: [
          { type: 'paragraph', content: 'Authentication is managed via Clerk. To get started, you will need to create an account to access your dashboard and generate an API key.' },
          { type: 'paragraph', content: 'If you do not have an account, you can sign up at [www.futeurcredx.com/signup](http://www.futeurcredx.com/signup). If you already have an account, please log in at [www.futeurcredx.com/login](http://www.futeurcredx.com/login).' },
          { type: 'image', src: '/Signup.png', alt: 'FuteurCredX Signup Page' },
          { type: 'paragraph', content: 'Once you are logged into your dashboard, you can obtain your API key. All API requests must include an `Authorization` header with your API key provided as a Bearer token.' },
          { type: 'code', language: 'bash', content: 'curl --request GET \\n  --url https://futeur.app/api/v1/credit-report \\n  --header \'Authorization: Bearer <YOUR_API_KEY>\'' }
        ]
      },
      {
        type: 'info',
        path: "/versioning",
        description: "Versioning",
        content: [
          { type: 'paragraph', content: 'When backwards-incompatible updates to non-beta products are made, a new API version is released. When a new version is released, you can choose whether to continue using an existing API version or update your application to the newer version.' },
          { type: 'paragraph', content: 'To specify the API version of a request, use the `FuteurCredX-Version` header. If the header is not provided, it will default to the latest major version. It is recommended to always include the version header.' },
          { type: 'code', language: 'bash', content: 'curl -X POST \'https://futeur.app/api/v1/some-endpoint\' \n  -H \'Content-Type: application/json\' \n  -H \'FuteurCredX-Version: 1.0\'' },
          { type: 'heading', level: 2, content: 'Backwards Compatible Changes' },
          { type: 'paragraph', content: 'FuteurCredX considers the following changes to be backwards compatible:' },
          { type: 'list', items: [
            'Adding new API endpoints.',
            'Adding new optional parameters to existing API endpoints.',
            'Adding new properties to existing API response schemas.',
            'Adding new values to enum fields in API responses.',
            'Changing the length or format of human-readable strings like error messages.'
          ]}
        ]
      },
    ],
  },
  {
    id: "default",
    name: "Default",
    endpoints: [
      {
        type: 'endpoint',
        method: "GET",
        path: "/api/v1",
        protected: false,
        description: "Welcome to FuteurCred API documentation.",
        responses: [
          {
            status: 200,
            description: "Successful response",
            schema: { message: "Welcome to TheFuteur API v1.0" },
            headers: {
              'access-control-allow-credentials': 'true',
              'connection': 'keep-alive',
              'content-encoding': 'gzip',
              'content-type': 'text/html; charset=utf-8',
              'date': 'Wed, 20 Aug 2025 04:33:05 GMT',
              'etag': 'W/"1d-HTTyUSjjUknU9lJKq97MjYD5M60"',
              'server': 'nginx/1.24.0 (Ubuntu)',
              'transfer-encoding': 'chunked',
              'vary': 'Origin',
              'x-clerk-auth-reason': 'session-token-and-uat-missing',
              'x-clerk-auth-status': 'signed-out',
              'x-powered-by': 'Express'
            }
          }
        ],
        longDescription: "This is the main entry point for the FuteurCred API. It provides a brief overview of the available endpoints and their functionalities.",
      },
    ],
  },
  {
    id: "lumiq-credit",
    name: "LUMIQ AI Credit",
    endpoints: [
      {
        type: 'endpoint',
        method: "GET",
        path: "/api/v1/credit-report",
        protected: true,
        description: "Retrieves comprehensive business credit report including trade payment experiences, collections, and credit scores.",
        longDescription: "This endpoint fetches a detailed credit report for a specified business. The report includes information on trade payment experiences, collections, and credit scores.",
        parameters: [{ name: "businessId", type: "string", description: "The business unique identifier" }],
      },
      {
        type: 'endpoint',
        method: "POST",
        path: "/api/v1/lumiq-credit-journey",
        protected: true,
        description: "Retrieves detailed credit journey data including payment history, credit utilization, and improvement recommendations.",
        longDescription: "This endpoint provides a detailed view of a user's credit journey, including their payment history, credit utilization, and personalized recommendations for improvement based on the provided business information. Note: This endpoint requires a valid JWT for user authentication and a generated API key for application authorization.",
        parameters: [
          { name: "X-API-Key", type: "string", description: "Your generated API key." }
        ],
        bodySchema: {
          name: "string",
          city: "string",
          state: "string"
        },
      },
    ],
  },
]

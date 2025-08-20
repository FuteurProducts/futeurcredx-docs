export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"

export interface ApiEndpoint {
  method: HttpMethod
  path: string
  protected: boolean
  description: string
  parameters?: { name: string; type: string; description: string }[]
  bodySchema?: Record<string, unknown>
}

export interface ApiCategory {
  id: string
  name: string
  endpoints: ApiEndpoint[]
}

export const apiData: ApiCategory[] = [
  {
    id: "default",
    name: "Default",
    endpoints: [
      {
        method: "GET",
        path: "/api/v1",
        protected: false,
        description: "Welcome to FuteurCred API documentation.",
      },
    ],
  },
  {
    id: "lumiq-credit",
    name: "LUMIQ AI Credit",
    endpoints: [
      {
        method: "GET",
        path: "/api/v1/credit-report",
        protected: true,
        description: "Retrieves comprehensive business credit report including trade payment experiences, collections, and credit scores.",
        parameters: [{ name: "businessId", type: "string", description: "The business unique identifier" }],
      },
      {
        method: "GET",
        path: "/api/v1/lumiq-credit-journey",
        protected: true,
        description: "Retrieves detailed credit journey data including payment history, credit utilization, and improvement recommendations.",
        parameters: [{ name: "userId", type: "string", description: "The user's unique identifier" }],
      },
    ],
  },
]

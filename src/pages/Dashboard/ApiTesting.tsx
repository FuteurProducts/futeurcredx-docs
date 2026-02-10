import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"

interface ApiEndpoint {
  method: HttpMethod
  path: string
  actualPath: string
  protected: boolean
  description: string
  name: string
  parameters?: { name: string; type: string; description: string }[]
  bodySchema?: Record<string, any>
  defaultBody?: Record<string, any>
}

const endpoints: ApiEndpoint[] = [
      {
        method: "GET",
    path: "/v1/credit/report/{business_id}",
    actualPath: "/api/v1/credit-report",
    name: "Get Credit Report",
    protected: true,
    description: "Retrieves comprehensive business credit report including trade payment experiences, collections, and credit scores.",
    parameters: [{ name: "business_id", type: "string", description: "The business unique identifier" }],
  },
      {
        method: "POST",
    path: "/v1/experian/ext/score",
    actualPath: "/api/v1/experian/ext/score",
    name: "Get Experian Score",
        protected: true,
        description: "Get Lumiq credit score for a business using name, city, and state information.",
        bodySchema: {
          name: "string",
          city: "string", 
          state: "string"
    },
    defaultBody: {
      name: "EXPERIAN CONSUMER DIRECT",
      city: "Costa Mesa",
      state: "CA"
        }
  },
      {
        method: "GET",
    path: "/v1/credit/journey/{user_id}",
    actualPath: "/api/v1/lumiq-credit-journey",
    name: "Credit Journey",
        protected: true,
    description: "Retrieves detailed credit journey data including payment history and recommendations.",
    parameters: [{ name: "user_id", type: "string", description: "The user's unique identifier" }],
      },
      {
        method: "GET",
    path: "/api/v1",
    actualPath: "/api/v1",
    name: "API Status",
    protected: false,
    description: "Check API status and get welcome message.",
  },
]

const getMethodColor = (method: HttpMethod) => {
  switch (method) {
    case "GET": return "text-primary bg-primary/10"
    case "POST": return "text-success bg-success/10"
    case "PUT": return "text-warning bg-warning/10"
    case "DELETE": return "text-destructive bg-destructive/10"
    case "PATCH": return "text-[var(--primary-04)] bg-[var(--primary-04)]/10"
    default: return "text-muted-foreground bg-muted"
  }
}

interface ApiTestingProps {
  apiKeys: any[]
}

const ApiTesting: React.FC<ApiTestingProps> = ({ apiKeys }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>(endpoints[0])
  const [keyInputMode, setKeyInputMode] = useState<'select' | 'manual'>('select')
  const [selectedApiKey, setSelectedApiKey] = useState('')
  const [manualApiKey, setManualApiKey] = useState('')
  const [showManualKey, setShowManualKey] = useState(false)
  const [paramValues, setParamValues] = useState<Record<string, string>>({})
  const [requestBody, setRequestBody] = useState('')
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [responseStatus, setResponseStatus] = useState<number | null>(null)
  const [responseTime, setResponseTime] = useState<number | null>(null)
  const [showHeaders, setShowHeaders] = useState(false)

  // Get the active API key based on mode
  const getActiveApiKey = () => {
    return keyInputMode === 'manual' ? manualApiKey : selectedApiKey
  }

  const handleSendRequest = async () => {
    const apiKey = getActiveApiKey()
    
    if (selectedEndpoint.protected && !apiKey) {
      setResponse({ error: 'API key required for protected endpoints' })
      setResponseStatus(401)
      return
    }

    setLoading(true)
    setResponse(null)
    setResponseStatus(null)
    setResponseTime(null)

    const startTime = Date.now()

    try {
      // Build the actual request URL
      let url = selectedEndpoint.actualPath
      
      // Add query parameters for GET requests
      if (selectedEndpoint.parameters && selectedEndpoint.method === 'GET') {
        const queryParams = new URLSearchParams()
        selectedEndpoint.parameters.forEach(param => {
          if (paramValues[param.name]) {
            queryParams.append(param.name, paramValues[param.name])
          }
        })
        const queryString = queryParams.toString()
        if (queryString) {
          url += `?${queryString}`
        }
      }

      // Prepare headers
      const headers: Record<string, string> = {
              'Content-Type': 'application/json',
        'Accept': '*/*',
      }
      
      if (apiKey) {
        headers['X-API-Key'] = apiKey
      }

      // Prepare request options
      const requestOptions: RequestInit = {
        method: selectedEndpoint.method,
        headers,
      }

      // Add body for non-GET requests
      if (selectedEndpoint.method !== 'GET') {
        let bodyData: any
        if (requestBody && requestBody.trim()) {
          try {
            bodyData = JSON.parse(requestBody)
          } catch (e) {
            setResponse({ error: 'Invalid JSON in request body' })
            setResponseStatus(400)
            setLoading(false)
            return
          }
        } else if (selectedEndpoint.defaultBody) {
          bodyData = selectedEndpoint.defaultBody
        }
        
        if (bodyData) {
          requestOptions.body = JSON.stringify(bodyData)
        }
      }

      // Make the actual API call
      const apiResponse = await fetch(url, requestOptions)
      const endTime = Date.now()
      setResponseTime(endTime - startTime)

      // Parse response
      let responseData: any
      const contentType = apiResponse.headers.get('content-type')
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await apiResponse.json()
      } else {
        const textResponse = await apiResponse.text()
        try {
          responseData = JSON.parse(textResponse)
        } catch {
          responseData = { message: textResponse }
        }
      }

      setResponse(responseData)
      setResponseStatus(apiResponse.status)

    } catch (error: any) {
      const endTime = Date.now()
      setResponseTime(endTime - startTime)
      
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        setResponse({ 
          error: 'Network Error',
          message: 'Could not connect to the API. This may be due to CORS restrictions when calling from the browser.',
          suggestion: 'For production use, make API calls from your backend server.',
          details: error.message
        })
      } else {
        setResponse({ 
          error: error.message || 'Request failed',
          details: 'Check the console for more information'
        })
      }
      setResponseStatus(0)
    } finally {
      setLoading(false)
    }
  }

  // Build the display URL with parameters
  const getFullPath = () => {
    let path = selectedEndpoint.path
    if (selectedEndpoint.parameters) {
      selectedEndpoint.parameters.forEach(param => {
        path = path.replace(`{${param.name}}`, paramValues[param.name] || `{${param.name}}`)
      })
    }
    return path
  }

  const activeKey = getActiveApiKey()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-primary text-xl">{">"}_</span>
          <h2 className="text-[1.5rem] font-semibold text-foreground">Interactive API Tester</h2>
        </div>
        <p className="text-[0.9375rem] text-muted-foreground">Test API endpoints with live requests and inspect real responses</p>
      </div>

      {/* Side by Side Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Request Panel */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-center gap-2 mb-6">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <h3 className="text-[1.25rem] font-semibold text-foreground">Request</h3>
          </div>

          {/* Endpoint Selector */}
          <div className="space-y-4">
            <div>
              <label className="block text-[0.8125rem] font-semibold text-foreground mb-2">Endpoint</label>
              <div className="relative">
                <select
                  value={selectedEndpoint.path}
                  onChange={(e) => {
                    const ep = endpoints.find(ep => ep.path === e.target.value)
                    if (ep) {
                      setSelectedEndpoint(ep)
                      setResponse(null)
                      setResponseStatus(null)
                      setRequestBody('')
                    }
                  }}
                  className="w-full h-12 px-4 pr-10 bg-muted/50 border border-border/50 rounded-xl text-foreground text-[0.9375rem] font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none cursor-pointer transition-all duration-200"
                >
                  {endpoints.map((ep) => (
                    <option key={ep.path} value={ep.path}>
                      {ep.method} - {ep.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Method + Path Display */}
            <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
              <span className={`px-2 py-1 rounded-lg text-[0.75rem] font-bold ${getMethodColor(selectedEndpoint.method)}`}>
                {selectedEndpoint.method}
              </span>
              <code className="text-[0.875rem] text-foreground font-mono break-all">{getFullPath()}</code>
            </div>

            {/* Description */}
            <p className="text-[0.8125rem] text-muted-foreground">{selectedEndpoint.description}</p>

            {/* API Key Section */}
            {selectedEndpoint.protected && (
              <div className="space-y-3">
                <label className="block text-[0.8125rem] font-semibold text-foreground">API Key</label>
                
                {/* Toggle between modes */}
                <div className="flex gap-2 p-1 bg-muted rounded-xl">
                  <button
                    onClick={() => setKeyInputMode('select')}
                    className={`flex-1 py-2 px-4 rounded-lg text-[0.8125rem] font-semibold transition-all ${
                      keyInputMode === 'select' 
                        ? 'bg-card text-foreground shadow-sm' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Choose from saved
                  </button>
        <button
                    onClick={() => setKeyInputMode('manual')}
                    className={`flex-1 py-2 px-4 rounded-lg text-[0.8125rem] font-semibold transition-all ${
                      keyInputMode === 'manual' 
                        ? 'bg-card text-foreground shadow-sm' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Enter manually
        </button>
      </div>

                {keyInputMode === 'select' ? (
                  <div className="relative">
                    <select
                      value={selectedApiKey}
                      onChange={(e) => setSelectedApiKey(e.target.value)}
                      className="w-full h-12 px-4 bg-muted/50 border border-border/50 rounded-xl text-foreground text-[0.9375rem] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none cursor-pointer transition-all duration-200"
                    >
                      <option value="">Select an API key...</option>
                      {apiKeys.map((key: any) => (
                        <option key={key.id} value={key.key || key.id}>
                          {key.name} {key.environment ? `(${key.environment})` : ''}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    {apiKeys.length === 0 && (
                      <p className="mt-2 text-[0.75rem] text-destructive">No API keys found. Generate one first or enter manually.</p>
                    )}
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type={showManualKey ? "text" : "password"}
                      value={manualApiKey}
                      onChange={(e) => setManualApiKey(e.target.value)}
                      placeholder="Paste your API key here..."
                      className="w-full h-12 px-4 pr-12 bg-muted/50 border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground font-mono text-[0.8125rem] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    />
                    <button
                      onClick={() => setShowManualKey(!showManualKey)}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground hover:text-foreground"
                    >
                      {showManualKey ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Request Headers Toggle */}
            <button 
              onClick={() => setShowHeaders(!showHeaders)}
              className="flex items-center gap-2 text-[0.875rem] font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="text-primary">{"<>"}</span>
              Request Headers
              <span className="px-2 py-0.5 bg-muted rounded-md text-[0.75rem]">{activeKey ? '2' : '1'} headers</span>
              <svg className={`w-4 h-4 transition-transform ${showHeaders ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

      <AnimatePresence>
              {showHeaders && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
                  <div className="space-y-2 p-3 bg-zinc-900 dark:bg-zinc-950 rounded-xl text-[0.8125rem] font-mono">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Content-Type:</span>
                      <span className="text-success">application/json</span>
                    </div>
                    {activeKey && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">X-API-Key:</span>
                        <span className="text-success">••••••••{activeKey.slice(-8)}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

              {/* Parameters */}
            {selectedEndpoint.parameters && selectedEndpoint.parameters.length > 0 && (
                <div>
                <label className="block text-[0.8125rem] font-semibold text-foreground mb-2">Parameters</label>
                {selectedEndpoint.parameters.map((param) => (
                  <div key={param.name} className="mb-2">
                        <input
                          type="text"
                          value={paramValues[param.name] || ''}
                      onChange={(e) => setParamValues(prev => ({ ...prev, [param.name]: e.target.value }))}
                      placeholder={`${param.name} (${param.type})`}
                      className="w-full h-12 px-4 bg-muted/50 border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground text-[0.9375rem] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    />
                    <p className="mt-1 text-[0.75rem] text-muted-foreground">{param.description}</p>
                      </div>
                    ))}
                </div>
              )}

              {/* Request Body */}
            {selectedEndpoint.method !== 'GET' && (
                <div>
                <label className="block text-[0.8125rem] font-semibold text-foreground mb-2">Request Body</label>
                  <textarea
                  value={requestBody || (selectedEndpoint.defaultBody ? JSON.stringify(selectedEndpoint.defaultBody, null, 2) : '')}
                    onChange={(e) => setRequestBody(e.target.value)}
                    placeholder="Enter JSON request body..."
                  rows={5}
                  className="w-full p-4 bg-muted/50 border border-border/50 rounded-xl text-success placeholder:text-muted-foreground font-mono text-[0.8125rem] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-all duration-200"
                  />
                </div>
              )}

            {/* Send Button */}
              <Button
                onClick={handleSendRequest}
                disabled={loading || (selectedEndpoint.protected && !activeKey)}
                className="w-full h-14 rounded-xl font-bold text-[0.9375rem] transition-all duration-200"
              >
                {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Send Request
                </>
              )}
              </Button>
          </div>
        </div>

        {/* Right: Response Panel - Terminal Style */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-xl">{">_"}</span>
              <h3 className="text-[1.25rem] font-semibold text-foreground">Response</h3>
            </div>
            {responseStatus !== null && (
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-lg text-[0.75rem] font-bold ${
                        responseStatus >= 200 && responseStatus < 300
                    ? 'bg-success/10 text-success'
                    : 'bg-destructive/10 text-destructive'
                      }`}>
                  {responseStatus === 0 ? 'Error' : responseStatus}
                      </span>
                {responseTime && (
                  <span className="text-[0.75rem] text-muted-foreground">{responseTime}ms</span>
                )}
              </div>
            )}
          </div>

          {/* Terminal */}
          <div className="bg-zinc-900 dark:bg-zinc-950 rounded-xl min-h-[400px] overflow-hidden">
            {/* Terminal Header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-muted/80 border-b border-border">
              <div className="w-3 h-3 rounded-full bg-destructive"></div>
              <div className="w-3 h-3 rounded-full bg-warning"></div>
              <div className="w-3 h-3 rounded-full bg-success"></div>
              <span className="ml-3 text-[0.75rem] text-muted-foreground">response.json</span>
              {response && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(response, null, 2))
                    toast.success('Response copied to clipboard')
                  }}
                  className="ml-auto text-[0.75rem] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                  </svg>
                  Copy
                </button>
                    )}
                  </div>

            {/* Terminal Content */}
            <div className="p-4 font-mono text-[0.8125rem] leading-relaxed max-h-[350px] overflow-auto">
                    {loading ? (
                <div className="flex items-center gap-2 text-success">
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Fetching response from API...</span>
                      </div>
              ) : response ? (
                <pre className={`whitespace-pre-wrap ${
                  response.error ? 'text-destructive' : 'text-success'
                }`}>
                        {JSON.stringify(response, null, 2)}
                      </pre>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                  <svg className="w-16 h-16 mb-4 opacity-30" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                  <p className="text-[0.9375rem]">Select an endpoint and send a request</p>
                  <p className="text-[0.8125rem] opacity-60">Real API response will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApiTesting

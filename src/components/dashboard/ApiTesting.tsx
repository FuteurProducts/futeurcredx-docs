import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Code, 
  Eye, 
  EyeOff, 
  Copy, 
  AlertCircle, 
  ChevronDown, 
  ChevronRight, 
  Lock, 
  Send, 
  LoaderCircle, 
  Play,
  Key
} from 'lucide-react'

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"

interface ApiEndpoint {
  method: HttpMethod
  path: string
  protected: boolean
  description: string
  parameters?: { name: string; type: string; description: string }[]
  bodySchema?: Record<string, any>
}

interface ApiCategory {
  id: string
  name: string
  endpoints: ApiEndpoint[]
}

const apiData: ApiCategory[] = [
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
    id: "experian-credit",
    name: "Experian Credit Score",
    endpoints: [
      {
        method: "POST",
        path: "/api/v1/crs-credit/u/experian/score",
        protected: true,
        description: "Get Experian credit score for a business using name, city, and state information.",
        bodySchema: {
          name: "string",
          city: "string", 
          state: "string"
        }
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

const getMethodClass = (method: HttpMethod) => {
  switch (method) {
    case "GET":
      return "bg-blue-600 hover:bg-blue-700 text-white"
    case "POST":
      return "bg-green-600 hover:bg-green-700 text-white"
    case "PUT":
      return "bg-yellow-600 hover:bg-yellow-700 text-white"
    case "DELETE":
      return "bg-red-600 hover:bg-red-700 text-white"
    case "PATCH":
      return "bg-orange-600 hover:bg-orange-700 text-white"
    default:
      return "bg-gray-600 hover:bg-gray-700 text-white"
  }
}

interface ApiTestingProps {
  apiKeys: any[]
}

const ApiTesting: React.FC<ApiTestingProps> = ({ apiKeys }) => {
  const [selectedApiKey, setSelectedApiKey] = useState('')
  const [manualApiKey, setManualApiKey] = useState('')
  const [useManualKey, setUseManualKey] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  const [openCategory, setOpenCategory] = useState<string | null>(apiData[0]?.id || null)

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Code className="w-6 h-6 text-slate-600" />
        <div>
          <h2 className="text-xl font-semibold text-slate-900">API Testing</h2>
          <p className="text-slate-600 text-sm">Test your APIs with your generated tokens</p>
        </div>
      </div>

      {/* API Key Selection */}
      <div className="mb-8 p-6 bg-slate-50 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <Key className="w-5 h-5 text-slate-600" />
          <h3 className="font-semibold text-slate-900">SELECT API KEY</h3>
        </div>

        {/* Toggle between saved keys and manual input */}
        <div className="flex items-center gap-4 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="keySource"
              checked={!useManualKey}
              onChange={() => setUseManualKey(false)}
              className="text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-slate-700">Use Saved Keys</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="keySource"
              checked={useManualKey}
              onChange={() => setUseManualKey(true)}
              className="text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-slate-700">Enter Key Manually</span>
          </label>
        </div>

        {!useManualKey ? (
          // Saved Keys Section
          apiKeys && apiKeys.length > 0 ? (
            <div className="space-y-4">
              <div className="relative">
                <select
                  value={selectedApiKey}
                  onChange={(e) => setSelectedApiKey(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
                >
                  <option value="" className="text-slate-500">Choose an API key...</option>
                  {apiKeys.map((key: any) => (
                    <option key={key.id} value={key.key} className="text-slate-900">
                      {key.name} - Created {new Date(key.createdAt).toLocaleDateString()}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>
              </div>
              
              {selectedApiKey && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-white rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-slate-600 mb-1">Selected API Key</div>
                      <div className="font-mono text-sm text-slate-900 bg-slate-50 px-3 py-2 rounded border break-all">
                        {showApiKey ? selectedApiKey : '•'.repeat(40)}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="p-2 hover:bg-slate-100 rounded transition-colors text-slate-600"
                        title={showApiKey ? "Hide API Key" : "Show API Key"}
                      >
                        {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => navigator.clipboard.writeText(selectedApiKey)}
                        className="p-2 hover:bg-slate-100 rounded transition-colors text-slate-600"
                        title="Copy API Key"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <p className="text-slate-600 mb-4">No API keys found. Generate your first API key to start testing.</p>
            </div>
          )
        ) : (
          // Manual Key Input Section
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Enter API Key
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? "text" : "password"}
                  value={manualApiKey}
                  onChange={(e) => setManualApiKey(e.target.value)}
                  placeholder="Paste your API key here..."
                  className="w-full p-3 pr-20 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                />
                <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-3">
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="p-2 hover:bg-slate-100 rounded transition-colors text-slate-600"
                    title={showApiKey ? "Hide API Key" : "Show API Key"}
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Your API key will only be used for testing and won't be saved.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* API Endpoints */}
      <div className="space-y-6">
        {apiData.map((category) => (
          <ApiCategorySection
            key={category.id}
            category={category}
            selectedApiKey={useManualKey ? manualApiKey : selectedApiKey}
            isOpen={openCategory === category.id}
            onToggle={() => setOpenCategory(openCategory === category.id ? null : category.id)}
          />
        ))}
      </div>
    </div>
  )
}

interface ApiCategorySectionProps {
  category: ApiCategory
  selectedApiKey: string
  isOpen: boolean
  onToggle: () => void
}

const ApiCategorySection: React.FC<ApiCategorySectionProps> = ({ 
  category, 
  selectedApiKey, 
  isOpen, 
  onToggle 
}) => {
  return (
    <div className="rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Code className="w-4 h-4 text-slate-600" />
          <h3 className="font-semibold text-slate-900">{category.name}</h3>
          <span className="text-sm text-slate-500">({category.endpoints.length} endpoints)</span>
        </div>
        {isOpen ? <ChevronDown className="w-4 h-4 text-slate-600" /> : <ChevronRight className="w-4 h-4 text-slate-600" />}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-6 space-y-4">
              {category.endpoints.map((endpoint, index) => (
                <ApiEndpointTester
                  key={`${category.id}-${endpoint.path}`}
                  endpoint={endpoint}
                  selectedApiKey={selectedApiKey}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface ApiEndpointTesterProps {
  endpoint: ApiEndpoint
  selectedApiKey: string
}

const ApiEndpointTester: React.FC<ApiEndpointTesterProps> = ({ endpoint, selectedApiKey }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [paramValues, setParamValues] = useState<Record<string, string>>({})
  const [requestBody, setRequestBody] = useState('')
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [responseStatus, setResponseStatus] = useState<number | null>(null)

  const handleSendRequest = async () => {
    if (endpoint.protected && !selectedApiKey) {
      setResponse({ error: 'API key required for protected endpoints' })
      setResponseStatus(401)
      return
    }

    setLoading(true)
    setResponse(null)
    setResponseStatus(null)

    try {
      // Handle real API call for Experian endpoint
      if (endpoint.path === "/api/v1/crs-credit/u/experian/score") {
        try {
          let requestBodyData: any = {}
          
          if (requestBody && requestBody.trim()) {
            try {
              requestBodyData = JSON.parse(requestBody)
            } catch (jsonError: any) {
              throw new Error(`Invalid JSON format: ${jsonError.message}`)
            }
            
            // Validate required fields for Experian endpoint only if we have data
            if (!requestBodyData.name || typeof requestBodyData.name !== 'string') {
              throw new Error('Missing or invalid "name" field - must be a string')
            }
            if (!requestBodyData.city || typeof requestBodyData.city !== 'string') {
              throw new Error('Missing or invalid "city" field - must be a string')
            }
            if (!requestBodyData.state || typeof requestBodyData.state !== 'string') {
              throw new Error('Missing or invalid "state" field - must be a string')
            }
            if (requestBodyData.state.length !== 2) {
              throw new Error('State must be a valid two-letter abbreviation (e.g., "CA", "NY", "TX")')
            }
          } else {
            // Use default values if no request body provided
            requestBodyData = {
              "name": "EXPERIAN CONSUMER DIRECT",
              "city": "Costa Mesa",
              "state": "CA"
            }
          }
          
          console.log('Making API request with:', {
            url: '/api/v1/crs-credit/u/experian/score',
            method: 'POST',
            headers: {
              'accept': '*/*',
              'X-API-Key': selectedApiKey ? `${selectedApiKey.substring(0, 10)}...` : 'NOT_PROVIDED',
              'Content-Type': 'application/json',
            },
            body: requestBodyData,
            bodyString: JSON.stringify(requestBodyData)
          })
          
          const response = await fetch('/api/v1/crs-credit/u/experian/score', {
            method: 'POST',
            headers: {
              'accept': '*/*',
              'X-API-Key': selectedApiKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBodyData)
          })

          if (!response.ok) {
            const errorText = await response.text()
            console.error('API Error Response:', {
              status: response.status,
              statusText: response.statusText,
              body: errorText
            })
            throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`)
          }

          const responseData = await response.json()
          setResponse(responseData)
          setResponseStatus(response.status)
        } catch (error: any) {
          console.error('API request failed:', error)
          
          if (error.message.includes('CORS') || error.message.includes('Access-Control') || error.name === 'TypeError') {
            setResponse({
              error: 'CORS Error - Direct browser calls blocked',
              message: 'The API endpoint blocks direct browser requests due to CORS policy. This is normal for production APIs.',
              suggestion: 'The API is working correctly. CORS prevents direct browser calls for security.',
              details: error.message,
              note: 'Use this API from your backend server or mobile app where CORS does not apply.'
            })
            setResponseStatus(0)
          } else if (error.message.includes('HTTP 401')) {
            setResponse({
              error: 'Authentication Error',
              message: 'Invalid or missing API key. Please check your API key.',
              suggestion: 'Ensure you have selected a valid API key from the dropdown above.',
              details: error.message
            })
            setResponseStatus(401)
          } else if (error.message.includes('HTTP 400')) {
            setResponse({
              error: 'Bad Request Error',
              message: 'The request format is invalid. Check the request body and parameters.',
              suggestion: 'Verify that all required fields are provided with correct data types.',
              details: error.message,
              troubleshooting: 'Common issues: Missing required fields, incorrect data format, or invalid values.'
            })
            setResponseStatus(400)
          } else {
            setResponse({
              error: error.message || 'Request failed',
              details: 'Check console for more details',
              troubleshooting: 'Common issues: Invalid API key, network connectivity, or server maintenance.'
            })
            setResponseStatus(error.status || 500)
          }
        }
        setLoading(false)
        return
      }

      // Simulate API call for other endpoints
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock response based on endpoint
      let mockResponse: any = {
        status: 200,
        message: `Success for ${endpoint.method} ${endpoint.path}`,
        timestamp: new Date().toISOString(),
      }

      if (endpoint.path === "/api/v1") {
        mockResponse = "Welcome to FuteurCred API v1.0"
        setResponseStatus(200)
      } else if (endpoint.path === "/api/v1/credit-report") {
      mockResponse = {
        businessId: paramValues.businessId || "12345",
        businessName: "Sample Business LLC",
        creditScore: 785,
        riskLevel: "Low",
        collections: [
          {
            creditorName: "ABC Supply Co",
            amount: 2500,
            dateReported: "2024-01-15",
            status: "Resolved"
          }
        ],
        tradePaymentExperiences: [
          {
            creditorName: "Office Depot",
            accountBalance: 1250,
            paymentTerms: "Net 30",
            paymentHistory: "Satisfactory",
            dateOpened: "2023-06-01"
          },
          {
            creditorName: "Staples Business",
            accountBalance: 850,
            paymentTerms: "Net 15",
            paymentHistory: "Excellent",
            dateOpened: "2023-08-15"
          }
        ],
        lastUpdated: new Date().toISOString()
      }
      setResponseStatus(200)
    } else if (endpoint.path === "/api/v1/lumiq-credit-journey") {
      mockResponse = {
        userId: paramValues.userId || "user123",
        creditScoreHistory: [
          { date: "2024-01-01", score: 720 },
          { date: "2024-02-01", score: 735 },
          { date: "2024-03-01", score: 750 },
          { date: "2024-04-01", score: 785 }
        ],
        paymentHistory: {
          onTimePayments: 95,
          latePayments: 3,
          missedPayments: 0
        },
        creditUtilization: {
          current: 25,
          recommended: 30,
          trend: "improving"
        },
        recommendations: [
          "Continue making on-time payments to maintain good credit",
          "Consider increasing credit limits to improve utilization ratio",
          "Monitor credit reports regularly for accuracy"
        ],
        lastUpdated: new Date().toISOString()
      }
      setResponseStatus(200)
    }

      setResponse(mockResponse)
      setLoading(false)
    } catch (error) {
      console.error('API request failed:', error)
      setResponse({ 
        error: error instanceof Error ? error.message : 'Failed to make API request',
        details: 'Check console for more details'
      })
      setResponseStatus(500)
      setLoading(false)
    }
  }

  const handleParamChange = (paramName: string, value: string) => {
    setParamValues(prev => ({ ...prev, [paramName]: value }))
  }

  return (
    <div className="rounded-lg overflow-hidden">
      <div className="p-4 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`px-2 py-1 rounded text-xs font-medium ${getMethodClass(endpoint.method)}`}>
            {endpoint.method}
          </span>
          <code className="font-mono text-sm text-slate-700">{endpoint.path}</code>
          {endpoint.protected && <Lock className="w-4 h-4 text-slate-500" />}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-slate-100 rounded transition-colors text-slate-600"
        >
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4 bg-white">
              <p className="text-slate-600 text-sm">{endpoint.description}</p>

              {/* Parameters */}
              {endpoint.parameters && endpoint.parameters.length > 0 && (
                <div>
                  <h4 className="font-medium text-slate-900 mb-3">Parameters</h4>
                  <div className="space-y-3">
                    {endpoint.parameters.map((param) => (
                      <div key={param.name} className="space-y-1">
                        <label className="block text-sm font-medium text-slate-700">
                          {param.name} <span className="text-slate-500">({param.type})</span>
                        </label>
                        <input
                          type="text"
                          value={paramValues[param.name] || ''}
                          onChange={(e) => handleParamChange(param.name, e.target.value)}
                          placeholder={param.description}
                          className="w-full p-2 bg-white border border-slate-300 rounded text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Request Body */}
              {endpoint.method !== 'GET' && (
                <div>
                  <h4 className="font-medium text-slate-900 mb-3">Request Body</h4>
                  {endpoint.bodySchema && (
                    <div className="mb-3 p-3 bg-slate-50 border border-slate-200 rounded">
                      <p className="text-xs text-slate-600 mb-2">Required fields:</p>
                      <code className="text-xs text-slate-700">
                        {JSON.stringify(endpoint.bodySchema, null, 2)}
                      </code>
                    </div>
                  )}
                  <textarea
                    value={requestBody || (endpoint.path === "/api/v1/crs-credit/u/experian/score" ? JSON.stringify({
                      "name": "EXPERIAN CONSUMER DIRECT",
                      "city": "Costa Mesa",
                      "state": "CA"
                    }, null, 2) : (endpoint.bodySchema ? JSON.stringify(endpoint.bodySchema, null, 2) : ''))}
                    onChange={(e) => setRequestBody(e.target.value)}
                    placeholder="Enter JSON request body..."
                    rows={6}
                    className="w-full p-3 bg-white border border-slate-300 rounded text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  />
                </div>
              )}

              {/* Send Request Button */}
              <button
                onClick={handleSendRequest}
                disabled={loading || (endpoint.protected && !selectedApiKey)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white rounded font-medium text-sm transition-colors"
              >
                {loading ? (
                  <LoaderCircle className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {loading ? 'Sending...' : 'Send Request'}
              </button>

              {/* Response */}
              {(response || loading) && (
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <h4 className="font-medium text-slate-900">Response</h4>
                    {responseStatus && (
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        responseStatus >= 200 && responseStatus < 300 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {responseStatus}
                      </span>
                    )}
                  </div>
                  <div className="bg-slate-50 rounded p-3 max-h-96 overflow-auto border border-slate-200">
                    {loading ? (
                      <div className="flex items-center gap-2 text-slate-600">
                        <LoaderCircle className="w-4 h-4 animate-spin" />
                        <span>Loading...</span>
                      </div>
                    ) : (
                      <pre className="text-sm text-slate-700 whitespace-pre-wrap">
                        {JSON.stringify(response, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ApiTesting

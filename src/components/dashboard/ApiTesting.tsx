import React, { useState, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { 
  Play, 
  Copy, 
  Eye, 
  EyeOff, 
  Lock, 
  LoaderCircle, 
  ChevronDown, 
  ChevronRight,
  Code,
  Send,
  CheckCircle,
  AlertCircle
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
  const [showApiKey, setShowApiKey] = useState(false)
  const [openCategory, setOpenCategory] = useState<string | null>(apiData[0]?.id || null)

  return (
    <div className="bg-white border border-blue-200 rounded-2xl p-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-blue-50 rounded-xl">
          <Code className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-blue-900">API Testing</h2>
          <p className="text-slate-600 font-medium">Test your APIs with your generated tokens</p>
        </div>
      </div>

      {/* API Key Selection */}
      <div className="mb-8 p-6 bg-blue-50/30 rounded-xl border border-blue-200">
        <h3 className="font-black uppercase tracking-tight mb-4 text-lg text-blue-900">Select API Key</h3>
        {apiKeys && apiKeys.length > 0 ? (
          <div className="space-y-4">
            <select
              value={selectedApiKey}
              onChange={(e) => setSelectedApiKey(e.target.value)}
              className="w-full p-3 bg-white border border-blue-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" className="text-slate-500">Choose an API key...</option>
              {apiKeys.map((key: any) => (
                <option key={key.id} value={key.key} className="text-slate-800">
                  {key.name} - Created {new Date(key.createdAt).toLocaleDateString()}
                </option>
              ))}
            </select>
            
            {selectedApiKey && (
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-blue-200">
                <div className="flex-1">
                  <div className="font-mono text-sm text-slate-700">
                    {showApiKey ? selectedApiKey : '•'.repeat(40)}
                  </div>
                </div>
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-slate-600"
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(selectedApiKey)}
                  className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-slate-600"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <p className="text-slate-600 mb-4">No API keys found. Generate your first API key to start testing.</p>
          </div>
        )}
      </div>

      {/* API Endpoints */}
      <div className="space-y-6">
        {apiData.map((category) => (
          <ApiCategorySection
            key={category.id}
            category={category}
            selectedApiKey={selectedApiKey}
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
    <div className="border border-blue-200 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-6 bg-blue-50/50 hover:bg-blue-100/50 transition-colors flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Code className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="font-black uppercase tracking-tight text-lg text-blue-900">{category.name}</h3>
          <span className="text-sm text-slate-500">({category.endpoints.length} endpoints)</span>
        </div>
        {isOpen ? <ChevronDown className="w-5 h-5 text-slate-600" /> : <ChevronRight className="w-5 h-5 text-slate-600" />}
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
          const requestBodyData = requestBody ? JSON.parse(requestBody) : {}
          
          // Use relative URL to work with Vercel proxy
          const response = await fetch('/api/v1/crs-credit/u/experian/score', {
            method: 'POST',
            mode: 'cors',
            headers: {
              'accept': '*/*',
              'X-API-Key': selectedApiKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBodyData)
          })

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
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
              suggestion: 'Use this API from your backend server or use a CORS proxy for testing.',
              details: error.message
            })
            setResponseStatus(0)
          } else {
            setResponse({
              error: error.message || 'Request failed',
              details: 'Check console for more details'
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
    <div className="border border-blue-200 rounded-xl overflow-hidden">
      <div className="p-4 bg-blue-50/30 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getMethodClass(endpoint.method)}`}>
            {endpoint.method}
          </span>
          <code className="font-mono text-sm text-slate-700">{endpoint.path}</code>
          {endpoint.protected && <Lock className="w-4 h-4 text-yellow-500" />}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-slate-600"
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
            <div className="p-6 space-y-6">
              <p className="text-slate-600 text-sm leading-relaxed">{endpoint.description}</p>

              {/* Parameters */}
              {endpoint.parameters && endpoint.parameters.length > 0 && (
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-wide mb-3 text-blue-900">Parameters</h4>
                  <div className="space-y-3">
                    {endpoint.parameters.map((param) => (
                      <div key={param.name} className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">
                          {param.name} <span className="text-slate-500">({param.type})</span>
                        </label>
                        <input
                          type="text"
                          value={paramValues[param.name] || ''}
                          onChange={(e) => handleParamChange(param.name, e.target.value)}
                          placeholder={param.description}
                          className="w-full p-3 bg-white border border-blue-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Request Body */}
              {endpoint.method !== 'GET' && (
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-wide mb-3 text-blue-900">Request Body</h4>
                  {endpoint.bodySchema && (
                    <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs text-blue-700 mb-2">Required fields:</p>
                      <code className="text-xs text-blue-600">
                        {JSON.stringify(endpoint.bodySchema, null, 2)}
                      </code>
                    </div>
                  )}
                  <textarea
                    value={requestBody || (endpoint.bodySchema ? JSON.stringify(endpoint.bodySchema, null, 2) : '')}
                    onChange={(e) => setRequestBody(e.target.value)}
                    placeholder="Enter JSON request body..."
                    rows={6}
                    className="w-full p-3 bg-white border border-blue-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  />
                </div>
              )}

              {/* Send Request Button */}
              <button
                onClick={handleSendRequest}
                disabled={loading || (endpoint.protected && !selectedApiKey)}
                className="flex items-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white rounded-lg font-bold text-sm uppercase tracking-wide transition-colors"
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
                    <h4 className="font-bold text-sm uppercase tracking-wide text-blue-900">Response</h4>
                    {responseStatus && (
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        responseStatus >= 200 && responseStatus < 300 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {responseStatus}
                      </span>
                    )}
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4 max-h-96 overflow-auto border border-slate-200">
                    {loading ? (
                      <div className="flex items-center gap-3 text-slate-600">
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

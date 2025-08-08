"use client"

import { useState, useRef, type Dispatch, type SetStateAction } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { Search, ChevronRight, ChevronDown, Lock, LoaderCircle, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

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
    id: "lumiq-credit",
    name: "LUMIQX Credit",
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

// --- Interactive API Endpoint Component ---
type ApiEndpointItemProps = {
  endpoint: ApiEndpoint
  categoryId: string
  index: number
}

const ApiEndpointItem = ({ endpoint, categoryId, index }: ApiEndpointItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [requestBody, setRequestBody] = useState("")
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [paramValues, setParamValues] = useState<Record<string, string>>({})
  const [authToken, setAuthToken] = useState("")

  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"])

  const handleSendRequest = async () => {
    setLoading(true)
    setResponse(null)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock response based on endpoint
    let mockResponse: any = {
      status: 200,
      message: `Success for ${endpoint.method} ${endpoint.path}`,
      timestamp: new Date().toISOString(),
    }

    if (endpoint.path === "/api/v1") {
      mockResponse = "Welcome to FuteurCred API v1.0"
    } else if (endpoint.path.includes("login")) {
      mockResponse.data = { token: "jwt.mock.token.value", user: { id: "user-123", email: "test@example.com" } }
    } else if (endpoint.path.includes("profile")) {
      mockResponse.data = {
        id: "user-123",
        name: "John Doe",
        email: "test@example.com",
        createdAt: "2024-01-01T00:00:00.000Z",
      }
    } else if (endpoint.path.includes("search-company")) {
      mockResponse.data = [{ id: "comp-456", name: "Acme Corp", score: 850 }]
    } else if (endpoint.path.includes("credit-report")) {
      mockResponse.data = {
        "businessInfo": {
          "name": "Acme Corporation",
          "address": "123 Business St, City, State 12345",
          "taxId": "12-3456789",
          "yearFounded": 2010
        },
        "creditScore": {
          "score": 785,
          "riskLevel": "Low",
          "lastUpdated": "2025-07-26"
        },
        "collectionsDetail": [
          {
            "amountPaid": 0,
            "accountStatus": "Open Account",
            "collectionAgencyInfo": {
              "name": "JEFFERSON CAPITAL SYSTEMS LLC",
              "phoneNumber": "+18338515552"
            },
            "datePlacedForCollection": "2023-12-01",
            "amountPlacedForCollection": 433
          }
        ],
        "tradePaymentExperiences": [
          {
            "dbt30": 0,
            "dbt60": 0,
            "dbt90": 0,
            "terms": "NET 30",
            "dbt91Plus": 0,
            "dateReported": "2025-04-01",
            "accountBalance": {
              "amount": 12100,
              "modifier": "Not applicable"
            },
            "businessCategory": "BUS SERVCS",
            "recentHighCredit": {
              "amount": 24300,
              "modifier": "Not applicable"
            },
            "currentPercentage": 100
          }
        ],
        "isAvailable": true
      }
    } else if (endpoint.path.includes("lumiq-credit-journey")) {
      mockResponse.data = {
        "commercialCreditScoreFactors": [
          {
            "code": "011",
            "definition": "NUMBER OF COMMERCIAL COLLECTION ACCOUNTS"
          },
          {
            "code": "057",
            "definition": "BALANCE OF COMMERCIAL ACCOUNTS AT WORST DELINQUENCY"
          }
        ],
        "isAvailable": true,
        "collectionsDetail": [
          {
            "amountPaid": 0,
            "accountStatus": "Open Account",
            "collectionAgencyInfo": {
              "name": "JEFFERSON CAPITAL SYSTEMS LLC",
              "phoneNumber": "+18338515552"
            },
            "datePlacedForCollection": "2023-12-01",
            "amountPlacedForCollection": 433
          },
          {
            "amountPaid": 0,
            "accountStatus": "Open Account",
            "collectionAgencyInfo": {
              "name": "JEFFERSON CAPITAL SYSTEMS LLC",
              "phoneNumber": "+18338515552"
            },
            "datePlacedForCollection": "2023-12-01",
            "amountPlacedForCollection": 208
          },
          {
            "amountPaid": 0,
            "accountStatus": "Open Account",
            "collectionAgencyInfo": {
              "name": "MCCARTHY BURGESS & WOLF",
              "phoneNumber": "+14407355100"
            },
            "datePlacedForCollection": "2020-12-01",
            "amountPlacedForCollection": 422
          },
          {
            "amountPaid": 0,
            "dateClosed": "2022-01-01",
            "accountStatus": "Uncollected",
            "collectionAgencyInfo": {
              "name": "ALTUS GLOBAL TRADE SOLUTIONS",
              "phoneNumber": "+18005096060"
            },
            "datePlacedForCollection": "2021-07-01",
            "amountPlacedForCollection": 971
          }
        ],
        "tradePaymentExperiences": [
          {
            "dbt30": 0,
            "dbt60": 0,
            "dbt90": 0,
            "terms": "VARIED",
            "dbt91Plus": 100,
            "dateReported": "2025-04-01",
            "tradelineFlag": {
              "definition": " "
            },
            "accountBalance": {
              "amount": 23500,
              "modifier": "Not applicable"
            },
            "businessCategory": "BUREAU",
            "dateLastActivity": "2025-04-01",
            "paymentIndicator": {
              "code": " ",
              "definition": "No Indicator"
            },
            "recentHighCredit": {
              "amount": 202300,
              "modifier": "Not applicable"
            },
            "currentPercentage": 0,
            "newlyReportedIndicator": {
              "code": " ",
              "definition": "Not Available"
            }
          },
          {
            "dbt30": 0,
            "dbt60": 0,
            "dbt90": 0,
            "terms": "NET 30",
            "dbt91Plus": 0,
            "dateReported": "2025-04-01",
            "tradelineFlag": {
              "definition": " "
            },
            "accountBalance": {
              "amount": 0,
              "modifier": "Not applicable"
            },
            "businessCategory": "BUREAU",
            "dateLastActivity": "2022-12-01",
            "paymentIndicator": {
              "code": " ",
              "definition": "No Indicator"
            },
            "recentHighCredit": {
              "amount": 0,
              "modifier": "Not applicable"
            },
            "currentPercentage": 0,
            "newlyReportedIndicator": {
              "code": " ",
              "definition": "Not Available"
            }
          },
          {
            "dbt30": 0,
            "dbt60": 0,
            "dbt90": 0,
            "terms": "VARIED",
            "dbt91Plus": 0,
            "dateReported": "2025-06-01",
            "tradelineFlag": {
              "definition": " "
            },
            "accountBalance": {
              "amount": 12100,
              "modifier": "Not applicable"
            },
            "businessCategory": "BUS SERVCS",
            "paymentIndicator": {
              "code": " ",
              "definition": "No Indicator"
            },
            "recentHighCredit": {
              "amount": 24300,
              "modifier": "Not applicable"
            },
            "currentPercentage": 100,
            "newlyReportedIndicator": {
              "code": " ",
              "definition": "Not Available"
            }
          },
          {
            "dbt30": 0,
            "dbt60": 0,
            "dbt90": 0,
            "terms": "NET 30",
            "dbt91Plus": 0,
            "dateReported": "2025-04-01",
            "tradelineFlag": {
              "definition": " "
            },
            "accountBalance": {
              "amount": 0,
              "modifier": "Not applicable"
            },
            "businessCategory": "CERAMICS",
            "paymentIndicator": {
              "code": " ",
              "definition": "No Indicator"
            },
            "recentHighCredit": {
              "amount": 0,
              "modifier": "Not applicable"
            },
            "currentPercentage": 0,
            "newlyReportedIndicator": {
              "code": " ",
              "definition": "Not Available"
            }
          },
          {
            "dbt30": 11,
            "dbt60": 1,
            "dbt90": 0,
            "terms": "VARIED",
            "comments": "ACCTCLOSED",
            "dbt91Plus": 4,
            "dateReported": "2025-04-01",
            "tradelineFlag": {
              "definition": " "
            },
            "accountBalance": {
              "amount": 74700,
              "modifier": "Not applicable"
            },
            "businessCategory": "COMMUNICTN",
            "paymentIndicator": {
              "code": " ",
              "definition": "No Indicator"
            },
            "recentHighCredit": {
              "amount": 1396100,
              "modifier": "Not applicable"
            },
            "currentPercentage": 84,
            "newlyReportedIndicator": {
              "code": " ",
              "definition": "Not Available"
            }
          },
          {
            "dbt30": 0,
            "dbt60": 0,
            "dbt90": 0,
            "terms": "OTHER",
            "dbt91Plus": 0,
            "dateReported": "2025-02-01",
            "tradelineFlag": {
              "definition": " "
            },
            "accountBalance": {
              "amount": 26800,
              "modifier": "Not applicable"
            },
            "businessCategory": "CONSTRUCTN",
            "dateLastActivity": "2025-01-01",
            "paymentIndicator": {
              "code": " ",
              "definition": "No Indicator"
            },
            "recentHighCredit": {
              "amount": 82100,
              "modifier": "Not applicable"
            },
            "currentPercentage": 100,
            "newlyReportedIndicator": {
              "code": " ",
              "definition": "Not Available"
            }
          },
          {
            "dbt30": 0,
            "dbt60": 0,
            "dbt90": 0,
            "terms": "VARIED",
            "dbt91Plus": 0,
            "dateReported": "2025-06-01",
            "tradelineFlag": {
              "definition": " "
            },
            "accountBalance": {
              "amount": 0,
              "modifier": "Not applicable"
            },
            "businessCategory": "DISPOSAL",
            "paymentIndicator": {
              "code": " ",
              "definition": "No Indicator"
            },
            "recentHighCredit": {
              "amount": 0,
              "modifier": "Not applicable"
            },
            "currentPercentage": 0,
            "newlyReportedIndicator": {
              "code": " ",
              "definition": "Not Available"
            }
          },
          {
            "dbt30": 0,
            "dbt60": 0,
            "dbt90": 0,
            "terms": "REVOLVE",
            "comments": "ACCTCLOSED",
            "dbt91Plus": 0,
            "dateReported": "2025-06-01",
            "tradelineFlag": {
              "definition": " "
            },
            "accountBalance": {
              "amount": 0,
              "modifier": "Not applicable"
            },
            "businessCategory": "FINCL SVCS",
            "paymentIndicator": {
              "code": " ",
              "definition": "No Indicator"
            },
            "recentHighCredit": {
              "amount": 3000,
              "modifier": "Not applicable"
            },
            "currentPercentage": 0,
            "newlyReportedIndicator": {
              "code": " ",
              "definition": "Not Available"
            }
          },
          {
            "dbt30": 0,
            "dbt60": 0,
            "dbt90": 0,
            "terms": "COD",
            "dbt91Plus": 0,
            "dateReported": "2025-05-01",
            "tradelineFlag": {
              "definition": " "
            },
            "accountBalance": {
              "amount": 0,
              "modifier": "Not applicable"
            },
            "businessCategory": "INDUS SUPL",
            "paymentIndicator": {
              "code": " ",
              "definition": "No Indicator"
            },
            "recentHighCredit": {
              "amount": 0,
              "modifier": "Not applicable"
            },
            "currentPercentage": 0,
            "newlyReportedIndicator": {
              "code": " ",
              "definition": "Not Available"
            }
          },
          {
            "dbt30": 0,
            "dbt60": 0,
            "dbt90": 0,
            "terms": "NET 30",
            "comments": "CUST 33 YR",
            "dbt91Plus": 0,
            "dateReported": "2025-06-01",
            "tradelineFlag": {
              "definition": " "
            },
            "accountBalance": {
              "amount": 0,
              "modifier": "Not applicable"
            },
            "businessCategory": "PACKAGING",
            "dateLastActivity": "2019-12-01",
            "paymentIndicator": {
              "code": " ",
              "definition": "No Indicator"
            },
            "recentHighCredit": {
              "amount": 1400,
              "modifier": "Not applicable"
            },
            "currentPercentage": 0,
            "newlyReportedIndicator": {
              "code": " ",
              "definition": "Not Available"
            }
          },
          {
            "dbt30": 79,
            "dbt60": 21,
            "dbt90": 0,
            "terms": "VARIOUS",
            "dbt91Plus": 0,
            "dateReported": "2025-06-01",
            "tradelineFlag": {
              "definition": " "
            },
            "accountBalance": {
              "amount": 400,
              "modifier": "Not applicable"
            },
            "businessCategory": "PLUMBING",
            "paymentIndicator": {
              "code": " ",
              "definition": "No Indicator"
            },
            "recentHighCredit": {
              "amount": 2400,
              "modifier": "Not applicable"
            },
            "currentPercentage": 0,
            "newlyReportedIndicator": {
              "code": " ",
              "definition": "Not Available"
            }
          },
          {
            "dbt30": 0,
            "dbt60": 0,
            "dbt90": 0,
            "terms": "NET 45",
            "dbt91Plus": 0,
            "dateReported": "2025-02-01",
            "tradelineFlag": {
              "definition": " "
            },
            "accountBalance": {
              "amount": 900,
              "modifier": "Not applicable"
            },
            "businessCategory": "PRNTG&PUBL",
            "dateLastActivity": "2025-01-01",
            "paymentIndicator": {
              "code": " ",
              "definition": "No Indicator"
            },
            "recentHighCredit": {
              "amount": 8800,
              "modifier": "Not applicable"
            },
            "currentPercentage": 100,
            "newlyReportedIndicator": {
              "code": " ",
              "definition": "Not Available"
            }
          },
          {
            "dbt30": 0,
            "dbt60": 0,
            "dbt90": 0,
            "terms": "VARIED",
            "dbt91Plus": 0,
            "dateReported": "2025-05-01",
            "tradelineFlag": {
              "definition": " "
            },
            "accountBalance": {
              "amount": 0,
              "modifier": "Not applicable"
            },
            "businessCategory": "PRNTG&PUBL",
            "paymentIndicator": {
              "code": " ",
              "definition": "No Indicator"
            },
            "recentHighCredit": {
              "amount": 0,
              "modifier": "Not applicable"
            },
            "currentPercentage": 0,
            "newlyReportedIndicator": {
              "code": " ",
              "definition": "Not Available"
            }
          }
        ],
        "additionalPaymentExperiences": [
          {
            "dbt30": 0,
            "dbt60": 0,
            "dbt90": 0,
            "terms": "OTHER",
            "dbt91Plus": 0,
            "dateReported": "2025-04-01",
            "tradelineFlag": {
              "definition": " "
            },
            "accountBalance": {
              "amount": 0,
              "modifier": "Not applicable"
            },
            "businessCategory": "AUTO RENTL",
            "paymentIndicator": {
              "code": " ",
              "definition": "No Indicator"
            },
            "recentHighCredit": {
              "amount": 0,
              "modifier": "Not applicable"
            },
            "currentPercentage": 0,
            "newlyReportedIndicator": {
              "code": " ",
              "definition": "Not Available"
            }
          },
          {
            "dbt30": 0,
            "dbt60": 0,
            "dbt90": 0,
            "terms": "CREDIT",
            "comments": "ACCTCLOSED",
            "dbt91Plus": 0,
            "dateReported": "2022-10-01",
            "tradelineFlag": {
              "definition": " "
            },
            "accountBalance": {
              "amount": 0,
              "modifier": "Not applicable"
            },
            "businessCategory": "BLDG MATRL",
            "paymentIndicator": {
              "code": " ",
              "definition": "No Indicator"
            },
            "recentHighCredit": {
              "amount": 0,
              "modifier": "Not applicable"
            },
            "currentPercentage": 0,
            "newlyReportedIndicator": {
              "code": " ",
              "definition": "Not Available"
            }
          },
          {
            "dbt30": 0,
            "dbt60": 0,
            "dbt90": 0,
            "terms": "0",
            "comments": "CUST  9 YR",
            "dbt91Plus": 0,
            "dateReported": "2024-11-01",
            "tradelineFlag": {
              "definition": " "
            },
            "accountBalance": {
              "amount": 0,
              "modifier": "Not applicable"
            },
            "businessCategory": "DP SERVCS",
            "dateLastActivity": "2016-05-01",
            "paymentIndicator": {
              "code": " ",
              "definition": "No Indicator"
            },
            "recentHighCredit": {
              "amount": 0,
              "modifier": "Not applicable"
            },
            "currentPercentage": 0,
            "newlyReportedIndicator": {
              "code": " ",
              "definition": "Not Available"
            }
          },
          {
            "dbt30": 0,
            "dbt60": 0,
            "dbt90": 0,
            "terms": "COD",
            "dbt91Plus": 0,
            "dateReported": "2024-01-01",
            "tradelineFlag": {
              "definition": " "
            },
            "accountBalance": {
              "amount": 0,
              "modifier": "Not applicable"
            },
            "businessCategory": "EQUIPMENT",
            "paymentIndicator": {
              "code": " ",
              "definition": "No Indicator"
            },
            "recentHighCredit": {
              "amount": 0,
              "modifier": "Not applicable"
            },
            "currentPercentage": 0,
            "newlyReportedIndicator": {
              "code": " ",
              "definition": "Not Available"
            }
          },
          {
            "dbt30": 100,
            "dbt60": 0,
            "dbt90": 0,
            "terms": "VARIED",
            "dbt91Plus": 0,
            "dateReported": "2023-08-01",
            "tradelineFlag": {
              "definition": " "
            },
            "accountBalance": {
              "amount": 300,
              "modifier": "Not applicable"
            },
            "businessCategory": "MANUFCTRNG",
            "paymentIndicator": {
              "code": " ",
              "definition": "No Indicator"
            },
            "recentHighCredit": {
              "amount": 300,
              "modifier": "Not applicable"
            },
            "currentPercentage": 0,
            "newlyReportedIndicator": {
              "code": " ",
              "definition": "Not Available"
            }
          },
          {
            "dbt30": 0,
            "dbt60": 0,
            "dbt90": 0,
            "terms": "CONTRCT",
            "dbt91Plus": 0,
            "dateReported": "2024-12-01",
            "tradelineFlag": {
              "definition": " "
            },
            "accountBalance": {
              "amount": 0,
              "modifier": "Not applicable"
            },
            "businessCategory": "OFFC EQUIP",
            "dateLastActivity": "2021-01-01",
            "paymentIndicator": {
              "code": " ",
              "definition": "No Indicator"
            },
            "recentHighCredit": {
              "amount": 0,
              "modifier": "Not applicable"
            },
            "currentPercentage": 0,
            "newlyReportedIndicator": {
              "code": " ",
              "definition": "Not Available"
            }
          },
          {
            "dbt30": 100,
            "dbt60": 0,
            "dbt90": 0,
            "terms": "VARIED",
            "dbt91Plus": 0,
            "dateReported": "2023-01-01",
            "tradelineFlag": {
              "definition": " "
            },
            "accountBalance": {
              "amount": 3700,
              "modifier": "Not applicable"
            },
            "businessCategory": "OPTIC SUPL",
            "paymentIndicator": {
              "code": " ",
              "definition": "No Indicator"
            },
            "recentHighCredit": {
              "amount": 3700,
              "modifier": "Not applicable"
            },
            "currentPercentage": 0,
            "newlyReportedIndicator": {
              "code": " ",
              "definition": "Not Available"
            }
          },
          {
            "dbt30": 0,
            "dbt60": 0,
            "dbt90": 0,
            "terms": "OTHER",
            "dbt91Plus": 0,
            "dateReported": "2023-04-01",
            "tradelineFlag": {
              "definition": " "
            },
            "accountBalance": {
              "amount": 0,
              "modifier": "Not applicable"
            },
            "businessCategory": "RESTR SUPL",
            "dateLastActivity": "2015-01-01",
            "paymentIndicator": {
              "code": " ",
              "definition": "No Indicator"
            },
            "recentHighCredit": {
              "amount": 0,
              "modifier": "Not applicable"
            },
            "currentPercentage": 0,
            "newlyReportedIndicator": {
              "code": " ",
              "definition": "Not Available"
            }
          }
        ],
        "isAvailable": true
      }
    } else {
      mockResponse.data = { result: "This is a mock response." }
    }

    try {
      if (requestBody) {
        mockResponse.requestBody = JSON.parse(requestBody)
      }
    } catch (error) {
      mockResponse = { status: 400, message: "Invalid JSON in request body." }
    }

    if (paramValues && Object.keys(paramValues).length > 0) {
      mockResponse.parameters = paramValues
    }

    setResponse(mockResponse)
    setLoading(false)
  }

  const handleParamChange = (paramName: string, value: string) => {
    setParamValues(prev => ({ ...prev, [paramName]: value }))
  }

  return (
    <div ref={ref} className="relative scroll-mt-28 mb-8">
      <motion.div 
        className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
        style={{ y }}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-6 hover:bg-gray-50 transition-colors duration-200"
        >
          <div className="flex items-center gap-4 w-full">
            <span className={cn("px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wide", getMethodClass(endpoint.method))}>
              {endpoint.method}
            </span>
            <span className="font-mono text-sm text-gray-700 flex-grow text-left font-medium">{endpoint.path}</span>
            {endpoint.protected && <Lock className="h-5 w-5 text-yellow-600" />}
            <ChevronRight
              className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                isExpanded ? "rotate-90" : ""
              }`}
            />
          </div>
          <p className="text-left text-gray-600 mt-3 font-medium">{endpoint.description}</p>
        </button>

        <AnimatePresence mode="wait">
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden border-t border-gray-200"
              style={{ position: "relative", zIndex: 1 }}
            >
              <div className="p-6 bg-gray-50">
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-bold text-black uppercase tracking-tight mb-4">Request Configuration</h4>
                      <Tabs defaultValue={endpoint.parameters ? "params" : endpoint.bodySchema ? "body" : "headers"} className="w-full">
                        <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200">
                          {endpoint.parameters && <TabsTrigger value="params" className="data-[state=active]:bg-black data-[state=active]:text-white">Parameters</TabsTrigger>}
                          {endpoint.bodySchema && <TabsTrigger value="body" className="data-[state=active]:bg-black data-[state=active]:text-white">Body</TabsTrigger>}
                          <TabsTrigger value="headers" className="data-[state=active]:bg-black data-[state=active]:text-white">Headers</TabsTrigger>
                        </TabsList>
                        
                        {endpoint.parameters && (
                          <TabsContent value="params" className="mt-4 space-y-4">
                            {endpoint.parameters.map((param) => (
                              <div key={param.name} className="space-y-2">
                                <Label htmlFor={param.name} className="text-gray-800 font-medium">
                                  {param.name} <span className="text-gray-500 text-sm">({param.type})</span>
                                </Label>
                                <Input
                                  id={param.name}
                                  placeholder={param.description}
                                  className="bg-white border-gray-300 text-black focus:border-black focus:ring-black"
                                  value={paramValues[param.name] || ""}
                                  onChange={(e) => handleParamChange(param.name, e.target.value)}
                                />
                              </div>
                            ))}
                          </TabsContent>
                        )}
                        
                        {endpoint.bodySchema && (
                          <TabsContent value="body" className="mt-4">
                            <Label htmlFor="body-input" className="text-gray-800 font-medium">
                              Request Body (JSON)
                            </Label>
                            <Textarea
                              id="body-input"
                              placeholder={JSON.stringify(endpoint.bodySchema, null, 2)}
                              className="bg-white border-gray-300 text-black font-mono h-32 mt-2 focus:border-black focus:ring-black"
                              value={requestBody}
                              onChange={(e) => setRequestBody(e.target.value)}
                            />
                          </TabsContent>
                        )}
                        
                        <TabsContent value="headers" className="mt-4 space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="auth-header" className="text-gray-800 font-medium">
                              Authorization
                            </Label>
                            <Input
                              id="auth-header"
                              placeholder="Bearer YOUR_API_KEY"
                              className="bg-white border-gray-300 text-black focus:border-black focus:ring-black"
                              value={authToken}
                              onChange={(e) => setAuthToken(e.target.value)}
                            />
                          </div>
                        </TabsContent>
                      </Tabs>
                      
                      <Button
                        onClick={handleSendRequest}
                        disabled={loading}
                        className="mt-6 w-full bg-black hover:bg-gray-800 text-white font-bold uppercase tracking-wide"
                      >
                        {loading ? (
                          <>
                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                            Sending Request...
                          </>
                        ) : (
                          <>
                            <Play className="mr-2 h-4 w-4" />
                            Send Request
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-bold text-black uppercase tracking-tight mb-4">Response</h4>
                    <Card className="bg-white border-gray-300 h-full min-h-[400px] max-h-[600px] flex flex-col">
                      <CardHeader className="pb-3 flex-shrink-0">
                        <CardTitle className="text-gray-800 text-sm font-medium uppercase tracking-wide">API Response</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1 overflow-hidden">
                        {loading && (
                          <div className="flex items-center justify-center h-64">
                            <LoaderCircle className="h-8 w-8 text-gray-400 animate-spin" />
                          </div>
                        )}
                        {response && (
                          <div className="h-full overflow-auto">
                            <pre className="text-xs text-black bg-gray-100 p-4 rounded-lg border border-gray-200 font-mono whitespace-pre-wrap break-words">
                              {JSON.stringify(response, null, 2)}
                            </pre>
                          </div>
                        )}
                        {!response && !loading && (
                          <div className="text-gray-500 text-center py-16 font-medium">
                            Click "Send Request" to see the response here.
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

// --- Sidebar Component ---
type DocsSidebarProps = {
  categories: ApiCategory[]
  openGroupId: string | null
  setOpenGroupId: Dispatch<SetStateAction<string | null>>
}

const DocsSidebar = ({ categories, openGroupId, setOpenGroupId }: DocsSidebarProps) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  const handleGroupClick = (groupId: string) => {
    setOpenGroupId((prevId) => (prevId === groupId ? null : groupId))
  }

  const handleLinkClick = (categoryId: string) => {
    setIsMobileNavOpen(false)
    const element = document.getElementById(`category-${categoryId}`)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const renderNav = () => (
    <div className="lg:sticky lg:top-28">
      {categories.map((category) => (
        <div className="mb-4" key={category.id}>
          <button
            className="flex items-center w-full text-left py-3 group"
            onClick={() => handleLinkClick(category.id)}
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <ChevronRight className="w-5 h-5 text-gray-500 transition-transform duration-300" />
            </div>
            <h3 className="text-lg font-bold text-black uppercase tracking-tight group-hover:text-gray-700">
              {category.name}
            </h3>
            <span className="ml-auto text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {category.endpoints.length}
            </span>
          </button>
        </div>
      ))}
    </div>
  )

  return (
    <aside className="mb-12 lg:mb-0">
      <div className="lg:hidden">
        <button
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          className="flex items-center justify-between w-full h-16 px-6 bg-gray-50 border border-gray-200 rounded-xl"
        >
          <span className="text-lg font-bold text-gray-800 uppercase tracking-tight">API Menu</span>
          <ChevronDown
            className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${isMobileNavOpen ? "rotate-180" : ""}`}
          />
        </button>
        <AnimatePresence>
          {isMobileNavOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden mt-2 bg-white rounded-xl border border-gray-200 shadow-lg"
            >
              <div className="p-4">{renderNav()}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="hidden lg:block">{renderNav()}</div>
    </aside>
  )
}

// --- Main Page Component ---
export default function DocsPage() {
  const [openGroupId, setOpenGroupId] = useState<string | null>(apiData[0]?.id || null)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCategories = apiData.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.endpoints.some(endpoint => 
      endpoint.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      endpoint.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  return (
    <div className="bg-white text-black min-h-screen font-sans">
      <section className="relative py-24 md:py-32 px-6 bg-white overflow-hidden border-b border-gray-200">
        <div className="absolute inset-0 bg-[url(/grid.png)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight">API Documentation</h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Interactive API documentation for FuteurCred platform. Test endpoints, explore responses, and integrate with confidence.
          </p>
        </div>
      </section>

      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="relative max-w-3xl mb-12 md:mb-20 mx-auto">
          <Search className="absolute top-1/2 left-6 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            className="w-full h-16 pl-14 pr-6 bg-white border border-gray-200 rounded-full outline-none transition-colors focus:border-gray-400 focus:ring-2 focus:ring-gray-200 placeholder-gray-500 shadow-sm text-lg"
            type="text"
            placeholder="Search API endpoints..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-12 xl:gap-20">
          <DocsSidebar categories={filteredCategories} openGroupId={openGroupId} setOpenGroupId={setOpenGroupId} />

          <div className="lg:mt-0">
            {filteredCategories.map((category) => (
              <div key={category.id} id={`category-${category.id}`} className="mb-20 scroll-mt-28">
                <h2 className="text-3xl font-black mb-12 md:mb-16 pb-6 border-b border-gray-200 uppercase tracking-tight">
                  {category.name}
                </h2>
                <div className="space-y-6">
                  {category.endpoints.map((endpoint, index) => (
                    <ApiEndpointItem
                      key={`${category.id}-${endpoint.path}`}
                      endpoint={endpoint}
                      categoryId={category.id}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}


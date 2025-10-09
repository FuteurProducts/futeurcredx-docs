"use client"

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { useState } from "react"
import { apiData, ApiEndpoint, InfoSection, HttpMethod, ApiCategory } from "@/data/api-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, ChevronRight } from "lucide-react"
import { mockResponses } from "@/data/mock-responses"

// Helper to generate cURL command
const generateCurl = (endpoint: ApiEndpoint) => {
  const baseUrl = 'https://futeur.app/api/v1';
  const headers = `  --header 'Authorization: Bearer <YOUR_API_KEY>' \\`
  const body = endpoint.bodySchema
    ? `  --header 'Content-Type: application/json' \\
  --data '${JSON.stringify(endpoint.bodySchema, null, 2)}'`
    : ''
  return `curl --request ${endpoint.method} \\
  --url ${baseUrl}${endpoint.path} \\
${headers}
${body}`
}

// Helper to get badge colors for HTTP methods
const getMethodBadgeClass = (method: HttpMethod) => {
  const colors: Record<HttpMethod, string> = {
    POST: "bg-blue-500 text-white dark:bg-blue-500/30 dark:text-blue-300 dark:border dark:border-blue-500/50",
    GET: "bg-green-600 text-white dark:bg-green-500/30 dark:text-green-300 dark:border dark:border-green-500/50",
    PUT: "bg-orange-400 text-white dark:bg-orange-400/30 dark:text-orange-300 dark:border dark:border-orange-400/50",
    DELETE: "bg-red-500 text-white dark:bg-red-500/30 dark:text-red-300 dark:border dark:border-red-500/50",
    PATCH: "bg-orange-500 text-white dark:bg-orange-500/30 dark:text-orange-300 dark:border dark:border-orange-500/50",
  }
  return colors[method] || "bg-gray-500 text-white"
}

export default function ApiReference() {
  // Find the first actual API endpoint to display by default (not info sections)
  const allEndpoints = apiData.flatMap(category => category.endpoints);
  const defaultEndpoint = allEndpoints.find(endpoint => endpoint.type === 'endpoint') || allEndpoints[0];
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | InfoSection | null>(defaultEndpoint || null);
  const [selectedResponse, setSelectedResponse] = useState("200")

  // Early return if no endpoints are available
  if (!selectedEndpoint) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">API Reference</h2>
          <p className="text-gray-600 dark:text-gray-400">No API endpoints available at the moment.</p>
        </div>
      </div>
    );
  }

  const curlExample = selectedEndpoint && selectedEndpoint.type === 'endpoint' ? generateCurl(selectedEndpoint) : '';
  const responseExample = selectedEndpoint && selectedEndpoint.type === 'endpoint' ? JSON.stringify(mockResponses[selectedEndpoint.path] || { message: "Success" }, null, 2) : '';

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row">
      {/* Left Sidebar for Navigation */}
      <aside className="w-full md:w-72 bg-white dark:bg-[#0d0d0f] md:h-screen overflow-y-auto hidden md:block border-r border-gray-200 dark:border-gray-800">
        <div className="p-6">
          <nav className="space-y-6">
            {apiData.map((category: ApiCategory) => (
              <div key={category.id}>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">{category.name}</h3>
                <div className="space-y-1">
                  {category.endpoints.map((endpoint) => (
                    <button
                      key={endpoint.path}
                      onClick={() => setSelectedEndpoint(endpoint)}
                      className={`w-full text-left flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${
                        selectedEndpoint?.path === endpoint.path
                          ? "bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-white font-medium"
                          : "text-gray-600 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {endpoint.type === 'endpoint' ? (
                          <Badge className={`text-[10px] w-14 flex-shrink-0 justify-center px-1 py-0 font-bold border-0 ${getMethodBadgeClass(endpoint.method)}`}>
                            {endpoint.method}
                          </Badge>
                        ) : (
                          <span className="w-14 flex-shrink-0"></span> // Placeholder for alignment
                        )}
                        <span className={`font-mono text-xs`}>{endpoint.type === 'endpoint' ? endpoint.path : endpoint.description}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {selectedEndpoint && selectedEndpoint.type === 'endpoint' ? (
          <>
            {/* Documentation Content (Center) */}
            <div className="flex-1 p-8 max-w-4xl bg-white dark:bg-[#0d0d0f] overflow-y-auto h-screen">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{selectedEndpoint.description}</h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-8">{selectedEndpoint.longDescription || "Detailed information about this endpoint will be available here."}</p>
              </div>

              {/* Endpoint URL */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-3 bg-gray-100 dark:bg-[#1a1a1a] px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800">
                    <Badge className={`text-white text-xs font-medium px-2 py-1 border-0 ${getMethodBadgeClass(selectedEndpoint.method)}`}>
                      {selectedEndpoint.method}
                    </Badge>
                    <code className="text-gray-800 dark:text-gray-300 font-mono">{selectedEndpoint.path}</code>
                  </div>
                </div>
              </div>

              {/* Parameters/Body */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Parameters</h2>
                <div className="p-6 space-y-8">
                  {selectedEndpoint.parameters && selectedEndpoint.parameters.length > 0 ? (
                      <div className="space-y-4">
                        {selectedEndpoint.parameters.map(param => (
                          <div key={param.name}>
                            <code className="text-blue-500 dark:text-blue-400 font-mono">{param.name}</code> <span className="text-gray-500">{param.type}</span>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{param.description}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600 dark:text-gray-400">This endpoint does not require any URL parameters.</p>
                    )}
                </div>
              </div>

              {selectedEndpoint.bodySchema && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Body</h2>
                  <pre className="bg-gray-100 dark:bg-[#1a1a1a] p-4 rounded-lg text-sm text-gray-800 dark:text-gray-300 overflow-x-auto">
                    <code>{JSON.stringify(selectedEndpoint.bodySchema, null, 2)}</code>
                  </pre>
                </div>
              )}
            </div>

            {/* Right Code Panel */}
            <aside className="w-[480px] bg-white dark:bg-[#0d0d0f] flex-col h-auto hidden lg:flex p-4 space-y-4 border-l border-gray-200 dark:border-gray-800">
              {/* cURL Tab */}
              <div className="bg-black dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between p-3 border-b border-gray-800">
                  <span className="text-sm font-medium text-gray-300 dark:text-gray-300">cURL</span>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-gray-800 dark:hover:bg-gray-700" onClick={() => navigator.clipboard.writeText(curlExample)}>
                      <Copy className="w-4 h-4 text-gray-400" />
                    </Button>
                  </div>
                </div>
                <div className="p-4 text-xs">
                  <SyntaxHighlighter language="bash" style={vscDarkPlus} customStyle={{ background: "transparent", padding: "0", margin: "0" }} wrapLongLines={true}>
                    {curlExample}
                  </SyntaxHighlighter>
                </div>
              </div>

              {/* Response Tab */}
              {/* Response Tab */}
              <div className="bg-black dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between p-3 border-b border-gray-800">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-green-300 bg-green-500/30 dark:text-green-400 dark:bg-green-900/50 px-2 py-1 rounded-md">200</span>
                    <span className="text-sm text-gray-300 dark:text-gray-400">Example</span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-gray-800 dark:hover:bg-gray-700" onClick={() => navigator.clipboard.writeText(responseExample)}>
                    <Copy className="w-4 h-4 text-gray-400" />
                  </Button>
                </div>
                <div className="p-4 text-xs">
                  <SyntaxHighlighter language="json" style={vscDarkPlus} customStyle={{ background: "transparent", padding: "0", margin: "0" }} wrapLongLines={true}>
                    {responseExample}
                  </SyntaxHighlighter>
                </div>
              </div>

              {/* Response Headers Tab */}
              {selectedEndpoint.type === 'endpoint' && selectedEndpoint.responses && selectedEndpoint.responses[0]?.headers && (
                <div className="bg-gray-100 dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between p-3 border-b border-gray-800">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-300">Response Headers</span>
                  </div>
                  <div className="p-4 text-xs font-mono">
                    {Object.entries(selectedEndpoint.responses[0].headers).map(([key, value]) => (
                      <div key={key} className="flex">
                        <span className="text-gray-500">{key}:&nbsp;</span>
                        <span className="text-gray-800 dark:text-gray-300">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </>
        ) : selectedEndpoint ? (
          <div className="flex-1 p-8 max-w-4xl bg-white dark:bg-[#0d0d0f] overflow-y-auto h-screen text-gray-800 dark:text-gray-300">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{selectedEndpoint.description}</h1>
            </div>
            <div className="space-y-6">
              {selectedEndpoint.content?.map((block, index) => {
                if (block.type === 'paragraph') {
                  const linkRegex = new RegExp(/\[([^\]]+)\]\(([^)]+)\)/g);
                  const parts = block.content.split(linkRegex);

                  return (
                    <p key={index} className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {parts.map((part, i) => {
                        if (i % 3 === 1) {
                          const url = parts[i + 1];
                          return (
                            <a key={i} href={url.startsWith('http') ? url : `https://${url}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 dark:text-blue-400 hover:underline">
                              {part}
                            </a>
                          );
                        }
                        if (i % 3 === 2) {
                          return null;
                        }
                        return part;
                      })}
                    </p>
                  );
                }
                if (block.type === 'code') {
                  const isBash = block.language.toLowerCase() === 'bash';
                  return (
                    <div key={index} className={`${isBash ? 'bg-black' : 'bg-gray-100'} dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-gray-800 my-6`}>
                      <div className="flex items-center justify-between p-3 border-b border-gray-800">
                        <span className={`text-sm font-medium ${isBash ? 'text-gray-300' : 'text-gray-800'} dark:text-gray-300`}>{block.language}</span>
                        <Button variant="ghost" size="icon" className={`h-7 w-7 ${isBash ? 'hover:bg-gray-800' : 'hover:bg-gray-200'} dark:hover:bg-gray-700`} onClick={() => navigator.clipboard.writeText(block.content)}>
                          <Copy className="w-4 h-4 text-gray-400" />
                        </Button>
                      </div>
                      <div className="p-4 text-xs">
                        <SyntaxHighlighter language={block.language} style={vscDarkPlus} customStyle={{ background: "transparent", padding: "0", margin: "0" }} wrapLongLines={true}>
                          {block.content}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                  );
                }
                if (block.type === 'image') {
                  return (
                    <div key={index} className="my-6">
                      <img src={block.src} alt={block.alt} className="rounded-lg border border-gray-200 dark:border-gray-800 w-full" />
                    </div>
                  );
                }
                if (block.type === 'heading') {
                  const Tag = `h${block.level}` as keyof JSX.IntrinsicElements;
                  return <Tag key={index} className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">{block.content}</Tag>
                }
                if (block.type === 'list') {
                  return (
                    <ul key={index} className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 pl-4">
                      {block.items.map((item, itemIndex) => (
                        <li key={itemIndex}>{item}</li>
                      ))}
                    </ul>
                  );
                }
                return null;
              })}
            </div>
          </div>
        ) : (
          <div className="flex-1 p-8 max-w-4xl bg-white dark:bg-[#0d0d0f] overflow-y-auto h-screen text-gray-800 dark:text-gray-300">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">No Content Available</h1>
              <p className="text-gray-600 dark:text-gray-400">Please select an endpoint from the sidebar.</p>
            </div>
          </div>
        )}
      </main>
      </div>
    </div>
  )
}


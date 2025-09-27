import React, { useState, useEffect } from 'react'
import { useUser, SignOutButton } from '@clerk/clerk-react'
import { testProductionClerk, testClerkAuthFlow } from '../utils/testProductionClerk'
import { testLiveApiConnection } from '../utils/liveApiTest'

const ProductionTest: React.FC = () => {
  const { user, isLoaded } = useUser()
  const [testResults, setTestResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Auto-run tests when component loads
    handleRunAllTests()
  }, [])

  const handleRunAllTests = async () => {
    setLoading(true)
    try {
      // Test Clerk configuration
      const clerkConfig = testProductionClerk()
      
      // Test Clerk auth flow
      const authFlow = await testClerkAuthFlow()
      
      // Test API connection
      const apiTest = await testLiveApiConnection()
      
      setTestResults({
        clerkConfig,
        authFlow,
        apiTest,
        timestamp: new Date().toISOString()
      })
    } catch (error: any) {
      console.error('Test failed:', error)
      setTestResults({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Production Test - futeurcredx.com
        </h1>
        
        {/* Current Status */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Status</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Domain:</strong> {window.location.hostname}
            </div>
            <div>
              <strong>Protocol:</strong> {window.location.protocol}
            </div>
            <div>
              <strong>Clerk Loaded:</strong> {isLoaded ? '✅ Yes' : '❌ No'}
            </div>
            <div>
              <strong>User Signed In:</strong> {user ? '✅ Yes' : '❌ No'}
            </div>
          </div>
          
          {user && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
              <h3 className="font-medium text-green-800">User Information:</h3>
              <p className="text-green-700">ID: {user.id}</p>
              <p className="text-green-700">Email: {user.emailAddresses[0]?.emailAddress}</p>
            </div>
          )}
        </div>

        {/* Test Controls */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
          <div className="flex space-x-4">
            <button
              onClick={handleRunAllTests}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Running Tests...' : '🧪 Run All Tests'}
            </button>
            
            {user && (
              <SignOutButton>
                <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                  🚪 Sign Out
                </button>
              </SignOutButton>
            )}
          </div>
        </div>

        {/* Test Results */}
        {testResults && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            
            {testResults.error ? (
              <div className="bg-red-50 border border-red-200 rounded p-4">
                <h3 className="text-red-800 font-medium">Error:</h3>
                <p className="text-red-700">{testResults.error}</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Clerk Configuration */}
                <div>
                  <h3 className="font-medium mb-2">Clerk Configuration:</h3>
                  <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                    {JSON.stringify(testResults.clerkConfig, null, 2)}
                  </pre>
                </div>

                {/* Auth Flow */}
                <div>
                  <h3 className="font-medium mb-2">Auth Flow Test:</h3>
                  <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                    {JSON.stringify(testResults.authFlow, null, 2)}
                  </pre>
                </div>

                {/* API Test */}
                <div>
                  <h3 className="font-medium mb-2">API Connection Test:</h3>
                  <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                    {JSON.stringify(testResults.apiTest, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-yellow-800 font-medium mb-2">Setup Instructions:</h3>
          <ol className="text-yellow-700 text-sm space-y-1 list-decimal list-inside">
            <li>Go to your Clerk Dashboard (https://dashboard.clerk.com)</li>
            <li>Select your application</li>
            <li>Go to Settings → Domains</li>
            <li>Add: <code>https://www.futeurcredx.com</code></li>
            <li>Add: <code>https://futeurcredx.com</code></li>
            <li>Go to Settings → Redirect URLs</li>
            <li>Add: <code>https://www.futeurcredx.com/dashboard</code></li>
            <li>Add: <code>https://www.futeurcredx.com/register</code></li>
          </ol>
        </div>
      </div>
    </div>
  )
}

export default ProductionTest

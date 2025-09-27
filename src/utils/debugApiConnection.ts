/**
 * Debug API Connection
 * Utility to debug API connection issues between development and production
 */

import apiService from '../services/api'

export const debugApiConnection = async () => {
  console.log('🔍 Debugging API Connection...')
  console.log('Current environment:', {
    isDev: import.meta.env.DEV,
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://futeur.app',
    currentHost: window.location.host,
    currentProtocol: window.location.protocol
  })

  // Test 1: Check if we're using the proxy correctly
  console.log('\n📡 Test 1: Testing with relative URL (should use Vite proxy)')
  try {
    const response1 = await apiService.get('/api/v1')
    console.log('✅ Relative URL works:', response1.data)
  } catch (error: any) {
    console.error('❌ Relative URL failed:', error.message)
    console.error('Error details:', error)
  }

  // Test 2: Check direct API call (might hit CORS)
  console.log('\n🌐 Test 2: Testing with absolute URL (might hit CORS)')
  try {
    const response2 = await fetch('https://futeur.app/api/v1', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    if (response2.ok) {
      const data = await response2.json()
      console.log('✅ Direct API call works:', data)
    } else {
      console.error('❌ Direct API call failed:', response2.status, response2.statusText)
    }
  } catch (error: any) {
    console.error('❌ Direct API call failed with error:', error.message)
    if (error.message.includes('CORS')) {
      console.error('🚫 CORS Error detected! This is likely the issue.')
    }
  }

  // Test 3: Check API key authentication
  console.log('\n🔑 Test 3: Testing API key authentication')
  const testApiKey = 'your-test-api-key-here' // Replace with your actual API key
  
  if (testApiKey !== 'your-test-api-key-here') {
    try {
      // Set API key for this test
      apiService.setApiKey(testApiKey)
      
      const response3 = await apiService.get('/api/v1/api-keys')
      console.log('✅ API key authentication works:', response3.data)
    } catch (error: any) {
      console.error('❌ API key authentication failed:', error.message)
      console.error('Error details:', error)
    } finally {
      // Clear API key
      apiService.setApiKey(null)
    }
  } else {
    console.log('⚠️ Skipping API key test - please set your test API key in the code')
  }

  // Test 4: Check headers being sent
  console.log('\n📋 Test 4: Checking request headers')
  try {
    const originalLog = console.log
    console.log = (...args) => {
      if (args[0]?.includes('🚀 API Request:')) {
        originalLog('📋 Request Headers:', args[1]?.headers)
      }
      originalLog(...args)
    }
    
    await apiService.get('/api/v1')
    
    console.log = originalLog
  } catch (error) {
    console.log = originalLog
    console.error('Error checking headers:', error)
  }
}

// Test function for browser console
export const debugFromConsole = () => {
  debugApiConnection()
}

// Make it available globally for testing
if (typeof window !== 'undefined') {
  (window as any).debugApiConnection = debugFromConsole
}

/**
 * Live API Test Utility
 * Tests the live API without CORS issues using Vite proxy
 */

import apiService from '../services/api'

export interface LiveApiTestResult {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
  status?: number;
}

export const testLiveApiConnection = async (): Promise<LiveApiTestResult> => {
  try {
    console.log('🔍 Testing live API connection through Vite proxy...')
    console.log('📍 Current URL:', window.location.href)
    console.log('🌐 API Base URL:', import.meta.env.VITE_API_BASE_URL || 'https://futeur.app')
    console.log('🔄 Using relative URL to go through Vite proxy...')
    
    // Test the main API endpoint using relative URL (goes through Vite proxy)
    const response = await apiService.get('/api/v1')
    
    console.log('✅ Live API connection successful!')
    console.log('📊 Response:', response.data)
    
    return {
      success: true,
      message: 'Live API connection successful',
      data: response.data,
      status: response.status
    }
  } catch (error: any) {
    console.error('❌ Live API connection failed:', error)
    
    return {
      success: false,
      message: 'Live API connection failed',
      error: error.message,
      status: error.status
    }
  }
}

export const testLiveApiWithKey = async (apiKey: string): Promise<LiveApiTestResult> => {
  try {
    console.log('🔑 Testing live API with API key...')
    console.log('🔄 Using relative URL to go through Vite proxy...')
    
    // Set API key for this request
    apiService.setApiKey(apiKey)
    
    // Test API keys endpoint using relative URL (goes through Vite proxy)
    const response = await apiService.get('/api/v1/api-keys')
    
    console.log('✅ Live API with key successful!')
    console.log('📊 Response:', response.data)
    
    return {
      success: true,
      message: 'Live API with key successful',
      data: response.data,
      status: response.status
    }
  } catch (error: any) {
    console.error('❌ Live API with key failed:', error)
    
    return {
      success: false,
      message: 'Live API with key failed',
      error: error.message,
      status: error.status
    }
  } finally {
    // Clear API key
    apiService.setApiKey(null)
  }
}

export const testLiveAuth = async (email: string, password: string): Promise<LiveApiTestResult> => {
  try {
    console.log('🔐 Testing live authentication...')
    console.log('🔄 Using relative URL to go through Vite proxy...')
    
    const response = await apiService.post('/api/v1/auth/login', {
      email,
      password
    })
    
    console.log('✅ Live authentication successful!')
    console.log('📊 Response:', response.data)
    
    return {
      success: true,
      message: 'Live authentication successful',
      data: response.data,
      status: response.status
    }
  } catch (error: any) {
    console.error('❌ Live authentication failed:', error)
    
    return {
      success: false,
      message: 'Live authentication failed',
      error: error.message,
      status: error.status
    }
  }
}

export const testLiveRegister = async (name: string, email: string, password: string): Promise<LiveApiTestResult> => {
  try {
    console.log('📝 Testing live registration...')
    console.log('🔄 Using relative URL to go through Vite proxy...')
    
    const response = await apiService.post('/api/v1/auth/register', {
      name,
      email,
      password
    })
    
    console.log('✅ Live registration successful!')
    console.log('📊 Response:', response.data)
    
    return {
      success: true,
      message: 'Live registration successful',
      data: response.data,
      status: response.status
    }
  } catch (error: any) {
    console.error('❌ Live registration failed:', error)
    
    return {
      success: false,
      message: 'Live registration failed',
      error: error.message,
      status: error.status
    }
  }
}

// Test function for browser console
export const testLiveApiFromConsole = async (apiKey?: string) => {
  console.log('🚀 Starting live API tests...')
  
  // Test 1: Basic connection
  console.log('\n📡 Test 1: Basic API Connection')
  const connectionTest = await testLiveApiConnection()
  console.log('Result:', connectionTest)
  
  // Test 2: With API key (if provided)
  if (apiKey) {
    console.log('\n🔑 Test 2: API with Key')
    const keyTest = await testLiveApiWithKey(apiKey)
    console.log('Result:', keyTest)
  }
  
  return { connectionTest, keyTest: apiKey ? await testLiveApiWithKey(apiKey) : null }
}

// Make it available globally for testing
if (typeof window !== 'undefined') {
  (window as any).testLiveApi = testLiveApiFromConsole
  (window as any).testLiveApiConnection = testLiveApiConnection
  (window as any).testLiveApiWithKey = testLiveApiWithKey
  (window as any).testLiveAuth = testLiveAuth
  (window as any).testLiveRegister = testLiveRegister
}

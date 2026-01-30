/**
 * Test API Connection
 * Utility to test the API connection with the new base URL
 */

import apiService from '../services/api'

export const testApiConnection = async (): Promise<{
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}> => {
  try {
    console.log('🔍 Testing API connection to https://futeur.app...')
    
    // Test the main API endpoint
    const response = await apiService.get('/api/v1')
    
    console.log('✅ API connection successful!')
    console.log('Response:', response.data)
    
    return {
      success: true,
      message: 'API connection successful',
      data: response.data
    }
  } catch (error: any) {
    console.error('❌ API connection failed:', error)
    
    return {
      success: false,
      message: 'API connection failed',
      error: error.message
    }
  }
}

// Test function that can be called from browser console
export const testApiFromConsole = async () => {
  const result = await testApiConnection()
  
  if (result.success) {
    console.log('🎉 API Test Result:', result)
  } else {
    console.error('💥 API Test Failed:', result)
  }
  
  return result
}

// Make it available globally for testing
if (typeof window !== 'undefined') {
  (window as any).testApiConnection = testApiFromConsole
}

/**
 * Test API Connection
 * Utility to test the API connection with the new base URL
 */

import apiService from '../services/api'
import { logger } from '@/utils/logger'

export const testApiConnection = async (): Promise<{
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}> => {
  try {
    logger.info('Testing API connection to https://api.lumiq.ai...')
    
    // Test the main API endpoint
    const response = await apiService.get('/api/v1')
    
    logger.info('API connection successful!')
    logger.info('Response:', response.data)
    
    return {
      success: true,
      message: 'API connection successful',
      data: response.data
    }
  } catch (error: any) {
    logger.error('API connection failed:', error)
    
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
    logger.info('API Test Result:', result)
  } else {
    logger.error('API Test Failed:', result)
  }
  
  return result
}

// Make it available globally for testing
if (typeof window !== 'undefined') {
  (window as any).testApiConnection = testApiFromConsole
}

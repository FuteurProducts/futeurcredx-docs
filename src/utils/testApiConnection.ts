/**
 * Test API Connection
 * Utility to test the API connection with the new base URL
 */

import apiService from '../services/api'
import { logger } from '@/utils/logger'

export const testApiConnection = async (): Promise<{
  success: boolean;
  message: string;
  data?: unknown;
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
  } catch (error: unknown) {
    logger.error('API connection failed:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return {
      success: false,
      message: 'API connection failed',
      error: errorMessage
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).testApiConnection = testApiFromConsole
}

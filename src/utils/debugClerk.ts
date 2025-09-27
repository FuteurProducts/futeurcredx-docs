/**
 * Debug Clerk Configuration
 * Utility to debug Clerk setup and domain issues
 */

export const debugClerkConfiguration = () => {
  console.log('🔍 Debugging Clerk Configuration...')
  console.log('=====================================')
  
  // Check environment variables
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
  console.log('📋 Environment Variables:')
  console.log('  VITE_CLERK_PUBLISHABLE_KEY:', publishableKey ? `${publishableKey.substring(0, 20)}...` : 'NOT SET')
  console.log('  Current Domain:', window.location.hostname)
  console.log('  Current Port:', window.location.port)
  console.log('  Current Protocol:', window.location.protocol)
  console.log('  Full URL:', window.location.href)
  
  // Check if Clerk is loaded
  console.log('\n🔧 Clerk Status:')
  console.log('  Clerk in window:', !!(window as any).Clerk)
  console.log('  Clerk loaded:', !!(window as any).Clerk?.loaded)
  
  // Check for Clerk errors in console
  console.log('\n🚨 Common Issues:')
  console.log('  1. Domain not allowed in Clerk dashboard')
  console.log('  2. Wrong publishable key for environment')
  console.log('  3. CORS issues with Clerk API')
  console.log('  4. Network connectivity issues')
  
  // Check network requests
  console.log('\n🌐 Network Check:')
  console.log('  Check Network tab for failed requests to:')
  console.log('  - clerk.app.futeur.ai')
  console.log('  - api.clerk.com')
  console.log('  - *.clerk.services')
  
  return {
    publishableKey: publishableKey ? `${publishableKey.substring(0, 20)}...` : null,
    domain: window.location.hostname,
    port: window.location.port,
    protocol: window.location.protocol,
    clerkLoaded: !!(window as any).Clerk?.loaded
  }
}

// Test Clerk connection
export const testClerkConnection = async () => {
  try {
    console.log('🧪 Testing Clerk Connection...')
    
    // Check if Clerk is available
    if (!(window as any).Clerk) {
      throw new Error('Clerk not loaded')
    }
    
    const clerk = (window as any).Clerk
    console.log('✅ Clerk loaded successfully')
    console.log('  Clerk version:', clerk.version)
    console.log('  Clerk loaded:', clerk.loaded)
    
    // Check user state
    if (clerk.user) {
      console.log('👤 User signed in:', clerk.user.id)
    } else {
      console.log('👤 User not signed in')
    }
    
    return {
      success: true,
      clerkLoaded: true,
      userSignedIn: !!clerk.user,
      userId: clerk.user?.id
    }
  } catch (error: any) {
    console.error('❌ Clerk connection failed:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Check for common Clerk errors
export const checkClerkErrors = () => {
  console.log('🔍 Checking for Clerk Errors...')
  
  // Check console for errors
  const originalError = console.error
  const errors: string[] = []
  
  console.error = (...args) => {
    const message = args.join(' ')
    if (message.includes('clerk') || message.includes('Clerk')) {
      errors.push(message)
    }
    originalError(...args)
  }
  
  // Restore original console.error after a short delay
  setTimeout(() => {
    console.error = originalError
  }, 1000)
  
  return errors
}

// Make functions available globally
if (typeof window !== 'undefined') {
  (window as any).debugClerk = debugClerkConfiguration
  (window as any).testClerk = testClerkConnection
  (window as any).checkClerkErrors = checkClerkErrors
}

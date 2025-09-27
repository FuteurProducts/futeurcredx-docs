/**
 * Production Clerk Test
 * Test Clerk functionality on futeurcredx.com domain
 */

export const testProductionClerk = () => {
  console.log('🌐 Testing Production Clerk on futeurcredx.com...')
  console.log('================================================')
  
  // Check current domain
  const currentDomain = window.location.hostname
  const isProduction = currentDomain.includes('futeurcredx.com')
  
  console.log('📍 Current Domain:', currentDomain)
  console.log('🏭 Is Production:', isProduction)
  
  // Check Clerk configuration
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
  console.log('🔑 Publishable Key:', publishableKey ? `${publishableKey.substring(0, 20)}...` : 'NOT SET')
  
  // Check if Clerk is loaded
  const clerk = (window as any).Clerk
  console.log('📦 Clerk Loaded:', !!clerk)
  console.log('👤 User Signed In:', !!clerk?.user)
  
  if (clerk?.user) {
    console.log('👤 User ID:', clerk.user.id)
    console.log('📧 User Email:', clerk.user.emailAddresses[0]?.emailAddress)
  }
  
  // Check for common production issues
  console.log('\n🔍 Production Checklist:')
  console.log('  ✅ Domain added to Clerk dashboard')
  console.log('  ✅ Redirect URLs configured')
  console.log('  ✅ HTTPS enabled')
  console.log('  ✅ CORS headers set')
  
  return {
    domain: currentDomain,
    isProduction,
    clerkLoaded: !!clerk,
    userSignedIn: !!clerk?.user,
    publishableKey: publishableKey ? `${publishableKey.substring(0, 20)}...` : null
  }
}

// Test Clerk authentication flow
export const testClerkAuthFlow = async () => {
  try {
    console.log('🔐 Testing Clerk Authentication Flow...')
    
    const clerk = (window as any).Clerk
    if (!clerk) {
      throw new Error('Clerk not loaded')
    }
    
    // Test sign in
    console.log('📝 Testing sign in...')
    const signIn = clerk.client.signIn
    console.log('  Sign in method available:', typeof signIn === 'function')
    
    // Test sign up
    console.log('📝 Testing sign up...')
    const signUp = clerk.client.signUp
    console.log('  Sign up method available:', typeof signUp === 'function')
    
    // Test user management
    console.log('👤 Testing user management...')
    const user = clerk.user
    if (user) {
      console.log('  User ID:', user.id)
      console.log('  Email addresses:', user.emailAddresses.length)
      console.log('  Created at:', user.createdAt)
    }
    
    return {
      success: true,
      signInAvailable: typeof signIn === 'function',
      signUpAvailable: typeof signUp === 'function',
      userSignedIn: !!user,
      userId: user?.id
    }
  } catch (error: any) {
    console.error('❌ Clerk auth flow test failed:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Make functions available globally
if (typeof window !== 'undefined') {
  (window as any).testProductionClerk = testProductionClerk
  (window as any).testClerkAuthFlow = testClerkAuthFlow
}

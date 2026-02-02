import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import App from './App.tsx'
import { AuthProvider, FallbackAuthProvider, isClerkConfigured } from './contexts/AuthContext'
import { EnvironmentProvider } from './contexts/EnvironmentContext'

// Clerk key from .env — set VITE_CLERK_PUBLISHABLE_KEY in .env (or Vercel env vars)
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const useClerk = isClerkConfigured(CLERK_PUBLISHABLE_KEY)

if (!useClerk) {
  console.warn(
    '[Lumiq] Clerk not configured (missing or placeholder VITE_CLERK_PUBLISHABLE_KEY). ' +
    'App will run in unauthenticated mode. Set a real key in .env to enable sign-in.'
  )
}

const app = (
  <StrictMode>
    <EnvironmentProvider>
      <App />
    </EnvironmentProvider>
  </StrictMode>
)

createRoot(document.getElementById('root')!).render(
  useClerk ? (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY!} afterSignOutUrl="/">
      <AuthProvider>{app}</AuthProvider>
    </ClerkProvider>
  ) : (
    <FallbackAuthProvider>{app}</FallbackAuthProvider>
  ),
)

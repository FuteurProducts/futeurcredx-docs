import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext'
import { EnvironmentProvider } from './contexts/EnvironmentContext'

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!CLERK_PUBLISHABLE_KEY) {
  console.warn(
    '[Lumiq] VITE_CLERK_PUBLISHABLE_KEY not set. Auth features will not work. ' +
    'Set it in your .env file.'
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY || 'pk_test_placeholder'}
      afterSignOutUrl="/"
    >
      <AuthProvider>
        <EnvironmentProvider>
          <App />
        </EnvironmentProvider>
      </AuthProvider>
    </ClerkProvider>
  </StrictMode>,
)

import { StrictMode, Component, type ReactNode, type ErrorInfo } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import App from './App.tsx'
import { AuthProvider, FallbackAuthProvider, isClerkConfigured } from './contexts/AuthContext'
import { EnvironmentProvider } from './contexts/EnvironmentContext'

// Error boundary to surface runtime crashes visually
class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state: { error: Error | null } = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error('[ErrorBoundary]', error, info); }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 32, fontFamily: 'monospace', color: '#ff4444', background: '#1a1a1a', minHeight: '100vh' }}>
          <h1>React Error</h1>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{this.state.error.message}</pre>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: 12, color: '#999', marginTop: 16 }}>{this.state.error.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

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
    <ErrorBoundary>
      <EnvironmentProvider>
        <App />
      </EnvironmentProvider>
    </ErrorBoundary>
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

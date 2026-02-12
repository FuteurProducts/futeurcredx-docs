import { StrictMode, Component, type ReactNode, type ErrorInfo } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import App from './App.tsx'
import { AuthProvider, DemoAuthProvider, FallbackAuthProvider, isClerkConfigured } from './contexts/AuthContext'
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
const clerkConfigured = isClerkConfigured(CLERK_PUBLISHABLE_KEY)

if (!clerkConfigured) {
  console.warn(
    '[Lumiq] Clerk not configured (missing or placeholder VITE_CLERK_PUBLISHABLE_KEY). ' +
    'App will run in unauthenticated mode. Set a real key in .env to enable sign-in.'
  )
}

/**
 * Resolve mode before React renders so we can pick the right auth provider.
 * Priority: URL param ?mode=xxx → localStorage → default 'demo'
 */
function resolveInitialMode(): 'demo' | 'sandbox' | 'production' {
  const valid = ['demo', 'sandbox', 'production'] as const;
  if (typeof window !== 'undefined') {
    const urlMode = new URLSearchParams(window.location.search).get('mode');
    if (urlMode && valid.includes(urlMode as typeof valid[number])) {
      return urlMode as typeof valid[number];
    }
  }
  try {
    const saved = localStorage.getItem('lumiq-environment');
    if (saved && valid.includes(saved as typeof valid[number])) {
      return saved as typeof valid[number];
    }
  } catch { /* restricted storage */ }
  return 'demo';
}

const initialMode = resolveInitialMode();

/**
 * Wrap App with the correct auth provider based on operating mode.
 * - demo: DemoAuthProvider (auto signed in, admin RBAC)
 * - sandbox: Clerk if configured, else FallbackAuthProvider
 * - production: Clerk if configured, else FallbackAuthProvider
 */
function renderAuthWrappedApp(appElement: ReactNode) {
  if (initialMode === 'demo') {
    return <DemoAuthProvider>{appElement}</DemoAuthProvider>;
  }

  if (clerkConfigured) {
    return (
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY!} afterSignOutUrl="/">
        <AuthProvider>{appElement}</AuthProvider>
      </ClerkProvider>
    );
  }

  return <FallbackAuthProvider>{appElement}</FallbackAuthProvider>;
}

const app = (
  <StrictMode>
    <ErrorBoundary>
      <EnvironmentProvider>
        {renderAuthWrappedApp(<App />)}
      </EnvironmentProvider>
    </ErrorBoundary>
  </StrictMode>
)

createRoot(document.getElementById('root')!).render(app)

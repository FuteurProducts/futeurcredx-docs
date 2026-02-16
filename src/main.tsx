import { StrictMode, Component, lazy, Suspense, type ReactNode, type ErrorInfo } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { dark } from '@clerk/themes'
import './index.css'
import App from './App.tsx'
import { AuthProvider, DemoAuthProvider, FallbackAuthProvider, isClerkConfigured } from './contexts/AuthContext'
import { EnvironmentProvider } from './contexts/EnvironmentContext'

// ============================================
// EARLY HEAD TAG SETUP — runs before React renders
// Sets document.title, meta description, og:title, og:description
// based on hostname so the correct metadata is present immediately.
// ============================================
;(function setHeadMetadata() {
  const hostname = window.location.hostname;

  // ── Document title ──
  if (hostname.startsWith('docs.') || hostname.startsWith('docs-')) {
    document.title = 'FuteurCredX Docs — LumiqAI API Documentation';
  } else if (hostname.startsWith('chase.demo.') || hostname.startsWith('chase-demo.')) {
    document.title = 'Chase Demo — LumiqAI Dashboard';
  } else if (hostname.match(/^wells-?fargo\.demo\./)) {
    document.title = 'Wells Fargo Demo — LumiqAI Dashboard';
  } else if (hostname.startsWith('santander.demo.')) {
    document.title = 'Santander Demo — LumiqAI Dashboard';
  } else if (hostname.match(/^citi(bank)?\.demo\./)) {
    document.title = 'Citibank Demo — LumiqAI Dashboard';
  } else if (hostname.includes('sandbox')) {
    document.title = 'LumiqAI Dashboard — Sandbox';
  } else if (hostname.startsWith('app.')) {
    document.title = 'LumiqAI Dashboard';
  } else if (hostname === 'localhost' || hostname === '127.0.0.1') {
    document.title = 'LumiqAI Dashboard — Dev';
  } else {
    document.title = 'LumiqAI Dashboard';
  }

  // ── Meta description ──
  const isDocsHostname = hostname.startsWith('docs.');
  const descContent = isDocsHostname
    ? 'Developer documentation for the LumiqAI credit analytics API. Quickstart guides, API reference, and integration tutorials.'
    : 'LumiqAI by FuteurCredX — Enterprise credit analytics, risk scoring, and business intelligence for financial institutions.';
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute('content', descContent);
  }

  // ── OG tags ──
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogTitle) ogTitle.setAttribute('content', document.title);
  if (ogDesc) ogDesc.setAttribute('content', descContent);
})();

// Lazy-load DocsApp — only loaded when hostname is docs.*
const DocsApp = lazy(() => import('./docs/DocsApp'))

// Error boundary to surface runtime crashes visually
class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state: { error: Error | null } = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error('[ErrorBoundary]', error, info); }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column' as const,
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: '#0f172a',
          color: '#e2e8f0',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: '2rem',
          textAlign: 'center' as const,
        }}>
          <img src="/lumiq-logo.svg" alt="LumiqAI" style={{ height: '48px', marginBottom: '2rem', opacity: 0.8 }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Something went wrong</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '1.5rem', maxWidth: '400px' }}>
            An unexpected error occurred. Please refresh the page to continue.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '0.625rem 1.5rem',
              borderRadius: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Refresh Page
          </button>
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
 * Priority: pathname /demo/* → URL param ?mode=xxx → localStorage → default 'sandbox'
 */
function resolveInitialMode(): 'demo' | 'sandbox' | 'production' {
  if (typeof window === 'undefined') return 'sandbox';

  const hostname = window.location.hostname;
  const pathname = window.location.pathname;

  // ── HOSTNAME IS AUTHORITATIVE for deployed environments ──
  // Must match EnvironmentContext.resolveInitialEnvironment() exactly.
  if (hostname.includes('.demo.')) return 'demo';
  if (hostname.startsWith('sandbox.')) return 'sandbox';
  if (hostname.startsWith('app.')) return 'production';

  // ── PATHNAME for localhost development only ──
  if ((hostname === 'localhost' || hostname === '127.0.0.1') && pathname.startsWith('/demo/')) {
    return 'demo';
  }

  // ── URL param / localStorage fallback (non-demo only) ──
  const nonDemoValid = ['sandbox', 'production'] as const;
  const urlMode = new URLSearchParams(window.location.search).get('mode');
  if (urlMode && (nonDemoValid as readonly string[]).includes(urlMode)) {
    return urlMode as typeof nonDemoValid[number];
  }
  try {
    const saved = localStorage.getItem('lumiq-environment');
    if (saved && (nonDemoValid as readonly string[]).includes(saved)) {
      return saved as typeof nonDemoValid[number];
    }
  } catch { /* restricted storage */ }
  return 'sandbox';
}

const initialMode = resolveInitialMode();

/**
 * Wrap App with the correct auth provider based on operating mode.
 * - demo: DemoAuthProvider (auto signed in, admin RBAC, local mock data)
 * - sandbox/production: Clerk auth (real login wall) + X-API-Key for BFF data calls
 */
function renderAuthWrappedApp(appElement: ReactNode) {
  if (initialMode === 'demo') {
    return <DemoAuthProvider>{appElement}</DemoAuthProvider>;
  }

  // Sandbox + Production: Clerk handles the login wall.
  // After sign-in, user sets an API key in API Console for BFF data access.
  // BFF client uses X-API-Key when available, falls back to Clerk JWT.
  if (clerkConfigured) {
    return (
      <ClerkProvider
        publishableKey={CLERK_PUBLISHABLE_KEY!}
        afterSignOutUrl="/sign-in"
        appearance={{
          baseTheme: dark,
          variables: {
            colorPrimary: '#6366f1',
            colorBackground: '#020617',
            colorInputBackground: '#0f172a',
            colorText: '#f8fafc',
            colorTextSecondary: '#94a3b8',
            borderRadius: '0.75rem',
          },
        }}
      >
        <AuthProvider>{appElement}</AuthProvider>
      </ClerkProvider>
    );
  }

  return <FallbackAuthProvider>{appElement}</FallbackAuthProvider>;
}

/**
 * Hostname-based routing: docs.futeurcredx.com gets the documentation portal,
 * everything else gets the dashboard app. Also supports localhost ?docs param.
 */
function isDocsHost(): boolean {
  if (typeof window === 'undefined') return false;
  const hostname = window.location.hostname;
  // Production: docs.futeurcredx.com or docs.lumiq.ai
  if (hostname.startsWith('docs.')) return true;
  // Local dev: localhost:8080?docs or localhost:8080/docs-preview
  if ((hostname === 'localhost' || hostname === '127.0.0.1') &&
      (new URLSearchParams(window.location.search).has('docs') ||
       window.location.pathname.startsWith('/docs-preview'))) {
    return true;
  }
  return false;
}

const root = createRoot(document.getElementById('root')!);

if (isDocsHost()) {
  // Documentation portal — no auth, no environment context needed
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <Suspense fallback={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#030712' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 32, height: 32, border: '2px solid #6366f1', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
              <p style={{ marginTop: 12, fontSize: 14, color: '#9ca3af' }}>Loading docs...</p>
            </div>
          </div>
        }>
          <DocsApp />
        </Suspense>
      </ErrorBoundary>
    </StrictMode>
  );
} else {
  // Dashboard app — full auth + environment context
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <EnvironmentProvider>
          {renderAuthWrappedApp(<App />)}
        </EnvironmentProvider>
      </ErrorBoundary>
    </StrictMode>
  );
}

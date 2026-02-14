import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useUser } from './contexts/AuthContext'
import { useEnvironment } from './contexts/EnvironmentContext'
import { PortfolioProvider } from './contexts/PortfolioContext'
import { BankProvider } from './contexts/BankContext'
import { ACTIVE_BANK_ID } from './data/bankConfig'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { Toaster } from 'react-hot-toast'

// Lazy-loaded page components
const Login = React.lazy(() => import('./pages/Authentication/Login'))
const Register = React.lazy(() => import('./pages/Authentication/Register'))
const BusinessSignup = React.lazy(() => import('./pages/Authentication/BusinessSignup'))
const Dashboard = React.lazy(() => import('./pages/Dashboard/Dashboard'))
const Index = React.lazy(() => import('./pages/Dashboard/Index'))
const Analytics = React.lazy(() => import('./pages/Dashboard/Analytics'))
const Users = React.lazy(() => import('./pages/Dashboard/Users'))
const Products = React.lazy(() => import('./pages/Dashboard/Products'))
const Reports = React.lazy(() => import('./pages/Dashboard/Reports'))
const Risk = React.lazy(() => import('./pages/Dashboard/Risk'))
const CreditIntelligence = React.lazy(() => import('./pages/Dashboard/CreditIntelligence'))
const Customer = React.lazy(() => import('./pages/Dashboard/Customer'))
const Settings = React.lazy(() => import('./pages/Dashboard/Settings'))
const Notifications = React.lazy(() => import('./pages/Dashboard/Notifications'))
const UnderwritingAssistant = React.lazy(() => import('./pages/Dashboard/UnderwritingAssistant'))
const ApiTesting = React.lazy(() => import('./pages/Dashboard/ApiTesting'))
const WidgetsShowcase = React.lazy(() => import('./pages/Dashboard/WidgetsShowcase'))
const DocumentationPage = React.lazy(() => import('./pages/Dashboard/Documentation'))
const NotFound = React.lazy(() => import('./pages/Dashboard/NotFound'))

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="text-center">
      <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent mx-auto"></div>
      <p className="mt-3 text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

// DEV/DEMO MODE: Bypass authentication for demo deployments or local development
// Demo sites bypass auth via DemoAuthProvider; sandbox/production use Clerk login wall.
const DEV_BYPASS_AUTH = false;

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useUser()
  const { isDemoMode } = useEnvironment()

  // Demo mode: always allow access (DemoAuthProvider handles auth)
  if (isDemoMode) {
    return <>{children}</>
  }

  // Bypass auth in dev mode
  if (DEV_BYPASS_AUTH) {
    return <>{children}</>
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />
  }

  return <>{children}</>
}

/** Environment-aware root redirect: demo → /demo/:bankId, others → /dashboard */
function RootRedirect() {
  const { isDemoMode } = useEnvironment()
  if (isDemoMode) {
    return <Navigate to={`/demo/${ACTIVE_BANK_ID}`} replace />
  }
  return <Navigate to="/dashboard" replace />
}

function App() {
  return (
    <ThemeProvider>
    <BankProvider>
    <BrowserRouter>
      <PortfolioProvider>
        <Toaster position="top-right" />
        <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Clerk auth routes (path-based routing) */}
          <Route path="/sign-in/*" element={<Login />} />
          <Route path="/sign-up/*" element={<Register />} />
          {/* Legacy redirects */}
          <Route path="/login" element={<Navigate to="/sign-in" replace />} />
          <Route path="/register" element={<Navigate to="/sign-up" replace />} />
          <Route path="/business-signup" element={
            <ProtectedRoute>
              <BusinessSignup />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          
          <Route path="/dashboard/index" element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard/analytics" element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard/users" element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard/products" element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard/reports" element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard/risk" element={
            <ProtectedRoute>
              <Risk />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard/credit-intelligence" element={
            <ProtectedRoute>
              <CreditIntelligence />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard/customer" element={
            <ProtectedRoute>
              <Customer />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard/notifications" element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard/underwriting-assistant" element={
            <ProtectedRoute>
              <UnderwritingAssistant />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard/api-testing" element={
            <ProtectedRoute>
              <ApiTesting apiKeys={[]} />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard/widgets" element={
            <ProtectedRoute>
              <WidgetsShowcase />
            </ProtectedRoute>
          } />

          <Route path="/dashboard/documentation" element={
            <ProtectedRoute>
              <DocumentationPage />
            </ProtectedRoute>
          } />

          {/* Demo mode: URL-isolated bank experiences */}
          <Route path="/demo/:bankId" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          {/* Default: environment-aware redirect */}
          <Route path="/" element={<RootRedirect />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </PortfolioProvider>
    </BrowserRouter>
    </BankProvider>
    </ThemeProvider>
  )
}

export default App


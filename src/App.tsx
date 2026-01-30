import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useUser } from './contexts/AuthContext'
import { PortfolioProvider } from './contexts/PortfolioContext'
import Login from './pages/Authentication/Login'
import Register from './pages/Authentication/Register'
import BusinessSignup from './pages/Authentication/BusinessSignup'
import Dashboard from './pages/Dashboard/Dashboard'

import Index from './pages/Dashboard/Index'
import Analytics from './pages/Dashboard/Analytics'
import Users from './pages/Dashboard/Users'
import Products from './pages/Dashboard/Products'
import Reports from './pages/Dashboard/Reports'
import Risk from './pages/Dashboard/Risk'
import CreditIntelligence from './pages/Dashboard/CreditIntelligence'
import Customer from './pages/Dashboard/Customer'
import Settings from './pages/Dashboard/Settings'
import Notifications from './pages/Dashboard/Notifications'
import UnderwritingAssistant from './pages/Dashboard/UnderwritingAssistant'
import ApiTesting from './pages/Dashboard/ApiTesting'
import WidgetsShowcase from './pages/Dashboard/WidgetsShowcase'
import NotFound from './pages/Dashboard/NotFound'
import { Toaster } from 'react-hot-toast'

// DEV MODE: Bypass authentication for frontend development
const DEV_BYPASS_AUTH = true; // Set to false to re-enable auth

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useUser()
  
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
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

function App() {
  return (
    <BrowserRouter>
      <PortfolioProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
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
          
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PortfolioProvider>
    </BrowserRouter>
  )
}

export default App


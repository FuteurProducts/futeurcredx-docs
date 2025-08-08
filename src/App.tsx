import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import Business from "./pages/Business";
import Enterprise from "./pages/Enterprise";
import Fintech from "./pages/Fintech";
import ApiDocs from "./pages/ApiDocs";
import LumiqBuild from "./pages/LumiqBuild";
import CreditJourney from "./pages/CreditJourney";
import MobileApp from "./pages/MobileApp";
import App from "./pages/App";
import FAQ from "./pages/FAQ";
import FuteurCredPlus from "./pages/FuteurCredPlus";
import Docs from "./pages/Docs";
import NotFound from "./pages/NotFound";
import FuteurHeader from "./pages/Header";
import Footer from "./pages/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const AppRouter = () => {
  // Check the hostname to determine if we need to redirect
  const hostname = window.location.hostname;
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
  
  // Get URL parameters for local development testing
  const urlParams = new URLSearchParams(window.location.search);
  const testMode = urlParams.get('mode');
  
  // Detect subdomain routing
  const isDomainInstitutions = hostname === 'institutions.futeurcredx.com' || (isLocalhost && testMode === 'institutions');
  const isDomainPlatform = hostname === 'platform.futeurcredx.com' || (isLocalhost && testMode === 'platform');
  const isDomainDocs = hostname === 'docs.futeurcredx.com' || (isLocalhost && testMode === 'docs');

  return (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <FuteurHeader />
          <div className="pt-16"> {/* Add padding top to ensure content starts below header */}
            <Routes>
          {/* TEMPORARILY DISABLED DOMAIN ROUTING FOR TESTING */}
          {false ? (
            // For docs.futeurcredx.com, show Docs content for all routes
            <>
              <Route path="/*" element={<Docs />} />
            </>
          ) : false ? (
            // For institutions.futeurcredx.com, show Enterprise content for most routes
            <>
              <Route path="/faq" element={<FAQ />} />
              <Route path="/*" element={<Enterprise />} />
            </>
          ) : false ? (
            // For platform.futeurcredx.com, show Fintech content for most routes
            <>
              <Route path="/faq" element={<FAQ />} />
              <Route path="/*" element={<Fintech />} />
            </>
          ) : (
            // Regular routing for main domain - ALWAYS ACTIVE FOR TESTING
            <>
              {/* Authentication Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/mobile-app" element={<MobileApp />} />
              <Route path="/business" element={<Business />} />
              <Route path="/enterprise" element={<Enterprise />} />
              <Route path="/fintech" element={<Fintech />} />
              <Route path="/api-docs" element={<ApiDocs />} />
              <Route path="/lumiq-build" element={<LumiqBuild />} />
              <Route path="/credit-journey" element={<CreditJourney />} />
              <Route path="/app" element={<App />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/futeurcred-plus" element={<FuteurCredPlus />} />
              <Route path="/docs" element={<Docs />} />
              
              {/* Local Development Routes - Physical routes for testing subdomains */}
              <Route path="/institutions" element={<Enterprise />} />
              <Route path="/institutions/*" element={<Enterprise />} />
              <Route path="/platform" element={<Fintech />} />
              <Route path="/platform/*" element={<Fintech />} />
              <Route path="/docs-test" element={<Docs />} />
              <Route path="/docs-test/*" element={<Docs />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </>
          )}
        </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </TooltipProvider>
  </AuthProvider>
  </QueryClientProvider>
  );
};

export default AppRouter;

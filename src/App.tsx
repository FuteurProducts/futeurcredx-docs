import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import Business from "./pages/Business";
import Enterprise from "./pages/Enterprise";
import Fintech from "./pages/Fintech";

import LumiqBuild from "./pages/LumiqBuild";
import CreditJourney from "./pages/CreditJourney";
import MobileApp from "./pages/MobileApp";
import App from "./pages/App";
import FAQ from "./pages/FAQ";
import FuteurCredPlus from "./pages/FuteurCredPlus";
import Docs from "./pages/Documentation/Docs";
import NotFound from "./pages/NotFound";
import FuteurHeader from "./pages/Header";
import DocsLayout from "./pages/Documentation/DocsLayout";
import Footer from "./pages/Footer"
import CleanFooter from "@/pages/Documentation/CleanFooter"
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from './pages/Documentation/dashboard/Dashboard'
import BusinessSignup from './pages/BusinessSignup';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';

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
  
  // Handle subdomain-specific routing for root paths
  if (window.location.pathname === '/') {
    // If we're on docs subdomain, default render the Docs component
    if (isDomainDocs) {
      return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <ScrollToTop />
                <DocsLayout />
              </BrowserRouter>
            </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
      );
    }
    
    // If we're on institutions subdomain, render the Enterprise component
    if (isDomainInstitutions) {
      return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <ScrollToTop />
                <FuteurHeader />
                <div className="pt-16">
                  <Enterprise />
                </div>
                <Footer />
              </BrowserRouter>
            </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
      );
    }
    
    // If we're on platform subdomain, render the Fintech component
    if (isDomainPlatform) {
      return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <ScrollToTop />
                <FuteurHeader />
                <div className="pt-16">
                  <Fintech />
                </div>
                <Footer />
              </BrowserRouter>
            </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
      );
    }
  }

  return (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Authentication Routes - No Header/Footer */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Docs routes with custom header */}
                        <Route path="/docs/*" element={<DocsLayout />} />
                                    <Route path="/docs-test" element={<DocsLayout />} />
            <Route path="/docs-test/*" element={<DocsLayout />} />
            
            {/* All other routes with Header/Footer */}
            <Route path="/*" element={
              <>
                <FuteurHeader />
                <div className="pt-16">
                  <Routes>
                    <Route path="/business-signup" element={
                      <SignedIn>
                        <BusinessSignup />
                      </SignedIn>
                    } />
                    
                    {/* Protected Routes */}
                    <Route path="/dashboard" element={
                      <SignedIn>
                        <div className="bg-white min-h-screen">
                          <Dashboard />
                          <CleanFooter />
                        </div>
                      </SignedIn>
                    } />
                    
                    {/* Public Routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/mobile-app" element={<MobileApp />} />
                    <Route path="/business" element={<Business />} />
                    <Route path="/enterprise" element={<Enterprise />} />
                    <Route path="/fintech" element={<Fintech />} />
                  
                    <Route path="/lumiq-build" element={<LumiqBuild />} />
                    <Route path="/credit-journey" element={<CreditJourney />} />
                    <Route path="/app" element={<App />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/futeurcred-plus" element={<FuteurCredPlus />} />
                    {/* The /docs route is now handled outside this block to use a different header */}
                    
                    {/* Local Development Routes - Physical routes for testing subdomains */}
                    <Route path="/institutions" element={<Enterprise />} />
                    <Route path="/institutions/*" element={<Enterprise />} />
                    <Route path="/platform" element={<Fintech />} />
                    <Route path="/platform/*" element={<Fintech />} />
                    {/* The /docs-test routes are now handled outside this block to use a different header */}
                    
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
                {/* Conditionally render Footer - exclude from Dashboard */}
                {window.location.pathname !== '/dashboard' && <Footer />}
              </>
            } />
          </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
</ThemeProvider>
  );
};

export default AppRouter;


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
import MainLayout from './pages/MainLayout';
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
            <Route path="/*" element={<MainLayout />} />
          </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
</ThemeProvider>
  );
};

export default AppRouter;


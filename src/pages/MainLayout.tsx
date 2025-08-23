import { useLocation, Routes, Route } from 'react-router-dom';
import FuteurHeader from './Header';
import Footer from './Footer';
import Index from './Index';
import Business from './Business';
import Enterprise from './Enterprise';
import Fintech from './Fintech';
import LumiqBuild from './LumiqBuild';
import CreditJourney from './CreditJourney';
import MobileApp from './MobileApp';
import App from './App';
import FAQ from './FAQ';
import FuteurCredPlus from './FuteurCredPlus';
import NotFound from './NotFound';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';
import ContactUs from './ContactUs';
import Dashboard from './Documentation/dashboard/Dashboard';
import BusinessSignup from './BusinessSignup';
import CleanFooter from '@/pages/Documentation/CleanFooter';
import { SignedIn } from '@clerk/clerk-react';

const MainLayout = () => {
  const location = useLocation();
  const showHeader = location.pathname !== '/dashboard';

  return (
    <>
      {showHeader && <FuteurHeader />}
      <div className={showHeader ? 'pt-16' : ''}>
        <Routes>
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <SignedIn>
              <div className="bg-white min-h-screen">
                <Dashboard />
                <CleanFooter />
              </div>
            </SignedIn>
          } />
          <Route path="/business-signup" element={
            <SignedIn>
              <BusinessSignup />
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
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/contact-us" element={<ContactUs />} />
          
          {/* Local Development Routes */}
          <Route path="/institutions" element={<Enterprise />} />
          <Route path="/institutions/*" element={<Enterprise />} />
          <Route path="/platform" element={<Fintech />} />
          <Route path="/platform/*" element={<Fintech />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {location.pathname !== '/dashboard' && <Footer />}
    </>
  );
};

export default MainLayout;

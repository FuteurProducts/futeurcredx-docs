
import LumiqCarouselSection from '@/components/LumiqCarouselSection';
import BusinessHero from '@/components/business/BusinessHero';
import CompetitorComparison from '@/components/business/CompetitorComparison';
import PGFreeSection from '@/components/business/PGFreeSection';
import BusinessFeatures from '@/components/business/BusinessFeatures';
import VendorUniverse from '@/components/business/VendorUniverse';
import AIBuiltSection from '@/components/business/AIBuiltSection';
import SocialProof from '@/components/business/SocialProof';
import BusinessFAQ from '@/components/business/BusinessFAQ';
import FinalCTA from '@/components/business/FinalCTA';
import BusinessFooter from '@/components/business/BusinessFooter';
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Home, Orbit, Rocket, Code } from 'lucide-react';
import QRCodeModal from '@/components/QrCode';

const Business = () => {
  return (
    <div className="min-h-screen bg-[#0E0E10] text-white">
      {/* Navigation is now provided by the RevolutHeader component */}
      {/* Extra padding added for mobile screens to create gap between header and content */}
      <div className="pt-1 md:pt-1">
        <BusinessHero />
    
        <LumiqCarouselSection />
     
        <BusinessFeatures />
        <VendorUniverse />

        <SocialProof />
        <BusinessFAQ />
 
      </div>

      {/* Floating CTA Button with QR Code */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="flex items-center">
          <QRCodeModal
            buttonText="START JOURNEY"
            buttonClassName="bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-black px-6 py-4 rounded-full shadow-lg border border-white/20 hover:border-white transition-all font-bold flex items-center"
            title="GET THE FUTEURCRED APP"
            description="Scan the QR code to download the app and start your credit journey"
            showIcon={false}
            id="journey-qr-code-button"
          >
            <Rocket className="mr-2 h-5 w-5" />
          </QRCodeModal>
        </div>
      </div>

      {/* Schema JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          "name": "FUTEURCRED™",
          "description": "AI-powered business credit app with LUMIQ™ journey engine, FSR scores, trade payment health tracking, and PG-free tools.",
          "brand": {
            "@type": "Organization",
            "name": "FUTEUR AI"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "9834"
          }
        })}
      </script>
    </div>
  );
};

export default Business;


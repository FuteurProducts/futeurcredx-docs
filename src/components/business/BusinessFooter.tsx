import { Link } from "react-router-dom";
import { getCrossDomainUrl } from "../../utils/domainUtils";
import SmartLink from "@/components/SmartLink";

const BusinessFooter = () => {
  return (
    <footer className="py-12 px-6 bg-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
              FUTEURCREDX™
            </div>
            <div className="text-sm text-purple-400 mb-4">Powered by LUMIQ AI™</div>
            <p className="text-gray-400 text-sm">
              Your Business Credit Operating System. AI-powered insights, <span className="inline-flex items-center gap-1"><img src="/Dark-Experian.png" alt="Experian" className="h-3 opacity-80" /> FSR tracking</span>, and PG-free tradelines.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Explore</h4>
            <div className="space-y-2">
              <SmartLink to="/" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Home
              </SmartLink>
              <SmartLink to="/app" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Mobile App
              </SmartLink>
              <a href={getCrossDomainUrl("/business")} className="block text-gray-400 hover:text-white transition-colors text-sm">
                Business Credit App
              </SmartLink>
              <a href={getCrossDomainUrl("/enterprise")} className="block text-gray-400 hover:text-white transition-colors text-sm">
                For Banks
              </SmartLink>
              <a href={getCrossDomainUrl("/fintech")} className="block text-gray-400 hover:text-white transition-colors text-sm">
                For Fintechs
              </SmartLink>
              <a href={getCrossDomainUrl("/api-docs")} className="block text-gray-400 hover:text-white transition-colors text-sm">
                API Documentation
              </SmartLink>
              <a href={getCrossDomainUrl("/lumiq-build")} className="block text-gray-400 hover:text-white transition-colors text-sm">
                LUMIQ AI Build
              </SmartLink>
              <a href={getCrossDomainUrl("/credit-journey")} className="block text-gray-400 hover:text-white transition-colors text-sm">
                Credit Journey Demo
              </SmartLink>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Features</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <div>LUMIQ AI™ Journey Engine</div>
              <div>Vendor Universe</div>
              <div>PG-Free Builder</div>
              <div className="inline-flex items-center gap-1">
                <img src="/Dark-Experian.png" alt="Experian" className="h-3 opacity-80" />
                <span>FSR Score Tracking</span>
              </div>
              <div>Trade Payment Health</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <div>About FUTEUR AI</div>
              <div>Privacy Policy</div>
              <div>Terms of Service</div>
              <div>Contact Support</div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            &copy; 2024 FUTEURCREDX by FUTEUR AI. Your Business Credit Operating System. 
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default BusinessFooter;


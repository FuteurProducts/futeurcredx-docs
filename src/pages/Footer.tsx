import { Link } from "react-router-dom"
import { ArrowRight, Facebook, Instagram, Twitter, Linkedin, Music } from "lucide-react"
import { getCrossDomainUrl } from "../utils/domainUtils"

export default function Component() {
  return (
    <div className="bg-[#2c2c2c] text-white">
      {/* LUMIQ Products Section */}
      <div className="px-6 py-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* For Businesses Card */}
          <div className="bg-[#f5f5f5] text-black rounded-2xl p-8 relative">
            <h3 className="text-2xl font-black mb-2 uppercase tracking-tight">For Businesses</h3>
            <h4 className="text-lg font-bold mb-4">LUMIQ™ Powered</h4>
            <p className="text-sm text-gray-600 mb-8 leading-relaxed">
              Complete business credit operating system with FSR tracking, vendor universe, and PG-free tradeline
              building. Our LUMIQ™ Journey Engine guides you through vendor universe discovery while our PG-Free Builder
              helps establish credit without personal guarantees.
            </p>
            <a href={getCrossDomainUrl("/business")}>
              <ArrowRight className="absolute bottom-8 right-8 w-6 h-6" />
            </a>
          </div>

          {/* For Banks Card */}
          <div className="bg-[#f5f5f5] text-black rounded-2xl p-8 relative">
            <h3 className="text-2xl font-black mb-2 uppercase tracking-tight">For Banks</h3>
            <h4 className="text-lg font-bold mb-4">Enterprise</h4>
            <p className="text-sm text-gray-600 mb-8 leading-relaxed">
              AI-powered lending intelligence and risk assessment tools for financial institutions. Our comprehensive
              suite includes AI risk assessment capabilities, advanced lending intelligence, and detailed portfolio
              analytics to enhance your decision-making process.
            </p>
            <a href={getCrossDomainUrl("/enterprise")}>
              <ArrowRight className="absolute bottom-8 right-8 w-6 h-6" />
            </a>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {/* LUMIQ Build Card */}
          <div className="bg-[#f5f5f5] text-black rounded-2xl p-8 relative">
            <h3 className="text-2xl font-black mb-2 uppercase tracking-tight">LUMIQ Build</h3>
            <h4 className="text-lg font-bold mb-4">Vendor Universe</h4>
            <p className="text-sm text-gray-600 mb-8 leading-relaxed">
              Discover and score vendors that actually report to business credit bureaus. Our platform provides
              comprehensive vendor scoring, detailed report tracking, and thorough credit impact analysis to help you
              make informed decisions about which vendors will truly benefit your business credit profile.
            </p>
            <a href={getCrossDomainUrl("/lumiq-build")}>
              <ArrowRight className="absolute bottom-8 right-8 w-6 h-6" />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Links Section */}
      <div className="px-6 py-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 text-sm">
          {/* Main Navigation */}
          <div>
            <h4 className="font-bold mb-4 uppercase tracking-tight text-white text-base">Main</h4>
            <div className="space-y-3">
              <a href={getCrossDomainUrl("/")} className="block text-white opacity-90 hover:opacity-100 font-medium tracking-wide">
                Home
              </a>
              <a href={getCrossDomainUrl("/faq")} className="block text-white opacity-90 hover:opacity-100 font-medium tracking-wide">
                FAQ's
              </a>
              
              <a href={getCrossDomainUrl("/credit-journey")} className="block text-white opacity-90 hover:opacity-100 font-medium tracking-wide">
                Credit Journey Demo
              </a>
            </div>
          </div>

          {/* Business Solutions */}
          <div>
            <h4 className="font-bold mb-4 uppercase tracking-tight text-white text-base">Business Solutions</h4>
            <div className="space-y-3">
              <a href={getCrossDomainUrl("/business")} className="block text-white opacity-90 hover:opacity-100 font-medium tracking-wide">
                Business Credit Score
              </a>
              <a href={getCrossDomainUrl("/lumiq-build")} className="block text-white opacity-90 hover:opacity-100 font-medium tracking-wide">
                LUMIQ Build
              </a>
            </div>
          </div>

          {/* Enterprise Section */}
          <div>
            <h4 className="font-bold mb-4 uppercase tracking-tight text-white text-base">Enterprise Solutions</h4>
            <div className="space-y-3">
              <a href="https://institutions.credbyfuteur.com" className="block text-white opacity-90 hover:opacity-100 font-medium tracking-wide">
                Institutions
              </a>
              <a href="https://platform.credbyfuteur.com" className="block text-white opacity-90 hover:opacity-100 font-medium tracking-wide">
                Platform
              </a>
              <a href="https://docs.credbyfuteur.com/" className="block text-white opacity-90 hover:opacity-100 font-medium tracking-wide">
                Documentation
              </a>
            </div>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-bold mb-4 uppercase tracking-tight text-white text-base">Company</h4>
            <div className="space-y-3">
              <a href="https://www.futeur.ai/about" target="_blank" rel="noopener noreferrer" className="block text-white opacity-90 hover:opacity-100 font-medium tracking-wide">
                About Us
              </a>
              <a href="https://www.futeur.ai/contact" target="_blank" rel="noopener noreferrer" className="block text-white opacity-90 hover:opacity-100 font-medium tracking-wide">
                Contact
              </a>
              <a href="https://www.futeur.ai/privacy-policy" target="_blank" rel="noopener noreferrer" className="block text-white opacity-90 hover:opacity-100 font-medium tracking-wide">
                Privacy Policy
              </a>
              <a href="https://www.futeur.ai/terms-and-condition" target="_blank" rel="noopener noreferrer" className="block text-white opacity-90 hover:opacity-100 font-medium tracking-wide">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Section */}
      <div className="border-t border-gray-600 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Logo and Social Icons */}
          <div className="flex justify-between items-center mb-8">
            <div className="text-2xl font-black uppercase tracking-tight">FuteurCred</div>
            <div className="flex space-x-4">
            
              <a href="https://www.instagram.com/futeurai/" target="_blank" rel="noopener noreferrer">
                <Instagram className="w-5 h-5 text-white opacity-90 hover:opacity-100 cursor-pointer" />
              </a>
              <a href="https://x.com/FuteurAI" target="_blank" rel="noopener noreferrer">
                <Twitter className="w-5 h-5 text-white opacity-90 hover:opacity-100 cursor-pointer" />
              </a>
              <a href="https://www.linkedin.com/company/futeurai/posts/?feedView=all" target="_blank" rel="noopener noreferrer">
                <Linkedin className="w-5 h-5 text-white opacity-90 hover:opacity-100 cursor-pointer" />
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-sm text-white opacity-90 font-medium mb-6">© FuteurCred 2025</div>

          {/* Legal Text */}
          <div className="text-xs text-white opacity-80 space-y-4 mb-8 font-medium">
            <p>
              To find out more about FuteurCred services, please visit our{" "}
              <Link to="/faq" className="underline font-bold text-white hover:opacity-90">
                FAQ page
              </Link>
              . If you have any questions, please reach out to us via the contact form on our website or through the FuteurCred app.
            </p>

            <p>
              <strong>Business Credit Services</strong><br />
              FuteurCred is a business credit technology platform and program manager. Our LUMIQ™ platform provides business credit monitoring, building, and intelligence services to help businesses establish and grow their credit profiles without personal guarantees.
            </p>

            <p>
              <strong>Enterprise Solutions</strong><br />
              Our enterprise solutions provide financial institutions with AI-powered risk assessment tools, lending intelligence, and portfolio analytics to enhance decision-making processes and improve operational efficiency.
            </p>

            <p>
              <strong>Data Security</strong><br />
              FuteurCred employs industry-leading security measures to protect your business data. All information is encrypted and stored according to the highest security standards in compliance with relevant regulations.
            </p>
          </div>

          {/* Copyright */}
          <div className="text-xs text-gray-500 mt-4">
            © 2025 FuteurCred.
            LUMIQ™ and FuteurCred® are registered trademarks. All rights reserved. Building business credit, empowering growth.
          </div>
        </div>
      </div>
    </div>
  )
}


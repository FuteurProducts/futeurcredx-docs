import { Link } from "react-router-dom"
import { Instagram, Twitter, Linkedin } from "lucide-react"
import { getCrossDomainUrl } from "../../utils/domainUtils"

export default function CleanFooter() {
  return (
    <div className="bg-[#0d0d0f] text-white">
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
              <a href={getCrossDomainUrl("/lumiq-build")} className="block text-white opacity-70 hover:opacity-100 font-medium tracking-wide">
                Lumiq AI Build
              </a>
            </div>
          </div>

          {/* Enterprise Section */}
          <div>
            <h4 className="font-bold mb-4 uppercase tracking-tight text-white text-base">Enterprise Solutions</h4>
            <div className="space-y-3">
              <a href="https://institutions.futeurcredx.com" className="block text-white opacity-90 hover:opacity-100 font-medium tracking-wide">
                Institutions
              </a>
              <a href="https://platform.futeurcredx.com" className="block text-white opacity-90 hover:opacity-100 font-medium tracking-wide">
                Platform
              </a>
              <a href="https://docs.futeurcredx.com/" className="block text-white opacity-90 hover:opacity-100 font-medium tracking-wide">
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
            <div className="text-2xl font-black uppercase tracking-tight">FUTEURCREDX</div>
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
          <div className="text-sm text-white opacity-90 font-medium mb-6">© FUTEURCREDX 2025</div>

          {/* Legal Text */}
          <div className="text-xs text-white opacity-80 space-y-4 mb-8 font-medium">
            <p>
              To find out more about FUTEURCREDX services, please visit our{" "}
              <Link to="/faq" className="underline font-bold text-white hover:opacity-90">
                FAQ page
              </Link>
              . If you have any questions, please reach out to us via the contact form on our website or through the FUTEURCREDX app.
            </p>

            <p>
              <strong>Business Credit Services</strong><br />
              FUTEURCREDX is a business credit technology platform and program manager. Our LUMIQX™ platform provides business credit monitoring, building, and intelligence services to help businesses establish and grow their credit profiles without personal guarantees.
            </p>

            <p>
              <strong>Enterprise Solutions</strong><br />
              Our enterprise solutions provide financial institutions with AI-powered risk assessment tools, lending intelligence, and portfolio analytics to enhance decision-making processes and improve operational efficiency.
            </p>

            <p>
              <strong>Data Security</strong><br />
              FUTEURCREDX employs industry-leading security measures to protect your business data. All information is encrypted and stored according to the highest security standards in compliance with relevant regulations.
            </p>
          </div>

          {/* Copyright */}
          <div className="text-xs text-gray-500 mt-4">
            © 2025 FUTEURCREDX.
            LUMIQX™ and FUTEURCREDX® are registered trademarks. All rights reserved. Building business credit, empowering growth.
          </div>
        </div>
      </div>
    </div>
  )
}

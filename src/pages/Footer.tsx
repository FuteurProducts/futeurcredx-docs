import { Link } from "react-router-dom"
import { ArrowRight, Facebook, Instagram, Twitter, Linkedin, Music } from "lucide-react"

export default function Component() {
  return (
    <div className="bg-[#2c2c2c] text-white">
      {/* LUMIQ AI Products Section */}
      <div className="px-6 py-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Score Card */}
          <div className="bg-[#f5f5f5] text-black rounded-2xl p-8 relative">
            <h3 className="text-2xl font-black mb-2 uppercase tracking-tight">Score</h3>
            <h4 className="text-lg font-bold mb-4">Know Your Rating</h4>
            <p className="text-sm text-gray-600 mb-8 leading-relaxed">
              Track and monitor your business credit score in real-time with our FSR tracking system. Get instant alerts 
              when your score changes and understand exactly what factors are affecting your business credit rating.
            </p>
            <Link to="/business">
              <ArrowRight className="absolute bottom-8 right-8 w-6 h-6" />
            </Link>
          </div>

          {/* Build Card */}
          <div className="bg-[#f5f5f5] text-black rounded-2xl p-8 relative">
            <h3 className="text-2xl font-black mb-2 uppercase tracking-tight">Build</h3>
            <h4 className="text-lg font-bold mb-4">Vendor Universe</h4>
            <p className="text-sm text-gray-600 mb-8 leading-relaxed">
              Discover and connect with vendors that actually report to business credit bureaus. Our platform provides
              comprehensive vendor scoring and helps you establish business credit without personal guarantees.
            </p>
            <Link to="/lumiq-build">
              <ArrowRight className="absolute bottom-8 right-8 w-6 h-6" />
            </Link>
          </div>

          {/* Journey Card */}
          <div className="bg-[#f5f5f5] text-black rounded-2xl p-8 relative">
            <h3 className="text-2xl font-black mb-2 uppercase tracking-tight">Journey</h3>
            <h4 className="text-lg font-bold mb-4">Credit Transformation</h4>
            <p className="text-sm text-gray-600 mb-8 leading-relaxed">
              Follow your personalized credit-building roadmap with AI-powered recommendations. Track your progress with 
              visual milestones and celebrate every win as you transform your business credit profile.
            </p>
            <Link to="/credit-journey">
              <ArrowRight className="absolute bottom-8 right-8 w-6 h-6" />
            </Link>
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
              <Link to="/" className="block text-white opacity-90 hover:opacity-100 font-medium tracking-wide">
                Home
              </Link>
              <Link to="/faq" className="block text-white opacity-90 hover:opacity-100 font-medium tracking-wide">
                FAQ's
              </Link>
              
              <Link to="/credit-journey" className="block text-white opacity-90 hover:opacity-100 font-medium tracking-wide">
                Credit Journey Demo
              </Link>
            </div>
          </div>

          {/* Business Solutions */}
          <div>
            <h4 className="font-bold mb-4 uppercase tracking-tight text-white text-base">Business Solutions</h4>
            <div className="space-y-3">
              <Link to="/business" className="block text-white opacity-90 hover:opacity-100 font-medium tracking-wide">
                Business Credit Score
              </Link>
              <Link to="/lumiq-build" className="block text-white opacity-90 hover:opacity-100 font-medium tracking-wide">
                LUMIQ AI Build
              </Link>
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
              <Link to="/about" className="block text-white opacity-90 hover:opacity-100 font-medium tracking-wide">
                About Us
              </Link>
              <Link to="/contact-us" className="block text-white opacity-90 hover:opacity-100 font-medium tracking-wide">
                Contact Us
              </Link>
              <Link to="/privacy-policy" className="block text-white opacity-90 hover:opacity-100 font-medium tracking-wide">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="block text-white opacity-90 hover:opacity-100 font-medium tracking-wide">
                Terms of Service
              </Link>
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
              FUTEURCREDX is a business credit technology platform and program manager. Our LUMIQ AI™ platform provides business credit monitoring, building, and intelligence services to help businesses establish and grow their credit profiles without personal guarantees.
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
            LUMIQ AI™ and FUTEURCREDX® are registered trademarks. All rights reserved. Building business credit, empowering growth.
          </div>
        </div>
      </div>
    </div>
  )
}


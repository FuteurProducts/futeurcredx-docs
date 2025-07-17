import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import QRCodeModal from "@/components/QrCode"
import { getAssetUrl } from "../utils/assetUtils"
import { getCrossDomainUrl } from "../utils/domainUtils"

export default function FuteurHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Close mobile menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && menuOpen) {
        setMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [menuOpen]);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <div className="bg-black/60 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
        <header className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-white text-2xl font-black uppercase tracking-tight">FUTEURCRED</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href={getCrossDomainUrl("/")} className="text-white hover:text-gray-300 transition-colors">
              Home
            </a>
            <a href={getCrossDomainUrl("/business")} className="text-white hover:text-gray-300 transition-colors">
              Score
            </a>
            <a href={getCrossDomainUrl("/lumiq-build")} className="text-white hover:text-gray-300 transition-colors">
              Build
            </a>
            <a href={getCrossDomainUrl("/credit-journey")} className="text-white hover:text-gray-300 transition-colors">
              Journey
            </a>
            <a href={getCrossDomainUrl("/enterprise")} className="text-white hover:text-gray-300 transition-colors">
              Enterprise
            </a>
          </nav>

          {/* Desktop Download App Button */}
          <div className="hidden md:flex items-center">
            <QRCodeModal 
              buttonText="Download the App" 
              buttonClassName="bg-white text-black hover:bg-gray-100 rounded-full px-6 py-2 font-bold" 
            />
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white p-1 focus:outline-none" 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>
      </div>
      
      {/* Mobile Menu Drawer - separate from header to avoid z-index issues */}
      {menuOpen && (
        <div className="fixed inset-0 top-16 bg-black z-40 md:hidden">
          <div className="flex flex-col space-y-6 p-6">
            {/* Mobile Navigation Links */}
            <nav className="flex flex-col space-y-4">
              <a 
                href={getCrossDomainUrl("/")} 
                className="text-white text-xl py-3 border-b border-gray-800 hover:bg-white/5"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </a>
              <a 
                href={getCrossDomainUrl("/business")} 
                className="text-white text-xl py-3 border-b border-gray-800 hover:bg-white/5"
                onClick={() => setMenuOpen(false)}
              >
                Business
              </a>
              <a 
                href={getCrossDomainUrl("/enterprise")} 
                className="text-white text-xl py-3 border-b border-gray-800 hover:bg-white/5"
                onClick={() => setMenuOpen(false)}
              >
                Enterprise
              </a>
              <a 
                href={getCrossDomainUrl("/lumiq-build")} 
                className="text-white text-xl py-3 border-b border-gray-800 hover:bg-white/5"
                onClick={() => setMenuOpen(false)}
              >
                Build
              </a>
              <a 
                href={getCrossDomainUrl("/credit-journey")} 
                className="text-white text-xl py-3 border-b border-gray-800 hover:bg-white/5"
                onClick={() => setMenuOpen(false)}
              >
                Credit Journey
              </a>
            </nav>
            
            {/* Mobile Download App Button */}
            <div className="flex flex-col space-y-4 pt-4">
              <div onClick={() => setMenuOpen(false)}>
                <QRCodeModal 
                  buttonText="Download the App" 
                  buttonClassName="bg-white text-black hover:bg-gray-100 rounded-lg py-5 text-xl font-bold w-full"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}


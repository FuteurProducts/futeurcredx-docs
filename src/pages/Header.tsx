import { Button } from "@/components/ui/button"
import { Link, useLocation } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import { Menu, X } from "lucide-react"
import QRCodeModal from "@/components/QrCode"
import { getAssetUrl } from "../utils/assetUtils"
import { getCrossDomainUrl } from "../utils/domainUtils"

export default function FuteurHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  // Define which routes should have white header
  const whiteHeaderRoutes = ['/dashboard', '/login', '/register', '/docs'];
  const isWhiteHeader = whiteHeaderRoutes.includes(location.pathname);
  
  // Define which routes should have transparent header
  const transparentHeaderRoutes = ['/contact-us', '/about', '/', '/business', '/lumiq-build', '/credit-journey'];
  const isTransparentHeader = transparentHeaderRoutes.includes(location.pathname);
  
  // Define which routes should have black text (only About page)
  const blackTextRoutes = ['/about'];
  const useBlackText = blackTextRoutes.includes(location.pathname);
  
  // Track scroll position for background changes
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      <div className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? isTransparentHeader 
            ? useBlackText ? 'bg-white/90 backdrop-blur-md border-b border-gray-200' : 'bg-black/80 backdrop-blur-md border-b border-white/10'
            : 'bg-black/60 backdrop-blur-md border-b border-white/10'
          : isWhiteHeader 
            ? 'bg-white/80 backdrop-blur-sm border-b border-gray-200'
            : isTransparentHeader
              ? 'bg-transparent border-b-0'
              : 'bg-transparent'
      }`}>
        <header className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center">
            <a href={getCrossDomainUrl("/")} className="cursor-pointer">
              <h1 className={`text-2xl font-black uppercase tracking-tight transition-colors hover:opacity-80 ${
                isScrolled 
                  ? isTransparentHeader 
                    ? useBlackText ? 'text-black' : 'text-white'
                    : 'text-white'
                  : isWhiteHeader 
                    ? 'text-black'
                    : isTransparentHeader
                      ? useBlackText ? 'text-black' : 'text-white'
                      : 'text-white'
              }`}>FUTEURCREDX</h1>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href={getCrossDomainUrl("/")} className={`transition-colors ${
              isScrolled 
                ? isTransparentHeader 
                  ? useBlackText ? 'text-slate-700 hover:text-blue-600' : 'text-white hover:text-gray-300'
                  : 'text-white hover:text-gray-300'
                : isWhiteHeader 
                  ? 'text-slate-700 hover:text-blue-600'
                  : isTransparentHeader
                    ? useBlackText ? 'text-black hover:text-gray-700' : 'text-white hover:text-gray-300'
                    : 'text-white hover:text-gray-300'
            }`}>
              Home
            </a>
            <a href={getCrossDomainUrl("/business")} className={`transition-colors ${
              isScrolled 
                ? isTransparentHeader 
                  ? useBlackText ? 'text-slate-700 hover:text-blue-600' : 'text-white hover:text-gray-300'
                  : 'text-white hover:text-gray-300'
                : isWhiteHeader 
                  ? 'text-slate-700 hover:text-blue-600'
                  : isTransparentHeader
                    ? useBlackText ? 'text-black hover:text-gray-700' : 'text-white hover:text-gray-300'
                    : 'text-white hover:text-gray-300'
            }`}>
              Score
            </a>
            <a href={getCrossDomainUrl("/lumiq-build")} className={`transition-colors ${
              isScrolled 
                ? isTransparentHeader 
                  ? useBlackText ? 'text-slate-700 hover:text-blue-600' : 'text-white hover:text-gray-300'
                  : 'text-white hover:text-gray-300'
                : isWhiteHeader 
                  ? 'text-slate-700 hover:text-blue-600'
                  : isTransparentHeader
                    ? useBlackText ? 'text-black hover:text-gray-700' : 'text-white hover:text-gray-300'
                    : 'text-white hover:text-gray-300'
            }`}>
              Build
            </a>
            <a href={getCrossDomainUrl("/credit-journey")} className={`transition-colors ${
              isScrolled 
                ? isTransparentHeader 
                  ? useBlackText ? 'text-slate-700 hover:text-blue-600' : 'text-white hover:text-gray-300'
                  : 'text-white hover:text-gray-300'
                : isWhiteHeader 
                  ? 'text-slate-700 hover:text-blue-600'
                  : isTransparentHeader
                    ? useBlackText ? 'text-black hover:text-gray-700' : 'text-white hover:text-gray-300'
                    : 'text-white hover:text-gray-300'
            }`}>
              Journey
            </a>
            
          </nav>

          {/* Desktop Download App Button */}
          <div className="hidden md:flex items-center">
            <div style={{
              '--custom-bg-color': isScrolled && (isTransparentHeader || isWhiteHeader) ? '#07124A' : undefined
            } as React.CSSProperties}>
              <QRCodeModal 
                buttonText="Download the App" 
                buttonClassName={`rounded-full px-6 py-2 font-bold transition-colors ${
                  isScrolled 
                    ? isTransparentHeader 
                      ? useBlackText ? 'text-white hover:opacity-80' : 'text-white hover:opacity-80'
                      : 'bg-white text-black hover:bg-gray-100'
                    : isWhiteHeader 
                      ? 'text-white hover:opacity-80'
                      : isTransparentHeader
                        ? useBlackText ? 'bg-black text-white hover:bg-gray-800' : 'bg-black text-white hover:bg-gray-800'
                        : 'bg-white text-black hover:bg-gray-100'
                } ${isScrolled && (isTransparentHeader || isWhiteHeader) ? '[background-color:var(--custom-bg-color)]' : ''}`}
              />
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className={`md:hidden p-1 focus:outline-none transition-colors ${
              isScrolled 
                ? isTransparentHeader 
                  ? useBlackText ? 'text-slate-700' : 'text-white'
                  : 'text-white'
                : isWhiteHeader 
                  ? 'text-slate-700'
                  : isTransparentHeader
                    ? useBlackText ? 'text-black' : 'text-white'
                    : 'text-white'
            }`} 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>
      </div>
      
      {/* Mobile Menu Drawer - separate from header to avoid z-index issues */}
      {menuOpen && (
        <div className={`fixed inset-0 top-16 z-40 md:hidden border-t ${
          isWhiteHeader 
            ? 'bg-white border-gray-200'
            : isTransparentHeader
              ? 'bg-white border-gray-200'
              : 'bg-black border-white/10'
        }`}>
          <div className="flex flex-col space-y-6 p-6">
            {/* Mobile Navigation Links */}
            <nav className="flex flex-col space-y-4">
              <a 
                href={getCrossDomainUrl("/")} 
                className={`text-xl py-3 border-b transition-colors ${
                  isWhiteHeader || isTransparentHeader
                    ? 'text-slate-700 border-gray-200 hover:bg-blue-50'
                    : 'text-white border-white/10 hover:bg-white/5'
                }`}
                onClick={() => setMenuOpen(false)}
              >
                Home
              </a>
              <a 
                href={getCrossDomainUrl("/business")} 
                className={`text-xl py-3 border-b transition-colors ${
                  isWhiteHeader || isTransparentHeader
                    ? 'text-slate-700 border-gray-200 hover:bg-blue-50'
                    : 'text-white border-white/10 hover:bg-white/5'
                }`}
                onClick={() => setMenuOpen(false)}
              >
                Score
              </a>
              <a 
                href={getCrossDomainUrl("/lumiq-build")} 
                className={`text-xl py-3 border-b transition-colors ${
                  isWhiteHeader || isTransparentHeader
                    ? 'text-slate-700 border-gray-200 hover:bg-blue-50'
                    : 'text-white border-white/10 hover:bg-white/5'
                }`}
                onClick={() => setMenuOpen(false)}
              >
                Build
              </a>
              <a 
                href={getCrossDomainUrl("/credit-journey")} 
                className={`text-xl py-3 border-b transition-colors ${
                  isWhiteHeader || isTransparentHeader
                    ? 'text-slate-700 border-gray-200 hover:bg-blue-50'
                    : 'text-white border-white/10 hover:bg-white/5'
                }`}
                onClick={() => setMenuOpen(false)}
              >
                Journey
              </a>
            </nav>
            
            {/* Mobile Download App Button */}
            <div className="flex flex-col space-y-4 pt-4">
              <div onClick={() => setMenuOpen(false)}>
                <QRCodeModal 
                  buttonText="Download the App" 
                  buttonClassName={`rounded-lg py-5 text-xl font-bold w-full transition-colors ${
                    isWhiteHeader || isTransparentHeader
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-white text-black hover:bg-gray-100'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}


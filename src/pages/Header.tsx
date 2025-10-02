import { Button } from "@/components/ui/button"
import { Link, useLocation } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import { Menu, X, ChevronDown, Sparkles, Zap } from "lucide-react"
import QRCodeModal from "@/components/QrCode"
import { getAssetUrl } from "../utils/assetUtils"
import { getCrossDomainUrl } from "../utils/domainUtils"
import { motion, AnimatePresence } from "framer-motion"

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
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? isTransparentHeader 
              ? useBlackText 
                ? 'bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-lg shadow-gray-200/20' 
                : 'bg-black/90 backdrop-blur-xl border-b border-white/20 shadow-lg shadow-black/20'
              : 'bg-black/80 backdrop-blur-xl border-b border-white/20 shadow-lg shadow-black/20'
            : isWhiteHeader 
              ? 'bg-white/90 backdrop-blur-sm border-b border-gray-200/50 shadow-sm'
              : isTransparentHeader
                ? 'bg-transparent border-b-0'
                : 'bg-transparent'
        }`}>
        <header className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 max-w-7xl mx-auto">
          {/* Logo */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <a href={getCrossDomainUrl("/")} className="cursor-pointer group">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className={`relative px-3 py-1.5 rounded-lg font-black text-lg sm:text-xl uppercase tracking-tight transition-all duration-300 ${
                    isScrolled 
                      ? isTransparentHeader 
                        ? useBlackText ? 'text-black bg-white/80' : 'text-white bg-black/60'
                        : 'text-white bg-black/60'
                      : isWhiteHeader 
                        ? 'text-black bg-white/80'
                        : isTransparentHeader
                          ? useBlackText ? 'text-black bg-white/80' : 'text-white bg-black/60'
                          : 'text-white bg-black/60'
                  }`}>
                    FUTEUR
                  </div>
                </div>
                <span className={`text-xs font-medium tracking-wider ${
                  isScrolled 
                    ? isTransparentHeader 
                      ? useBlackText ? 'text-gray-600' : 'text-gray-300'
                      : 'text-gray-300'
                    : isWhiteHeader 
                      ? 'text-gray-600'
                      : isTransparentHeader
                        ? useBlackText ? 'text-gray-600' : 'text-gray-300'
                        : 'text-gray-300'
                }`}>
                  CRED
                </span>
              </div>
            </a>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {[
              { href: "/", label: "Home", icon: Sparkles },
              { href: "/business", label: "Score", icon: Zap },
              { href: "/lumiq-build", label: "Build", icon: ChevronDown },
              { href: "/credit-journey", label: "Journey", icon: ChevronDown }
            ].map((item, index) => (
              <motion.a
                key={item.href}
                href={getCrossDomainUrl(item.href)}
                className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 group ${
                  isScrolled 
                    ? isTransparentHeader 
                      ? useBlackText 
                        ? 'text-slate-700 hover:text-blue-600 hover:bg-blue-50' 
                        : 'text-white hover:text-blue-300 hover:bg-white/10'
                      : 'text-white hover:text-blue-300 hover:bg-white/10'
                    : isWhiteHeader 
                      ? 'text-slate-700 hover:text-blue-600 hover:bg-blue-50'
                      : isTransparentHeader
                        ? useBlackText 
                          ? 'text-black hover:text-gray-700 hover:bg-gray-100' 
                          : 'text-white hover:text-blue-300 hover:bg-white/10'
                        : 'text-white hover:text-blue-300 hover:bg-white/10'
                }`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                <div className="flex items-center space-x-2">
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                <div className={`absolute inset-0 rounded-lg transition-all duration-300 ${
                  isScrolled 
                    ? isTransparentHeader 
                      ? useBlackText 
                        ? 'bg-blue-100/50 group-hover:bg-blue-100/80' 
                        : 'bg-white/5 group-hover:bg-white/10'
                      : 'bg-white/5 group-hover:bg-white/10'
                    : isWhiteHeader 
                      ? 'bg-blue-100/50 group-hover:bg-blue-100/80'
                      : isTransparentHeader
                        ? useBlackText 
                          ? 'bg-gray-100/50 group-hover:bg-gray-100/80' 
                          : 'bg-white/5 group-hover:bg-white/10'
                        : 'bg-white/5 group-hover:bg-white/10'
                }`}></div>
              </motion.a>
            ))}
          </nav>

          {/* Desktop Download App Button */}
          <motion.div 
            className="hidden md:flex items-center"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              <QRCodeModal 
                buttonText="Download App" 
                buttonClassName={`relative rounded-full px-6 py-3 font-bold transition-all duration-300 group-hover:scale-105 ${
                  isScrolled 
                    ? isTransparentHeader 
                      ? useBlackText 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg' 
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg'
                      : 'bg-white text-black hover:bg-gray-100 shadow-lg'
                    : isWhiteHeader 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg'
                      : isTransparentHeader
                        ? useBlackText 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg' 
                          : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg'
                        : 'bg-white text-black hover:bg-gray-100 shadow-lg'
                }`}
              />
            </div>
          </motion.div>
          
          {/* Mobile Menu Button */}
          <motion.button 
            className={`md:hidden p-2 rounded-lg focus:outline-none transition-all duration-300 ${
              isScrolled 
                ? isTransparentHeader 
                  ? useBlackText 
                    ? 'text-slate-700 hover:bg-gray-100' 
                    : 'text-white hover:bg-white/10'
                  : 'text-white hover:bg-white/10'
                : isWhiteHeader 
                  ? 'text-slate-700 hover:bg-gray-100'
                  : isTransparentHeader
                    ? useBlackText 
                      ? 'text-black hover:bg-gray-100' 
                      : 'text-white hover:bg-white/10'
                    : 'text-white hover:bg-white/10'
            }`} 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: menuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.div>
          </motion.button>
        </header>
      </div>
      
      {/* Mobile Menu Drawer - separate from header to avoid z-index issues */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`fixed inset-0 top-16 z-40 md:hidden border-t ${
              isWhiteHeader 
                ? 'bg-white/95 backdrop-blur-xl border-gray-200/50 shadow-lg'
                : isTransparentHeader
                  ? isScrolled 
                    ? useBlackText 
                      ? 'bg-white/95 backdrop-blur-xl border-gray-200/50 shadow-lg' 
                      : 'bg-black/90 backdrop-blur-xl border-white/20 shadow-lg'
                    : 'bg-black/80 backdrop-blur-xl border-white/20 shadow-lg'
                  : 'bg-black/90 backdrop-blur-xl border-white/20 shadow-lg'
            }`}
          >
            <div className="flex flex-col space-y-2 p-6">
              {/* Mobile Navigation Links */}
              <nav className="flex flex-col space-y-2">
                {[
                  { href: "/", label: "Home", icon: Sparkles },
                  { href: "/business", label: "Score", icon: Zap },
                  { href: "/lumiq-build", label: "Build", icon: ChevronDown },
                  { href: "/credit-journey", label: "Journey", icon: ChevronDown }
                ].map((item, index) => (
                  <motion.a
                    key={item.href}
                    href={getCrossDomainUrl(item.href)}
                    className={`flex items-center space-x-3 px-4 py-4 rounded-xl font-medium transition-all duration-300 ${
                      isWhiteHeader
                        ? 'text-slate-700 hover:bg-blue-50 hover:text-blue-600'
                        : isTransparentHeader
                          ? isScrolled
                            ? useBlackText 
                              ? 'text-slate-700 hover:bg-blue-50 hover:text-blue-600' 
                              : 'text-white hover:bg-white/10 hover:text-blue-300'
                            : 'text-white hover:bg-white/10 hover:text-blue-300'
                          : 'text-white hover:bg-white/10 hover:text-blue-300'
                    }`}
                    onClick={() => setMenuOpen(false)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-lg">{item.label}</span>
                  </motion.a>
                ))}
              </nav>
              
              {/* Mobile Download App Button */}
              <motion.div 
                className="pt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div onClick={() => setMenuOpen(false)}>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <QRCodeModal 
                      buttonText="Download App" 
                      buttonClassName={`relative rounded-xl py-4 text-lg font-bold w-full transition-all duration-300 group-hover:scale-105 ${
                        isWhiteHeader
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg'
                          : isTransparentHeader
                            ? isScrolled && useBlackText 
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg' 
                              : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg'
                      }`}
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}


import { ChevronDown, Bell } from "lucide-react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { HeroBackground } from "@/components/HeroBackground"

export default function Component() {
  const [showNotification, setShowNotification] = useState(false);
  const [scoreIncrement, setScoreIncrement] = useState(0);
  const [currentScore, setCurrentScore] = useState(85);
  
  useEffect(() => {
    // Show notification after a delay
    const notificationTimer = setTimeout(() => {
      setShowNotification(true);
    }, 2000);
    
    // Increment score animation
    const scoreTimer = setTimeout(() => {
      const incrementInterval = setInterval(() => {
        setScoreIncrement(prev => {
          if (prev >= 15) {
            clearInterval(incrementInterval);
            return 15;
          }
          return prev + 1;
        });
      }, 100);
      
      return () => clearInterval(incrementInterval);
    }, 2500);
    
    return () => {
      clearTimeout(notificationTimer);
      clearTimeout(scoreTimer);
    };
  }, []);
  return (
    <div className="min-h-[calc(100vh-64px)] md:min-h-screen relative overflow-hidden">
      {/* Background image - using HeroBackground component for better loading */}
      <HeroBackground imagePath="/45.jpg" overlayOpacity={20} showNoise={true} />

      <div className="relative z-10 container mx-auto px-4 md:px-6 flex items-center justify-center min-h-[calc(100vh-64px)] md:min-h-screen py-12 md:py-0">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-20 items-center max-w-7xl mx-auto">
          {/* Left content */}
          <div className="space-y-8 lg:w-1/2 w-full">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-tight tracking-tight pt-4 md:pt-8">
                THIS ISN'T JUST YOUR CREDIT SCORE.
                <br />
                IT'S YOUR LEGACY SCORE.
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-lg leading-relaxed">
                <span className="font-semibold text-blue-500">Futercred™</span> is your AI-powered business credit app
                with the revolutionary <span className="font-semibold text-black-400">LUMIQ™</span> journey engine— FSR
                scoring, trade payment health, vendor syncing, and PG-free tools in one cosmic dashboard.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="https://app.futeur.ai/signin"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/80 backdrop-blur-sm text-black hover:bg-white px-8 py-3 text-lg font-medium rounded-full transition-colors duration-200 cursor-pointer text-center"
              >
                Check My Business Credit
              </a>
              <Link 
                to="/credit-journey"
                className="border border-white/60 text-white hover:bg-white hover:text-black px-8 py-3 text-lg font-medium rounded-full bg-white/10 backdrop-blur-sm transition-colors duration-200 cursor-pointer text-center"
              >
                See Credit Journey Demo
              </Link>
            </div>
          </div>

          {/* Right content - Phone mockup */}
          <div className="flex justify-center lg:w-1/2 w-full mt-4 lg:mt-16">
            <div className="relative">
              {/* Phone frame */}
              <div className="w-80 h-[600px] bg-gradient-to-b from-gray-900/90 to-black/90 rounded-[3rem] p-2 shadow-2xl border border-white/20 backdrop-blur-sm">
                <div className="w-full h-full bg-gradient-to-b from-gray-800/80 to-gray-900/80 rounded-[2.5rem] relative overflow-hidden backdrop-blur-sm">
                  {/* Phone screen content */}
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-800/90 via-gray-900/90 to-black/90 backdrop-blur-sm">
                    {/* Balance section */}
                    <div className="pt-20 px-8 text-center">
                      <div className="text-5xl font-bold text-white mb-2">
                        {currentScore + scoreIncrement}
                        {scoreIncrement > 0 && (
                          <span className="text-green-400 text-2xl ml-2 animate-pulse">+{scoreIncrement}</span>
                        )}
                      </div>
                      <div className="text-lg text-gray-300 mb-4">Business Score</div>
                      
                      {/* Experian logo */}
                      <div className="mb-4 flex justify-center">
                        <img 
                          src="/Dark-Experian.png" 
                          alt="Experian" 
                          className="h-6 w-auto opacity-90" 
                        />
                      </div>

                      {/* Account selector */}
                      <div className="inline-flex items-center gap-2 bg-gray-700/50 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
                        <span className="text-white font-medium">Intelliscore v2</span>
                        <ChevronDown className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    {/* Transaction notification */}
                    {/* Bell notification icon with ping animation */}
                    <div className="absolute top-6 right-6">
                      <div className="relative">
                        <Bell className="h-6 w-6 text-white" />
                        {showNotification && (
                          <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full animate-ping"></span>
                        )}
                        <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full"></span>
                      </div>
                    </div>
                    
                    {/* Transaction notification */}
                    <div className="absolute bottom-32 left-6 right-6">
                      <div 
                        className={`bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 transform transition-all duration-500 ${showNotification ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center relative">
                              <div className="w-6 h-6 bg-white rounded-full"></div>
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
                            </div>
                            <div>
                              <div className="text-white font-medium">Credit Improved</div>
                              <div className="text-gray-400 text-sm">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                            </div>
                          </div>
                          <div className="text-green-400 font-semibold text-lg animate-pulse">+15 pts</div>6                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


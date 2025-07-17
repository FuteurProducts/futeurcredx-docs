"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import QRCodeModal from "@/components/QrCode"

export default function Component() {
  const handleGetStarted = () => {
    window.open("https://apps.apple.com/us/app/futeurcred/id6736497241", "_blank", "noopener,noreferrer")
  }

  const handleNavClick = () => {
    alert("Redirecting to NAV comparison...")
  }

  const handleCreditKarmaClick = () => {
    alert("Redirecting to Credit Karma comparison...")
  }

  const handleFuteurCredClick = () => {
    window.open("https://app.futeur.ai/signin", "_blank", "noopener,noreferrer")
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-black mb-4 sm:mb-6 md:mb-8 tracking-tighter leading-none px-4 sm:px-0">
            FUTEURCRED IS THE WHOLE
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-800 max-w-3xl mx-auto mb-4 sm:mb-6 leading-relaxed font-medium px-4 sm:px-6 md:px-8">
            NAV, Credit Karma, Dun & Bradstreet? All fragments. We're not another credit monitor. We're your complete
            business credit app powered by the LUMIQ journey engine. FSR tracking. Trade payment health. No PG
            tradelines.
          </p>
          <p className="text-xs sm:text-sm text-gray-600 mb-8 sm:mb-10 md:mb-12 leading-relaxed max-w-2xl mx-auto px-4 sm:px-0">
            Complete business credit ecosystem powered by AI technology.
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            Member exclusive access to the full-spectrum platform.{" "}
            <span className="underline cursor-pointer">Terms apply.</span>
          </p>
          <QRCodeModal
            buttonText="Get Complete App"
            buttonClassName="bg-gray-900 hover:bg-black text-white px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 rounded-full text-base sm:text-lg font-semibold tracking-wide"
            showIcon={true}
          />
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-20">
          {/* Left Card - NAV */}
          <Card
            onClick={handleNavClick}
            className="border-0 rounded-[32px] overflow-hidden h-[520px] transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl cursor-pointer relative"
            style={{ 
              backgroundImage: 'url("/52.jpg")', 
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Semi-transparent overlay for better text readability */}
            <div className="absolute inset-0 bg-black/5 z-0"></div>
            <CardContent className="p-10 h-full flex flex-col text-white relative z-10">
              <div className="mb-4">
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">Middleman</span>
              </div>

              <div className="flex items-center mb-8">
                <div className="h-10 w-10 mr-3 flex items-center">
                  <img src="/logos/nav.jpeg" alt="NAV Logo" className="h-full object-contain" />
                </div>
                <h3 className="text-3xl font-bold text-white leading-tight">NAV</h3>
              </div>

              <div className="flex-1 space-y-8">
                <div className="text-white/90">
                  <div className="text-lg font-semibold text-white mb-3">1M+ users</div>
                  <p className="text-base leading-relaxed h-12">Shows partial data - fragments only</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs">✕</span>
                    </div>
                    <span className="text-sm text-white/90">Incomplete vendor visibility</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <div className="text-base md:text-lg text-white">$39-$79/mo</div>
              </div>
            </CardContent>
          </Card>

          {/* Center Card - Credit Karma */}
          <Card
            onClick={handleCreditKarmaClick}
            className="border-0 rounded-[32px] overflow-hidden h-[520px] transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl cursor-pointer relative"
            style={{ 
              backgroundImage: 'url("/16.jpg")', 
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Semi-transparent overlay for better text readability */}
            <div className="absolute inset-0 bg-black/5 z-0"></div>
            <CardContent className="p-10 h-full flex flex-col text-white relative z-10">
              <div className="mb-4">
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">Consumer Toy</span>
              </div>

              <div className="flex items-center mb-8">
                <div className="h-10 w-10 mr-3 flex items-center">
                  <img src="/logos/creditkarma.png" alt="Credit Karma Logo" className="h-full object-contain" />
                </div>
                <h3 className="text-3xl font-bold text-white leading-tight">Credit Karma</h3>
              </div>

              <div className="flex-1 space-y-8">
                <div className="text-white/90">
                  <div className="text-lg font-semibold text-white mb-3">120M+ users</div>
                  <p className="text-base leading-relaxed h-12">Consumer toy - not for business owners</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs">✕</span>
                    </div>
                    <span className="text-sm text-white/90">No business credit coverage</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <div className="text-base md:text-lg text-white">Free for personal only</div>
              </div>
            </CardContent>
          </Card>

          {/* Right Card - FUTEURCRED */}
          <Card
            onClick={handleFuteurCredClick}
            className="border-0 rounded-[32px] overflow-hidden h-[520px] transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl cursor-pointer relative"
            style={{ 
              backgroundImage: 'url("/35.jpg")', 
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Semi-transparent overlay for better text readability */}
            <div className="absolute inset-0 bg-black/5 z-0"></div>
            <CardContent className="p-10 h-full flex flex-col text-white relative z-10">
              <div className="mb-4">
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Operating System
                </span>
              </div>

              <div className="flex items-center mb-8">
                <div className="h-10 w-10 mr-3 flex items-center">
                  <img src="/logos/futeur.png" alt="FUTEURCRED Logo" className="h-full object-contain" />
                </div>
                <h3 className="text-3xl font-bold text-white leading-tight">FuteurCred</h3>
              </div>

              <div className="flex-1 space-y-8">
                <div className="text-white/90">
                  <div className="text-lg font-semibold text-white mb-3">50K+ users</div>
                  <p className="text-base leading-relaxed h-12">
                    Complete business credit app powered by LUMIQ journey engine
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-sm text-white/90">Full-spectrum AI-powered ecosystem</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <a 
                  href="https://app.futeur.ai/signin" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-base md:text-lg text-white underline hover:text-blue-300 transition-colors"
                >
                  Try Now
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


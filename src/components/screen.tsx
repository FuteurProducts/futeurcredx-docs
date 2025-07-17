"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { ScrollParallax } from "react-just-parallax"
import { Menu, X } from "lucide-react"
import { Link } from "react-router-dom"

// Circular Progress Component
const CircularProgress = ({
  value,
  max = 100,
  size = 100,
  strokeWidth = 6,
  label,
  sublabel,
}: {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  label: string
  sublabel?: string
}) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (value / max) * circumference

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90 animate-spin"
          style={{ animationDuration: "8s" }}
          width={size}
          height={size}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-white/10"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={`text-white transition-all duration-1000 ease-out ${
              value < 30 ? "text-white/40" : value < 70 ? "text-white/60" : "text-white/80"
            }`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-xl md:text-2xl font-bold text-white">{value}</div>
            <div className="text-xs text-white/60">0 - {max}</div>
          </div>
        </div>
      </div>
      <div className="mt-2 md:mt-4 text-center">
        <div className="text-xs md:text-sm font-medium text-white">{label}</div>
        {sublabel && <div className="text-xs text-white/60">{sublabel}</div>}
      </div>
    </div>
  )
}

// Custom Button Component
const Button = ({
  children,
  className = "",
  onClick,
  size = "md",
}: {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  size?: "sm" | "md" | "lg"
}) => {
  const sizeClasses = {
    sm: "px-3 py-2 text-xs md:px-4 md:text-sm",
    md: "px-4 py-2 text-sm md:px-6 md:py-3 md:text-base",
    lg: "px-6 py-3 text-base md:px-8 md:py-4 md:text-lg",
  }

  const baseClasses = `inline-flex items-center justify-center border border-transparent font-medium rounded-full transition-all duration-300 hover:scale-105`
  const buttonClasses = `${baseClasses} ${sizeClasses[size]} ${className}`

  return (
    <button onClick={onClick} className={buttonClasses}>
      {children}
    </button>
  )
}

// Dashboard Screen Component
const DashboardScreen = ({ className = "" }: { className?: string }) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [mounted, setMounted] = useState<boolean>(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const parallaxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Toggle generating state
    const generatingInterval = setInterval(() => {
      setIsGenerating((prev) => !prev)
    }, 3000)

    return () => clearInterval(generatingInterval)
  }, [])

  return (
    <div className={`relative ${className}`} style={{ pointerEvents: 'none' }}>
      {/* Overlay Cards with Parallax - Hidden on mobile */}
      <div className="absolute z-20 w-full h-full pointer-events-none hidden md:block">
        {/* Left overlay card */}
        <ScrollParallax isAbsolutelyPositioned strength={0.2}>
          <div className="absolute top-[20%] left-[5%] w-[240px] h-[140px] bg-transparent backdrop-blur-sm border border-white/20 rounded-3xl shadow-lg">
            <div className="p-5 flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-green-500/30 mr-3 flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 20V4M18 10L12 4L6 10" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-green-400 text-sm font-medium">+5 points</span>
                    <p className="text-white/80 text-xs">Experian Intelliscore improved</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <div className="w-6 h-6 rounded-full overflow-hidden border-2 border-white">
                    <img
                      src="https://randomuser.me/api/portraits/men/32.jpg"
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-6 h-6 rounded-full overflow-hidden border-2 border-white -ml-2">
                    <img
                      src="https://randomuser.me/api/portraits/women/44.jpg"
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-6 h-6 rounded-full overflow-hidden border-2 border-white -ml-2">
                    <img
                      src="https://randomuser.me/api/portraits/men/86.jpg"
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-white/70 text-xs">1m ago</span>
              </div>
            </div>
          </div>
        </ScrollParallax>

        {/* Right overlay card */}
        <ScrollParallax isAbsolutelyPositioned strength={0.15}>
          <div className="absolute top-[40%] right-[5%] w-[220px] h-[130px] bg-transparent backdrop-blur-sm border border-white/20 rounded-3xl shadow-lg">
            <div className="p-5 flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 mr-3 flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 18H17V16H7V18Z" fill="white"/>
                      <path d="M17 14H7V12H17V14Z" fill="white"/>
                      <path d="M7 10H11V8H7V10Z" fill="white"/>
                      <path fillRule="evenodd" clipRule="evenodd" d="M6 2C4.34315 2 3 3.34315 3 5V19C3 20.6569 4.34315 22 6 22H18C19.6569 22 21 20.6569 21 19V9C21 5.13401 17.866 2 14 2H6ZM5 5C5 4.44772 5.44772 4 6 4H13V9H19V19C19 19.5523 18.5523 20 18 20H6C5.44772 20 5 19.5523 5 19V5ZM15 4.10002C16.6113 4.4271 17.9413 5.52906 18.584 7H15V4.10002Z" fill="white"/>
                    </svg>
                  </div>
                  <span className="text-white text-sm font-medium">PDF Ready for Download</span>
                </div>
                <div className="flex space-x-1">
                  <div className="w-6 h-6 rounded-full overflow-hidden border-2 border-white">
                    <img
                      src="https://randomuser.me/api/portraits/women/65.jpg"
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-white/70 text-xs">3m ago</span>
              </div>
            </div>
          </div>
        </ScrollParallax>
      </div>

      {/* Computer Frame - Responsive */}
      <div className="relative z-10 p-0.5 rounded-2xl bg-gradient-to-r from-white/30 via-white/20 to-white/30">
        <div className="relative bg-black/50 rounded-[0.875rem] overflow-hidden border border-white/20">
          {/* Computer Top Bar */}
          <div className="h-[1.375rem] bg-black/40 rounded-t-[0.875rem] flex items-center px-2 md:px-4 border-b border-white/5">
            <div className="flex space-x-2">
              <div className="w-2 h-2 md:w-3 md:h-3 bg-white/30 rounded-full hover:bg-white/40 transition-colors cursor-pointer"></div>
              <div className="w-2 h-2 md:w-3 md:h-3 bg-white/30 rounded-full hover:bg-white/40 transition-colors cursor-pointer"></div>
              <div className="w-2 h-2 md:w-3 md:h-3 bg-white/30 rounded-full hover:bg-white/40 transition-colors cursor-pointer"></div>
            </div>
            <div className="flex-1 text-center">
              <span className="text-xs text-white/60 hidden sm:inline">Business Credit Monitoring</span>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="min-h-[500px] md:aspect-[688/600] lg:aspect-[1024/600] bg-black/20 p-2 md:p-4 lg:p-6">
            {/* Mobile Menu Button */}
            <div className="md:hidden mb-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 text-white/80 hover:text-white transition-colors"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>

            {/* Dashboard Layout */}
            <div className="flex h-full relative">
              {/* Mobile Sidebar Overlay */}
              {sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 md:hidden" onClick={() => setSidebarOpen(false)} />
              )}

              {/* Sidebar */}
              <div
                className={`
                fixed md:relative top-0 left-0 h-full md:h-auto w-64 md:w-48 
                bg-black/40 md:bg-black/20 rounded-lg p-4 mr-0 md:mr-6 
                border border-white/5 z-50 md:z-auto
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
              `}
              >
                {/* Logo */}
                <div className="flex items-center mb-6 md:mb-8">
                  <div className="w-5 h-5 md:w-6 md:h-6 bg-white/20 rounded mr-2"></div>
                  <span className="text-white font-semibold text-sm">Futeur AI</span>
                </div>

                {/* Navigation */}
                <nav className="space-y-2">
                  {[
                    { name: "Dashboard", active: true },
                    { name: "Credit Health", active: false },
                    { name: "Subscriptions", active: false },
                    { name: "Profile", active: false },
                    { name: "Feed", active: false },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-center px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                        item.active ? "bg-white/10 text-white" : "text-white/60 hover:text-white/80"
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <div className="w-4 h-4 bg-white/20 rounded mr-3"></div>
                      {item.name}
                    </div>
                  ))}
                </nav>

                {/* Credit Scores Section */}
                <div className="mt-6 md:mt-8">
                  <h4 className="text-white/60 text-xs font-medium mb-4">Credit Scores</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="text-white text-sm">Equifax One Score</div>
                      <div className="text-white font-bold text-lg">391</div>
                    </div>
                    <div>
                      <div className="text-white text-sm">Experian Score</div>
                      <div className="text-white font-bold text-lg">23</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 space-y-3 md:space-y-0">
                  <div>
                    <h1 className="text-white text-lg md:text-xl font-bold">Dashboard</h1>
                    <p className="text-white/60 text-sm">Saturday, July 5</p>
                    <p className="text-white/80 text-sm">Welcome to Futeur AI</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <div className="bg-white/10 px-3 py-1 rounded-full">
                      <span className="text-white/80 text-xs">30 days left in your free trial</span>
                    </div>
                    <Link to="/credit-journey" className="inline-block">
                      <Button size="sm" className="bg-white text-black hover:bg-gray-100 border border-white/10">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-2 h-3 w-3 md:h-4 md:w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                        <span className="hidden sm:inline">View Full Dashboard</span>
                        <span className="sm:hidden">View Full</span>
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Credit Score Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8" ref={parallaxRef}>
                  <div className="relative">
                    <div className="bg-black/20 rounded-lg p-4 md:p-6 border border-white/10 transition-transform duration-500 hover:scale-105 relative">
                      <div className="h-6 md:h-7 mb-3 md:mb-4">
                        <img
                          src="/logos/Dark-Equifax.png"
                          alt="Equifax"
                          className="h-6 md:h-7 w-auto object-contain"
                        />
                      </div>
                      <div className="text-white text-2xl md:text-3xl font-bold mb-3 md:mb-4">391</div>
                      <div className="text-xs text-white/70">Your Equifax One Score</div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="bg-black/20 rounded-lg p-4 md:p-6 border border-white/10 transition-transform duration-500 hover:scale-105 relative">
                      <div className="h-6 md:h-7 mb-3 md:mb-4">
                        <img
                          src="/logos/Dark-Experian.png"
                          alt="Experian"
                          className="h-6 md:h-7 w-auto object-contain scale-110"
                        />
                      </div>
                      <div className="text-white text-2xl md:text-3xl font-bold mb-3 md:mb-4">23</div>
                      <div className="text-xs text-white/70">Your Experian Intelliscore</div>
                    </div>
                  </div>
                </div>

                {/* Business Credit Profile */}
                <div className="bg-black/20 rounded-lg p-4 md:p-6 border border-white/10">
                  <h3 className="text-white text-base md:text-lg font-semibold mb-3 md:mb-4">
                    Business Credit Profile
                  </h3>

                  {/* Tabs */}
                  <div className="flex mb-4 md:mb-6 overflow-x-auto">
                    <button className="px-3 md:px-4 py-2 text-white/60 text-sm border-b border-white/20 whitespace-nowrap">
                      OneScore
                    </button>
                    <button className="px-3 md:px-4 py-2 text-white text-sm border-b-2 border-white whitespace-nowrap">
                      Experian
                    </button>
                  </div>

                  {/* Assessment Section */}
                  <div className="mb-4 md:mb-6">
                    <h4 className="text-white text-sm md:text-base font-medium mb-3 md:mb-4">
                      Experian Business Credit Assessment
                    </h4>
                  </div>

                  {/* Circular Progress Charts */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 py-4">
                    <div className="text-center">
                      <div className="bg-white/5 px-3 py-1 rounded text-xs text-white/80 mb-3 md:mb-4 inline-block">
                        Premium Feature
                      </div>
                      <CircularProgress value={23} label="Financial Stability Risk" size={80} strokeWidth={5} />
                    </div>
                    <div className="text-center">
                      <div className="bg-white/5 px-3 py-1 rounded text-xs text-white/80 mb-3 md:mb-4 inline-block">
                        Premium Feature
                      </div>
                      <CircularProgress value={57} label="Intelliscore Plus V2" size={80} strokeWidth={5} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom space for better visual balance */}
            <div className="h-4 md:h-8"></div>
          </div>
        </div>

        {/* Computer Base Shadows */}
        <div className="relative z-10 h-4 md:h-6 mx-2 md:mx-2.5 lg:mx-8 bg-black/40 shadow-xl rounded-b-[1.25rem]"></div>
        <div className="relative z-10 h-4 md:h-6 mx-4 md:mx-6 lg:mx-20 bg-black/20 shadow-xl rounded-b-[1.25rem]"></div>
      </div>
    </div>
  )
}

export default DashboardScreen


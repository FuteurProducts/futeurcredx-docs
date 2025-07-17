"use client"

import { useState, useEffect } from "react"
import { HeroBackground } from "@/components/HeroBackground"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Link } from "react-router-dom"
import {
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Play,
  Pause,
  RotateCcw,
  Orbit,
  Cpu,
  CheckCircle,
  AlertTriangle,
  Activity,
  Zap,
} from "lucide-react"

const CreditJourney = () => {
  const [currentView, setCurrentView] = useState("dashboard")
  const [animatedScore, setAnimatedScore] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => {
        setAnimatedScore((prev) => Math.min(prev + 5, 785))
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [animatedScore, isPlaying])

  const startAnimation = () => {
    setIsPlaying(true)
    setAnimatedScore(0)
  }

  const pauseAnimation = () => {
    setIsPlaying(false)
  }

  const resetAnimation = () => {
    setIsPlaying(false)
    setAnimatedScore(0)
  }

  const comparisonData = [
    {
      feature: "Score Type",
      chase: "VantageScore (Experian, Personal)",
      lumiq: "Multi-Bureau Biz Credit Scores",
      advantage: "lumiq",
    },
    {
      feature: "Credit Factors",
      chase: "Personal Credit (Util, Age, Mix)",
      lumiq: "Business Tradelines, PG-Free Accounts",
      advantage: "lumiq",
    },
    {
      feature: "Insights",
      chase: "Consumer Simulation",
      lumiq: "Commercial Optimization",
      advantage: "lumiq",
    },
    {
      feature: "Alerts",
      chase: "Personal Score + Identity",
      lumiq: "Business Inquiries + Vendor Movement",
      advantage: "lumiq",
    },
    {
      feature: "Action Engine",
      chase: "None",
      lumiq: "AI-Powered, EIN-Based Recommendations",
      advantage: "lumiq",
    },
    {
      feature: "Target User",
      chase: "Consumers",
      lumiq: "Entrepreneurs, LLCs, SMBs",
      advantage: "lumiq",
    },
    {
      feature: "User Flow",
      chase: "Monitor + Learn",
      lumiq: "Command + Accelerate",
      advantage: "lumiq",
    },
  ]

  const businessFactors = [
    { name: "Trade Payment History", impact: 89, trend: "up", color: "green" },
    { name: "Credit Utilization", impact: 76, trend: "stable", color: "blue" },
    { name: "Account Age", impact: 92, trend: "up", color: "green" },
    { name: "Credit Mix", impact: 68, trend: "down", color: "orange" },
    { name: "Inquiry Activity", impact: 85, trend: "up", color: "green" },
  ]

  const tradeLines = [
    {
      vendor: "Office Depot Business",
      limit: "$15,000",
      balance: "$2,340",
      utilization: "16%",
      status: "Current",
      reporting: ["Experian", "Equifax"],
    },
    {
      vendor: "Staples Business",
      limit: "$25,000",
      balance: "$4,750",
      utilization: "19%",
      status: "Current",
      reporting: ["Experian", "Equifax"],
    },
    {
      vendor: "Grainger Industrial",
      limit: "$50,000",
      balance: "$8,200",
      utilization: "16%",
      status: "Current",
      reporting: ["All Bureaus"],
    },
    {
      vendor: "Uline Shipping Supply",
      limit: "$35,000",
      balance: "$0",
      utilization: "0%",
      status: "Current",
      reporting: ["All Bureaus"],
    },
  ]

  return (
    <div className="min-h-screen bg-[#0E0E10] text-white">
      {/* Hero Section */}
      <section className="pt-16 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 relative overflow-hidden bg-black">
        {/* Background image with overlay - using HeroBackground component for better loading */}
        <HeroBackground imagePath="/46.jpg" overlayOpacity={30} showNoise={true} />

        <div className="max-w-7xl mx-auto relative text-center">
          <div className="inline-flex items-center gap-2 sm:gap-3 bg-white/5 px-3 sm:px-6 py-2 sm:py-3 rounded-full mb-6 sm:mb-8 border border-white/10">
            <Orbit className="h-4 w-4 sm:h-5 sm:w-5 text-white animate-spin" />
            <span className="font-medium text-white text-xs sm:text-sm">LUMIQ™ CREDIT JOURNEY DEMO</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-6 sm:mb-8 leading-tight tracking-tight text-white uppercase px-2">
            YOUR BUSINESS CREDIT
            <br />
            COMMAND CENTER
          </h1>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4">
            If Chase Credit Journey was the blueprint for personal credit evolution...
            <br />
            <strong className="text-white font-semibold">
              LUMIQ is the FUTEUR-powered command center for business credit ascension.
            </strong>
          </p>

          {/* Interactive Demo Controls - Made Transparent */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 px-4">
            <Button
              onClick={startAnimation}
              className="bg-black/30 text-white hover:bg-black/40 px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg font-bold rounded-full border border-white/10 hover:border-white/30 transition-all uppercase backdrop-blur-sm"
            >
              <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Start Journey
            </Button>
            <Button
              onClick={pauseAnimation}
              className="bg-black/30 text-white hover:bg-black/40 px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg font-bold rounded-full border border-white/10 hover:border-white/30 transition-all uppercase backdrop-blur-sm"
            >
              <Pause className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Pause
            </Button>
            <Button
              onClick={resetAnimation}
              className="bg-black/30 text-white hover:bg-black/40 px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg font-bold rounded-full border border-white/10 hover:border-white/30 transition-all uppercase backdrop-blur-sm"
            >
              <RotateCcw className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Reset
            </Button>
          </div>
        </div>
      </section>

      {/* Live Dashboard Demo */}
      <section id="dashboard" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-black relative">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4 sm:mb-6 uppercase tracking-tight">
              Live LUMIQ™ Dashboard
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 px-4">
              Watch your business credit ecosystem come alive in real-time
            </p>
          </div>

          {/* Dashboard Controls */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 sm:gap-4 bg-white/5 backdrop-blur-sm border border-white/10 px-4 sm:px-6 py-2 sm:py-3 rounded-full">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm text-white font-medium uppercase">Live Data</span>
              <div className="h-4 w-px bg-white/20"></div>
              <span className="text-xs sm:text-sm text-white/60">
                Last updated: <span className="text-white">Just now</span>
              </span>
            </div>
          </div>

          {/* Main Dashboard */}
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
            {/* Enhanced Credit Score Visualization */}
            <Card className="lg:col-span-2 p-4 sm:p-6 md:p-8 bg-black/40 backdrop-blur-sm border border-white/10 shadow-2xl rounded-xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5"></div>
              <CardContent className="p-0 relative z-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
                  <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                    Business Credit Score
                  </h3>
                  <Badge className="bg-white/10 text-white border border-white/20 backdrop-blur-sm px-3 sm:px-4 py-1 rounded-full uppercase text-xs font-bold">
                    EXCELLENT
                  </Badge>
                </div>

                {/* Enhanced Score Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
                  {/* Equifax Score with Enhanced Meter */}
                  <div className="relative group">
                    <div className="p-4 sm:p-6 bg-black/60 rounded-xl border border-white/10 hover:border-white/30 transition-all duration-300 backdrop-blur-sm shadow-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight flex items-center gap-2">
                          <img src="/Dark-Equifax.png" alt="Equifax" className="h-5 w-auto opacity-90" />
                   
                        </h4>
                        <div className="flex items-center gap-2 bg-white/5 px-2 sm:px-3 py-1 rounded-full">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          <span className="text-xs text-white/80 font-medium uppercase">Active</span>
                        </div>
                      </div>

                      {/* Circular Progress Meter */}
                      <div className="flex items-center justify-center mb-6">
                        <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                            <circle
                              className="text-white/10"
                              strokeWidth="8"
                              stroke="currentColor"
                              fill="transparent"
                              r="54"
                              cx="60"
                              cy="60"
                            />
                            <circle
                              className="text-white"
                              strokeWidth="8"
                              strokeDasharray={339.292}
                              strokeDashoffset={339.292 * (1 - 80 / 100)}
                              strokeLinecap="round"
                              stroke="currentColor"
                              fill="transparent"
                              r="54"
                              cx="60"
                              cy="60"
                            />
                          </svg>
                          <div className="absolute flex flex-col items-center justify-center">
                            <span className="text-2xl sm:text-3xl font-bold text-white">80</span>
                            <span className="text-xs text-white/60 uppercase">out of 100</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 px-2 sm:px-3 py-1.5 rounded-full">
                          <span className="text-xs text-white font-medium uppercase">Excellent Range</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Experian FSR Score with Enhanced Meter */}
                  <div className="relative group">
                    <div className="p-4 sm:p-6 bg-black/60 rounded-xl border border-white/10 hover:border-white/30 transition-all duration-300 backdrop-blur-sm shadow-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight flex items-center gap-2">
                          <img src="/Dark-Experian.png" alt="Experian" className="h-7 w-auto opacity-90" />
                 
                        </h4>
                        <div className="flex items-center gap-2 bg-white/5 px-2 sm:px-3 py-1 rounded-full">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          <span className="text-xs text-white/80 font-medium uppercase">Active</span>
                        </div>
                      </div>

                      {/* Circular Progress Meter */}
                      <div className="flex items-center justify-center mb-6">
                        <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                            <circle
                              className="text-white/10"
                              strokeWidth="8"
                              stroke="currentColor"
                              fill="transparent"
                              r="54"
                              cx="60"
                              cy="60"
                            />
                            <circle
                              className="text-white"
                              strokeWidth="8"
                              strokeDasharray={339.292}
                              strokeDashoffset={339.292 * (1 - 92 / 100)}
                              strokeLinecap="round"
                              stroke="currentColor"
                              fill="transparent"
                              r="54"
                              cx="60"
                              cy="60"
                            />
                          </svg>
                          <div className="absolute flex flex-col items-center justify-center">
                            <span className="text-2xl sm:text-3xl font-bold text-white">92</span>
                            <span className="text-xs text-white/60 uppercase">out of 100</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 px-2 sm:px-3 py-1.5 rounded-full">
                          <span className="text-xs text-white font-medium uppercase">Low Risk Zone</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Animated Score Circle */}
                <div className="relative mx-auto w-48 h-48 sm:w-64 sm:h-64 mb-6 sm:mb-8">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-40 h-40 sm:w-56 sm:h-56 rounded-full bg-white/5 backdrop-blur-sm border border-white/10"></div>
                  </div>
                  <svg
                    className="w-48 h-48 sm:w-64 sm:h-64 transform -rotate-90 animate-spin-slow"
                    style={{ animationDuration: "12s" }}
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="transparent"
                      className="text-white/10"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - animatedScore / 850)}`}
                      className="text-white transition-all duration-300"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl sm:text-5xl font-black text-white">{animatedScore}</div>
                      <div className="text-xs sm:text-sm text-white/70 uppercase tracking-tight">Overall Score</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                  <div className="p-3 sm:p-4 bg-black/60 backdrop-blur-sm border border-white/10 rounded-xl hover:border-white/30 transition-all duration-300 shadow-lg">
                    <div className="text-xl sm:text-2xl font-black text-white">80</div>
                    <div className="text-xs sm:text-sm text-white/70 uppercase tracking-tight flex items-center justify-center gap-1">
                     
                      EQUIFAX SCORE
                    </div>
                  </div>
                  <div className="p-3 sm:p-4 bg-black/60 backdrop-blur-sm border border-white/10 rounded-xl hover:border-white/30 transition-all duration-300 shadow-lg">
                    <div className="text-xl sm:text-2xl font-black text-white">92</div>
                    <div className="text-xs sm:text-sm text-white/70 uppercase tracking-tight flex items-center justify-center gap-1">
                    
                      EXPERIAN Financial Stability Risk Score
                    </div>
                  </div>
                  <div className="p-3 sm:p-4 bg-black/60 backdrop-blur-sm border border-white/10 rounded-xl hover:border-white/30 transition-all duration-300 shadow-lg">
                    <div className="text-xl sm:text-2xl font-black text-white">785</div>
                    <div className="text-xs sm:text-sm text-white/70 uppercase tracking-tight">Credit Score</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Score Factors */}
            <Card className="p-4 sm:p-6 bg-black/40 backdrop-blur-sm border border-white/10 shadow-2xl rounded-xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5"></div>
              <CardContent className="p-0 relative z-10">
                <h3 className="text-lg sm:text-xl font-black text-white mb-4 sm:mb-6 uppercase tracking-tight">
                  Credit Factors
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {businessFactors.map((factor, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 sm:p-3 bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg hover:border-white/30 transition-all duration-300"
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-white"></div>
                        <span className="text-xs sm:text-sm text-white/80">{factor.name}</span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span className="text-xs sm:text-sm font-bold text-white">{factor.impact}%</span>
                        {factor.trend === "up" && <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-white" />}
                        {factor.trend === "down" && <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-white" />}
                        {factor.trend === "stable" && <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-white" />}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trade Lines Section */}
          <Card className="p-4 sm:p-6 md:p-8 bg-black/40 backdrop-blur-sm border border-white/10 shadow-2xl rounded-xl overflow-hidden relative mb-8 sm:mb-12">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5"></div>
            <CardContent className="p-0 relative z-10">
              <h3 className="text-xl sm:text-2xl font-black text-white mb-4 sm:mb-6 uppercase tracking-tight">
                Active Trade Lines
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-2 sm:py-3 text-white/70 uppercase text-xs sm:text-sm tracking-tight">
                        Vendor
                      </th>
                      <th className="text-left py-2 sm:py-3 text-white/70 uppercase text-xs sm:text-sm tracking-tight">
                        Credit Limit
                      </th>
                      <th className="text-left py-2 sm:py-3 text-white/70 uppercase text-xs sm:text-sm tracking-tight">
                        Balance
                      </th>
                      <th className="text-left py-2 sm:py-3 text-white/70 uppercase text-xs sm:text-sm tracking-tight">
                        Utilization
                      </th>
                      <th className="text-left py-2 sm:py-3 text-white/70 uppercase text-xs sm:text-sm tracking-tight">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tradeLines.map((line, index) => (
                      <tr
                        key={index}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200"
                      >
                        <td className="py-2 sm:py-3 text-white font-medium text-xs sm:text-sm">{line.vendor}</td>
                        <td className="py-2 sm:py-3 text-white text-xs sm:text-sm">{line.limit}</td>
                        <td className="py-2 sm:py-3 text-white text-xs sm:text-sm">{line.balance}</td>
                        <td className="py-2 sm:py-3 text-white text-xs sm:text-sm">{line.utilization}%</td>
                        <td className="py-2 sm:py-3">
                          <Badge className="bg-white/10 text-white border border-white/20 uppercase text-xs">
                            {line.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4 sm:mb-6 uppercase tracking-tight">
              Chase Credit Journey vs. LUMIQ™
            </h2>
            <p className="text-lg sm:text-xl text-white/70">The evolution from consumer tracking to business command</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-2xl">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-3 sm:p-6 text-white font-bold uppercase tracking-tight text-xs sm:text-sm">
                    Feature
                  </th>
                  <th className="text-left p-3 sm:p-6 text-white font-bold uppercase tracking-tight text-xs sm:text-sm">
                    Chase Credit Journey
                  </th>
                  <th className="text-left p-3 sm:p-6 text-white font-bold uppercase tracking-tight text-xs sm:text-sm">
                    FUTEURCRED™ (LUMIQ)
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, index) => (
                  <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200">
                    <td className="p-3 sm:p-6 text-white font-medium text-xs sm:text-sm">{row.feature}</td>
                    <td className="p-3 sm:p-6 text-white/70 text-xs sm:text-sm">{row.chase}</td>
                    <td className="p-3 sm:p-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        <span className="text-white text-xs sm:text-sm">{row.lumiq}</span>
                        {row.advantage === "lumiq" && (
                          <Badge className="bg-white/10 text-white border border-white/20 text-xs uppercase">
                            <Zap className="mr-1 h-3 w-3" />
                            Advanced
                          </Badge>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* AI Recommendations Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center mb-6 sm:mb-8">
              <Cpu className="h-8 w-8 sm:h-12 sm:w-12 text-white animate-pulse" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4 sm:mb-6 uppercase tracking-tight">
              AI-Powered Recommendations
            </h2>
            <p className="text-lg sm:text-xl text-white/70 px-4">
              Unlike Chase's passive monitoring, LUMIQ actively guides your growth
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            <Card className="p-4 sm:p-6 md:p-8 bg-black/40 backdrop-blur-sm border border-white/10 shadow-2xl rounded-xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5"></div>
              <CardContent className="p-0 relative z-10">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">
                    Recommended Actions
                  </h3>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div className="p-3 sm:p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:border-white/30 transition-all duration-300">
                    <div className="font-bold text-white mb-2 uppercase tracking-tight text-sm sm:text-base">
                      Open Uline Account
                    </div>
                    <div className="text-xs sm:text-sm text-white/70">Expected impact: +15 points to PAYDEX</div>
                  </div>
                  <div className="p-3 sm:p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:border-white/30 transition-all duration-300">
                    <div className="font-bold text-white mb-2 uppercase tracking-tight text-sm sm:text-base">
                      Pay Early Next Month
                    </div>
                    <div className="text-xs sm:text-sm text-white/70">Boost payment history score by 8%</div>
                  </div>
                  <div className="p-3 sm:p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:border-white/30 transition-all duration-300">
                    <div className="font-bold text-white mb-2 uppercase tracking-tight text-sm sm:text-base">
                      Reduce Utilization
                    </div>
                    <div className="text-xs sm:text-sm text-white/70">Target: Under 15% for optimal scoring</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="p-4 sm:p-6 md:p-8 bg-black/40 backdrop-blur-sm border border-white/10 shadow-2xl rounded-xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5"></div>
              <CardContent className="p-0 relative z-10">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">Risk Alerts</h3>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div className="p-3 sm:p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:border-white/30 transition-all duration-300">
                    <div className="font-bold text-white mb-2 uppercase tracking-tight text-sm sm:text-base">
                      High Inquiry Activity
                    </div>
                    <div className="text-xs sm:text-sm text-white/70">
                      3 inquiries this month - consider spacing applications
                    </div>
                  </div>
                  <div className="p-3 sm:p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:border-white/30 transition-all duration-300">
                    <div className="font-bold text-white mb-2 uppercase tracking-tight text-sm sm:text-base">
                      Utilization Spike
                    </div>
                    <div className="text-xs sm:text-sm text-white/70">
                      Tech Solutions Inc. at 75% - consider payment
                    </div>
                  </div>
                  <div className="p-3 sm:p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:border-white/30 transition-all duration-300">
                    <div className="font-bold text-white mb-2 uppercase tracking-tight text-sm sm:text-base">
                      Missing Trade Lines
                    </div>
                    <div className="text-xs sm:text-sm text-white/70">
                      Add 2+ vendor references for stronger profile
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-black relative">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5"></div>
        <div className="max-w-5xl mx-auto text-center relative">
          <div className="mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6 sm:mb-8 uppercase tracking-tight leading-tight">
              We didn't build a tracker.
              <br />
              We built a command center.
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              Ready to evolve from monitoring to commanding your business credit journey?
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4">
            <Link to="/business">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-black/30 backdrop-blur-sm text-white hover:bg-black/40 px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl font-bold uppercase rounded-full border border-white/10 hover:border-white/30 transition-all"
              >
                <Orbit className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                Start My Credit Journey
                <ArrowRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CreditJourney


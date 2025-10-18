import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ArrowRight, Orbit, Rocket, Play, Info, ExternalLink, CheckCircle, Eye, Network, Building2, Gauge, Download, Shield, BarChart3, Brain, LineChart, LockKeyhole, RefreshCw, Globe, TrendingUp, Lock, Trophy, ShoppingCart, FileSearch, MessageSquare, Search, Receipt, Compass, Handshake, Building, Presentation, ArrowLeft } from "lucide-react"
import DashboardScreen from "@/components/screen"
import QRCodeModal from "@/components/QrCode"
import { Link } from "react-router-dom"
import { getCrossDomainUrl } from "../utils/domainUtils"
import SmartLink from "@/components/SmartLink"
import { ScrollParallax } from "react-just-parallax"
import { useState, useEffect } from "react"

export default function FuteurCredPlus() {
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  // Handle scroll for blur effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  return (
    <TooltipProvider>
      <div className="min-h-screen text-white">
        {/* Back Button */}
        <div className="fixed top-6 left-6 z-50">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 bg-black/20 backdrop-blur-sm text-white px-4 py-2 rounded-full border border-white/20 hover:bg-black/40 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>

        {/* Hero Section - White Background */}
        <section className="min-h-screen bg-white text-black flex items-center justify-center px-4 relative overflow-hidden">
          {/* Top blur overlay */}
          <div
            className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/80 to-transparent backdrop-blur-sm z-10"
            style={{
              backdropFilter: `blur(${Math.min(scrollY / 50, 8)}px)`,
              opacity: Math.min(scrollY / 200, 0.8),
            }}
          ></div>

          <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col lg:flex-row items-center justify-between relative z-10 py-20">
            {/* Text content positioned on the left */}
            <div className="lg:max-w-[45%] w-full">
              <p className="text-gray-600 mb-4 text-sm">FuteurCred+ for $32 per month</p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-2 leading-tight text-black">
                FUTEURCRED+
                <br />
                </h1>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-black">
                NOT JUST A CREDIT SCORE
                <br />
                A PATH TO POWER
              </h1>
              <p className="text-lg text-gray-700 mb-8 max-w-md leading-relaxed">
                FuteurCred+ unlocks live multi-agency credit reporting, Lumiq™ growth tracking, AI-powered score boosters, and automated reputation-building tools—all in one sleek dashboard.
              </p>
              <ul className="mb-8 max-w-md space-y-2">
                <li className="flex items-start">
                  <span className="mr-2 font-bold">✓</span>
                  <span>Equifax. Experian. D&B.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">✓</span>
                  <span>Smart score triggers, not static numbers.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold">✓</span>
                  <span>Every action fuels your score. Literally.</span>
                </li>
              </ul>
              <button 
                className="bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
                onClick={() => window.location.href = 'https://app.futeur.ai/signin'}
              >
                Join FuteurCred+
              </button>
            </div>

            {/* Video Container positioned on the right */}
            <div className="lg:max-w-[50%] w-full mt-12 lg:mt-0 flex justify-center lg:justify-end">
              <div className="relative">
                {/* Desktop Video Container */}
                <div className="lg:block hidden">
                  <div className="relative w-[600px] h-[720px]">
                    {/* Video container seamless with white background */}
                    <div className="w-full h-full overflow-hidden bg-transparent">
                      <video
                        className="w-full h-full object-cover scale-110 origin-center"
                        autoPlay
                        loop
                        muted
                        playsInline
                        controlsList="nodownload nofullscreen noremoteplayback"
                        disablePictureInPicture
                        onLoadedData={() => setVideoLoaded(true)}
                        preload="auto"
                      >
                        <source src="/Animation.mp4" type="video/mp4" />
                        <source src="/Animation.mp4" type="video/mp4" />
                        {/* Fallback content */}
                        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
                          <p className="text-white text-center">
                            Video not supported
                            <br />
                            <span className="text-sm opacity-70">Animation.mp4</span>
                          </p>
                        </div>
                      </video>
                    </div>

                    {/* Removing decorative elements for cleaner look */}
                  </div>
                </div>

                {/* Mobile Video Container */}
                <div className="lg:hidden w-full flex justify-center">
                  <div className="relative w-[320px] h-[400px]">
                    <div className="w-full h-full overflow-hidden bg-transparent">
                      <video
                        className="w-full h-full rounded-lg object-cover"
                        muted
                        loop
                        autoPlay
                        playsInline
                        controlsList="nodownload nofullscreen noremoteplayback"
                        disablePictureInPicture
                        onLoadedData={() => setVideoLoaded(true)}
                        preload="auto"
                      >
                        <source src="/Animation.mp4" type="video/mp4" />
                        <source src="/Animation.mp4" type="video/mp4" />
                        {/* Fallback content */}
                        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
                          <p className="text-white text-center">
                            Video not supported
                            <br />
                            <span className="text-sm opacity-70">Animation.mp4</span>
                          </p>
                        </div>
                      </video>
                    </div>

                    {/* Removing mobile decorative elements */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Overview Section */}
        <section className="min-h-screen flex items-center justify-center px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto w-full py-12 lg:py-16">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-black mb-4 sm:mb-6 md:mb-8 tracking-tighter leading-none px-4 sm:px-0">
                BEYOND PERKS. THIS IS POWER.
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-800 max-w-3xl mx-auto mb-4 sm:mb-6 leading-relaxed font-medium px-4 sm:px-6 md:px-8">
                FuteurCred+ doesn't offer freebies. It builds financial freedom through real-time credit mastery and AI-guided score growth.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Real-Time Business Credit Mastery */}
              <div className="bg-white border border-gray-100 p-8 rounded-2xl text-center hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-black">Real-Time Business Credit Mastery</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  You don't just view credit—you live it. Every payment, sync, tax action, or contract you fulfill fuels your Lumiq™ score like a digital pulse of business trust.
                </p>
              </div>

              {/* AI-Powered Lumiq™ Tracker */}
              <div className="bg-white border border-gray-100 p-8 rounded-2xl text-center hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-black">AI-Powered Lumiq™ Tracker</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  We don't just display numbers — we train them. Your Lumiq™ score updates live as you act. That means your reputation grows in real time, unlocking smarter funding and vendor trust.
                </p>
              </div>

              {/* One-Tap Multi-Bureau Reports */}
              <div className="bg-white border border-gray-100 p-8 rounded-2xl text-center hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-black">One-Tap Multi-Bureau Reports</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Access official data from Experian, Equifax (MasterScore® & OneScore®), and Dun & Bradstreet — the actual intel banks and lenders use to make million-dollar decisions.
                </p>
              </div>

              {/* Dynamic Score Boosters */}
              <div className="bg-white border border-gray-100 p-8 rounded-2xl text-center hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                    <LineChart className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-black">Dynamic Score Boosters</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Our AI identifies what to do next — pay early, link accounting tools, settle disputes, or file taxes — to trigger measurable score jumps. Not next year. Now.
                </p>
              </div>

              {/* Live Credit Timeline */}
              <div className="bg-white border border-gray-100 p-8 rounded-2xl text-center hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
                    <RefreshCw className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-black">Live Credit Timeline</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Your entire credit journey — mapped visually. Track score movement, gain lender insights, and see exactly why your business is trusted (or not). Transparency = leverage.
                </p>
              </div>

              {/* Risk Class Alerts & Fraud Radar */}
              <div className="bg-white border border-gray-100 p-8 rounded-2xl text-center hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                    <LockKeyhole className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-black">Risk Class Alerts & Fraud Radar</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Stay 10 steps ahead. Get alerts if your profile changes or credit risk class drops — with steps to recover instantly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Credit Understanding Section */}
        <section className="relative py-12 sm:py-16 md:py-20 px-4 sm:px-6">
          {/* Background image */}
          <div className="absolute inset-0 -z-10">
            <img 
              src="/credit-back.jpg" 
              alt="Credit background" 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          
          <div className="max-w-6xl mx-auto text-center relative z-10">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 text-white max-w-4xl mx-auto">
              UNDERSTAND YOUR BUSINESS CREDIT
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Powered by LUMIQ AI™, our advanced business credit recommendation engine that analyzes your active tradelines,
              Days Beyond Terms, Credit Utilization, credit health risk factors, and business obligations to deliver
              actionable insights tailored to your business growth.
            </p>
            
            <a href="https://app.futeur.ai/signin" target="_blank" rel="noopener noreferrer">
              <Button className="bg-white text-black hover:bg-gray-100 px-8 py-3 rounded-full font-semibold mb-12">
                Explore FuteurCred+
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>

            {/* Mobile Interface Card */}
            <div className="relative max-w-sm mx-auto">
              <div className="bg-black/25 backdrop-blur-[2px] rounded-3xl p-6 border border-white/10 shadow-2xl">
                <div className="text-center">
                  <p className="text-white/70 text-sm mb-2">Credit Utilization</p>
                  <p className="text-4xl font-bold text-white mb-4">$142,400</p>
                  <div className="bg-black/15 backdrop-blur-[1px] rounded-full px-4 py-2 inline-block mb-6 border border-white/10">
                    <span className="text-white text-sm font-medium">Business Accounts</span>
                  </div>

                  {/* Account List */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-black/30 rounded-2xl p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                        <span className="text-white font-medium text-sm">Main Business</span>
                      </div>
                      <span className="text-white font-bold text-sm">$128,475.50</span>
                    </div>
                    <div className="flex items-center justify-between bg-black/30 rounded-2xl p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                        <span className="text-white font-medium text-sm">Side Venture</span>
                      </div>
                      <span className="text-white font-bold text-sm">$129,552.50</span>
                    </div>
                  </div>

                  {/* Bottom Action Icons */}
                  <div className="flex justify-center gap-4 mt-6">
                    <div className="w-10 h-10 bg-black/40 border border-white/10 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg">+</span>
                    </div>
                    <div className="w-10 h-10 bg-black/40 border border-white/10 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg">%</span>
                    </div>
                    <div className="w-10 h-10 bg-black/40 border border-white/10 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg">⌂</span>
                    </div>
                    <div className="w-10 h-10 bg-black/40 border border-white/10 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg">⋯</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Power Perks Section */}
        <section className="min-h-screen bg-black flex items-center justify-center px-4 py-20 relative">
          <div className="max-w-7xl mx-auto text-center relative z-20">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 text-white">
              UNLOCK POWER PERKS THAT BANKS WON'T TELL YOU EXIST
            </h2>
            <p className="text-lg text-white/80 mb-16 max-w-2xl mx-auto">
              Where others tap out, you tap in. These aren't upgrades — they're unlocks.
              Because once you master credit behavior, you bend the financial system to your will.
            </p>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Pre-Approval Alerts Card */}
              <div className="bg-black/25 backdrop-blur-[2px] rounded-3xl p-8 text-center relative overflow-hidden h-auto border border-white/10">
                <div className="relative z-10">
                  <div className="flex items-center justify-center mb-3">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    PRE-APPROVAL
                  </h3>
                  <p className="text-white/80 text-sm mb-6">
                    Be the first to know when lenders are watching.
                    Our Lumiq Radar™ detects bureau pings and predictive interest from banks — before they send the mailers.
                    Know when you're hot. Strike when you're golden.
                  </p>
                </div>
              </div>
              
              {/* Dynamic Credit Limit Engine Card */}
              <div className="bg-black/25 backdrop-blur-[2px] rounded-3xl p-8 text-center relative overflow-hidden h-auto border border-white/10">
                <div className="relative z-10">
                  <div className="flex items-center justify-center mb-3">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    CREDIT LIMITS
                  </h3>
                  <p className="text-white/80 text-sm mb-6">
                    We don't set limits. You grow them.
                    Our system dynamically unlocks higher credit thresholds based on your Lumiq™ behavior — not fixed underwriting.
                    It's not what you have. It's what your data says you deserve.
                  </p>
                </div>
              </div>
              
              {/* Invite-Only Lending Tiers Card */}
              <div className="bg-black/25 backdrop-blur-[2px] rounded-3xl p-8 text-center relative overflow-hidden h-auto border border-white/10">
                <div className="relative z-10">
                  <div className="flex items-center justify-center mb-3">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    LENDING TIERS
                  </h3>
                  <p className="text-white/80 text-sm mb-6">
                    Hit Lumiq milestones. Unlock private capital.
                    Access FuteurCred+ tiered lending vaults — only available once your AI score unlocks the gateway.
                    Your score is the key. The vault is real.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 tracking-tight px-2">
              Ready to unlock
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              <span className="text-white">your credit power?</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8 sm:mb-10 md:mb-12 px-2">
              Join thousands of businesses already building their financial future with FuteurCred+.
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              <strong className="text-white">Your credit transformation starts today.</strong>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://app.futeur.ai/signin" target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-gray-100 px-6 sm:px-8 md:px-12 py-4 sm:py-5 md:py-6 text-base sm:text-lg md:text-xl font-bold rounded-full w-full sm:w-auto"
                >
                  <Download className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 md:h-5 md:w-5" />
                  Start Your Journey
                </Button>
              </a>
              <SmartLink to="/credit-journey" className="inline-block w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white/10 hover:text-white px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 text-base sm:text-lg md:text-xl rounded-full bg-transparent w-full sm:w-auto"
                >
                  <Eye className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 md:h-5 md:w-5" />
                  See Demo
                </Button>
              </SmartLink>
            </div>
          </div>
        </section>
      </div>
    </TooltipProvider>
  )
}


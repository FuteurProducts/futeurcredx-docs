import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ArrowRight, Orbit, Rocket, Play, Info, ExternalLink, CheckCircle, Eye, Network, Building2, Gauge, Download } from "lucide-react"
import DashboardScreen from "@/components/screen"
import BusinessSection from "@/components/BusinessSection"
import Component from "@/components/comparison"
import QRCodeModal from "@/components/QrCode"
import Pricing from "@/components/Pricing"
import LazyImage from "@/components/LazyImage"
import SkeletonLoader from "@/components/SkeletonLoader"
import { Link } from "react-router-dom"
import { ScrollParallax } from "react-just-parallax";

export default function Index() {
  return (
    <TooltipProvider>
      <div className="min-h-screen text-white">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center overflow-hidden -mt-20 pt-24">
          {/* Background image with lazy loading */}
          <div className="absolute inset-0 -z-10">
            <LazyImage 
              src="/53.jpg" 
              alt="Hero background" 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-black/10"></div> {/* Overlay for text readability */}
          </div>
          <div className="max-w-6xl mx-auto px-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-8">
              <Orbit className="h-4 w-4 text-white" />
              <span className="text-sm font-medium text-white">Complete Business Credit Operating System</span>
            </div>

            {/* Main Headline - Revolut Style */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[0.9] tracking-tight text-crisp">
              YOUR BUSINESS CREDIT
              <br />
              <span className="text-white">OPERATING SYSTEM</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl font-normal leading-relaxed">
              <strong className="text-white">FUTEURCREDX™</strong> brings together business credit monitoring,
              AI-powered insights, PG-free tradelines, and enterprise banking solutions all powered by the
              revolutionary <strong className="text-white">LUMIQ AI™ journey engine</strong>.
            </p>

            {/* CTA Buttons - Revolut Style */}
            <div className="flex flex-col sm:flex-row gap-4 mb-16 justify-center relative z-50">
              <div className="relative z-50">
                <QRCodeModal
                  buttonText="Download the app"
                  buttonClassName="bg-white text-black hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full relative z-50"
                  showIcon={true}
                  id="hero-download-button"
                />
              </div>
              <Link to="/credit-journey" className="inline-block">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-black hover:border-white hover:shadow-lg hover:scale-105 px-8 py-4 text-lg rounded-full bg-transparent transition-all duration-300 ease-in-out text-crisp"
                >
                  <Play className="mr-2 h-5 w-5" />
                  See LUMIQ AI™ Demo
                </Button>
              </Link>
            </div>

            {/* Dashboard Screen */}
            <div className="relative w-full max-w-5xl mx-auto min-h-[70vh] flex items-center justify-center z-10">
              <DashboardScreen className="w-full" />
            </div>
          </div>
        </section>

        <section className="min-h-screen flex items-center justify-center px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto w-full py-12 lg:py-16">
            <div className="grid lg:grid-cols-2 gap-4 lg:gap-6 items-center">
              <div>
                <div className="space-y-4">
                  <h2 className="text-[36px] lg:text-[42px] font-extrabold leading-tight tracking-tight text-black">
                    WE DON'T SELL DATA.
                    <br />
                    <span className="text-black">WE DECODE IT.</span>
                  </h2>
                  <p className="text-sm md:text-base text-gray-600 leading-normal max-w-md">
                    In a digital economy where business data is constantly harvested and monetized, FUTEURCREDX™ redefines credit intelligence through trust and sovereignty.
                  </p>
                  <p className="text-sm md:text-base text-gray-500 leading-normal max-w-md">
                    Unlike traditional bureaus that profit from selling your activity to third parties, FUTEURCREDX™ runs on a zero-knowledge, quantum-resilient architecture, powered by <strong className="text-black">FUTEURSECURE™</strong>—our internal cybersecurity arm.
                  </p>
                  <p className="text-sm md:text-base text-gray-500 leading-normal max-w-md mt-3">
                    Your EINs, business documents, and financial data are encrypted using AES-256 standards and protected through:
                  </p>
                  <ul className="text-sm md:text-base text-gray-500 leading-normal max-w-md mt-2 list-disc pl-5 space-y-1">
                    <li>Zero-knowledge vaults: No one—not even us—can view your decrypted data</li>
                    <li>Multi-factor authentication</li>
                    <li>Quantum-resistant encryption prep</li>
                    <li>End-to-end TLS 1.3 with Perfect Forward Secrecy</li>
                    <li>Behavioral anomaly detection to catch unauthorized access attempts</li>
                    <li>Security audit logs with forensic traceability</li>
                    <li>SOC 2 compliant protocols, backed by HSM-ready architecture</li>
                  </ul>
                  <p className="text-sm md:text-base text-gray-500 leading-normal max-w-md mt-3">
                    Our algorithm—<strong className="text-black">LUMIQ AI™</strong>—learns only from encrypted meta-patterns. We never monetize your data, we decode it to unlock predictive financial outcomes only you control.
                  </p>
                </div>
                <div className="mt-6">
                  <a href="https://futeurcred.futeursecure.com" target="_blank" rel="noopener noreferrer">
                    <Button className="bg-black text-white hover:bg-gray-800 px-6 py-2.5 text-sm md:text-base font-medium rounded-full hover:scale-105 transition-transform duration-300">
                      Learn more
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </a>
                </div>
              </div>
              <div className="relative">
                <div className="relative rounded-3xl overflow-hidden">
                  <img
                    src="/futeursecure.png"
                    alt="Data Protection Shield"
                    className="w-full h-auto object-cover"
                    style={{ aspectRatio: "500/600" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Business Section */}
        <BusinessSection />
        
        {/* Comparison Section */}
        <Component />
        
        {/* Final CTA - Revolut Style */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 tracking-tight px-2">
              In 2025, business credit
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              <span className="text-white">changed forever.</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8 sm:mb-10 md:mb-12 px-2">
              Not because banks decided it. But because small businesses demanded better.
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              <strong className="text-white">Welcome to your new credit era.</strong>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <QRCodeModal
                buttonText="Download the app"
                buttonClassName="bg-white text-black hover:bg-gray-100 px-6 sm:px-8 md:px-12 py-4 sm:py-5 md:py-6 text-base sm:text-lg md:text-xl font-bold rounded-full w-full sm:w-auto"
                showIcon={true}
                id="footer-download-button"
              />
              <Link to="/credit-journey" className="inline-block w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white/10 px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 text-base sm:text-lg md:text-xl rounded-full bg-transparent w-full sm:w-auto"
                >
                  <Eye className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 md:h-5 md:w-5" />
                  See Operating System Demo
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
      
      {/* Pricing Section */}
      <Pricing />
    </TooltipProvider>
  )
}


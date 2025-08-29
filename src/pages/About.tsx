import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import "../styles/animations.css"

export default function About() {
  const [imagesLoaded, setImagesLoaded] = useState(false)

  // Preload images
  useEffect(() => {
    const imageUrls = ['/about-bg.jpg', '/about-1.jpg', '/lumiq.png', '/about-3.jpg']
    const imagePromises = imageUrls.map((url) => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = resolve
        img.onerror = reject
        img.src = url
      })
    })

    Promise.all(imagePromises)
      .then(() => setImagesLoaded(true))
      .catch(() => setImagesLoaded(true)) // Still show content even if images fail
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/about-bg.jpg" 
            alt="About Background" 
            className={`w-full h-full object-cover transition-opacity duration-1000 ${
              imagesLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
          {!imagesLoaded && (
            <div className="absolute inset-0 bg-gray-100 animate-pulse" />
          )}
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="max-w-2xl">
              <p className="text-black/90 text-base sm:text-lg font-medium mb-4 tracking-wide pl-1 animate-fade-in-up opacity-0 animation-delay-200"> About Us</p>
              <h1 className="text-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6 uppercase animate-fade-in-up opacity-0 animation-delay-400">
                Welcome to FuteurCredX™<br/>the Business Credit Operating System of the Future
              </h1>
             
              <p className="text-black/80 text-lg sm:text-xl leading-relaxed max-w-xl mb-8 pl-1 animate-fade-in-up opacity-0 animation-delay-600">
                FuteurCredX™ merges razor-sharp business credit monitoring, AI-powered insights, PG-free tradelines, and enterprise-grade banking infrastructure into one seamless platform delivered via LUMIQ™, our proprietary all-seeing system.
              </p>
             
            </div>
          </div>
        </div>
      </section>

      {/* Why It Matters Section */}
      <section className="py-20 md:py-40 px-6 bg-white animate-fade-in-up opacity-0 animation-delay-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-black leading-tight">
                Why It Matters
              </h2>
              <p className="text-lg text-black/70 leading-relaxed">
                The old ways of building business credit are slow, opaque, and outdated. You shouldn't need to sacrifice control or resort to personal guarantees to grow your company's financial backbone. So, FuteurCredX flipped the script:
              </p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-black mb-2">
                    Credit Monitoring Redefined
                  </h3>
                  <p className="text-base text-black/70 leading-relaxed">
                    LUMIQ doesn't just show your credit, it understands it. By tracking trend trajectories, scoring fluctuations, limits, and utilization across multiple schemas, you're empowered with foresight, not hindsight.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-black mb-2">
                    PG-Free Tradelines
                  </h3>
                  <p className="text-base text-black/70 leading-relaxed">
                    Forget personal guarantees; our approach taps into powerful tradelines that don't tether business credibility to personal liability. AI guided, enterprise level, and credit boosting.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-black mb-2">
                    Embedded Enterprise Banking
                  </h3>
                  <p className="text-base text-black/70 leading-relaxed">
                    A digital first banking backbone that moves as fast as you do. No friction, just financial fluidity.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="relative h-full order-1 lg:order-2">
              <img 
                src="/about-1.jpg" 
                alt="Why It Matters" 
                className="w-full h-64 sm:h-80 lg:h-full object-cover rounded-2xl hover:scale-105 transition-transform duration-500 shadow-lg hover:shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Secret Sauce Section */}
      <section className="py-20 md:py-40 px-6 bg-white animate-fade-in-up opacity-0 animation-delay-1000">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Column - Image */}
            <div className="relative h-full order-2 lg:order-1">
              <img 
                src="/lumiq.png" 
                alt="LUMIQ - Our Secret Sauce" 
                className="w-full h-64 sm:h-80 lg:h-full object-cover rounded-2xl hover:scale-105 transition-transform duration-500 shadow-lg hover:shadow-xl"
              />
            </div>

            {/* Right Column - Content */}
            <div className="space-y-6 lg:space-y-8 order-1 lg:order-2">
              <h2 className="text-4xl md:text-5xl font-bold text-black leading-tight">
                Our Secret Sauce
              </h2>
              <p className="text-lg text-black/70 leading-relaxed">
                Everything you see, every digital pulse, is powered by:
              </p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-black mb-2">
                    LUMIQ™
                  </h3>
                  <p className="text-base text-black/70 leading-relaxed mb-4">
                    A sophisticated engine that transforms raw credit data into predictive intelligence:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-black/80 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-base text-black/70">Real-time, multi-model analytics</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-black/80 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-base text-black/70">Unified dashboard across credit sources</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-black/80 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-base text-black/70">Strategic credit utilization recommendations</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <p className="text-lg text-black/70 leading-relaxed">
                What once took weeks, score tracking, limit forecasts, tradeline discovery, now unfolds in seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Built for Growth-Driven Businesses Section */}
      <section className="py-20 md:py-40 px-6 bg-white animate-fade-in-up opacity-0 animation-delay-1200">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-black leading-tight">
                Built for Growth-Driven Businesses
              </h2>
              <p className="text-lg text-black/70 leading-relaxed">
                Whether you're scaling from zero or managing multiple business lines
              </p>
              
              {/* Scenario Table */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 lg:gap-6">
                  <div className="border-l-4 border-black/20 pl-4 lg:pl-6 hover:border-black/40 transition-colors duration-300">
                    <h3 className="text-base lg:text-lg font-bold text-black mb-2">
                      Startups & New Businesses
                    </h3>
                    <p className="text-sm lg:text-base text-black/70 leading-relaxed">
                      Accelerate credibility with tradelines that don't require personal guarantees.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-black/20 pl-4 lg:pl-6 hover:border-black/40 transition-colors duration-300">
                    <h3 className="text-base lg:text-lg font-bold text-black mb-2">
                      High-Growth Firms
                    </h3>
                    <p className="text-sm lg:text-base text-black/70 leading-relaxed">
                      Monitor and optimize credit usage across vendors with precision dashboards.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-black/20 pl-4 lg:pl-6 hover:border-black/40 transition-colors duration-300">
                    <h3 className="text-base lg:text-lg font-bold text-black mb-2">
                      Enterprises & Multi-Vendor Corporations
                    </h3>
                    <p className="text-sm lg:text-base text-black/70 leading-relaxed">
                      Streamline banking, tradeline performance, and predictive analytics on a single pane interface.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Key Benefits */}
              <div className="space-y-4 pt-4">
                <p className="text-lg font-semibold text-black">
                  Crafted to impress both people and algorithms:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-black/80 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-base text-black/70">Immediate clarity in financial health and forecasting</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-black/80 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-base text-black/70">No more surprises, proactive alerts and smart actions guide your next move</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-black/80 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-base text-black/70">Confidence at every level, from founders to CFOs</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-black/80 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-base text-black/70">Seamless integration, meaning financial trust isn't just built, it's automated</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="relative h-full order-1 lg:order-2">
              <img 
                src="/about-3.jpg" 
                alt="Built for Growth-Driven Businesses" 
                className="w-full h-64 sm:h-80 lg:h-full object-cover rounded-2xl hover:scale-105 transition-transform duration-500 shadow-lg hover:shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Additional Content Sections */}
    
      {/* Our Promise Section */}
      <section className="py-16 lg:py-20 px-6 bg-gray-50 animate-fade-in-up opacity-0 animation-delay-1400">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-8">
            Our Promise
          </h2>
          <p className="text-xl text-black/70 leading-relaxed mb-8">
            You deserve a partner not just a service. FuteurCredX delivers:
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-8 lg:mt-12">
            <div className="text-center p-4 hover:bg-white/50 rounded-xl transition-colors duration-300">
              <div className="text-2xl lg:text-3xl font-bold text-black mb-2">99.9%</div>
              <div className="text-sm lg:text-base text-black/60">Uptime and gold-standard data integrity</div>
            </div>
            <div className="text-center p-4 hover:bg-white/50 rounded-xl transition-colors duration-300">
              <div className="text-2xl lg:text-3xl font-bold text-black mb-2">100%</div>
              <div className="text-sm lg:text-base text-black/60">Transparency on credit scoring models</div>
            </div>
            <div className="text-center p-4 hover:bg-white/50 rounded-xl transition-colors duration-300 sm:col-span-2 lg:col-span-1">
              <div className="text-2xl lg:text-3xl font-bold text-black mb-2">Enterprise</div>
              <div className="text-sm lg:text-base text-black/60">Grade banking with personalized insight</div>
            </div>
          </div>
        </div>
      </section>

      {/* Join the New Credit Order */}
      <section className="py-16 lg:py-20 px-6 bg-white animate-fade-in-up opacity-0 animation-delay-1600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Join the New Credit Order
          </h2>
          <p className="text-xl text-black/70 mb-8">
            FuteurCredX isn't about rehashing credit. It's about redefining it. We are the nexus of FinTech, AI, and trust. Welcome to financial leverage designed like it should be.
          </p>
          <Button
            size="lg"
            className="bg-black text-white hover:bg-gray-800 px-12 py-6 text-lg font-semibold rounded-full hover:scale-105 transition-all duration-300"
            onClick={() => window.open('https://apps.apple.com/us/app/futeurcredx/id6736497241', '_blank')}
          >
            Get started today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  )
}


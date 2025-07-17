import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Orbit, 
  BarChart3, 
  PieChart, 
  Activity, 
  Building2,
  TrendingUp,
  Target,
  Network,
  Zap,
  ArrowRight
} from 'lucide-react';

const LumiqCarouselSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselItems = [
    {
      id: 1,
      title: "FSR Score Journey",
      subtitle: "Track your Financial Stability Risk in real-time",
      description: "See your FSR score update as you build trade relationships. Watch improvements flow through all three bureaus with intelligent recommendations.",
      features: ["Real-time FSR tracking", "Bureau sync status", "Improvement suggestions"],
      mockupContent: (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl h-96 flex flex-col justify-between">
          <div className="text-center">
            <div className="text-sm text-gray-300 mb-2 flex items-center justify-center gap-2">
              <img src="/Dark-Experian.png" alt="Experian" className="h-4 opacity-80" />
              Financial Stability Risk Score
            </div>
            <div className="text-6xl font-bold text-white mb-4">47</div>
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
              <TrendingUp className="h-4 w-4 text-white" />
              <span className="text-white text-sm">+12 this month</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-lg font-bold text-white">3</div>
              <div className="text-xs text-gray-400">Active Lines</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-lg font-bold text-white">95%</div>
              <div className="text-xs text-gray-400">Pay Health</div>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-lg font-bold text-white">$45K</div>
              <div className="text-xs text-gray-400">Available</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Vendor Universe",
      subtitle: "Discover vendors that actually report to bureaus",
      description: "Stop guessing which vendors help your score. Our AI maps vendor reporting patterns and scores their impact on your business credit profile.",
      features: ["Vendor credit impact scoring", "Bureau reporting verification", "Application guidance"],
      mockupContent: (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl h-96 overflow-hidden">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-4">Recommended Vendors</h3>
          </div>
          <div className="space-y-4">
            {[
              { name: "Office Depot", logo: "/business-logos/office-depot.svg", impact: "High", bureaus: ["Experian", "D&B"], color: "green" },
              { name: "Grainger", logo: "/business-logos/grainger.svg", impact: "Medium", bureaus: ["D&B", "Equifax"], color: "blue" },
              { name: "Uline", logo: "/business-logos/uline.svg", impact: "Maximum", bureaus: ["All Bureaus"], color: "purple" }
            ].map((vendor, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center h-8 w-16">
                    <img src={vendor.logo} alt={`${vendor.name} logo`} className="max-h-6 max-w-14 object-contain" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">{vendor.name}</div>
                    <div className="text-sm text-gray-400">{vendor.bureaus.join(" • ")}</div>
                  </div>
                </div>
                <Badge className="bg-white/10 text-white">{vendor.impact} Impact</Badge>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Trade Payment Health",
      subtitle: "Monitor payment patterns that affect your score",
      description: "Track payment timeliness across all your business relationships. See how each payment impacts your credit profile and get alerts before issues arise.",
      features: ["Payment timeline tracking", "Credit impact analysis", "Early warning system"],
      mockupContent: (
        <div className="bg-black/80 p-6 rounded-2xl h-96">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-2">Payment Health Dashboard</h3>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold text-white">95%</div>
              <div className="text-sm text-gray-400">On-time payments</div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-black rounded-lg border-l-2 border-white">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-8 w-16">
                  <img src="/business-logos/office-depot.svg" alt="Office Depot logo" className="max-h-6 max-w-14 object-contain" />
                </div>
                <div>
                  <div className="font-semibold text-white">Office Depot</div>
                  <div className="text-sm text-gray-400">Paid 2 days early</div>
                </div>
              </div>
              <div className="text-white font-semibold">+2 pts</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg border-l-2 border-white">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-8 w-16">
                  <img src="/business-logos/staples.svg" alt="Staples Business logo" className="max-h-6 max-w-14 object-contain" />
                </div>
                <div>
                  <div className="font-semibold text-white">Staples Business</div>
                  <div className="text-sm text-gray-400">Due in 5 days</div>
                </div>
              </div>
              <div className="text-white font-semibold">On track</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg border-l-2 border-white">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-8 w-16">
                  <img src="/business-logos/grainger.svg" alt="Grainger logo" className="max-h-6 max-w-14 object-contain" />
                </div>
                <div>
                  <div className="font-semibold text-white">Grainger</div>
                  <div className="text-sm text-gray-400">Due tomorrow</div>
                </div>
              </div>
              <div className="text-white font-semibold">Reminder</div>
            </div>
          </div>
        </div>
      )
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [carouselItems.length]);

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Left Content - Revolut style */}
          <div className="space-y-6 sm:space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 bg-purple-500/10 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6 border border-purple-500/20">
                <Orbit className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400 animate-spin" />
                <span className="text-xs sm:text-sm font-medium text-white">LUMIQ™ JOURNEY ENGINE</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-4 sm:mb-6 leading-tight tracking-tight">
                ANALYZE YOUR BUSINESS
                <br className="hidden sm:block" />
                <span className="sm:hidden"> </span>
                CREDIT LIKE NEVER BEFORE
              </h2>
              
              <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed">
                Your complete business credit ecosystem in one intelligent dashboard. 
                Track <span className="inline-flex items-center gap-1"><img src="/Dark-Experian.png" alt="Experian" className="h-4 opacity-80" /> FSR scores</span>, discover reporting vendors, and monitor trade payment health with AI-powered insights.
              </p>
            </div>

            {/* Current slide content */}
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white mb-1 sm:mb-2 tracking-tight">
                  {carouselItems[currentSlide].title.toUpperCase()}
                </h3>
                <p className="text-base sm:text-lg text-gray-300 mb-2 sm:mb-4">
                  {carouselItems[currentSlide].subtitle}
                </p>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  {carouselItems[currentSlide].description}
                </p>
              </div>

              <div className="space-y-2 sm:space-y-3">
                {carouselItems[currentSlide].features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 sm:gap-3">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                    <span className="text-sm sm:text-base text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

            </div>

            {/* Slide indicators */}
            <div className="flex gap-2 sm:gap-3">
              {carouselItems.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-8 sm:w-12 h-1 rounded-full transition-all duration-300 ${
                    idx === currentSlide ? 'bg-white' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right Carousel - Revolut style */}
          <div className="relative mt-8 lg:mt-0 hidden md:block">   {/* Hide on mobile, show from medium screens up */}
            <div className="bg-black/20 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl md:rounded-3xl border border-white/20">
              <Carousel className="w-full max-w-lg sm:max-w-xl md:max-w-2xl mx-auto">
                <CarouselContent>
                  {carouselItems.map((item, index) => (
                    <CarouselItem key={item.id}>
                      <div className="p-1">
                        <Card className="border-0 bg-transparent">
                          <CardContent className="p-0">
                            {/* Apply responsive height to mockupContent divs */}
                            <div className="h-[280px] sm:h-[320px] md:h-[360px] lg:h-[400px] xl:h-[420px]">
                              {item.mockupContent}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                
                <div className="flex justify-center gap-3 sm:gap-4 mt-4 sm:mt-6">
                  <CarouselPrevious className="static w-8 h-8 sm:w-10 sm:h-10 bg-gray-800/80 border-gray-600 hover:bg-gray-700" />
                  <CarouselNext className="static w-8 h-8 sm:w-10 sm:h-10 bg-gray-800/80 border-gray-600 hover:bg-gray-700" />
                </div>
              </Carousel>
            </div>

            {/* Floating elements for visual interest */}
            <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 bg-white/20 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 bg-white/20 rounded-full animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LumiqCarouselSection;


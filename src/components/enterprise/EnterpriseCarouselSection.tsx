import { useState, useEffect } from 'react';

// In Vite, use relative URLs in the img tags directly
// We'll embed the image paths directly in the component
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
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Activity, 
  Building2,
  Target,
  Network,
  Zap,
  ArrowRight,
  Bell,
  ChevronDown
} from 'lucide-react';

const EnterpriseCarouselSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const [autoplayPaused, setAutoplayPaused] = useState(false);

  // Direct image imports with imported assets
  const carouselItems = [
    {
      id: 1,
      title: "JPMorgan Chase",
      subtitle: "Credit Journey® Success",
      description: "Chase drives 25% increase in card applications with their Credit Journey tool, generating $340M in additional revenue within 18 months.",
      features: ["+25% card applications", "$340M additional revenue", "Within 18 months"],
      logo: "/logos/banks/chase.png",
      screenImage: "/mobile/chase.png"
    },
    {
      id: 2,
      title: "Dun & Bradstreet",
      subtitle: "CreditSignal® Platform",
      description: "Dun & Bradstreet's CreditSignal platform increased business client acquisition by 35% and improved retention rates through business credit monitoring.",
      features: ["+35% client acquisition", "22% retention improvement", "15-month deployment"],
      logo: "/logos/banks/dnb.png",
      screenImage: "/mobile/dun.png"
    },
    {
      id: 3,
      title: "Wells Fargo",
      subtitle: "Credit Close-Up® Results",
      description: "Wells Fargo increased loan origination by 30% with their Credit Close-Up tool, driving $220M in lending growth over a 24-month period.",
      features: ["+30% loan origination", "$220M lending growth", "24-month period"],
      logo: "/logos/banks/wellsfargo.png",
      screenImage: "/mobile/wells.png"
    }
  ];

  // Auto-advance slides every 3 seconds
  useEffect(() => {
    if (autoplayPaused) return;
    
    const autoplayTimer = setInterval(() => {
      setCurrentSlide(current => (current === carouselItems.length - 1 ? 0 : current + 1));
    }, 3000);
    
    return () => {
      clearInterval(autoplayTimer);
    };
  }, [autoplayPaused, carouselItems.length]);
  
  // Helper functions for navigation
  const handlePrevious = () => {
    setAutoplayPaused(true);
    const newIndex = currentSlide === 0 ? carouselItems.length - 1 : currentSlide - 1;
    setCurrentSlide(newIndex);
    
    // Resume autoplay after 10 seconds of inactivity
    setTimeout(() => setAutoplayPaused(false), 10000);
  };
  
  const handleNext = () => {
    setAutoplayPaused(true);
    const newIndex = currentSlide === carouselItems.length - 1 ? 0 : currentSlide + 1;
    setCurrentSlide(newIndex);
    
    // Resume autoplay after 10 seconds of inactivity
    setTimeout(() => setAutoplayPaused(false), 10000);
  };

  return (
    <section className="py-20 sm:py-24 md:py-32 bg-black">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 sm:mb-16 md:mb-20 max-w-3xl mx-auto text-center">
          <Badge variant="outline" className="mb-4 border-white/10 bg-white/5 text-white hover:bg-white/10">
            <Zap className="mr-1 h-3 w-3" /> Success Metrics
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
            YOU HAVE DONE THIS BEFORE
          </h2>
          <p className="text-lg text-gray-300">
            The biggest names in banking have already proven that credit visibility tools drive massive ROI. 
            Their success stories validate the LUMIQ approach to business credit visibility.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between max-w-6xl mx-auto">
          {/* Left content - Info panel */}
          <div className="mb-12 lg:mb-0 w-full lg:w-2/5 lg:pr-8">
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-8 border border-white/10">
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
              <div className="flex gap-2 sm:gap-3 mt-8">
                {carouselItems.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setAutoplayPaused(true);
                      setCurrentSlide(idx);
                      
                      // Resume autoplay after 10 seconds of inactivity
                      setTimeout(() => setAutoplayPaused(false), 10000);
                    }}
                    className={`w-8 sm:w-12 h-1 rounded-full transition-all duration-300 ${
                      idx === currentSlide ? 'bg-white' : 'bg-gray-600'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right content - Phone Carousel */}
          <div className="w-full lg:w-3/5 relative">   
            {/* Show the current slide's image directly */}
            <div className="flex justify-center items-center">
              {/* Special technique for images that ensures they load on subdomains */}
              {currentSlide === 0 ? (
                <img 
                  src="/mobile/chase.png" 
                  alt="JPMorgan Chase credit monitoring dashboard" 
                  className="w-full max-w-[400px]"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = window.location.protocol + "//credbyfuteur.com/mobile/chase.png";
                  }}
                />
              ) : currentSlide === 1 ? (
                <img 
                  src="/mobile/dun.png" 
                  alt="Dun & Bradstreet credit monitoring dashboard" 
                  className="w-full max-w-[400px]"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = window.location.protocol + "//credbyfuteur.com/mobile/dun.png";
                  }}
                />
              ) : (
                <img 
                  src="/mobile/wells.png" 
                  alt="Wells Fargo credit monitoring dashboard" 
                  className="w-full max-w-[400px]"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = window.location.protocol + "//credbyfuteur.com/mobile/wells.png";
                  }}
                />
              )}
            </div>
              
            <div className="flex justify-center gap-3 sm:gap-4 mt-4 sm:mt-6">
              <button 
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800/80 border border-gray-600 hover:bg-gray-700" 
                onClick={handlePrevious}
                aria-label="Previous slide"
              >
                <ArrowRight className="h-5 w-5 text-white transform rotate-180" />
              </button>
              <button 
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800/80 border border-gray-600 hover:bg-gray-700" 
                onClick={handleNext}
                aria-label="Next slide"
              >
                <ArrowRight className="h-5 w-5 text-white" />
              </button>
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

export default EnterpriseCarouselSection;


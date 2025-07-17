
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Orbit, Network, Unlock } from 'lucide-react';

const BusinessFeatures = () => {
  const features = [
    {
      name: "LUMIQ™ Journey Engine",
      tagline: "Like Chase Journey, But for Business",
      icon: Orbit,
      description: "Interactive FSR scoring with Experian integration, trade payment health tracking, and industry payment insights - just like your personal Credit Journey but for business credit",
      benefit: "See your complete business credit ecosystem in real-time",
      dopamineHit: "Your business credit universe visualized",
      comparison: "Chase Credit Journey for business owners",
      timeToValue: "Instant",
      memberValue: "$200/mo value - Included"
    },
    {
      name: "Vendor Universe", 
      tagline: "Discover + Score Vendors",
      icon: Network,
      description: "Stop guessing which vendors report. We show you exactly who reports to which bureaus and score their impact on your Experian FSR and Intelliscore",
      benefit: "Build with vendors that actually matter",
      dopamineHit: "Finally see the hidden credit builders",
      comparison: "No one else shows vendor scoring",
      timeToValue: "Immediate discovery",
      memberValue: "$150/mo value - Included"
    },
    {
      name: "PG-Free Builder",
      tagline: "No Personal Guarantees",
      icon: Unlock,
      description: "Access tradelines backed by your EIN, not your SSN. Scale without personal liability through AI creditworthiness analysis",
      benefit: "Protect personal assets while building",
      dopamineHit: "True business credit freedom",
      comparison: "Exclusive FUTEUR AI technology",
      timeToValue: "30-60 days",
      memberValue: "$300/mo value - Included"
    }
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
            YOUR COMPLETE
            <br />
            CREDIT OPERATING SYSTEM
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto">
            Not fragments. Not toys. Your complete business credit ecosystem.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-8 hover:scale-105 transition-all duration-500 border border-white/10 bg-black/80 hover:bg-black/60">
              <CardContent className="p-0">
                <div className="flex items-center justify-center mb-6">
                  <div className="p-4 bg-white/10 rounded-xl">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                
                <div className="text-center mb-6">
                  <h3 className="font-bold text-2xl text-white mb-2">{feature.name}</h3>
                  <Badge className="bg-white/10 text-white border-0">{feature.tagline}</Badge>
                </div>
                
                <p className="text-gray-300 mb-6 leading-relaxed text-center h-24">{feature.description}</p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2 justify-center">
                    <CheckCircle className="h-5 w-5 text-white" />
                    <span className="text-sm text-gray-300">{feature.benefit}</span>
                  </div>
                  <div className="p-4 bg-white/10 rounded-lg text-center">
                    <div className="text-sm font-semibold text-white">{feature.dopamineHit}</div>
                  </div>
                  <div className="text-xs text-gray-400 text-center">
                    <strong>Value:</strong> {feature.memberValue}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BusinessFeatures;

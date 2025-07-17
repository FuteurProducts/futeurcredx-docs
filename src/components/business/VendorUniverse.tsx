
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Network, CheckCircle, Zap, ArrowRight } from 'lucide-react';

// Vendor logo information
interface VendorInfo {
  name: string;
  reports: string[];
  impact: string;
  sync: boolean;
  logo: string;
  height?: number;
  width?: number;
}

const VendorUniverse = () => {
  return (
    <section className="py-20 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Network className="h-16 w-16 mx-auto text-white mb-8" />
          <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
            DISCOVER VENDORS THAT
            <br />
            ACTUALLY REPORT
          </h2>
          <p className="text-xl text-gray-300">
            Stop building with vendors that don't move your score. See exactly who reports where.
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { name: "Office Depot", reports: ["Experian", "D&B"], impact: "High", sync: true, logo: "/business-logos/office-depot.svg", width: 180, height: 50 },
            { name: "Staples Business", reports: ["Experian", "Equifax"], impact: "High", sync: true, logo: "/business-logos/staples.svg", width: 180, height: 50 },
            { name: "Grainger", reports: ["D&B", "Experian"], impact: "Medium", sync: true, logo: "/business-logos/grainger.svg", width: 150, height: 40 },
            { name: "Uline", reports: ["All Bureaus"], impact: "Maximum", sync: true, logo: "/business-logos/uline.svg", width: 140, height: 35 }
          ].map((vendor: VendorInfo, index) => (
            <Card key={index} className="p-6 bg-black/80 border border-white/10 hover:border-white/30 transition-all duration-300">
              <CardContent className="p-0">
                {/* Logo */}
                <div className="flex justify-center mb-4 h-16 items-center  p-2 rounded">
                  <img 
                    src={vendor.logo} 
                    alt={`${vendor.name} logo`}
                    width={vendor.width || 140}
                    height={vendor.height || 35}
                    className="h-auto max-h-12 w-auto max-w-[90%] object-contain"
                    style={{
                      transform: vendor.name === "Office Depot" ? "scale(1.2)" : vendor.name === "Staples Business" ? "scale(1.3)" : "none"
                    }}
                  />
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-white" />
                    <span className="text-xs text-gray-300">Reports to: {vendor.reports.join(" | ")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-white" />
                    <span className="text-xs text-gray-300">Syncs with LUMIQ</span>
                  </div>
                </div>
                <Badge className="text-xs bg-white/10 text-white">
                  {vendor.impact} Score Impact
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/lumiq-build">
            <Button className="bg-black text-white hover:bg-white hover:text-black px-8 py-4 border border-white/20 hover:border-white transition-all font-bold">
              <Network className="mr-2 h-5 w-5" />
              EXPLORE LUMIQ BUILD
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default VendorUniverse;



import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeroBackground } from "@/components/HeroBackground";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { useState } from "react";
import { 
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Zap,
  Shield,
  Target,
  Building2,
  Star,
  Gauge,
  Bell,
  LineChart,
  Users,
  Eye,
  Clock,
  DollarSign,
  Award,
  Heart,
  ThumbsUp,
  Crown,
  Lock,
  Gift,
  Home,
  Play,
  Orbit,
  Cpu,
  Rocket,
  Layers,
  Database,
  Network,
  Unlock,
  BarChart3,
  PieChart,
  Activity,
  Smartphone,
  Monitor,
  Globe,
  Settings,
  Brain,
  Sparkles,
  Search,
  Filter,
  ShoppingCart,
  Truck,
  CreditCard,
  Phone,
  Wifi,
  Fuel,
  Building,
  Briefcase,
  Package
} from 'lucide-react';

const LumiqBuild = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedCreditGoal, setSelectedCreditGoal] = useState("");

  const vendorCategories = [
    {
      id: "office-supplies",
      name: "Office & Business Supplies",
      icon: Briefcase,
      description: "Essential business supplies with NET 30 terms",
      vendors: ["Staples Business", "Office Depot", "Quill", "Amazon Business"],
      creditImpact: "High reporting frequency",
      useCase: "Daily operations & recurring purchases"
    },
    {
      id: "telecom-utilities",
      name: "Telecom & Utilities",
      icon: Phone,
      description: "Communication and utility services",
      vendors: ["Verizon Business", "AT&T Business", "Comcast Business"],
      creditImpact: "Excellent payment history building",
      useCase: "Essential services with monthly reporting"
    },
    {
      id: "fuel-fleet",
      name: "Fuel & Fleet Management",
      icon: Fuel,
      description: "Gas cards and fleet management solutions",
      vendors: ["Shell Business", "BP Business", "Chevron Business"],
      creditImpact: "High volume transaction reporting",
      useCase: "Transportation-based businesses"
    },
    {
      id: "trade-suppliers",
      name: "Trade & Manufacturing",
      icon: Package,
      description: "Industry-specific trade suppliers",
      vendors: ["Grainger", "Fastenal", "MSC Industrial", "Uline"],
      creditImpact: "Large purchase volume reporting",
      useCase: "Manufacturing & construction businesses"
    },
    {
      id: "technology",
      name: "Technology & Software",
      icon: Cpu,
      description: "Business technology and software solutions",
      vendors: ["Dell Business", "CDW", "Microsoft Business", "Adobe Business"],
      creditImpact: "High-value transaction reporting",
      useCase: "Tech-forward businesses"
    },
    {
      id: "shipping-logistics",
      name: "Shipping & Logistics",
      icon: Truck,
      description: "Shipping and delivery services",
      vendors: ["FedEx Business", "UPS Business", "DHL Business"],
      creditImpact: "Consistent monthly reporting",
      useCase: "E-commerce & distribution businesses"
    }
  ];

  const industries = [
    "Professional Services", "Retail & E-commerce", "Manufacturing", 
    "Construction", "Technology", "Healthcare", "Restaurant & Food Service",
    "Transportation & Logistics", "Real Estate", "Consulting"
  ];

  const creditGoals = [
    "Build Initial Credit Profile",
    "Improve Existing Credit Score",
    "Increase Credit Limits",
    "Diversify Credit Mix",
    "Prepare for Major Financing"
  ];

  const features = [
    {
      icon: Network,
      title: "Smart Vendor Discovery",
      description: "AI-powered vendor matching based on your industry, location, and credit profile. Find vendors that actually report to bureaus.",
      benefit: "Build faster with verified reporting vendors"
    },
    {
      icon: TrendingUp,
      title: "Credit Impact Scoring",
      description: "Every vendor gets a credit impact score showing exactly how they'll affect your FSR and Intelliscore before you apply.",
      benefit: "Never waste time on non-reporting vendors again"
    },
    {
      icon: Rocket,
      title: "Automated Application Flow",
      description: "One-click applications with pre-filled business information and optimized approval likelihood scoring.",
      benefit: "10x faster vendor onboarding process"
    },
    {
      icon: Shield,
      title: "PG-Free Guarantee",
      description: "All vendor relationships built through LUMIQ Build are underwritten via your EIN, protecting your personal credit.",
      benefit: "Scale without personal liability"
    },
    {
      icon: Activity,
      title: "Real-Time Sync",
      description: "Vendor payments and credit updates sync directly with your LUMIQ journey engine for complete visibility.",
      benefit: "Never miss a credit-building opportunity"
    },
    {
      icon: Crown,
      title: "Priority Access",
      description: "Exclusive access to premium vendor relationships typically reserved for established businesses.",
      benefit: "Unlock enterprise-level credit building"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Profile Analysis",
      description: "LUMIQ analyzes your business profile, industry, and current credit standing to create your personalized vendor strategy.",
      visual: (
        <div className="bg-gradient-to-br from-blue-900/50 to-black-900/50 p-8 rounded-2xl h-64 flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="h-16 w-16 text-white-400 mx-auto mb-4" />
            <div className="text-2xl font-bold text-white mb-2">Business Analysis</div>
            <div className="text-sm text-gray-300">AI-powered profiling</div>
          </div>
        </div>
      )
    },
    {
      number: "02",
      title: "Vendor Matching",
      description: "Our AI matches you with vendors that report to your target bureaus and have high approval rates for businesses like yours.",
      visual: (
        <div className="bg-gradient-to-br from-blue-900/50 to-black-900/50 p-8 rounded-2xl h-64 flex items-center justify-center">
          <div className="text-center">
            <Network className="h-16 w-16 text-white-400 mx-auto mb-4" />
            <div className="text-2xl font-bold text-white mb-2">Smart Matching</div>
            <div className="text-sm text-gray-300">97% approval rate</div>
          </div>
        </div>
      )
    },
    {
      number: "03",
      title: "Automated Building",
      description: "LUMIQ handles applications, setup, and ongoing relationship management while you focus on growing your business.",
      visual: (
        <div className="bg-gradient-to-br from-blue-900/50 to-black-900/50 p-8 rounded-2xl h-64 flex items-center justify-center">
          <div className="text-center">
            <Rocket className="h-16 w-16 text-white-400 mx-auto mb-4" />
            <div className="text-2xl font-bold text-white mb-2">Auto-Build</div>
            <div className="text-sm text-gray-300">Hands-free growth</div>
          </div>
        </div>
      )
    }
  ];

  const results = [
    {
      metric: "127%",
      label: "Average FSR Increase",
      timeframe: "Within 90 days",
      icon: TrendingUp
    },
    {
      metric: "15+",
      label: "New Vendor Relationships",
      timeframe: "Per quarter",
      icon: Network
    },
    {
      metric: "94%",
      label: "Approval Success Rate",
      timeframe: "First attempt",
      icon: CheckCircle
    },
    {
      metric: "$2.3M",
      label: "Average Credit Access",
      timeframe: "Within 12 months",
      icon: DollarSign
    }
  ];

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const selectedCategoryData = vendorCategories.find(cat => cat.id === selectedCategory);

  return (
    <div className="min-h-screen  text-white">
      {/* Navigation is now provided by the RevolutHeader component */}

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-6 relative overflow-hidden">
        {/* Background image with overlay - using HeroBackground component for better loading */}
        <HeroBackground imagePath="/9.jpg" overlayOpacity={5} showNoise={true} />
        <div className="max-w-7xl mx-auto relative text-center">
         
          <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
            <span className="text-white">
              LUMIQ Build
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-5xl mx-auto leading-relaxed">
            The world's first <strong className="text-white">AI-powered business credit builder</strong> that automatically discovers, 
            scores, and builds relationships with vendors that actually report to credit bureaus.
          </p>

          <div className="mb-16">
            <Badge className="bg-black/30 backdrop-blur-sm text-white border border-white/10 hover:border-white/30 px-8 py-5 text-lg mb-60">
              <Crown className="mr-2 h-6 w-6" />
              Exclusively for FUTEURCRED Members
            </Badge>
          </div>

          {/* Hero visual placeholder */}
          <div className="relative mx-auto max-w-4xl ">
            <div className="bg-black/30 backdrop-blur-sm rounded-3xl p-12 border border-white/10">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <Monitor className="h-16 w-16 mx-auto text-white mb-4" />
                  <div className="text-xl font-bold text-white mb-2">Dashboard</div>
                  <div className="text-sm text-gray-300">Unified credit builder</div>
                </div>
                <div className="text-center">
                  <Search className="h-16 w-16 mx-auto text-white mb-4" />
                  <div className="text-xl font-bold text-white mb-2">Discovery</div>
                  <div className="text-sm text-gray-300">AI-powered matching</div>
                </div>
                <div className="text-center">
                  <Gauge className="h-16 w-16 mx-auto text-white mb-4" />
                  <div className="text-xl font-bold text-white mb-2">Growth</div>
                  <div className="text-sm text-gray-300">Automatic reporting</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI-Powered Vendor Discovery Teaser */}
      <section className="py-20 px-6 bg-black border-y border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-sm px-6 py-3 rounded-full mb-6 border border-white/10">
              <Brain className="h-5 w-5 text-white" />
              <span className="text-white font-semibold">AI-Powered Intelligence</span>
            </div>
            <h2 className="text-5xl font-bold text-white mb-6">
              Smart Vendor <span className="text-white">Discovery</span>
            </h2>
            <p className="text-xl text-white/70 max-w-4xl mx-auto mb-12">
              Get a glimpse of LUMIQ's intelligent vendor matching system. See how our AI categorizes and matches 
              credit-building vendors based on your unique business profile.
            </p>
          </div>

          {/* Interactive Vendor Discovery Demo */}
          <div className="max-w-6xl mx-auto">
            <Card className="bg-black/30 border-white/10 backdrop-blur-sm">
              <CardContent className="p-12">
                {/* Input Selectors */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">Your Industry</label>
                    <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                      <SelectTrigger className="bg-black/30 border-white/10 text-white">
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/80 border-white/10">
                        {industries.map((industry) => (
                          <SelectItem key={industry} value={industry} className="text-white hover:bg-black/40">
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">Credit Goal</label>
                    <Select value={selectedCreditGoal} onValueChange={setSelectedCreditGoal}>
                      <SelectTrigger className="bg-black/30 border-white/10 text-white">
                        <SelectValue placeholder="What's your goal?" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/80 border-white/10">
                        {creditGoals.map((goal) => (
                          <SelectItem key={goal} value={goal} className="text-white hover:bg-black/40">
                            {goal}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">Vendor Category</label>
                    <Select value={selectedCategory} onValueChange={handleCategorySelect}>
                      <SelectTrigger className="bg-black/30 border-white/10 text-white">
                        <SelectValue placeholder="Explore categories" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/80 border-white/10">
                        {vendorCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id} className="text-white hover:bg-black/40">
                            <div className="flex items-center gap-2">
                              <category.icon className="h-4 w-4" />
                              {category.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* AI Analysis Results */}
                {selectedCategory && selectedCategoryData && (
                  <div className="border border-white/10 rounded-2xl p-8 bg-black/30 backdrop-blur-sm mb-8">
                    <div className="flex items-start gap-6">
                      <div className="p-4 bg-black/40 backdrop-blur-sm rounded-xl">
                        <selectedCategoryData.icon className="h-12 w-12 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-3">{selectedCategoryData.name}</h3>
                        <p className="text-white/70 mb-6">{selectedCategoryData.description}</p>
                        
                        <div className="grid md:grid-cols-3 gap-6">
                          <div>
                            <div className="text-sm font-semibold text-white mb-2">Sample Vendors</div>
                            <div className="space-y-1">
                              {selectedCategoryData.vendors.slice(0, 3).map((vendor, idx) => (
                                <div key={idx} className="text-white text-sm flex items-center gap-2">
                                  <CheckCircle className="h-3 w-3 text-white" />
                                  {vendor}
                                </div>
                              ))}
                              <div className="text-white/70 text-sm">+{selectedCategoryData.vendors.length - 3} more</div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-sm font-semibold text-white mb-2">Credit Impact</div>
                            <div className="text-white text-sm">{selectedCategoryData.creditImpact}</div>
                          </div>
                          
                          <div>
                            <div className="text-sm font-semibold text-white mb-2">Best Use Case</div>
                            <div className="text-white text-sm">{selectedCategoryData.useCase}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Locked Features Tease */}
                    <div className="mt-8 p-6 bg-black/30 rounded-xl border border-purple-500/20 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10"></div>
                      <div className="relative flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Lock className="h-5 w-5 text-white" />
                            <span className="text-white font-semibold">LUMIQ Intelligence Preview</span>
                          </div>
                          <p className="text-white/70 text-sm">
                            See detailed approval odds, credit impact scores, application requirements, and 
                            personalized recommendations for each vendor.
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-2xl font-bold text-white">94%</div>
                            <div className="text-xs text-gray-300">Approval Rate</div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-white">+12</div>
                            <div className="text-xs text-gray-300">FSR Points</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* CTA */}
                <div className="text-center">
                  {!selectedCategory ? (
                    <div className="text-white/70">
                      <Sparkles className="h-8 w-8 mx-auto mb-3 animate-pulse text-white" />
                      Select options above to see LUMIQ's AI in action
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-white flex items-center justify-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        <span>This is just a preview of LUMIQ's intelligence</span>
                      </div>
                      <p className="text-white/70 text-sm">
                        The full LUMIQ Build experience includes real-time analysis, automated applications, 
                        and ongoing relationship management for 500+ verified vendors.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">
              How <span className="text-white">LUMIQ Build</span> Works
            </h2>
            <p className="text-xl text-white/70 max-w-4xl mx-auto">
              Three simple steps to transform your business credit profile with AI-powered vendor relationships.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-black/40 border border-white/10 backdrop-blur-sm rounded-full text-2xl font-bold text-white mb-6">
                    {step.number}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                  <p className="text-white/70 leading-relaxed">{step.description}</p>
                </div>
                {step.visual}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 -right-6 w-12 h-1 bg-white/20"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-[#0E0E10]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">
              Built for <span className="text-white">Modern Businesses</span>
            </h2>
            <p className="text-xl text-white/70 max-w-4xl mx-auto">
              Every feature designed to maximize your credit building potential while minimizing your time investment.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-8 hover:scale-105 transition-all duration-500 border border-white/10 bg-black/30 backdrop-blur-sm">
                <CardContent className="p-0">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 bg-black/40 border border-white/10 backdrop-blur-sm rounded-xl">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-bold text-xl text-white">{feature.title}</h3>
                  </div>
                  
                  <p className="text-white leading-relaxed">{feature.description}</p>
                  
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-white" />
                    <span className="text-sm text-white/70">{feature.benefit}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-20 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">
              Proven <span className="text-white">Results</span>
            </h2>
            <p className="text-xl text-gray-300">
              Real metrics from FUTEURCRED members using LUMIQ Build beta.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {results.map((result, index) => (
              <Card key={index} className="p-8 text-center border border-white/10 bg-black/30 backdrop-blur-sm hover:scale-105 transition-all duration-300">
                <CardContent className="p-0">
                  <result.icon className="h-12 w-12 mx-auto text-white mb-4" />
                  <div className="text-4xl font-bold text-white mb-2">{result.metric}</div>
                  <div className="text-lg font-semibold text-white/70 mb-2">{result.label}</div>
                  <div className="text-sm text-white/50">{result.timeframe}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon CTA */}
      <section className="py-20 px-6 bg-black">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-12">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
              Ready to Build<br/>
              <span className="text-white">Different?</span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8">
              LUMIQ Build is launching exclusively for FUTEURCRED members.<br/>
              <strong className="text-white">Join the waitlist to get early access.</strong>
            </p>
          </div>
          
          <div className="bg-black/30 backdrop-blur rounded-2xl p-12 mb-12 border border-white/10">
            <div className="mb-8">
              <Rocket className="h-20 w-20 mx-auto text-white mb-6" />
              <h3 className="text-3xl font-bold text-white mb-4">Early Access Benefits</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-black/40 border border-white/10 backdrop-blur-sm p-6 rounded-xl">
                <Crown className="h-8 w-8 text-white mx-auto mb-3" />
                <div className="font-semibold text-white">Priority Access</div>
                <div className="text-sm text-white/70 mt-1">First to use LUMIQ Build</div>
              </div>
              <div className="bg-black/40 border border-white/10 backdrop-blur-sm p-6 rounded-xl">
                <Gift className="h-8 w-8 text-white mx-auto mb-3" />
                <div className="font-semibold text-white">Exclusive Pricing</div>
                <div className="text-sm text-white/70 mt-1">Special launch rates</div>
              </div>
              <div className="bg-black/40 border border-white/10 backdrop-blur-sm p-6 rounded-xl">
                <Settings className="h-8 w-8 text-white mx-auto mb-3" />
                <div className="font-semibold text-white">Beta Features</div>
                <div className="text-sm text-white/70 mt-1">Latest AI capabilities</div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a href="https://www.futeur.ai/contact" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 border border-white/10 hover:border-white/20 px-12 py-6 text-xl font-bold transition-all">
                <Gauge className="mr-2 h-6 w-6" />
                Join LUMIQ Build Waitlist
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </a>
            <a href="https://apps.apple.com/us/app/futeurcred/id6736497241" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border border-white/10 text-white hover:bg-black/40 px-8 py-6 text-lg transition-all">
                <Eye className="mr-2 h-5 w-5" />
                Explore FUTEURCRED App
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
     
    </div>
  );
};

export default LumiqBuild;


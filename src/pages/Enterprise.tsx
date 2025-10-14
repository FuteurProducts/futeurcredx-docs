import { useState, useEffect } from 'react';
import { HeroBackground } from "@/components/HeroBackground";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { getCrossDomainUrl } from "../utils/domainUtils";
import EnterpriseCarouselSection from "@/components/enterprise/EnterpriseCarouselSection";
import { 
  TrendingUp, 
  Code, 
  Shield, 
  BarChart3,
  Users,
  CreditCard,
  Building2,
  Zap,
  CheckCircle,
  Eye,
  Bell,
  Target,
  ArrowRight,
  Globe,
  Lock,
  Smartphone,
  Award,
  Lightbulb,
  PieChart,
  AlertTriangle,
  Clock,
  DollarSign,
  Briefcase,
  Star,
  Home,
  Orbit,
  Rocket,
  Network,
  Cpu,
  Unlock,
  Gauge
} from 'lucide-react';

const Enterprise = () => {
  const [animatedNumbers, setAnimatedNumbers] = useState({
    marketSize: 0,
    lostRevenue: 0,
    banks: 0
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedNumbers({
        marketSize: 2.3,
        lostRevenue: 47,
        banks: 15
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const bankSuccess = [
    { 
      bank: "JPMorgan Chase", 
      tool: "Credit Journey®", 
      logo: "/logos/banks/chase.png",
      result: "+25% card applications",
      revenue: "$340M additional revenue",
      timeframe: "Within 18 months"
    },
    { 
      bank: "Capital One", 
      tool: "CreditWise®", 
      logo: "/logos/banks/capitalone.png",
      result: "2x digital engagement",
      revenue: "$180M cost savings",
      timeframe: "First year alone"
    },
    { 
      bank: "Wells Fargo", 
      tool: "Credit Close-Up®", 
      logo: "/logos/banks/wellsfargo.png",
      result: "+30% loan origination",
      revenue: "$220M lending growth",
      timeframe: "24-month period"
    }
  ];

  const competitorThreats = [
    "Lendio serves 2M+ SMBs with credit intelligence",
    "Kabbage (now Amex) captured $7B+ in SMB lending",
    "Square Capital uses data advantage for $6B+ loans",
    "Fintechs growing SMB market share 23% annually"
  ];

  const lumiqAdvantages = [
    {
      name: "LUMIQ AI Intelligence™",
      description: "Multi-bureau business credit scoring with 340+ data points",
      icon: TrendingUp,
      bankBenefit: "5x more accurate than traditional scoring",
      implementation: "2-week API integration",
      compliance: "FCRA compliant, audit-ready"
    },
    {
      name: "LUMIQ AI Engage™", 
      description: "SMB credit engagement platform with personalized insights",
      icon: Users,
      bankBenefit: "3.2x increase in digital banking usage",
      implementation: "White-label ready",
      compliance: "SOC 2 Type II certified"
    },
    {
      name: "LUMIQ AI Convert™",
      description: "AI-powered pre-qualification engine for business products",
      icon: Target,
      bankBenefit: "+40% loan application completion",
      implementation: "Seamless core integration",
      compliance: "Transparent AI, explainable decisions"
    },
    {
      name: "LUMIQ AI Retain™",
      description: "Proactive SMB relationship management through credit monitoring",
      icon: Bell,
      bankBenefit: "65% reduction in SMB churn",
      implementation: "Real-time alerts & workflows",
      compliance: "Privacy-first architecture"
    }
  ];

  const roiProjections = [
    {
      metric: "Additional SMB Lending Volume",
      year1: "$50M",
      year3: "$180M",
      basis: "Based on Wells Fargo 30% increase"
    },
    {
      metric: "Digital Engagement Revenue",
      year1: "$12M", 
      year3: "$45M",
      basis: "From increased product adoption"
    },
    {
      metric: "Reduced Acquisition Costs",
      year1: "$8M",
      year3: "$28M", 
      basis: "Higher organic engagement"
    },
    {
      metric: "Churn Prevention Value",
      year1: "$15M",
      year3: "$55M",
      basis: "SMB relationship retention"
    }
  ];

  const implementationSteps = [
    { name: "Discovery", description: "Technical requirements gathering and API planning", duration: "1-2 weeks" },
    { name: "Integration", description: "API connection and data flow setup", duration: "2-3 weeks" },
    { name: "Testing", description: "QA and security validation", duration: "1 week" },
    { name: "Deployment", description: "Production launch with monitoring", duration: "1 week" }
  ];

  const trustCredentials = [
    { icon: Shield, text: "SOC 2 Type II Certified", detail: "Annual audits by Big 4" },
    { icon: Lock, text: "Bank-Grade Encryption", detail: "AES-256, zero-trust architecture" },
    { icon: Award, text: "FCRA Compliant", detail: "Transparent, auditable methodology" },
    { icon: Globe, text: "Multi-Bureau Coverage", detail: "Experian, Equifax, D&B integrated" },
    { icon: Clock, text: "99.9% Uptime SLA", detail: "Enterprise-grade reliability" },
    { icon: CheckCircle, text: "Explainable AI", detail: "Every decision fully auditable" }
  ];

  return (
    <div className="min-h-screen bg-[#0E0E10] text-white">
      {/* Navigation is now provided by the RevolutHeader component */}

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden -mt-20 pt-24 px-6 bg-black">
        {/* Background image with overlay - using HeroBackground component for better loading */}
        <HeroBackground imagePath="/01.jpg" overlayOpacity={30} showNoise={true} />
        
        <div className="max-w-7xl mx-auto relative text-center">
          <div className="inline-flex items-center gap-3 bg-black/30 px-6 py-3 rounded-full mb-8 border border-white/10">
            <AlertTriangle className="h-5 w-5 text-white" />
            <span className="font-medium text-white text-sm">COMPETITIVE THREAT ALERT</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-8 leading-tight tracking-tight text-white">
            YOUR SMB CUSTOMERS ARE<br/>
            LEAVING FOR FINTECHS<br/>
            THAT UNDERSTAND BUSINESS CREDIT
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            You mastered consumer credit engagement with <strong className="text-white font-semibold">CreditWise® and Credit Journey®</strong>.<br/>
            <strong className="text-white font-semibold">Now fintechs are eating your SMB market with the same playbook.</strong>
          </p>

          {/* Commented out buttons as requested
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button size="lg" className="bg-black/30 backdrop-blur-sm text-white hover:bg-white hover:text-black px-10 py-4 text-lg font-bold rounded-full border border-white/10 hover:border-white transition-all">
              <Briefcase className="mr-3 h-6 w-6" />
              SCHEDULE C-SUITE DEMO
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
            <Button size="lg" variant="outline" className="border border-white/10 text-white hover:bg-black/30 px-8 py-4 text-lg rounded-full">
              <Code className="mr-3 h-5 w-5" />
              REQUEST TECHNICAL SPECS
            </Button>
          </div>
          */}

          {/* Crisis Stats */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:scale-[1.02] transition-all duration-300">
              <div className="text-3xl font-bold text-white mb-2">${animatedNumbers.marketSize}T</div>
              <div className="text-sm text-gray-300 font-medium">SMB CREDIT MARKET SIZE</div>
              <div className="text-xs text-gray-400 mt-1">Being captured by fintechs</div>
            </div>
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:scale-[1.02] transition-all duration-300">
              <div className="text-3xl font-bold text-white mb-2">${animatedNumbers.lostRevenue}M</div>
              <div className="text-sm text-gray-300 font-medium">AVG. ANNUAL REVENUE LOSS</div>
              <div className="text-xs text-gray-400 mt-1">Per major bank to fintechs</div>
            </div>
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:scale-[1.02] transition-all duration-300">
              <div className="text-3xl font-bold text-white mb-2">{animatedNumbers.banks}+</div>
              <div className="text-sm text-gray-300 font-medium">BANKS ALREADY PILOTING</div>
              <div className="text-xs text-gray-400 mt-1">Business credit intelligence</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Logo Subtitle Line */}
      <section className="py-8 px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            <img 
              src="/enterprisesubhero/1.jpg" 
              alt="Enterprise Partner" 
              className="h-8 md:h-10 object-contain opacity-90 hover:opacity-100 transition-opacity"
            />
            <img 
              src="/enterprisesubhero/2.png" 
              alt="Enterprise Partner" 
              className="h-8 md:h-12 object-contain opacity-90 hover:opacity-100 transition-opacity"
            />
            <img 
              src="/enterprisesubhero/3.png" 
              alt="Enterprise Partner" 
              className="h-8 md:h-12 object-contain opacity-90 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </section>

      {/* Competitive Threats */}
      <section className="py-12 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8 max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-tight">
              <AlertTriangle className="h-5 w-5" />
              While You Wait, Your Competition Moves
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {competitorThreats.map((threat, index) => (
                <div key={index} className="flex items-start gap-2 text-gray-300 text-sm">
                  <ArrowRight className="h-4 w-4 text-white mt-0.5 flex-shrink-0" />
                  <span>{threat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Your Success Story */}
      <section className="py-16 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6 uppercase tracking-tight">
              You've Done This Before <br /> And Won Big
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Your consumer credit tools generated billions in additional revenue. Here's the proof.
            </p>
          </div>

          <EnterpriseCarouselSection />

          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 text-white text-center border border-white/10">
            <h3 className="text-xl font-bold mb-3">Combined Industry Impact</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <div className="text-2xl font-bold text-white mb-1">$740M+</div>
                <div className="text-xs opacity-90">Additional revenue generated</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-1">150M+</div>
                <div className="text-xs opacity-90">Americans using these tools</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-1">3.2x</div>
                <div className="text-xs opacity-90">Average ROI achieved</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-1">85%</div>
                <div className="text-xs opacity-90">Customer satisfaction increase</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SMB Opportunity Gap */}
      <section className="py-12 px-6 bg-black">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-4 uppercase tracking-tight">
            But 32 Million SMBs? Still Flying Blind
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-6 items-center max-w-5xl mx-auto mb-6">
            <Card className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <CardContent className="p-0">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2 uppercase">
                  <CheckCircle className="h-4 w-4" />
                  Your Consumer Success Formula
                </h3>
                <div className="space-y-2 text-left">
                  <div className="bg-black/30 backdrop-blur-sm p-2 rounded-lg border border-white/10">
                    <div className="font-medium text-white mb-1 text-sm">✓ Free Credit Visibility</div>
                    <div className="text-xs text-gray-300">FICO® scores in banking apps drove engagement</div>
                  </div>
                  <div className="bg-black/30 backdrop-blur-sm p-2 rounded-lg border border-white/10">
                    <div className="font-medium text-white mb-1 text-sm">✓ Smart Monitoring & Alerts</div>
                    <div className="text-xs text-gray-300">Real-time notifications increased usage 2-3x</div>
                  </div>
                  <div className="bg-black/30 backdrop-blur-sm p-2 rounded-lg border border-white/10">
                    <div className="font-medium text-white mb-1 text-sm">✓ Pre-qualified Offers</div>
                    <div className="text-xs text-gray-300">Personalized products boosted conversion 40%</div>
                  </div>
                  <div className="bg-black/30 backdrop-blur-sm p-2 rounded-lg border border-white/10">
                    <div className="font-medium text-white mb-1 text-sm">✓ Improvement Guidance</div>
                    <div className="text-xs text-gray-300">Credit education created customer loyalty</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <CardContent className="p-0">
                <h3 className="text-lg font-bold text-white mb-3 uppercase">SMB Reality Check</h3>
                <div className="space-y-2 text-left">
                  <div className="bg-black/30 backdrop-blur-sm p-2 rounded-lg border border-white/10">
                    <div className="font-medium text-white mb-1 text-sm">"I don't know my business credit score"</div>
                    <div className="text-xs text-gray-300"><strong>78% of SMBs</strong> have never seen their business credit</div>
                  </div>
                  <div className="bg-black/30 backdrop-blur-sm p-2 rounded-lg border border-white/10">
                    <div className="font-medium text-white mb-1 text-sm">"Got denied, no explanation"</div>
                    <div className="text-xs text-gray-300"><strong>85% of rejections</strong> come with no actionable feedback</div>
                  </div>
                  <div className="bg-black/30 backdrop-blur-sm p-2 rounded-lg border border-white/10">
                    <div className="font-medium text-white mb-1 text-sm">"My payments don't count"</div>
                    <div className="text-xs text-gray-300"><strong>90% of vendor payments</strong> go unreported to bureaus</div>
                  </div>
                  <div className="bg-black/30 backdrop-blur-sm p-2 rounded-lg border border-white/10">
                    <div className="font-medium text-white mb-1 text-sm">"Banking feels impersonal"</div>
                    <div className="text-xs text-gray-300"><strong>60% consider switching</strong> to fintech alternatives</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-black/30 backdrop-blur-sm border border-white/10 p-4 rounded-xl max-w-3xl mx-auto">
            <h3 className="text-lg font-bold text-white mb-2 uppercase">The $2.3 Trillion Opportunity</h3>
            <p className="text-gray-300 leading-relaxed mb-2 text-sm">
              32 million small businesses generate $2.3 trillion in credit demand annually. 
              They want the same credit clarity consumers already have.
            </p>
            <p className="text-white font-medium text-sm">
              The bank that gives it to them first wins the relationship.
            </p>
          </div>
        </div>
      </section>

      {/* LUMIQ AI Solution */}
      <section className="py-16 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-black/30 px-4 py-2 rounded-full mb-6 border border-white/10">
              <Orbit className="h-4 w-4 text-white" />
              <span className="font-medium text-white text-sm">ENTERPRISE-GRADE SOLUTION</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6 uppercase tracking-tight">
              LUMIQ AI™ — Your Consumer Playbook for SMBs
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-6">
              The same proven engagement strategy that generated billions for consumer credit — 
              now engineered for business credit intelligence.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-12">
            {lumiqAdvantages.map((advantage, index) => (
              <Card key={index} className="p-6 hover:scale-105 transition-all duration-500 border border-white/10 bg-black/30 backdrop-blur-sm hover:bg-black/40">
                <CardContent className="p-0">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="bg-black/30 backdrop-blur-sm p-3 rounded-xl border border-white/10">
                      <advantage.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-2 uppercase">{advantage.name}</h3>
                      <p className="text-gray-300 mb-3 text-sm">{advantage.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-3">
                    <div className="bg-black/30 backdrop-blur-sm border border-white/10 p-2 rounded-lg">
                      <div className="text-white font-medium mb-1 text-xs uppercase">Business Impact</div>
                      <div className="text-gray-300 font-semibold text-xs">{advantage.bankBenefit}</div>
                    </div>
                    <div className="bg-black/30 backdrop-blur-sm border border-white/10 p-2 rounded-lg">
                      <div className="text-white font-medium mb-1 text-xs uppercase">Implementation</div>
                      <div className="text-gray-300 font-semibold text-xs">{advantage.implementation}</div>
                    </div>
                    <div className="bg-black/30 backdrop-blur-sm border border-white/10 p-2 rounded-lg">
                      <div className="text-white font-medium mb-1 text-xs uppercase">Compliance</div>
                      <div className="text-gray-300 font-semibold text-xs">{advantage.compliance}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Trust Credentials */}
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4 text-center uppercase">Bank-Grade Security & Compliance</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {trustCredentials.map((cred, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="bg-black/30 backdrop-blur-sm p-2 rounded-lg flex-shrink-0 border border-white/10">
                    <cred.icon className="h-3 w-3 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">{cred.text}</div>
                    <div className="text-xs text-gray-300">{cred.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* ROI Projections */}
      <section className="py-16 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6 uppercase tracking-tight">
              Projected ROI: Based on Your Own Success
            </h2>
            <p className="text-lg text-gray-300 mb-6">
              Conservative projections based on proven consumer credit tool performance at major banks.
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6 mb-8">
            {roiProjections.map((projection, index) => (
              <Card key={index} className="p-4 text-center hover:scale-105 transition-all duration-300 border border-white/10 bg-black/30 backdrop-blur-sm hover:bg-black/40">
                <CardContent className="p-0">
                  <div className="mb-3">
                    <DollarSign className="h-6 w-6 text-white mx-auto mb-2" />
                    <h3 className="font-bold text-white text-xs mb-2 uppercase">{projection.metric}</h3>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="bg-black/30 backdrop-blur-sm border border-white/10 p-2 rounded-lg">
                      <div className="text-xs text-white mb-1 uppercase">Year 1</div>
                      <div className="text-lg font-bold text-white">{projection.year1}</div>
                    </div>
                    <div className="bg-black/30 backdrop-blur-sm border border-white/10 p-2 rounded-lg">
                      <div className="text-xs text-white mb-1 uppercase">Year 3</div>
                      <div className="text-lg font-bold text-white">{projection.year3}</div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-400 italic">{projection.basis}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 text-white text-center border border-white/10">
            <h3 className="text-xl font-bold mb-3 uppercase">3-Year Cumulative Impact</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <div className="text-3xl font-bold text-white mb-2">$308M</div>
                <div className="text-sm text-gray-300 uppercase">Additional SMB Revenue</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">42%</div>
                <div className="text-sm text-gray-300 uppercase">Increase in SMB Engagement</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">3.8x</div>
                <div className="text-sm text-gray-300 uppercase">Return on Investment</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation */}
      <section className="py-16 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6 uppercase tracking-tight">
                Enterprise Integration<br/>
                Made Simple
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-black/30 backdrop-blur-sm p-2 rounded-full border border-white/10">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1 uppercase">Flexible API Architecture</h3>
                    <p className="text-gray-300 text-sm">REST or GraphQL endpoints with comprehensive documentation</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-black/30 backdrop-blur-sm p-2 rounded-full border border-white/10">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1 uppercase">SSO & Identity Management</h3>
                    <p className="text-gray-300 text-sm">SAML, OAuth2, and custom authentication options</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-black/30 backdrop-blur-sm p-2 rounded-full border border-white/10">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1 uppercase">White-Label UI Components</h3>
                    <p className="text-gray-300 text-sm">Fully customizable React or Web Components</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-black/30 backdrop-blur-sm p-2 rounded-full border border-white/10">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1 uppercase">Dedicated Implementation Team</h3>
                    <p className="text-gray-300 text-sm">Average 45-day integration timeline with full support</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Button disabled className="bg-black/50 text-gray-400 px-6 py-3 rounded-lg border border-white/10 cursor-not-allowed uppercase font-bold">
                  <Clock className="mr-2 h-5 w-5" />
                  Coming Soon
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4 uppercase">Implementation Timeline</h3>
                
                <div className="space-y-6">
                  {implementationSteps.map((step, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="bg-black text-white font-bold rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 border border-white/10">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-white mb-1 uppercase">{step.name}</h4>
                        <p className="text-gray-300 text-sm mb-2">{step.description}</p>
                        <div className="flex items-center gap-2 text-xs">
                          <Clock className="h-3 w-3 text-white" />
                          <span className="text-gray-400">{step.duration}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-6 bg-black">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-6 uppercase tracking-tight">
            Don't Let Fintechs Win<br/>
            Your SMB Market
          </h2>
          <p className="text-lg text-gray-300 mb-3 max-w-2xl mx-auto">
            You proved credit visibility drives billions in revenue with consumers.
          </p>
          <p className="text-white mb-8 max-w-2xl mx-auto">
            Give your 32 million SMB customers the same advantage — before your competition does.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <a href="https://www.futeur.ai/contact" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-black/30 backdrop-blur-sm text-white border border-white/10 hover:bg-white hover:text-orange-500 transition-all px-8 py-4 text-lg font-bold uppercase text-crisp">
                <Briefcase className="mr-2 h-5 w-5" />
                Contact Us for Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
            <a href="https://www.futeur.ai/contact" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-2 border-white/10 text-white hover:bg-black/30 px-6 py-4 uppercase">
                <Code className="mr-2 h-4 w-4" />
                Request Technical Documentation
              </Button>
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6 text-xs">
            <div className="text-white">
              <div className="font-semibold mb-1 flex items-center gap-2 uppercase">
                <Zap className="h-3 w-3" />
                Rapid Deployment
              </div>
              <div className="text-gray-300">2-week API integration timeline</div>
            </div>
            <div className="text-white">
              <div className="font-semibold mb-1 flex items-center gap-2 uppercase">
                <Shield className="h-3 w-3" />
                Bank-Grade Security
              </div>
              <div className="text-gray-300">SOC 2, FCRA compliant, audit-ready</div>
            </div>
            <div className="text-white">
              <div className="font-semibold mb-1 flex items-center gap-2 uppercase">
                <TrendingUp className="h-3 w-3" />
                Proven ROI
              </div>
              <div className="text-gray-300">420% ROI based on industry benchmarks</div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating CTA Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <a href={getCrossDomainUrl("/credit-journey#dashboard")}>
          <Button className="bg-black/30 backdrop-blur-sm text-white hover:bg-white hover:text-orange-500 px-6 py-4 rounded-full shadow-lg border border-white/10 transition-all font-bold uppercase text-crisp">
            <Gauge className="mr-2 h-5 w-5" />
            Start Journey
          </Button>
        </a>
      </div>
    </div>
  );
};

export default Enterprise;


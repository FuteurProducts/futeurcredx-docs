import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  TrendingUp,
  Code,
  Shield,
  BarChart3,
  CreditCard,
  Building2,
  Zap,
  Bell,
  Target,
  ArrowRight,
  Award,
  Clock,
  Database,
  Gauge,
} from "lucide-react"

const FintechPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Revenue Alert Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden -mt-20 pt-24 px-6 bg-cover bg-center" style={{ backgroundImage: "url('/60.jpg')" }}>
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10 w-full">
          <div className="inline-flex items-center gap-3 bg-white/10 px-6 py-3 rounded-full mb-8 border border-white/20">
            <TrendingUp className="h-5 w-5 text-white" />
            <span className="font-medium text-white text-sm uppercase tracking-tight">Revenue Optimization Alert</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black uppercase mb-8 leading-tight tracking-tight">
            Brex, Ramp, Mercury:
            <br />
            <span className="text-white">You're Leaving Money on the Table</span>
          </h1>
         
          <p className="text-lg text-white mb-12 font-semibold">
            Every major fintech that added credit visibility saw 40%+ revenue growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button
              size="lg"
              className="bg-black/30 text-white border border-white/10 px-10 py-4 text-lg font-bold uppercase text-crisp"
            >
              <Gauge className="mr-3 h-6 w-6" />
              Start Free Integration
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white/10 text-white px-8 py-4 text-lg uppercase bg-transparent"
            >
              <Code className="mr-3 h-5 w-5" />
              View API Docs
            </Button>
          </div>
          {/* Key Metrics */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="text-3xl font-bold text-white mb-2">+47%</div>
              <div className="text-sm text-gray-300 font-medium">Average conversion increase</div>
              <div className="text-xs text-gray-400 mt-1">With credit intelligence</div>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="text-3xl font-bold text-white mb-2">+23%</div>
              <div className="text-sm text-gray-300 font-medium">More accurate approvals</div>
              <div className="text-xs text-gray-400 mt-1">Better risk assessment</div>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="text-3xl font-bold text-white mb-2">85%</div>
              <div className="text-sm text-gray-300 font-medium">Faster decisions</div>
              <div className="text-xs text-gray-400 mt-1">Real-time processing</div>
            </div>
          </div>
        </div>
      </section>

      {/* Revenue Potential Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6 tracking-tight uppercase">
              Your Revenue Potential with <span className="text-white">Credit Intelligence</span>
            </h2>
            <p className="text-xl text-gray-300 font-light">
              Conservative projections based on proven fintech implementations.
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Brex Card */}
            <Card className="p-8 border border-white/10 bg-black/20" style={{ backgroundImage: "url('/16.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
              <div className="absolute inset-0 bg-black/30"></div>
              <CardContent className="p-0 relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-white p-4 rounded-2xl">
                    <img src="/fintech-logos/Brex.png" alt="Brex logo" className="h-10 w-auto" />
                  </div>
                  <div>
                    <h3 className="font-bold text-2xl text-white">Brex</h3>
                    <div className="text-white font-bold text-lg">$300M ARR</div>
                  </div>
                </div>
                <div className="space-y-4 mb-6">
                  <div className="bg-black/30 p-4 rounded-xl border border-white/10">
                    <div className="text-gray-400 font-semibold mb-1">Current State</div>
                    <div className="text-white font-bold">12% application conversion</div>
                  </div>
                  <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                    <div className="text-white font-semibold mb-1">With LUMIQ AI</div>
                    <div className="text-white font-bold">19% projected conversion (+58%)</div>
                  </div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl text-center border border-white/10">
                  <div className="text-white font-bold text-lg">$174M additional ARR potential</div>
                  <div className="text-gray-300 text-sm">Based on credit visibility impact</div>
                </div>
              </CardContent>
            </Card>
            {/* Ramp Card */}
            <Card className="p-8 border border-white/10 bg-black/20" style={{ backgroundImage: "url('/17.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
              <div className="absolute inset-0 bg-black/30"></div>
              <CardContent className="p-0 relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-white/10 p-4 rounded-2xl">
                    <img src="/fintech-logos/Ramp.jpeg" alt="Ramp logo" className="h-10 w-auto" />
                  </div>
                  <div>
                    <h3 className="font-bold text-2xl text-white">Ramp</h3>
                    <div className="text-white font-bold text-lg">$200M ARR</div>
                  </div>
                </div>
                <div className="space-y-4 mb-6">
                  <div className="bg-black/30 p-4 rounded-xl border border-white/10">
                    <div className="text-gray-400 font-semibold mb-1">Current State</div>
                    <div className="text-white font-bold">15% underwriting approval</div>
                  </div>
                  <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                    <div className="text-white font-semibold mb-1">With LUMIQ AI</div>
                    <div className="text-white font-bold">24% projected approval (+60%)</div>
                  </div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl text-center border border-white/10">
                  <div className="text-white font-bold text-lg">$120M additional ARR potential</div>
                  <div className="text-gray-300 text-sm">With enhanced credit intelligence</div>
                </div>
              </CardContent>
            </Card>
            {/* Mercury Card */}
            <Card className="p-8 border border-white/10 bg-black/20" style={{ backgroundImage: "url('/18.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
              <div className="absolute inset-0 bg-black/30"></div>
              <CardContent className="p-0 relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-white/10 p-4 rounded-2xl">
                    <img src="/fintech-logos/mercury.png" alt="Mercury logo" className="h-10 w-auto" />
                  </div>
                  <div>
                    <h3 className="font-bold text-2xl text-white">Mercury</h3>
                    <div className="text-white font-bold text-lg">$120M ARR</div>
                  </div>
                </div>
                <div className="space-y-4 mb-6">
                  <div className="bg-black/30 p-4 rounded-xl border border-white/10">
                    <div className="text-gray-400 font-semibold mb-1">Current State</div>
                    <div className="text-white font-bold">8% lending product uptake</div>
                  </div>
                  <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                    <div className="text-white font-semibold mb-1">With LUMIQ AI</div>
                    <div className="text-white font-bold">14% projected uptake (+75%)</div>
                  </div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl text-center border border-white/10">
                  <div className="text-white font-bold text-lg">$90M additional ARR potential</div>
                  <div className="text-gray-300 text-sm">Through credit journey integration</div>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Combined Market Impact */}
          <div className="bg-white/5 p-8 rounded-3xl text-center border border-white/10 mb-16">
            <h3 className="text-3xl font-bold text-white mb-8">Combined Fintech Market Impact</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-4xl font-bold text-white mb-2">$384M+</div>
                <div className="text-white/80">Additional ARR potential</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-white mb-4">47%</div>
                <div className="text-white/80">Average conversion increase</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">90%</div>
                <div className="text-white/80">Customer satisfaction boost</div>
              </div>
            </div>
          </div>
          {/* Typical Fintech ROI */}
          <div className="bg-white/5 p-8 rounded-3xl text-center border border-white/10">
            <h3 className="text-3xl font-bold text-white mb-8">Typical Fintech ROI</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-5xl font-bold text-white mb-4">580%</div>
                <div className="text-white/90 text-lg">ROI in first year</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-white mb-4">$2.4M</div>
                <div className="text-white/90 text-lg">Additional revenue per 10K MAU</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-white mb-4">4 weeks</div>
                <div className="text-white/90 text-lg">Time to break even</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LUMIQ AI Built for Modern Fintechs */}
      <section className="py-20 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-white/10 px-6 py-3 rounded-full mb-8 border border-white/30">
              <Zap className="h-5 w-5 text-white" />
              <span className="font-medium text-white text-sm">Fintech-Optimized APIs</span>
            </div>
            <h2 className="text-5xl font-bold text-white mb-6 tracking-tight uppercase">
              <span className="text-white">LUMIQ AI™</span> — Built for Modern Fintechs
            </h2>
            <p className="text-xl text-gray-300 font-light">
              Drop-in credit intelligence that integrates with your existing stack in hours, not months.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* LUMIQ AI Conversion Engine */}
            <Card className="p-8 bg-white/5 border border-white/10">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-white/10 p-4 rounded-2xl">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-2xl text-white">LUMIQ AI Conversion Engine™</h3>
                  <p className="text-[#D1D5DB]">
                    Real-time credit scoring integration for higher application completions
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white/10 p-4 rounded-xl border border-white/10 text-center">
                  <div className="text-white font-semibold text-sm mb-1">Impact</div>
                  <div className="text-white font-bold">47% average conversion rate increase</div>
                </div>
                <div className="bg-white/10 p-4 rounded-xl border border-white/10 text-center">
                  <div className="text-white font-semibold text-sm mb-1">Setup</div>
                  <div className="text-white font-bold">Single API call integration</div>
                </div>
                <div className="bg-white/10 p-4 rounded-xl border border-white/10 text-center">
                  <div className="text-white font-semibold text-sm mb-1">Analytics</div>
                  <div className="text-white font-bold">Track every step of credit journey</div>
                </div>
              </div>
            </Card>
            {/* LUMIQ AI Underwriting Assistant */}
            <Card className="p-8 bg-white/5 border border-white/10">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-white/10 p-4 rounded-2xl">
                  <Database className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-2xl text-white">LUMIQ AI Underwriting Assistant™</h3>
                  <p className="text-gray-300">Multi-bureau credit intelligence for smarter lending decisions</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white/10 p-4 rounded-xl border border-white/20 text-center">
                  <div className="text-gray-300 font-semibold text-sm mb-1">Impact</div>
                  <div className="text-white font-bold">23% more accurate approvals</div>
                </div>
                <div className="bg-white/10 p-4 rounded-xl border border-white/20 text-center">
                  <div className="text-gray-300 font-semibold text-sm mb-1">Setup</div>
                  <div className="text-white font-bold">Real-time decision APIs</div>
                </div>
                <div className="bg-white/10 p-4 rounded-xl border border-white/20 text-center">
                  <div className="text-gray-300 font-semibold text-sm mb-1">Analytics</div>
                  <div className="text-white font-bold">Reduce false positives by 60%</div>
                </div>
              </div>
            </Card>
            {/* LUMIQ AI Engagement Dashboard */}
            <Card className="p-8 bg-white/5 border border-white/10">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-white/10 p-4 rounded-2xl">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-2xl text-white">LUMIQ AI Engagement Dashboard™</h3>
                  <p className="text-gray-300">Credit health monitoring that keeps customers coming back</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white/10 p-4 rounded-xl border border-white/20 text-center">
                  <div className="text-gray-300 font-semibold text-sm mb-1">Impact</div>
                  <div className="text-white font-bold">3.2x increase in platform usage</div>
                </div>
                <div className="bg-white/10 p-4 rounded-xl border border-white/20 text-center">
                  <div className="text-gray-300 font-semibold text-sm mb-1">Setup</div>
                  <div className="text-white font-bold">White-label dashboard widgets</div>
                </div>
                <div className="bg-white/10 p-4 rounded-xl border border-white/20 text-center">
                  <div className="text-gray-300 font-semibold text-sm mb-1">Analytics</div>
                  <div className="text-white font-bold">85% reduction in customer churn</div>
                </div>
              </div>
            </Card>
            {/* LUMIQ AI Risk Intelligence */}
            <Card className="p-8 bg-white/5 border border-white/10">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-white/10 p-4 rounded-2xl">
                  <Bell className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-2xl text-white">LUMIQ AI Risk Intelligence™</h3>
                  <p className="text-gray-300">Predictive credit monitoring for portfolio management</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white/10 p-4 rounded-xl border border-white/20 text-center">
                  <div className="text-gray-300 font-semibold text-sm mb-1">Impact</div>
                  <div className="text-white font-bold">30% reduction in default rates</div>
                </div>
                <div className="bg-white/10 p-4 rounded-xl border border-white/20 text-center">
                  <div className="text-gray-300 font-semibold text-sm mb-1">Setup</div>
                  <div className="text-white font-bold">Automated alert systems</div>
                </div>
                <div className="bg-white/10 p-4 rounded-xl border border-white/20 text-center">
                  <div className="text-gray-300 font-semibold text-sm mb-1">Analytics</div>
                  <div className="text-white font-bold">Real-time risk scoring updates</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-3 bg-[#6366F1]/20 px-6 py-3 rounded-full mb-8 border border-[#6366F1]/30">
                <Clock className="h-5 w-5 text-[#6366F1]" />
                <span className="font-medium text-[#6366F1] text-sm">Simple Integration Example</span>
              </div>
              <h2 className="text-5xl font-bold text-white mb-8 tracking-tight">
                Integration So Simple,
                <br />
                <span className="text-[#3B82F6]">Your Developers Will Thank You</span>
              </h2>
              <div className="space-y-6 mb-12">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-[#6366F1]/20 to-[#8B5CF6]/20 p-3 rounded-xl">
                    <Clock className="h-6 w-6 text-[#6366F1]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-white">15-Minute Setup</h3>
                    <p className="text-[#D1D5DB]">RESTful APIs with comprehensive documentation</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-[#10B981]/20 to-[#059669]/20 p-3 rounded-xl">
                    <Code className="h-6 w-6 text-[#10B981]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-white">Any Tech Stack</h3>
                    <p className="text-[#D1D5DB]">React, Vue, Angular, or pure JavaScript</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-[#8B5CF6]/20 to-[#7C3AED]/20 p-3 rounded-xl">
                    <Zap className="h-6 w-6 text-[#8B5CF6]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-white">Production Ready</h3>
                    <p className="text-[#D1D5DB]">99.9% uptime SLA, enterprise security</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#111827] border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="ml-4 text-[#D1D5DB] text-sm font-mono">lumiq-integration.js</span>
              </div>
              <pre className="text-sm text-green-400 overflow-x-auto bg-transparent p-0">
                {`// Add to your application form
const creditScore = await lumiq.getScore({
  businessId: application.businessId,
  includeFactors: true
});

// Display real-time credit visibility
<CreditScoreWidget 
  score={creditScore.lumiq_score}
  factors={creditScore.factors}
  recommendations={creditScore.recommendations}
  onImprove={() => showCreditJourney()}
/>

// Instant pre-qualification
const preQual = await lumiq.prequalify({
  score: creditScore.lumiq_score,
  products: ['line_of_credit', 'term_loan']
});

// Result: 47% higher conversion rates`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-6 bg-black">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 tracking-tight">
            Don't Leave 47% More Revenue
            <br />
            <span className="text-white">On The Table</span>
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Every day without credit intelligence is money lost to competitors who get it.
          </p>
          <p className="text-lg text-white/80 mb-12">
            Join the fintechs already using LUMIQ AI to dominate their markets.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button
              size="lg"
              className="bg-white text-black px-10 py-4 text-lg font-semibold rounded-full shadow-lg uppercase"
            >
              <Gauge className="mr-3 h-6 w-6" />
              Start Free Integration
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white/30 text-white px-8 py-4 text-lg rounded-full bg-transparent"
            >
              <Code className="mr-3 h-5 w-5" />
              View Technical Docs
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-white">
            <div className="flex items-center justify-center gap-3">
              <Zap className="h-6 w-6" />
              <span className="font-semibold">Instant Setup</span>
              <span className="text-white/70">15-minute API integration</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Shield className="h-6 w-6" />
              <span className="font-semibold">Enterprise Security</span>
              <span className="text-white/70">SOC 2, GDPR compliant</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Award className="h-6 w-6" />
              <span className="font-semibold">Proven Results</span>
              <span className="text-white/70">580% ROI average across fintechs</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default FintechPage


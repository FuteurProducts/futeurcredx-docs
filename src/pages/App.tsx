
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import BusinessFooter from '@/components/business/BusinessFooter';
import QRCodeModal from "@/components/QrCode";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Smartphone, 
  TrendingUp, 
  Bell, 
  Shield, 
  Zap, 
  Target, 
  BarChart3, 
  Award, 
  Download,
  Star,
  CheckCircle,
  AlertTriangle,
  Rocket,
  Eye,
  Gauge
} from "lucide-react";

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E0E10] via-[#1A1A2E] to-[#16213E]">
      {/* Header is now provided by the RevolutHeader component */}

      {/* Sticky Scroll Bar */}
      <div className="fixed top-16 w-full z-40 bg-gradient-to-r from-purple-600/90 to-blue-600/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-2">
          <p className="text-white text-sm md:text-base font-medium text-center">
            <span className="inline-flex items-center gap-2">
              <Eye className="w-4 h-4" />
              90% of businesses don't know their credit score—LUMIQ users not only know it, they weaponize it.
            </span>
          </p>
        </div>
      </div>

      <div className="pt-32">
        {/* Hero Section */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                    <Smartphone className="w-4 h-4 mr-2" />
                    Now on Mobile
                  </Badge>
                  <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                    Your Business Credit
                    <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent block">
                      Operating System
                    </span>
                  </h1>
                  <p className="text-xl text-gray-300 leading-relaxed">
                    Track, build, and weaponize your business credit with real-time alerts, 
                    FSR monitoring, and PG-free tradeline opportunities.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <QRCodeModal 
                    buttonText="Know Your Score"
                    buttonClassName="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-6"
                    showIcon={true}
                  />
                  <Button size="lg" variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white text-lg px-8 py-6">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Boost It
                  </Button>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 border-2 border-[#0E0E10]" />
                      ))}
                    </div>
                    <span>10k+ businesses</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span>4.9 rating</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="relative z-10">
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 shadow-2xl animate-glow">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-semibold">Business Credit Score</h3>
                        <Badge className="bg-green-500/20 text-green-400">Live</Badge>
                      </div>
                      
                      <div className="relative">
                        <div className="text-6xl font-bold text-center">
                          <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                            742
                          </span>
                        </div>
                        <div className="text-center text-gray-400 mt-2">Excellent</div>
                        <Progress value={85} className="mt-4 h-3" />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Card className="bg-gray-800/50 border-gray-700">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <TrendingUp className="w-4 h-4 text-green-400" />
                              <span className="text-sm text-gray-300">This Month</span>
                            </div>
                            <div className="text-2xl font-bold text-green-400">+23</div>
                          </CardContent>
                        </Card>
                        <Card className="bg-gray-800/50 border-gray-700">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Bell className="w-4 h-4 text-blue-400" />
                              <span className="text-sm text-gray-300">Alerts</span>
                            </div>
                            <div className="text-2xl font-bold text-blue-400">3</div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-3xl blur-3xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                Everything You Need to 
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"> Dominate</span>
              </h2>
              <p className="text-xl text-gray-300">Real-time monitoring, alerts, and credit-building tools in your pocket</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Bell,
                  title: "Real-Time Alerts",
                  description: "Get notified instantly when your credit changes, new tradelines appear, or opportunities arise.",
                  color: "from-orange-400 to-red-400"
                },
                {
                  icon: BarChart3,
                  title: "FSR Score Tracking",
                  description: "Monitor your Financial Stress Rating and understand exactly what impacts your creditworthiness.",
                  color: "from-blue-400 to-cyan-400"
                },
                {
                  icon: Shield,
                  title: "PG-Free Builder",
                  description: "Access exclusive tradelines that don't require personal guarantees or impact your personal credit.",
                  color: "from-green-400 to-emerald-400"
                },
                {
                  icon: Target,
                  title: "Vendor Universe",
                  description: "Discover thousands of vendors ready to extend credit terms to businesses like yours.",
                  color: "from-purple-400 to-pink-400"
                },
                {
                  icon: Zap,
                  title: "LUMIQ Journey",
                  description: "Follow your personalized credit-building roadmap with AI-powered recommendations.",
                  color: "from-yellow-400 to-orange-400"
                },
                {
                  icon: Award,
                  title: "Credit Wins",
                  description: "Celebrate milestones and unlock new opportunities as your credit score improves.",
                  color: "from-indigo-400 to-purple-400"
                }
              ].map((feature, index) => (
                <Card key={index} className="bg-gray-900/50 border-gray-700 hover:border-gray-600 transition-all duration-300 hover:scale-105">
                  <CardContent className="p-8">
                    <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${feature.color} mb-6`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Credit Journey Visualization */}
        <section className="py-20 px-6 bg-gradient-to-r from-gray-900/50 to-gray-800/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                Watch Your Credit 
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"> Transform</span>
              </h2>
              <p className="text-xl text-gray-300">Track your progress with visual milestones and celebrate every win</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {[
                {
                  stage: "Starting Point",
                  score: 580,
                  color: "from-red-400 to-orange-400",
                  icon: AlertTriangle,
                  status: "Needs Improvement"
                },
                {
                  stage: "Building Phase",
                  score: 680,
                  color: "from-yellow-400 to-orange-400",
                  icon: TrendingUp,
                  status: "Good Progress"
                },
                {
                  stage: "Elite Status",
                  score: 780,
                  color: "from-green-400 to-emerald-400",
                  icon: Rocket,
                  status: "Excellent"
                }
              ].map((stage, index) => (
                <Card key={index} className="bg-gray-900/70 border-gray-700 overflow-hidden">
                  <CardContent className="p-8">
                    <div className="text-center space-y-6">
                      <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${stage.color}`}>
                        <stage.icon className="w-8 h-8 text-white" />
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">{stage.stage}</h3>
                        <div className="text-5xl font-bold mb-2">
                          <span className={`bg-gradient-to-r ${stage.color} bg-clip-text text-transparent`}>
                            {stage.score}
                          </span>
                        </div>
                        <Badge className={`bg-gradient-to-r ${stage.color} text-white`}>
                          {stage.status}
                        </Badge>
                      </div>

                      <Progress value={(stage.score - 300) / 5} className="h-2" />
                      
                      {index < 2 && (
                        <div className="flex justify-center">
                          <ArrowRight className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                Join Thousands of 
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"> Success Stories</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  metric: "150+",
                  label: "Average Score Increase",
                  icon: TrendingUp,
                  color: "from-green-400 to-emerald-400"
                },
                {
                  metric: "90%",
                  label: "Approval Rate Improvement",
                  icon: CheckCircle,
                  color: "from-blue-400 to-cyan-400"
                },
                {
                  metric: "30 Days",
                  label: "Average Time to First Win",
                  icon: Zap,
                  color: "from-purple-400 to-pink-400"
                }
              ].map((stat, index) => (
                <Card key={index} className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 text-center">
                  <CardContent className="p-8">
                    <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${stat.color} mb-6`}>
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-4xl font-bold text-white mb-2">{stat.metric}</div>
                    <div className="text-gray-300">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-6 bg-gradient-to-r from-purple-600/20 to-blue-600/20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl font-bold text-white mb-6">
              Ready to 
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"> Track Progress</span>?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Download the LUMIQ app and start building your business credit empire today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <QRCodeModal
                buttonText="Download for iOS"
                buttonClassName="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-12 py-6"
                title="GET THE FUTEURCRED iOS APP"
                showIcon={true}
              />
              <QRCodeModal
                buttonText="Download for Android"
                buttonClassName="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-lg px-12 py-6"
                title="GET THE FUTEURCRED ANDROID APP"
                showIcon={true}
              />
            </div>
          </div>
        </section>
      </div>

      <BusinessFooter />
    </div>
  );
};

export default App;

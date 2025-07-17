
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Code, 
  Smartphone, 
  Globe, 
  Shield, 
  Zap, 
  Clock, 
  CheckCircle,
  Copy,
  Play,
  Book,
  Download,
  ExternalLink,
  Terminal,
  Database,
  Key,
  Users,
  BarChart3,
  CreditCard
} from 'lucide-react';

const ApiDocs = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="py-6 px-6 bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back to Home</span>
            </Link>
            <div className="text-2xl font-bold text-slate-900">
              LUMIQ™ API
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
              v2.1.0
            </Badge>
            <div className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-sm font-semibold border border-emerald-200">
              Live Documentation
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            LUMIQ™ API Documentation
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Complete developer resources for integrating business credit intelligence into your applications. 
            Native mobile SDKs, REST APIs, and comprehensive tooling.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4">
              <Play className="mr-2 h-5 w-5" />
              Quick Start Guide
            </Button>
            <Button size="lg" variant="outline" className="border-slate-300 text-slate-700 px-8 py-4">
              <Download className="mr-2 h-5 w-5" />
              Download SDKs
            </Button>
          </div>

          {/* Coming Soon Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-amber-600" />
              <span className="font-semibold text-amber-800">Coming Soon</span>
            </div>
            <p className="text-amber-700">
              Full interactive documentation and live API explorer launching Q1 2024. 
              Contact our team for early access.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 px-6 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-emerald-600 mb-2">99.9%</div>
              <div className="text-slate-600">API Uptime</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">&lt;200ms</div>
              <div className="text-slate-600">Response Time</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
              <div className="text-slate-600">Endpoints</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-600 mb-2">24/7</div>
              <div className="text-slate-600">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform SDKs */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Native Platform Support
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Plug-and-play SDKs for seamless integration into your native mobile applications.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* iOS SDK */}
            <Card className="p-8 bg-white border-slate-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-0 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Smartphone className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">iOS SDK</h3>
                <p className="text-slate-600 mb-6">
                  Native Swift framework for iOS apps with complete credit intelligence features.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Swift 5.0+ Support</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>iOS 13+ Compatible</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>SwiftUI Components</span>
                  </div>
                </div>
                <Button className="w-full bg-slate-100 text-slate-600 hover:bg-slate-200">
                  <span>Coming Soon</span>
                </Button>
              </CardContent>
            </Card>

            {/* Android SDK */}
            <Card className="p-8 bg-white border-slate-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-0 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">A</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Android SDK</h3>
                <p className="text-slate-600 mb-6">
                  Kotlin-first library for Android apps with material design components.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Kotlin & Java Support</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Android 7+ Compatible</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Jetpack Compose</span>
                  </div>
                </div>
                <Button className="w-full bg-slate-100 text-slate-600 hover:bg-slate-200">
                  <span>Coming Soon</span>
                </Button>
              </CardContent>
            </Card>

            {/* Web SDK */}
            <Card className="p-8 bg-white border-slate-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-0 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Web SDK</h3>
                <p className="text-slate-600 mb-6">
                  JavaScript/TypeScript SDK for web applications and progressive web apps.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>TypeScript Support</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>React Components</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Framework Agnostic</span>
                  </div>
                </div>
                <Button className="w-full bg-slate-100 text-slate-600 hover:bg-slate-200">
                  <span>Coming Soon</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* API Endpoints Preview */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Core API Endpoints
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              RESTful API with comprehensive business credit intelligence capabilities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Credit Score Endpoint */}
            <Card className="p-6 bg-white border-slate-200">
              <CardHeader className="p-0 mb-4">
                <div className="flex items-center gap-3">
                  <Badge className="bg-emerald-100 text-emerald-700">GET</Badge>
                  <CardTitle className="text-lg">Credit Score</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="bg-slate-50 p-4 rounded-lg font-mono text-sm mb-4">
                  <div className="text-slate-600">
                    /api/v2/business/credit-score
                  </div>
                </div>
                <p className="text-slate-600 text-sm mb-4">
                  Get comprehensive business credit score with detailed breakdown and factors.
                </p>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="text-xs">
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Try It
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Credit Monitoring Endpoint */}
            <Card className="p-6 bg-white border-slate-200">
              <CardHeader className="p-0 mb-4">
                <div className="flex items-center gap-3">
                  <Badge className="bg-blue-100 text-blue-700">POST</Badge>
                  <CardTitle className="text-lg">Credit Monitoring</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="bg-slate-50 p-4 rounded-lg font-mono text-sm mb-4">
                  <div className="text-slate-600">
                    /api/v2/business/monitor
                  </div>
                </div>
                <p className="text-slate-600 text-sm mb-4">
                  Setup real-time credit monitoring with customizable alert preferences.
                </p>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="text-xs">
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Try It
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Credit Offers Endpoint */}
            <Card className="p-6 bg-white border-slate-200">
              <CardHeader className="p-0 mb-4">
                <div className="flex items-center gap-3">
                  <Badge className="bg-purple-100 text-purple-700">GET</Badge>
                  <CardTitle className="text-lg">Smart Offers</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="bg-slate-50 p-4 rounded-lg font-mono text-sm mb-4">
                  <div className="text-slate-600">
                    /api/v2/business/offers
                  </div>
                </div>
                <p className="text-slate-600 text-sm mb-4">
                  Get personalized financing offers matched to business credit profile.
                </p>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="text-xs">
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Try It
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Credit Building Endpoint */}
            <Card className="p-6 bg-white border-slate-200">
              <CardHeader className="p-0 mb-4">
                <div className="flex items-center gap-3">
                  <Badge className="bg-amber-100 text-amber-700">GET</Badge>
                  <CardTitle className="text-lg">Credit Recommendations</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="bg-slate-50 p-4 rounded-lg font-mono text-sm mb-4">
                  <div className="text-slate-600">
                    /api/v2/business/recommendations
                  </div>
                </div>
                <p className="text-slate-600 text-sm mb-4">
                  Get actionable recommendations to improve business credit score.
                </p>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="text-xs">
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Try It
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Developer Resources */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Developer Resources
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Everything you need to integrate LUMIQ™ into your applications.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 bg-white border-slate-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-0 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Book className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">API Reference</h3>
                <p className="text-slate-600 text-sm mb-4">Complete endpoint documentation with examples and responses.</p>
                <Button size="sm" variant="outline" className="w-full">
                  Coming Soon
                </Button>
              </CardContent>
            </Card>

            <Card className="p-6 bg-white border-slate-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-0 text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Terminal className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Interactive Console</h3>
                <p className="text-slate-600 text-sm mb-4">Test API endpoints directly in your browser with live data.</p>
                <Button size="sm" variant="outline" className="w-full">
                  Coming Soon
                </Button>
              </CardContent>
            </Card>

            <Card className="p-6 bg-white border-slate-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-0 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Code className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Code Examples</h3>
                <p className="text-slate-600 text-sm mb-4">Ready-to-use code snippets in multiple programming languages.</p>
                <Button size="sm" variant="outline" className="w-full">
                  Coming Soon
                </Button>
              </CardContent>
            </Card>

            <Card className="p-6 bg-white border-slate-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-0 text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Key className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Authentication Guide</h3>
                <p className="text-slate-600 text-sm mb-4">Secure API key management and OAuth 2.0 implementation.</p>
                <Button size="sm" variant="outline" className="w-full">
                  Coming Soon
                </Button>
              </CardContent>
            </Card>

            <Card className="p-6 bg-white border-slate-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-0 text-center">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Database className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Webhooks</h3>
                <p className="text-slate-600 text-sm mb-4">Real-time notifications for credit changes and events.</p>
                <Button size="sm" variant="outline" className="w-full">
                  Coming Soon
                </Button>
              </CardContent>
            </Card>

            <Card className="p-6 bg-white border-slate-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-0 text-center">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Users className="h-6 w-6 text-slate-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Developer Support</h3>
                <p className="text-slate-600 text-sm mb-4">24/7 technical support and dedicated developer community.</p>
                <Button size="sm" variant="outline" className="w-full">
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join the waitlist for early access to LUMIQ™ API documentation and SDKs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4">
              Join Waitlist
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-4">
              Contact Sales
            </Button>
          </div>

          <div className="text-slate-400 text-sm">
            Expected release: Q1 2024 • Early access available for enterprise customers
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-2xl font-bold mb-4">LUMIQ™ API</div>
          <p className="text-slate-400 mb-8">
            Powering the future of business credit intelligence
          </p>
          <div className="text-slate-500">
            &copy; 2024 LUMIQ™ by Futeur AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ApiDocs;

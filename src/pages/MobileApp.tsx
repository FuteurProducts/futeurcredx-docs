import { ArrowRight, Download } from "lucide-react"
import { Link } from "react-router-dom"
import QRCodeModal from "@/components/QrCode"

export default function MobileApp() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                FuteurCred Mobile App
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Take control of your business credit journey with our powerful mobile application. 
                Track your credit, discover reporting vendors, and build your business credit profile on the go.
              </p>
              <div className="flex flex-wrap gap-4">
                <QRCodeModal
                  buttonText="App Store"
                  buttonClassName="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-50 transition-colors"
                  title="GET THE FUTEURCRED iOS APP"
                  showIcon={true}
                />
                <QRCodeModal
                  buttonText="Google Play"
                  buttonClassName="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-50 transition-colors"
                  title="GET THE FUTEURCRED ANDROID APP"
                  showIcon={true}
                />
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <div className="absolute -inset-4 bg-blue-400 rounded-3xl opacity-20 blur-xl"></div>
                <div className="relative bg-gray-900 rounded-2xl p-4 shadow-2xl">
                  <img 
                    src="/images/mobile-app-mockup.png" 
                    alt="FuteurCred Mobile App" 
                    className="rounded-xl w-full"
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/600x1200/2563eb/FFFFFF?text=FuteurCred+Mobile+App";
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">
            Powerful Features at Your Fingertips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 12h20"/></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Credit Monitoring</h3>
              <p className="text-gray-600">
                Real-time alerts and updates on your business credit profile changes across all major bureaus.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m16 8-8 8"/><path d="m8 8 8 8"/></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Vendor Discovery</h3>
              <p className="text-gray-600">
                Find and connect with vendors that report to business credit bureaus to build your credit profile.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Credit Journey</h3>
              <p className="text-gray-600">
                Step-by-step guidance to establish and improve your business credit score with actionable tasks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Take Control of Your Business Credit?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Download the FuteurCred mobile app today and start building your business credit profile with confidence.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/credit-journey" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors"
            >
              Start Your Credit Journey
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              to="/business" 
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-300 transition-colors"
            >
              Learn More
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

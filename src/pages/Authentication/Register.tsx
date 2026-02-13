import { SignUp } from "@clerk/clerk-react"
import { Link } from "react-router-dom"
import { Shield, Lock, BrainCircuit, CheckCircle2 } from "lucide-react"

const BENEFITS = [
  "Portfolio analytics across all SMB segments",
  "AI-powered credit scoring and risk profiling",
  "Automated underwriting memo generation",
  "Real-time early warning system alerts",
  "Customizable API integration sandbox",
];

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left Side — Branding Panel */}
      <div className="hidden lg:flex w-[48%] relative bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-violet-600/8 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">LUMIQ.ai</span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
            Start Building<br />Smarter Lending
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed max-w-md mb-10">
            Get access to the full LUMIQ platform. Set up your sandbox environment and integrate in minutes.
          </p>

          <div className="space-y-4 mb-12">
            {BENEFITS.map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <span className="text-slate-300 text-sm">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-xl p-4 max-w-sm">
            <p className="text-indigo-300 text-sm font-medium">Free sandbox access included</p>
            <p className="text-slate-500 text-xs mt-1">No credit card required. Full API access with test data.</p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-6 pt-8 border-t border-white/10">
          <div className="flex items-center gap-2 text-slate-500">
            <Shield className="w-4 h-4" />
            <span className="text-xs font-medium">SOC 2 Type II</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <Lock className="w-4 h-4" />
            <span className="text-xs font-medium">Bank-Grade Encryption</span>
          </div>
          <div className="text-xs text-slate-600">ISO 27001 | GDPR</div>
        </div>
      </div>

      {/* Right Side — Clerk SignUp */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-12 bg-slate-950">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">LUMIQ.ai</span>
          </div>

          <SignUp
            routing="path"
            path="/sign-up"
            signInUrl="/sign-in"
            forceRedirectUrl="/dashboard"
            appearance={{
              elements: {
                rootBox: "w-full",
                cardBox: "w-full shadow-none",
                card: "bg-transparent shadow-none p-0 w-full",
                headerTitle: "text-white text-2xl font-bold",
                headerSubtitle: "text-slate-400",
                socialButtonsBlockButton: "bg-slate-800 border-slate-700 text-white hover:bg-slate-700 transition-all duration-200 rounded-xl h-11",
                socialButtonsBlockButtonText: "text-sm font-medium",
                dividerLine: "bg-slate-800",
                dividerText: "text-slate-500",
                formFieldLabel: "text-slate-300 font-medium text-sm",
                formFieldInput: "bg-slate-900 border-slate-700 text-white rounded-xl h-12 focus:border-indigo-500 focus:ring-indigo-500/20",
                formButtonPrimary: "bg-indigo-600 hover:bg-indigo-500 transition-all duration-200 rounded-xl h-11 text-sm font-semibold",
                footerActionLink: "text-indigo-400 hover:text-indigo-300 font-medium",
                footerActionText: "text-slate-500",
                identityPreviewEditButton: "text-indigo-400",
                formFieldAction: "text-indigo-400 hover:text-indigo-300",
                alert: "bg-red-950/50 border-red-800 text-red-300",
                alertText: "text-red-300",
              },
            }}
          />

          <div className="text-center mt-10">
            <p className="text-slate-600 text-xs">
              &copy; 2026 LUMIQ AI. All Rights Reserved.
            </p>
            <div className="flex items-center justify-center gap-4 mt-2">
              <Link to="/sign-in" className="text-xs text-slate-500 hover:text-indigo-400 transition-colors">
                Already have an account? Sign in
              </Link>
              <span className="text-slate-700">|</span>
              <a href="https://lumiqai.com/privacy" className="text-xs text-slate-500 hover:text-indigo-400 transition-colors">
                Privacy
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

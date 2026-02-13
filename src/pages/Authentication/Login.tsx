import { SignIn } from "@clerk/clerk-react"
import { Link } from "react-router-dom"
import { Shield, Lock, BarChart3, BrainCircuit } from "lucide-react"

const TRUST_BADGES = [
  { label: "SOC 2 Type II", icon: Shield },
  { label: "Bank-Grade Encryption", icon: Lock },
];

const STATS = [
  { value: "200+", label: "Financial Institutions" },
  { value: "$2T+", label: "Assets Monitored" },
  { value: "99.99%", label: "Uptime SLA" },
];

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left Side — Branding Panel */}
      <div className="hidden lg:flex w-[48%] relative bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 flex-col justify-between p-12 overflow-hidden">
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        {/* Gradient orb */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-violet-600/8 rounded-full blur-3xl" />

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">LUMIQ.ai</span>
          </div>

          {/* Hero copy */}
          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
            Enterprise Credit<br />Intelligence Platform
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed max-w-md mb-12">
            AI-powered portfolio analytics, credit scoring, and automated underwriting for commercial lenders.
          </p>

          {/* Stats row */}
          <div className="flex gap-8 mb-12">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 max-w-md backdrop-blur-sm">
            <div className="flex items-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <BarChart3 key={i} className="w-3.5 h-3.5 text-indigo-400" />
              ))}
            </div>
            <p className="text-slate-300 text-sm leading-relaxed italic mb-3">
              "LUMIQ transformed our underwriting pipeline. What used to take 2 weeks now takes 48 hours with better accuracy."
            </p>
            <div className="text-xs text-slate-500">
              <span className="text-slate-400 font-medium">VP Commercial Lending</span> — Top 10 US Bank
            </div>
          </div>
        </div>

        {/* Trust badges at bottom */}
        <div className="relative z-10 flex items-center gap-6 pt-8 border-t border-white/10">
          {TRUST_BADGES.map((badge) => (
            <div key={badge.label} className="flex items-center gap-2 text-slate-500">
              <badge.icon className="w-4 h-4" />
              <span className="text-xs font-medium">{badge.label}</span>
            </div>
          ))}
          <div className="text-xs text-slate-600">ISO 27001 | GDPR | CCPA</div>
        </div>
      </div>

      {/* Right Side — Clerk SignIn */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-12 bg-slate-950">
        <div className="w-full max-w-md">
          {/* Mobile logo (hidden on desktop where left panel shows it) */}
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">LUMIQ.ai</span>
          </div>

          <SignIn
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
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

          {/* Footer */}
          <div className="text-center mt-10">
            <p className="text-slate-600 text-xs">
              &copy; 2026 LUMIQ AI. All Rights Reserved.
            </p>
            <div className="flex items-center justify-center gap-4 mt-2">
              <Link to="/sign-up" className="text-xs text-slate-500 hover:text-indigo-400 transition-colors">
                Create account
              </Link>
              <span className="text-slate-700">|</span>
              <a href="https://lumiqai.com/privacy" className="text-xs text-slate-500 hover:text-indigo-400 transition-colors">
                Privacy
              </a>
              <span className="text-slate-700">|</span>
              <a href="https://lumiqai.com/terms" className="text-xs text-slate-500 hover:text-indigo-400 transition-colors">
                Terms
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { SignIn } from "@clerk/clerk-react"
import { Link } from "react-router-dom"
import { CheckCircle, Shield, Zap } from "lucide-react"
import { motion } from "framer-motion"

const STATS = [
  { value: "200+", label: "Financial Institutions" },
  { value: "$2T+", label: "Assets Monitored" },
  { value: "99.99%", label: "Uptime SLA" },
]

function FadeIn({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: "up" | "none"
}) {
  return (
    <motion.div
      initial={direction === "up" ? { opacity: 0, y: 20 } : { opacity: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function Page() {
  return (
    <div className="min-h-screen flex selection:bg-indigo-600 selection:text-white">
      {/* ── Left: Branding Panel ────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 overflow-hidden">
        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Animated gradient orbs (Sentinel pattern) */}
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.18, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"
          animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.14, 0.08] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Content — justify-between pushes logo top, hero center, stats bottom */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <FadeIn delay={0.1}>
            <Link to="/" className="inline-block">
              <img
                src="/lumiq-logo.svg"
                alt="LUMIQ AI"
                className="h-14 w-auto"
              />
            </Link>
          </FadeIn>

          {/* Hero copy */}
          <div className="max-w-md">
            <motion.h1
              className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Welcome back to enterprise credit intelligence.
            </motion.h1>
            <motion.p
              className="text-lg text-slate-400 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Access your dashboard to manage portfolio analytics, credit scoring, and automated underwriting.
            </motion.p>

            {/* Inline trust badges */}
            <motion.div
              className="flex items-center gap-5 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Shield className="h-4 w-4 text-indigo-400" />
                <span>SOC 2 Certified</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Zap className="h-4 w-4 text-indigo-400" />
                <span>99.99% Uptime</span>
              </div>
            </motion.div>
          </div>

          {/* Stats grid with staggered entrance */}
          <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              >
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-slate-500 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: Clerk Sign-In ───────────────────────────── */}
      <div className="w-full lg:w-1/2 bg-slate-950 flex items-start lg:items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-y-auto">
        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: "radial-gradient(rgba(99,102,241,1) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="w-full max-w-md relative z-10">
          {/* Mobile logo */}
          <FadeIn delay={0.05} className="lg:hidden mb-8 flex justify-center">
            <img src="/lumiq-logo.svg" alt="LUMIQ AI" className="h-10 w-auto" />
          </FadeIn>

          {/* Secure login badge (Sentinel pattern) */}
          <FadeIn delay={0.1}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-950/50 border border-indigo-500/20 text-indigo-400 text-xs mb-6 rounded-full">
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
              SECURE LOGIN
            </div>
          </FadeIn>

          {/* Clerk SignIn component */}
          <FadeIn delay={0.15}>
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
                  headerTitle: "text-white text-2xl font-bold tracking-tight",
                  headerSubtitle: "text-slate-400",
                  socialButtonsBlockButton:
                    "bg-slate-800/50 border-slate-700/50 text-white hover:bg-slate-700/50 transition-all duration-200 rounded-xl h-11",
                  socialButtonsBlockButtonText: "text-sm font-medium",
                  dividerLine: "bg-slate-800",
                  dividerText: "text-slate-500",
                  formFieldLabel: "text-slate-300 font-medium text-sm",
                  formFieldInput:
                    "bg-slate-900/50 border-slate-700/50 text-white rounded-xl h-12 focus:border-indigo-500 focus:ring-indigo-500/20",
                  formButtonPrimary:
                    "bg-indigo-600 hover:bg-indigo-500 transition-all duration-200 rounded-xl h-11 text-sm font-semibold shadow-lg shadow-indigo-600/20 hover:shadow-xl hover:shadow-indigo-600/30",
                  footerActionLink: "text-indigo-400 hover:text-indigo-300 font-medium",
                  footerActionText: "text-slate-500",
                  identityPreviewEditButton: "text-indigo-400",
                  formFieldAction: "text-indigo-400 hover:text-indigo-300",
                  alert: "bg-red-950/50 border-red-800 text-red-300 rounded-xl",
                  alertText: "text-red-300",
                },
              }}
            />
          </FadeIn>

          {/* Security badges (Sentinel pattern) */}
          <FadeIn delay={0.25}>
            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                <span>256-bit encryption</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-indigo-400" />
                <span>SOC 2 compliant</span>
              </div>
            </div>
          </FadeIn>

          {/* Footer */}
          <FadeIn delay={0.3}>
            <div className="text-center mt-6">
              <p className="text-slate-600 text-xs">
                &copy; 2026 LUMIQ AI. All Rights Reserved.
              </p>
              <div className="flex items-center justify-center gap-4 mt-2">
                <a
                  href="https://lumiqai.com/privacy"
                  className="text-xs text-slate-500 hover:text-indigo-400 transition-colors"
                >
                  Privacy
                </a>
                <span className="text-slate-700">|</span>
                <a
                  href="https://lumiqai.com/terms"
                  className="text-xs text-slate-500 hover:text-indigo-400 transition-colors"
                >
                  Terms
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  )
}

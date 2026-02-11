import { useState, useEffect } from "react"
import { useUser, useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import {
  Eye,
  EyeOff,
  ArrowRight,
  ChevronDown,
  BarChart3,
  BrainCircuit,
  FileCheck,
  ActivitySquare,
  ShieldCheck,
  Rocket,
} from "lucide-react"
import loginIllustration from "../../assets/dashboard-assets/login.png"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { logger } from "@/utils/logger"

const DEMO_EMAIL = "demo@partnerbank.com";
const DEMO_PASSWORD = "LumiqDemo2026!";

const FEATURE_HIGHLIGHTS = [
  {
    icon: BarChart3,
    title: "Portfolio Analytics",
    description: "Comprehensive SMB portfolio views with exposure breakdowns and trend analysis",
  },
  {
    icon: BrainCircuit,
    title: "Credit Intelligence",
    description: "AI-driven credit scoring and borrower risk profiling across your book",
  },
  {
    icon: FileCheck,
    title: "AI-Powered Underwriting",
    description: "Automated credit memo generation and decisioning recommendations",
  },
  {
    icon: ActivitySquare,
    title: "Real-time Risk Monitoring",
    description: "Continuous portfolio surveillance with early-warning alerts and triggers",
  },
];

export default function Page() {
  const { user, isSignedIn, isLoaded } = useUser()
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDemoLoading, setIsDemoLoading] = useState(false)
  const [error, setError] = useState("")
  const [showCredentials, setShowCredentials] = useState(true) // Show form by default

  // Redirect if already signed in
  useEffect(() => {
    if (isSignedIn && user) {
      navigate("/dashboard", { replace: true })
    }
  }, [isSignedIn, user, navigate])

  const handleDemoLaunch = async () => {
    if (!isLoaded) return

    setIsDemoLoading(true)
    setError("")

    try {
      // If already signed in or auth is bypassed in dev mode, navigate directly
      if (isSignedIn) {
        navigate("/dashboard", { replace: true })
        return
      }

      // Try sign-in with demo credentials (works with Clerk if configured)
      await signIn(DEMO_EMAIL, DEMO_PASSWORD)
      
      // If sign-in succeeded (or bypassed), navigate to dashboard
      navigate("/dashboard", { replace: true })
    } catch (err: unknown) {
      logger.error("Demo launch error:", err)
      // If auth fails but we're in demo mode, still navigate (auth bypass handles it)
      logger.info("Attempting direct navigation to dashboard...")
      navigate("/dashboard", { replace: true })
    } finally {
      setIsDemoLoading(false)
    }
  }

  const handleCredentialLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return

    setIsLoading(true)
    setError("")

    try {
      if (isSignedIn) {
        navigate("/dashboard", { replace: true })
        return
      }

      await signIn(email, password)
      navigate("/dashboard", { replace: true })
    } catch (err: unknown) {
      logger.error("Sign in error:", err)
      setError(err instanceof Error ? err.message : "An error occurred during sign in")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-card flex">
      {/* Left Side - Illustration Panel */}
      <div className="hidden lg:flex w-[45%] relative bg-muted items-center justify-center p-12">
        <div className="w-full max-w-lg">
          <img
            src={loginIllustration}
            alt="LUMIQ AI Platform illustration"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>

      {/* Right Side - Demo Launcher */}
      <div className="flex-1 flex flex-col items-center justify-start px-4 sm:px-6 lg:px-12 py-6 bg-card overflow-y-auto">
        <div className="w-full max-w-lg">

          {/* Sandbox Banner */}
          <div className="mb-6 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg px-4 py-2.5 flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">
              Sandbox Environment &mdash; All data shown is simulated. Click "Launch Demo" to explore the platform.
            </p>
          </div>

          {/* Hero Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-1 bg-primary rounded-full" />
              <span className="text-sm font-semibold text-primary tracking-wide uppercase">
                LUMIQ AI
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 leading-tight">
              Experience the LUMIQ AI Platform
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
              Explore our SMB credit intelligence dashboard with sample portfolio data
            </p>
          </div>

          {/* Launch Demo CTA */}
          <div className="mb-8">
            {/* Error Message */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-3.5 text-sm mb-4">
                {error}
              </div>
            )}

            <Button
              type="button"
              disabled={isDemoLoading || !isLoaded}
              onClick={handleDemoLaunch}
              className="bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-200 rounded-xl py-7 px-8 w-full text-base flex items-center justify-center gap-3 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDemoLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Launching Demo Environment...
                </>
              ) : (
                <>
                  <Rocket className="w-5 h-5" />
                  Launch Demo
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground mt-3">
              No account required. Click above to instantly explore the platform with sample data.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Key Capabilities
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FEATURE_HIGHLIGHTS.map((feature) => (
                <div
                  key={feature.title}
                  className="flex items-start gap-3 bg-muted/40 dark:bg-muted/20 border border-border/50 rounded-lg p-3.5 transition-colors hover:bg-muted/60 dark:hover:bg-muted/30"
                >
                  <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-foreground leading-tight">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
          </div>

          {/* Collapsible Credential Login */}
          <div className="mb-6">
            <button
              type="button"
              onClick={() => setShowCredentials(!showCredentials)}
              className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              <span className="font-medium">Already have credentials? Sign in</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  showCredentials ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`overflow-hidden transition-all duration-200 ease-in-out ${
                showCredentials ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0"
              }`}
            >
              <div className="bg-card rounded-xl border border-border p-6">
                <form onSubmit={handleCredentialLogin} className="space-y-4">
                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-foreground font-medium text-sm mb-1.5">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="bg-card border-2 border-border text-foreground placeholder-muted-foreground focus:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 rounded-lg py-2.5 px-4 transition-all duration-200 text-sm w-full"
                    />
                  </div>

                  {/* Password Field */}
                  <div>
                    <label htmlFor="password" className="block text-foreground font-medium text-sm mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        className="bg-card border-2 border-border text-foreground placeholder-muted-foreground focus:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 rounded-lg py-2.5 px-4 pr-10 transition-all duration-200 text-sm w-full"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading || !isLoaded}
                    variant="outline"
                    className="border-2 border-border text-foreground font-medium hover:bg-muted transition-all duration-200 rounded-lg py-2.5 px-6 w-full text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-2 pb-4">
            <p className="text-muted-foreground text-xs">
              &copy; 2026 LUMIQ AI. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

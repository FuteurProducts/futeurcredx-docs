import { useState, useEffect } from "react"
import { useUser, useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, ArrowRight } from "lucide-react"
import loginIllustration from "../../assets/dashboard-assets/login.png"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Page() {
  const { user, isSignedIn, isLoaded } = useUser()
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Redirect if already signed in
  useEffect(() => {
    if (isSignedIn && user) {
      navigate("/dashboard", { replace: true })
    }
  }, [isSignedIn, user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return

    setIsLoading(true)
    setError("")

    try {
      // Check if user is already signed in
      if (isSignedIn) {
        navigate("/dashboard", { replace: true })
        return
      }

      await signIn(email, password)
      navigate("/dashboard", { replace: true })
    } catch (err: any) {
      console.error("Sign in error:", err)
      setError(err?.message || "An error occurred during sign in")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex w-1/2 relative bg-[#F4F4F4] items-center justify-center p-12">
        <div className="w-full max-w-lg">
          <img 
            src={loginIllustration} 
            alt="Login illustration" 
            className="w-full h-auto object-contain"
          />
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-12 py-8 bg-white">
        <div className="w-full max-w-md">
          {/* Back to website link */}
          <div className="mb-6">
            <a
              href="/"
              className="text-slate-600 text-sm hover:text-slate-900 transition-colors inline-flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to website
            </a>
          </div>

          {/* Login Form Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 sm:p-10">
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
                Welcome Back!
              </h1>
              <p className="text-slate-600 text-sm sm:text-base">
                Enter your credentials to access your account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 rounded-lg p-4 text-sm">
                  {error}
                </div>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-slate-700 font-medium text-sm mb-2">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="bg-white border-2 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none rounded-lg py-3 px-4 transition-all duration-200 text-sm w-full"
                />
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-slate-700 font-medium text-sm">
                    Password
                  </label>
                  <a
                    href="/forgot-password"
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="min 8 chars"
                    required
                    className="bg-white border-2 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none rounded-lg py-3 px-4 pr-10 transition-all duration-200 text-sm w-full"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || !isLoaded}
                className="bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all duration-200 rounded-lg py-3 px-6 w-full text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
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
                    Login
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-slate-600 text-sm">
                Don't have an account?{" "}
                <a
                  href="/register"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Sign up
                </a>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-slate-500 text-xs sm:text-sm">
              © 2025 FUTEURCREDX API. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


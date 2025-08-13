import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SignUp } from '@clerk/clerk-react'

const Register: React.FC = () => {

  return (
    <div className="min-h-screen bg-[#0E0E10] text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url(/grid.png)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>
      
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <h1 className="text-3xl font-black uppercase tracking-tight">FUTEURCREDX</h1>
            </Link>
            <p className="mt-4 text-gray-400 text-lg">Create your account to start using our APIs</p>
          </div>

          {/* Clerk Sign Up Component */}
          <div className="flex justify-center">
            <SignUp 
              afterSignUpUrl="/business-signup"
              afterSignInUrl="/dashboard"
              appearance={{
                elements: {
                  rootBox: "w-full max-w-md",
                  card: "bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl p-8",
                  headerTitle: "text-white font-black uppercase tracking-tight text-2xl mb-2",
                  headerSubtitle: "text-gray-400 text-sm font-medium mb-6",
                  socialButtonsBlockButton: "bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-200 rounded-xl font-semibold py-3 mb-4",
                  socialButtonsBlockButtonText: "font-semibold text-white",
                  dividerLine: "bg-white/20",
                  dividerText: "text-gray-400 font-medium uppercase tracking-wide text-xs",
                  formFieldInput: "bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-white/30 focus:ring-2 focus:ring-white/10 rounded-xl py-3 px-4 transition-all duration-200",
                  formFieldLabel: "text-white font-bold uppercase tracking-wide text-xs mb-2",
                  formButtonPrimary: "bg-white text-black font-black uppercase tracking-wide hover:bg-gray-100 transition-all duration-200 rounded-xl py-3 w-full",
                  footerActionLink: "text-white hover:text-gray-300 font-semibold transition-colors duration-200",
                  identityPreviewText: "text-white",
                  formFieldInputShowPasswordButton: "text-gray-400 hover:text-white",
                  alertError: "bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-3",
                  formFieldSuccessText: "text-green-400",
                  formFieldErrorText: "text-red-400 text-sm mt-1",
                  otpCodeFieldInput: "bg-white/5 border border-white/10 text-white rounded-lg",
                  formResendCodeLink: "text-white hover:text-gray-300 font-semibold",
                  verificationLinkStatusText: "text-gray-400",
                  verificationLinkStatusIconBox: "text-gray-400",
                },
                variables: {
                  colorPrimary: "#ffffff",
                  colorBackground: "transparent",
                  colorInputBackground: "rgba(255, 255, 255, 0.05)",
                  colorInputText: "#ffffff",
                  colorText: "#ffffff",
                  colorTextSecondary: "#9ca3af",
                  borderRadius: "12px",
                }
              }}
            />
          </div>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <Link
              to="/docs"
              className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
            >
              ← Back to API Documentation
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Register

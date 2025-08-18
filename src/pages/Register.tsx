import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SignUp } from '@clerk/clerk-react'

const Register: React.FC = () => {

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url(/grid.png)] bg-center [mask-image:linear-gradient(180deg,black,rgba(0,0,0,0))] opacity-5"></div>
      
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
            <p className="mt-4 text-gray-600 text-lg">Create your account to start using our APIs</p>
          </div>

          {/* Clerk Sign Up Component */}
          <div className="flex justify-center">
            <SignUp 
              afterSignUpUrl="/business-signup"
              afterSignInUrl="/dashboard"
              appearance={{
                elements: {
                  rootBox: "w-full max-w-md",
                  card: "bg-white backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl p-8",
                  headerTitle: "text-black font-black uppercase tracking-tight text-2xl mb-2",
                  headerSubtitle: "text-gray-600 text-sm font-medium mb-6",
                  socialButtonsBlockButton: "bg-gray-100 border border-gray-200 text-black hover:bg-gray-200 transition-all duration-200 rounded-xl font-semibold py-3 mb-4",
                  socialButtonsBlockButtonText: "font-semibold text-black",
                  dividerLine: "bg-gray-200",
                  dividerText: "text-gray-600 font-medium uppercase tracking-wide text-xs",
                  formFieldInput: "bg-gray-50 border border-gray-200 text-black placeholder-gray-500 focus:border-black focus:ring-2 focus:ring-gray-100 rounded-xl py-3 px-4 transition-all duration-200",
                  formFieldLabel: "text-black font-bold uppercase tracking-wide text-xs mb-2",
                  formButtonPrimary: "bg-black text-white font-black uppercase tracking-wide hover:bg-gray-800 transition-all duration-200 rounded-xl py-3 w-full",
                  footerActionLink: "text-black hover:text-gray-600 font-semibold transition-colors duration-200",
                  identityPreviewText: "text-black",
                  formFieldInputShowPasswordButton: "text-gray-600 hover:text-black",
                  alertError: "bg-red-50 border border-red-200 text-red-600 rounded-xl p-3",
                  formFieldSuccessText: "text-green-600",
                  formFieldErrorText: "text-red-600 text-sm mt-1",
                  otpCodeFieldInput: "bg-gray-50 border border-gray-200 text-black rounded-lg",
                  formResendCodeLink: "text-black hover:text-gray-600 font-semibold",
                  verificationLinkStatusText: "text-gray-600",
                  verificationLinkStatusIconBox: "text-gray-600",
                },
                variables: {
                  colorPrimary: "#000000",
                  colorBackground: "#ffffff",
                  colorInputBackground: "#f9fafb",
                  colorInputText: "#000000",
                  colorText: "#000000",
                  colorTextSecondary: "#6b7280",
                  borderRadius: "12px",
                }
              }}
            />
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <Link
              to="/docs"
              className="text-gray-600 hover:text-black transition-colors text-sm font-medium"
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

import { motion } from "framer-motion"
import { SignIn } from "@clerk/clerk-react"
import { Code2, Shield, Zap, ArrowLeft } from "lucide-react"

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:14px_24px]"></div>

      <div className="relative z-10 min-h-screen flex">
        <div className="hidden lg:flex lg:w-1/2 bg-gray-50/50 backdrop-blur-sm border-r border-gray-200 flex-col justify-between p-12">
          <div>
            <div className="inline-block mb-12">
              <h1 className="text-4xl font-bold text-black tracking-tight">
                FUTEURCREDX
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Developer API Platform</p>
            </div>

            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-start space-x-4"
              >
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Code2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-black mb-2">Powerful APIs</h3>
                  <p className="text-gray-600">
                    Access enterprise-grade APIs with comprehensive documentation and SDKs.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-start space-x-4"
              >
                <div className="bg-green-100 p-3 rounded-lg">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-black mb-2">Secure & Reliable</h3>
                  <p className="text-gray-600">
                    Enterprise-level security with 99.9% uptime SLA and global CDN.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-start space-x-4"
              >
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-black mb-2">Sandbox Environment</h3>
                  <p className="text-gray-600">
                    Test and prototype with our full-featured sandbox before going live.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <p>© 2024 FUTEURCREDX. All rights reserved.</p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            {/* Mobile header */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-block">
                <h1 className="text-3xl font-bold text-black tracking-tight">
                  FUTEURCREDX
                </h1>
                <p className="text-gray-600 mt-2">Developer API Platform</p>
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-black mb-2">Welcome back</h2>
              <p className="text-gray-600">Sign in to access your API dashboard and sandbox environment</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden max-w-5xl mx-auto">
              <div className="px-8 py-20">
                <SignIn
                  redirectUrl="/dashboard"
                  signUpUrl="/register"
                  appearance={{
                    elements: {
                      rootBox: "w-full max-w-none",
                      card: "bg-transparent shadow-none border-0 p-6 m-0 w-full max-w-none",
                      headerTitle: "text-black font-bold text-2xl mb-3 text-center",
                      headerSubtitle: "text-gray-600 text-base mb-8 text-center leading-relaxed",
                      socialButtonsBlockButton:
                        "bg-gray-50 border border-gray-200 text-black hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 rounded-lg font-medium py-3.5 px-5 mb-4 text-base shadow-sm hover:shadow-md w-full",
                      socialButtonsBlockButtonText: "font-medium text-black text-base",
                      socialButtonsBlockButtonArrowIcon: "text-gray-500",
                      socialButtonsProviderIcon: "w-5 h-5",
                      dividerLine: "bg-gray-200 my-6",
                      dividerText: "text-gray-500 font-medium text-sm px-4 bg-white",
                      formFieldInput:
                        "bg-gray-50 border border-gray-200 text-black placeholder-gray-500 focus:border-black focus:ring-1 focus:ring-black/20 focus:bg-white rounded-lg py-3.5 px-4 transition-all duration-200 text-base w-full",
                      formFieldLabel: "text-black font-semibold text-sm mb-2 tracking-wide",
                      formButtonPrimary:
                        "bg-black text-white font-semibold hover:bg-gray-800 transition-all duration-200 rounded-lg py-3.5 px-5 w-full text-base shadow-md hover:shadow-lg",
                      footerActionLink: "text-black hover:text-gray-600 font-medium transition-colors duration-200 text-base",
                      identityPreviewText: "text-black text-base",
                      formFieldInputShowPasswordButton: "text-gray-500 hover:text-black transition-colors p-2",
                      alertError: "bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-4 text-sm",
                      formFieldSuccessText: "text-green-600 text-sm mt-2",
                      formFieldErrorText: "text-red-600 text-sm mt-2",
                      otpCodeFieldInput: "bg-gray-50 border border-gray-200 text-black rounded-lg py-3 px-4 text-center text-lg font-mono",
                      formResendCodeLink: "text-black hover:text-gray-600 font-medium transition-colors text-sm",
                      footer: "mt-8 pt-6 border-t border-gray-100 text-center",
                      formFieldRow: "mb-6",
                      formField: "mb-6",
                      main: "space-y-6 w-full max-w-none",
                      formHeaderTitle: "text-black font-bold text-2xl mb-3 text-center",
                      formHeaderSubtitle: "text-gray-600 text-base mb-8 text-center",
                      socialButtonsBlock: "w-full max-w-none",
                      formFieldsContainer: "w-full max-w-none",
                    },
                    variables: {
                      colorPrimary: "#000000",
                      colorBackground: "#ffffff",
                      colorInputBackground: "#f9fafb",
                      colorInputText: "#000000",
                      colorText: "#000000",
                      colorTextSecondary: "#6b7280",
                      borderRadius: "8px",
                      spacingUnit: "1rem",
                      fontSize: "16px",
                    },
                  }}
                />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <a
                  href="/docs"
                  className="flex items-center text-gray-600 hover:text-black transition-colors font-medium"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  API Documentation
                </a>
                <a
                  href="/support"
                  className="text-gray-600 hover:text-black transition-colors font-medium"
                >
                  Need help?
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}


import { SignIn } from "@clerk/clerk-react"

export default function Page() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Back to website button */}
      <div className="p-4 sm:p-6">
        <a
          href="/"
          className="text-white text-xs sm:text-sm font-mono hover:text-gray-300 transition-colors"
        >
          &lt; Back to website
        </a>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-4 min-h-0">
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
          {/* Brand */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-white text-lg sm:text-xl md:text-2xl font-normal mb-2">FUTEURCREDX</h1>
          </div>

          {/* Login form container */}
          <div className="bg-black border border-white rounded-lg p-4 sm:p-6 md:p-8">
            <SignIn
              redirectUrl="/dashboard"
              signUpUrl="/register"
              appearance={{
                elements: {
                  rootBox: "w-full max-w-full",
                  card: "bg-transparent shadow-none border-0 p-0 m-0 w-full max-w-full",
                  headerTitle: "text-white font-normal text-sm sm:text-base md:text-lg mb-3 sm:mb-4 md:mb-6 text-left",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "hidden",
                  socialButtonsBlockButtonText: "hidden",
                  socialButtonsProviderIcon: "hidden",
                  socialButtonsBlock: "hidden",
                  dividerLine: "hidden",
                  dividerText: "hidden",
                  formFieldRow: "w-full mb-3 sm:mb-4",
                  formFieldInput:
                    "bg-black border border-white text-white placeholder-gray-500 focus:border-white focus:ring-0 rounded-md py-2 sm:py-3 px-3 sm:px-4 transition-all duration-200 text-xs sm:text-sm w-full min-w-0",
                  formFieldLabel: "text-white font-normal text-xs sm:text-sm mb-1 sm:mb-2",
                  formButtonPrimary:
                    "bg-white text-black font-normal hover:bg-gray-100 transition-all duration-200 rounded-md py-2 sm:py-3 px-3 sm:px-4 w-full text-xs sm:text-sm min-w-0",
                  footerActionLink: "text-white hover:text-gray-300 font-normal transition-colors duration-200 text-xs sm:text-sm",
                  identityPreviewText: "text-white text-xs sm:text-sm",
                  formFieldInputShowPasswordButton: "text-gray-400 hover:text-white transition-colors p-1 sm:p-2",
                  alertError: "bg-red-900/20 border border-red-800 text-red-400 rounded-md p-2 sm:p-3 mb-3 sm:mb-4 text-xs sm:text-sm",
                  formFieldSuccessText: "text-green-400 text-xs sm:text-sm mt-1 sm:mt-2",
                  formFieldErrorText: "text-red-400 text-xs sm:text-sm mt-1 sm:mt-2",
                  otpCodeFieldInput: "bg-black border border-white text-white rounded-md py-2 sm:py-3 px-2 sm:px-4 text-center text-sm sm:text-lg font-mono min-w-0",
                  footer: "w-full max-w-full mt-4 sm:mt-6 text-center",
                  footerAction: "w-full max-w-full text-center",
                  formResendCodeLink: "text-white hover:text-gray-300 font-normal transition-colors text-xs sm:text-sm",
                  formField: "mb-3 sm:mb-4",
                  main: "space-y-3 sm:space-y-4 w-full",
                  formFieldsContainer: "w-full",
                },
                variables: {
                  colorPrimary: "#ffffff",
                  colorBackground: "#000000",
                  colorInputBackground: "#000000",
                  colorInputText: "#ffffff",
                  colorText: "#ffffff",
                  colorTextSecondary: "#9ca3af",
                  borderRadius: "6px",
                  spacingUnit: "1rem",
                  fontSize: "14px",
                },
              }}
            />
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-gray-500 text-xs">
              © 2025 FUTEURCREDX API. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


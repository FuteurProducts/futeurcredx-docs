import { SignIn } from "@clerk/clerk-react"

export default function Page() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Back to website button */}
      <div className="p-6">
        <a
          href="/"
          className="text-white text-sm font-mono hover:text-gray-300 transition-colors"
        >
          &lt; Back to website
        </a>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          {/* Brand */}
          <div className="text-center mb-12">
            <h1 className="text-white text-2xl font-normal mb-2">FUTEURCREDX</h1>
          </div>

          {/* Login form container */}
          <div className="bg-black border border-white rounded-lg p-8">
            <SignIn
              redirectUrl="/dashboard"
              signUpUrl="/register"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "bg-transparent shadow-none border-0 p-0 m-0 w-full",
                  headerTitle: "text-white font-normal text-xl mb-8 text-left",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "hidden",
                  socialButtonsBlockButtonText: "hidden",
                  socialButtonsProviderIcon: "hidden",
                  socialButtonsBlock: "hidden",
                  dividerLine: "hidden",
                  dividerText: "hidden",
                  formFieldInput:
                    "bg-black border border-white text-white placeholder-gray-500 focus:border-white focus:ring-0 rounded-md py-3 px-4 transition-all duration-200 text-sm w-full",
                  formFieldLabel: "text-white font-normal text-sm mb-2",
                  formButtonPrimary:
                    "bg-white text-black font-normal hover:bg-gray-100 transition-all duration-200 rounded-md py-3 px-4 w-full text-sm",
                  footerActionLink: "text-white hover:text-gray-300 font-normal transition-colors duration-200 text-sm",
                  identityPreviewText: "text-white text-sm",
                  formFieldInputShowPasswordButton: "text-gray-400 hover:text-white transition-colors p-2",
                  alertError: "bg-red-900/20 border border-red-800 text-red-400 rounded-md p-3 mb-4 text-sm",
                  formFieldSuccessText: "text-green-400 text-sm mt-2",
                  formFieldErrorText: "text-red-400 text-sm mt-2",
                  otpCodeFieldInput: "bg-black border border-white text-white rounded-md py-3 px-4 text-center text-lg font-mono",
                  formResendCodeLink: "text-white hover:text-gray-300 font-normal transition-colors text-sm",
                  footer: "mt-6 text-center",
                  formFieldRow: "mb-4",
                  formField: "mb-4",
                  main: "space-y-4 w-full",
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


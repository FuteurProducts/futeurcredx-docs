import { SignIn } from "@clerk/clerk-react"

export default function Page() {
  return (
    <>
      <style>{`
        @media (max-width: 640px) {
          .cl-formFieldInput {
            font-size: 14px !important;
            padding: 8px 12px !important;
          }
          .cl-formButtonPrimary {
            font-size: 14px !important;
            padding: 8px 12px !important;
          }
          .cl-headerTitle {
            font-size: 16px !important;
            margin-bottom: 12px !important;
          }
          .cl-footerActionLink {
            font-size: 14px !important;
          }
          .cl-formFieldLabel {
            font-size: 12px !important;
            margin-bottom: 4px !important;
          }
          .cl-main {
            padding: 0 !important;
          }
          .cl-card {
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      `}</style>
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
              <div className="text-center mb-6">
                <h2 className="text-white text-lg mb-4">Sign In</h2>
                <p className="text-gray-400 text-sm mb-6">
                  To test authentication, please add localhost:8080 to your Clerk Dashboard domains.
                </p>
                <div className="bg-yellow-900/20 border border-yellow-800 text-yellow-400 rounded-md p-4 mb-4">
                  <p className="text-sm">
                    <strong>Setup Required:</strong><br/>
                    1. Go to <a href="https://clerk.app.futeur.ai" target="_blank" className="underline">Clerk Dashboard</a><br/>
                    2. Settings → Domains<br/>
                    3. Add: localhost:8080
                  </p>
                </div>
                <a 
                  href="https://clerk.app.futeur.ai" 
                  target="_blank"
                  className="inline-block bg-white text-black px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  Open Clerk Dashboard
                </a>
              </div>
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
    </>
  )
}
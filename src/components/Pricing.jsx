"use client"
import React from "react"
import { ArrowRight, Info, X } from "lucide-react"
import { useNavigate } from "react-router-dom"

// Dialog component
const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">{children}</div>
    </div>
  )
}

// DialogContent component
const DialogContent = ({ children, className = "", onClose }) => {
  return (
    <div className={`p-4 sm:p-6 ${className} relative`}>
      {children}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
      >
        <X className="h-4 w-4 sm:h-5 sm:w-5 text-black" />
      </button>
    </div>
  )
}

// DialogHeader component
const DialogHeader = ({ children }) => {
  return <div className="mb-4 pr-8">{children}</div>
}

// DialogTitle component
const DialogTitle = ({ children }) => {
  return <h2 className="text-lg sm:text-xl font-semibold text-black">{children}</h2>
}

const Pricing = () => {
  const navigate = useNavigate()
  const [showModal, setShowModal] = React.useState(false)

  const handleSubscribeClick = () => {
    navigate("/futeurcred-plus")
  }

  const handleSeeHowItWorksClick = () => {
    navigate("/SeeHowItWorks")
  }

  const handleSeeSamplesClick = () => {
    navigate("/SeeSample")
  }

  return (
    <>
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent onClose={() => setShowModal(false)}>
          <DialogHeader>
            <DialogTitle>Exclusive Early Access</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 sm:space-y-4 text-black text-sm sm:text-base">
            <p>
              Be among the first 500,000 businesses to gain executive-level access to upcoming FuteurAI innovations,
              including:
            </p>
            <ul className="space-y-2 pl-4 sm:pl-6">
              <li className="list-disc">
                <span className="font-semibold">Futeur Intelligence:</span> Advanced AI tools tailored to your business
                needs.
              </li>
              <li className="list-disc">
                <span className="font-semibold">Digital Banking Products:</span> Access to our suite of digital banking
                solutions designed for seamless financial management.
              </li>
            </ul>
          </div>
        </DialogContent>
      </Dialog>

      <div className="relative py-8 sm:py-12 md:py-20 lg:py-32 px-4 sm:px-6 bg-white overflow-x-hidden" style={{backgroundColor: '#ffffff'}}>
        <div className="max-w-2xl mx-auto w-full">
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-black mb-4 sm:mb-6 md:mb-8 tracking-tighter leading-none px-4 sm:px-0">
              SIMPLE PRICING
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-xl mx-auto leading-relaxed px-2">
              One plan, infinite possibilities. No hidden fees, no complex tiers.
            </p>
          </div>

          {/* Pricing Card */}
          <div
            className="bg-gray-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 cursor-pointer hover:bg-gray-100 transition-colors group relative"
            onClick={handleSubscribeClick}
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-8">
              <div className="flex-1">
                {/* Plan Title */}
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 sm:mb-6 text-black">
                  FUTEURCREDX +
                </h2>

                {/* Pricing */}
                <div className="mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-black line-through opacity-70">
                      $32
                    </span>
                    <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-black opacity-60">FREE</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm sm:text-base md:text-lg text-gray-600">
                      First month free, then $32/month
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mb-4 sm:mb-6 break-words">
                  For businesses ready to transform — get AI-powered insights, credit monitoring, and exclusive early
                  access to revolutionary tools worth thousands annually.
                </p>

                {/* Early Access Info */}
                <div className="flex items-center text-xs sm:text-sm text-gray-600 mb-4">
                  <span>Exclusive Early Access</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowModal(true)
                    }}
                    className="ml-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <Info className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                </div>
              </div>

              {/* Arrow Icon */}
              <div className="flex-shrink-0 self-center sm:self-start">
                <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default Pricing


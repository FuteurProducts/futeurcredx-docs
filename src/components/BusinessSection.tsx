
"use client"

// Custom Button Component
const Button = ({ children, className = "", ...props }) => {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default function BusinessSection() {
  return (
    <div className="bg-black text-white">
      <div className="container mx-auto px-6 py-12 lg:py-16 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Image Section */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden">
              <img
                src="/lumiq.png"
                alt="LUMIQ Credit Journey Platform"
                className="w-full h-auto object-cover"
                style={{ aspectRatio: "500/600" }}
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-[36px] lg:text-[42px] font-extrabold leading-tight tracking-tight">
                MORE THAN JUST
                <br />
                THE ESSENTIALS
              </h2>

              <p className="text-sm md:text-base text-gray-300 leading-normal max-w-md">
                Your Lumiq account doesn't just show your credit. It trains it, strengthens it, and gets it ready for anything.
              </p>
            </div>

            <div className="mt-5">
              <ul className="space-y-2 text-white">
                <li className="flex items-start">
                  <span className="text-lg mr-2">✓</span>
                  <span className="text-sm md:text-base">Track your FSR & Intelliscore Plus™ in real-time</span>
                </li>
                <li className="flex items-start">
                  <span className="text-lg mr-2">✓</span>
                  <span className="text-sm md:text-base">See exactly where you stand — and why. Lumiq gives daily visibility into risk tiers, trends, and next moves.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-lg mr-2">✓</span>
                  <span className="text-sm md:text-base">Understand what's impacting your score</span>
                </li>
                <li className="flex items-start">
                  <span className="text-lg mr-2">✓</span>
                  <span className="text-sm md:text-base">
                    Uncover the real reasons behind credit drops or gains, from payment behavior to public records.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-lg mr-2">✓</span>
                  <span className="text-sm md:text-base">
                    Get smarter recommendations every day
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-lg mr-2">✓</span>
                  <span className="text-sm md:text-base">We don't just flag problems — Lumiq guides you with AI-backed tips to build a stronger credit profile.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-lg mr-2">✓</span>
                  <span className="text-sm md:text-base">Dispute errors & monitor activity easily</span>
                </li>
                <li className="flex items-start">
                  <span className="text-lg mr-2">✓</span>
                  <span className="text-sm md:text-base">No more waiting. Raise disputes, track resolution progress, and stay ahead of surprises.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-lg mr-2">✓</span>
                  <span className="text-sm md:text-base">Build lender-ready profiles</span>
                </li>
                <li className="flex items-start">
                  <span className="text-lg mr-2">✓</span>
                  <span className="text-sm md:text-base">From insights to print-ready reports, Lumiq arms you with the data lenders want to see.</span>
                </li>
              </ul>
            </div>

            <div className="mt-6">
              <p className="text-sm md:text-base text-gray-300 mb-4">
                Every login moves you forward — toward approvals, growth, and financial control.
              </p>
              <a href="https://app.futeur.ai/signup/business" target="_blank" rel="noopener noreferrer">
                <Button
                  className="bg-white text-black hover:bg-gray-100 font-medium px-6 py-2.5 rounded-full text-sm md:text-base transition-all duration-200 hover:scale-105"
                >
                  Open Account
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .container {
          width: 100%;
        }
        
        @media (min-width: 1024px) {
          .container {
            max-width: 1200px;
          }
        }
        
        .space-y-8 > * + * {
          margin-top: 2rem;
        }
        
        .space-y-6 > * + * {
          margin-top: 1.5rem;
        }
        
        .space-y-4 > * + * {
          margin-top: 1rem;
        }
        
        .space-y-3 > * + * {
          margin-top: 0.75rem;
        }
        
        .gap-3 {
          gap: 0.75rem;
        }
        
        .gap-12 {
          gap: 3rem;
        }
        
        @media (min-width: 1024px) {
          .lg\\:gap-16 {
            gap: 4rem;
          }
        }
        
        .grid {
          display: grid;
        }
        
        @media (min-width: 1024px) {
          .lg\\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        
        .items-center {
          align-items: center;
        }
        
        .items-start {
          align-items: flex-start;
        }
        
        .flex {
          display: flex;
        }
        
        .flex-shrink-0 {
          flex-shrink: 0;
        }
        
        .leading-tight {
          line-height: 1.25;
        }
        
        .leading-relaxed {
          line-height: 1.625;
        }
        
        .tracking-tight {
          letter-spacing: -0.025em;
        }
        
        .max-w-lg {
          max-width: 32rem;
        }
        
        .rounded-3xl {
          border-radius: 1.5rem;
        }
        
        .rounded-full {
          border-radius: 9999px;
        }
        
        .overflow-hidden {
          overflow: hidden;
        }
        
        .object-cover {
          object-fit: cover;
        }
        
        .w-full {
          width: 100%;
        }
        
        .h-auto {
          height: auto;
        }
        
        .w-2 {
          width: 0.5rem;
        }
        
        .h-2 {
          height: 0.5rem;
        }
        
        .mt-2 {
          margin-top: 0.5rem;
        }
        
        .px-6 {
          padding-left: 1.5rem;
          padding-right: 1.5rem;
        }
        
        .py-16 {
          padding-top: 4rem;
          padding-bottom: 4rem;
        }
        
        .px-8 {
          padding-left: 2rem;
          padding-right: 2rem;
        }
        
        .py-3 {
          padding-top: 0.75rem;
          padding-bottom: 0.75rem;
        }
        
        .pt-4 {
          padding-top: 1rem;
        }
        
        @media (min-width: 1024px) {
          .lg\\:py-24 {
            padding-top: 6rem;
            padding-bottom: 6rem;
          }
          
          .lg\\:text-5xl {
            font-size: 3rem;
            line-height: 1;
          }
          
          .lg\\:text-xl {
            font-size: 1.25rem;
            line-height: 1.75rem;
          }
          
          .lg\\:text-lg {
            font-size: 1.125rem;
            line-height: 1.75rem;
          }
        }
        
        @media (min-width: 1280px) {
          .xl\\:text-6xl {
            font-size: 3.75rem;
            line-height: 1;
          }
        }
        
        .text-4xl {
          font-size: 2.25rem;
          line-height: 2.5rem;
        }
        
        .text-lg {
          font-size: 1.125rem;
          line-height: 1.75rem;
        }
        
        .text-base {
          font-size: 1rem;
          line-height: 1.5rem;
        }
        
        .font-bold {
          font-weight: 700;
        }
        
        .font-medium {
          font-weight: 500;
        }
        
        .text-white {
          color: rgb(255 255 255);
        }
        
        .text-gray-300 {
          color: rgb(209 213 219);
        }
        
        .text-gray-200 {
          color: rgb(229 231 235);
        }
        
        .text-black {
          color: rgb(0 0 0);
        }
        
        .bg-black {
          background-color: rgb(0 0 0);
        }
        
        .bg-white {
          background-color: rgb(255 255 255);
        }
        
        .hover\\:bg-gray-100:hover {
          background-color: rgb(243 244 246);
        }
        
        .hover\\:scale-105:hover {
          transform: scale(1.05);
        }
        
        .transition-all {
          transition-property: all;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 150ms;
        }
        
        .duration-200 {
          transition-duration: 200ms;
        }
        
        .min-h-screen {
          min-height: 100vh;
        }
        
        .mx-auto {
          margin-left: auto;
          margin-right: auto;
        }
        
        .relative {
          position: relative;
        }
        
        .inline-flex {
          display: inline-flex;
        }
        
        .justify-center {
          justify-content: center;
        }
        
        .rounded-md {
          border-radius: 0.375rem;
        }
        
        .text-sm {
          font-size: 0.875rem;
          line-height: 1.25rem;
        }
        
        .focus-visible\\:outline-none:focus-visible {
          outline: 2px solid transparent;
          outline-offset: 2px;
        }
        
        .focus-visible\\:ring-2:focus-visible {
          box-shadow: 0 0 0 2px currentColor;
        }
        
        .disabled\\:opacity-50:disabled {
          opacity: 0.5;
        }
        
        .disabled\\:pointer-events-none:disabled {
          pointer-events: none;
        }
        
        .cursor-pointer {
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}

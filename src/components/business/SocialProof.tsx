"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Star, CheckCircle, UtensilsCrossed, Monitor, Store, Users } from "lucide-react"

const SocialProof = () => {
  const successStories = [
    {
      icon: UtensilsCrossed,
      business: "Restaurant Owner",
      name: "Maria Rodriguez",
      location: "Austin, TX",
      membership: "FUTEURCRED Member since 2023",
      before: "Using NAV's fragments, missing 60% of reporting vendors",
      after: "Full vendor universe visible, FSR improved from 23 to 47, $125K approved",
      scoreJump: { from: 23, to: 47, label: "FSR Score" },
      quote: "Finally see my complete credit ecosystem - not just fragments!",
      savings: "Avoided $18K in personal guarantees",
      highlight: "$125K Approved",
      timeframe: "6 months",
      profileImage: "https://randomuser.me/api/portraits/women/42.jpg"
    },
    {
      icon: Monitor,
      business: "SaaS Founder",
      name: "David Chen",
      location: "San Francisco, CA",
      membership: "LUMIQ Journey Member",
      before: "Credit Karma told me nothing about business credit reality",
      after: "Built 5 PG-free tradelines, trade payment health improved to 95%",
      scoreJump: { from: 0, to: 41, label: "FSR Score" },
      quote: "This isn't monitoring - it's a complete operating system!",
      savings: "Unlocked $2.1M without personal risk",
      highlight: "$2.1M Unlocked",
      timeframe: "4 months",
      profileImage: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      icon: Store,
      business: "Retail Chain Owner",
      name: "Jennifer Park",
      location: "Miami, FL",
      membership: "FUTEURCRED Power User",
      before: "Paying $200/mo for NAV + Dun & Bradstreet separately",
      after: "All-in-one cosmic dashboard + 18-point Intelliscore improvement",
      scoreJump: { from: 61, to: 79, label: "Intelliscore" },
      quote: "From fragments to full spectrum - this is the future!",
      savings: "Saves $2,400/year on fragmented tools",
      highlight: "+18 Points",
      timeframe: "8 months",
      profileImage: "https://randomuser.me/api/portraits/women/56.jpg"
    },
  ]

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-800 mb-4 sm:mb-6 leading-tight tracking-tight">
            FROM FRAGMENTS TO
            <br />
            <span className="text-blue-600">FULL SPECTRUM</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Business owners who upgraded from traditional tools to the complete operating system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {successStories.map((story, index) => {
            const IconComponent = story.icon
            return (
              <Card
                key={index}
                className="group relative overflow-hidden bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-500 hover:scale-[1.02]"
              >
                <CardContent className="p-6 sm:p-8">
                  {/* Header with Profile Image, Icon and Info */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="relative">
                      <img 
                        src={story.profileImage} 
                        alt={`${story.name} profile`} 
                        className="h-16 w-16 rounded-full object-cover border-2 border-gray-200" 
                        onError={(e) => {
                          e.currentTarget.src = 'https://placehold.co/200x200/e2e8f0/475569?text=Profile';
                        }}
                      />
                      <div className="absolute -bottom-2 -right-2 p-2 bg-blue-500 rounded-full border-2 border-white">
                        <IconComponent className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg sm:text-xl text-gray-800 mb-1">{story.name}</h3>
                      <p className="text-sm text-gray-600 mb-1">{story.business}</p>
                      <p className="text-xs text-gray-500">{story.location}</p>
                      <Badge className="text-xs bg-blue-100 text-blue-800 border-blue-200 mt-2">{story.membership}</Badge>
                    </div>
                  </div>

                  {/* Score Transformation - Visual */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-700 uppercase tracking-wide font-semibold">{story.scoreJump.label}</span>
                      <span className="text-xs text-gray-600">{story.timeframe}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-xl sm:text-2xl font-bold text-gray-500">{story.scoreJump.from}</div>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transform transition-all duration-1000 group-hover:scale-x-110"></div>
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-blue-700">{story.scoreJump.to}</div>
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-center mt-2">
                      <span className="inline-flex items-center gap-1 text-sm font-bold text-blue-700">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        {story.highlight}
                      </span>
                    </div>
                  </div>

                  {/* Before/After Comparison */}
                  <div className="space-y-3 mb-6">
                    <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-gray-400">
                      <p className="text-xs sm:text-sm text-gray-700">
                        <span className="font-semibold text-gray-700">Before:</span> {story.before}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                      <p className="text-xs sm:text-sm text-gray-700">
                        <span className="font-semibold text-blue-700">After:</span> {story.after}
                      </p>
                    </div>
                  </div>

                  {/* Quote */}
                  <blockquote className="relative p-4 bg-gray-50 rounded-lg border border-gray-200 mb-4">
                    <div className="absolute top-2 left-3 text-blue-300 text-2xl font-serif">"</div>
                    <p className="text-sm italic text-gray-700 pl-4 pr-2">{story.quote}</p>
                    <div className="flex items-center gap-1 mt-3 pl-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </blockquote>

                  {/* Savings Highlight */}
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <p className="text-xs sm:text-sm font-semibold text-center text-blue-700">{story.savings}</p>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-4 right-4 w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-4 left-4 w-1 h-1 bg-blue-200 rounded-full animate-pulse delay-1000"></div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 sm:mt-16">
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            Join thousands of business owners who've upgraded to the complete system
          </p>
          <div className="inline-flex items-center gap-3 bg-blue-50 px-6 py-3 rounded-full border border-blue-200 shadow-sm">
            <Users className="h-5 w-5 text-blue-600" />
            <span className="text-sm text-gray-800 font-medium">2,847+ active members</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SocialProof


import { Card, CardContent } from "@/components/ui/card";

const CompetitorComparison = () => {
  const competitorComparisons = [
    { 
      name: "NAV", 
      icon: "📊", 
      users: "1M+",
      tagline: "Shows partial data - fragments only",
      limitation: "❌ Incomplete vendor visibility",
      cost: "$39-$79/mo",
      category: "Middleman"
    },
    { 
      name: "Credit Karma", 
      icon: "💚", 
      users: "120M+",
      tagline: "Consumer toy - not for business owners",
      limitation: "❌ No business credit coverage",
      cost: "Free for personal only",
      category: "Consumer Toy"
    },
    { 
      name: "FUTEURCRED™", 
      icon: "🚀", 
      users: "50K+",
      tagline: "Complete business credit app powered by LUMIQ™ journey engine",
      limitation: "✅ Full-spectrum AI-powered ecosystem",
      cost: "Member exclusive - Complete App",
      category: "Operating System"
    }
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-r from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto text-center">
        <div className="mb-16">
          <h2 className="text-5xl font-bold text-white mb-8">
            NAV, Credit Karma, Dun & Bradstreet?<br/>
            <span className="text-gray-400">All fragments.</span><br/>
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              FUTEURCRED is the Whole.
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto">
            We're not another credit monitor. We're your <strong className="text-white">complete business credit app</strong><br/>
            powered by the <strong className="text-purple-400">LUMIQ™ journey engine</strong>. FSR tracking. Trade payment health. No PG tradelines.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {competitorComparisons.map((service, index) => (
            <Card key={index} className={`p-8 transition-all duration-500 hover:scale-105 border-0 ${
              index === 2 
                ? 'bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-2 border-purple-500/50' 
                : 'bg-gray-800/50'
            }`}>
              <CardContent className="p-0 text-center">
                <div className="text-5xl mb-4">{service.icon}</div>
                <div className={`text-xs font-bold mb-2 px-3 py-1 rounded-full ${
                  index === 0 ? 'bg-orange-500/20 text-orange-300' :
                  index === 1 ? 'bg-green-500/20 text-green-300' :
                  'bg-purple-500/20 text-purple-300'
                }`}>
                  {service.category}
                </div>
                <h3 className="font-bold text-2xl text-white mb-3">{service.name}</h3>
                <div className="text-sm text-gray-400 mb-3">{service.users} users</div>
                <p className="text-sm text-gray-300 mb-6 leading-relaxed">{service.tagline}</p>
                <div className={`text-sm font-bold mb-4 p-3 rounded-lg ${
                  index === 2 ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'
                }`}>
                  {service.limitation}
                </div>
                <div className="text-xs font-medium text-gray-400">{service.cost}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompetitorComparison;

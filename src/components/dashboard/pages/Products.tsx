import { DashboardLayout } from "@/components/dashboard/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAssetUrl } from "@/utils/assetUtils";

type ChaseCard = {
  id: string;
  name: string;
  tagline: string;
  annualFee: string;
  apr: string;
  welcomeOffer: string;
  highlights: string[];
};

const chaseCards: ChaseCard[] = [
  {
    id: "csp",
    name: "Chase Sapphire Preferred",
    tagline: "Premium travel rewards with flexible redemption",
    annualFee: "$95",
    apr: "21.49% - 28.49%",
    welcomeOffer: "60,000 bonus points after $4,000 spend in 3 months",
    highlights: ["5x on travel through Chase", "3x dining, online groceries, streaming", "1:1 point transfers"],
  },
  {
    id: "csr",
    name: "Chase Sapphire Reserve",
    tagline: "Luxury travel perks and Priority Pass",
    annualFee: "$550",
    apr: "22.49% - 29.49%",
    welcomeOffer: "60,000 bonus points after $4,000 spend in 3 months",
    highlights: ["$300 annual travel credit", "Lounge access", "1.5x points via Chase portal"],
  },
  {
    id: "cfu",
    name: "Chase Freedom Unlimited",
    tagline: "Simple cash-back on every purchase",
    annualFee: "$0",
    apr: "20.49% - 29.24%",
    welcomeOffer: "Additional 1.5% back on everything (first year)",
    highlights: ["5% travel via Chase", "3% dining and drugstores", "1.5% everywhere else"],
  },
  {
    id: "ink-preferred",
    name: "Ink Business Preferred",
    tagline: "High-value points for growing businesses",
    annualFee: "$95",
    apr: "21.24% - 26.24%",
    welcomeOffer: "100,000 points after $8,000 spend in 3 months",
    highlights: ["3x on advertising, shipping, telecom", "Cell phone protection", "Transfer partners"],
  },
  {
    id: "ink-cash",
    name: "Ink Business Cash",
    tagline: "Cash-back on office and telecom",
    annualFee: "$0",
    apr: "18.49% - 24.49%",
    welcomeOffer: "$750 bonus cash after $6,000 spend in 3 months",
    highlights: ["5% at office supply & telecom", "2% gas & restaurants", "0% intro APR (limited)"],
  },
];

const Products = () => {
  const logo = getAssetUrl("/mobile/chase.png");

  return (
    <DashboardLayout hideSidebar>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Chase" className="h-8 w-auto" />
          <h1 className="text-2xl font-bold tracking-tight">Chase Credit Cards</h1>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {chaseCards.map((c) => (
            <Card key={c.id} className="p-6 border border-slate-200/80 shadow-sm bg-white">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{c.name}</h3>
                  <p className="text-slate-500 text-sm mt-1">{c.tagline}</p>
                </div>
                <img src={logo} alt="Chase" className="h-6 w-auto opacity-80" />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-slate-500">Annual Fee</p>
                  <p className="font-semibold">{c.annualFee}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-slate-500">Variable APR</p>
                  <p className="font-semibold">{c.apr}</p>
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-blue-50 p-3 border border-blue-100">
                <p className="text-xs font-bold uppercase text-blue-900">Welcome Offer</p>
                <p className="text-sm text-blue-800 mt-1">{c.welcomeOffer}</p>
              </div>

              <ul className="mt-4 space-y-2 text-sm">
                {c.highlights.map((h, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-slate-700">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    {h}
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex gap-3">
                <Button className="bg-blue-600 hover:bg-blue-700">Apply</Button>
                <Button variant="outline">Details</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Products;



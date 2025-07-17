
import { Button } from "@/components/ui/button";
import { Rocket, ArrowRight, Eye } from 'lucide-react';

const FinalCTA = () => {
  return (
    <section className="py-20 px-6 bg-black">
      <div className="max-w-5xl mx-auto text-center">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-8 leading-tight tracking-tight">
            FIND YOUR PERFECT PLAN
          </h2>
          <div className="flex justify-center gap-4 mb-12">
            <Button className="bg-white text-black hover:bg-gray-200 px-6 py-2 rounded-full font-medium">
              Get started
            </Button>
            <Button className="bg-transparent text-white hover:bg-white/10 px-6 py-2 rounded-full border border-white/30 font-medium">
              Discover our plans
            </Button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-[#1A1A1A] p-6 rounded-xl">
            <div className="flex justify-center mb-4">
              <div className="p-2 bg-black rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
            </div>
            <div className="font-bold text-white text-center mb-1">Basic</div>
            <div className="text-sm text-gray-400 text-center mb-3">From £10/month</div>
            <div className="text-xs text-gray-400 text-center">Get the essentials to run your business.</div>
          </div>
          <div className="bg-[#1A1A1A] p-6 rounded-xl">
            <div className="flex justify-center mb-4">
              <div className="p-2 bg-black rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
            </div>
            <div className="font-bold text-white text-center mb-1">Grow</div>
            <div className="text-sm text-gray-400 text-center mb-3">From £30/month</div>
            <div className="text-xs text-gray-400 text-center">Unlock the tools you need to manage spend worry-free.</div>
          </div>
          <div className="bg-[#1A1A1A] p-6 rounded-xl">
            <div className="flex justify-center mb-4">
              <div className="p-2 bg-black rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
              </div>
            </div>
            <div className="font-bold text-white text-center mb-1">Scale</div>
            <div className="text-sm text-gray-400 text-center mb-3">From £90/month</div>
            <div className="text-xs text-gray-400 text-center">Access higher allowances to expand globally.</div>
          </div>
          <div className="bg-[#1A1A1A] p-6 rounded-xl">
            <div className="flex justify-center mb-4">
              <div className="p-2 bg-black rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              </div>
            </div>
            <div className="font-bold text-white text-center mb-1">Enterprise</div>
            <div className="text-sm text-gray-400 text-center mb-3">Custom</div>
            <div className="text-xs text-gray-400 text-center">Create the plan that fits your exact needs.</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;


import { Unlock, Cpu } from 'lucide-react';

const PGFreeSection = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
      <div className="max-w-7xl mx-auto text-center">
        <div className="mb-16">
          <Unlock className="h-20 w-20 mx-auto text-purple-400 mb-8 animate-pulse" />
          <h2 className="text-5xl font-bold text-white mb-8">
            No More Personal Guarantees.<br/>
            <span className="text-purple-400">No More Guessing.</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            <strong className="text-white">FUTEURCRED™ connects you with PG-free tradelines,</strong> underwritten via your EIN, not your SSN.<br/>
            Build trust with vendors, unlock supply chain credit, and scale — with no personal liability.
          </p>
          <div className="mt-8 inline-flex items-center gap-2 bg-purple-600/20 px-6 py-3 rounded-full">
            <Cpu className="h-5 w-5 text-purple-400" />
            <span className="text-purple-300">Backed by FUTEUR AI's creditworthiness engine</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PGFreeSection;


import { Cpu } from 'lucide-react';

const AIBuiltSection = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <div className="mb-16">
          <Cpu className="h-20 w-20 mx-auto text-purple-400 mb-8 animate-pulse" />
          <h2 className="text-5xl font-bold text-white mb-8">
            We Don't Sell Data.<br/>
            <span className="text-purple-400">We Decode It.</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Traditional platforms sell your clicks. We give you clarity.<br/>
            <strong className="text-white">Built by FUTEUR AI™,</strong> your data is encrypted, your LUMIQ™ journey is clear, 
            and your growth is predictive — not reactive.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AIBuiltSection;

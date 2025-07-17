
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const BusinessFAQ = () => {
  const faqItems = [
    {
      question: "What's the difference between FUTEURCRED and NAV?",
      answer: "NAV shows you fragments - partial data from some vendors. FUTEURCRED is your complete operating system with LUMIQ™ journey engine, full vendor universe visibility, AI-powered insights, and PG-free building tools. NAV is a middleman, we're your mission control."
    },
    {
      question: "Is this like Credit Karma but for business?",
      answer: <>
        Credit Karma is a consumer toy with zero business coverage. FUTEURCRED is an AI-powered business credit app with the LUMIQ™ journey engine that shows your complete credit ecosystem, <span className="inline-flex items-center gap-1"><img src="/Dark-Experian.png" alt="Experian" className="h-4 opacity-80" /> FSR scores</span>, trade payment health, and builds PG-free tradelines with real-time vendor intelligence.
      </>
    },
    {
      question: "How is LUMIQ different from Chase Credit Journey?",
      answer: <>
        Chase Credit Journey is for personal credit only. LUMIQ™ is the business credit journey engine that powers FUTEURCRED, showing <span className="inline-flex items-center gap-1"><img src="/Dark-Experian.png" alt="Experian" className="h-4 opacity-80" /> FSR scores</span>, trade payment health, industry payment insights, and vendor relationships - everything Chase Journey does for personal credit, but for your business.
      </>
    },
    {
      question: "What if I have no credit history?",
      answer: <>
        Perfect! Our LUMIQ™ engine identifies the fastest path to establish business credit through strategic vendor partnerships and PG-free tradelines. We show you exactly which vendors to approach first for maximum <span className="inline-flex items-center gap-1"><img src="/Dark-Experian.png" alt="Experian" className="h-4 opacity-80" /> FSR</span> and Intelliscore impact.
      </>
    },
    {
      question: "Do I need to pay to see my score?",
      answer: <>
        Your business credit ecosystem view is included with FUTEURCRED membership. Unlike fragmented tools that charge separately for each bureau, you get complete <span className="inline-flex items-center gap-1"><img src="/Dark-Experian.png" alt="Experian" className="h-4 opacity-80" /> FSR</span>, Intelliscore, and trade payment health visibility in one interface.
      </>
    }
  ];

  return (
    <section className="py-20 px-6 bg-black">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-6 leading-tight tracking-tight">FREQUENTLY ASKED QUESTIONS</h2>
          <p className="text-xl text-gray-300">Everything you need to know about your business credit operating system.</p>
        </div>
        
        <Accordion type="single" collapsible className="space-y-4">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border border-white/10 rounded-lg bg-black/80">
              <AccordionTrigger className="px-6 py-4 text-left text-white hover:text-gray-300">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-300">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default BusinessFAQ;

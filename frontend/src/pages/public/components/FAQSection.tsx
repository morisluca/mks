import { useState } from 'react';

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Do I need trading experience?",
      answer: "No trading experience is required. Our platform is designed for both beginners and experienced traders. You can start copying expert traders immediately and learn as you go."
    },
    {
      question: "Is my money safe?",
      answer: "Your funds are held in top-tier institutions and are completely secure. We use bank-level encryption and security measures. Your money remains in your own brokerage account — we never have direct access to your funds."
    },
    {
      question: "Can I stop copying anytime?",
      answer: "Yes, you can stop copying anytime. Even if you’ve already joined when you’re halfway in, you’re not locked in. Just deactivate your current trading activity whenever you want. You’re always in control."
    },
    {
      question: "What is Capital protection Scheme?",
      answer: "This is an automated tool that secures your principal (capital) in any market condition. It runs in the background managing risk, so your core funds stay protected while trades are active.."
    }
  ];

  return (
    <section id="faq" className="max-w-[1320px] mx-auto py-32 px-[clamp(1.2rem,4vw,3.5rem)]">
      {/* Header */}
      <div className="mb-24">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-[1px] bg-oc-accent" />
          <span className="font-mono text-[0.55rem] tracking-[0.2em] uppercase text-oc-muted font-semibold">FAQ</span>
        </div>
        <h2 className="font-serif text-[clamp(2.4rem,4vw,4.8rem)] font-light leading-[0.95] text-oc-text max-w-[600px]">
          Your questions,
          <br />
          <em className="text-oc-accent italic">answered.</em>
        </h2>
      </div>

      {/* FAQ Items */}
      <div className="max-w-3xl space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-oc-text/8 bg-white/3 backdrop-blur-sm rounded-lg overflow-hidden hover:bg-white/5 hover:border-oc-accent/20 transition-all duration-300"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-8 py-6 text-left font-normal text-oc-text hover:bg-white/3 transition-colors flex justify-between items-center gap-4"
            >
              <span className="text-[0.95rem] font-semibold">{faq.question}</span>
              <span className={`text-2xl transition-transform duration-300 flex-shrink-0 text-oc-accent ${openIndex === index ? 'rotate-45' : ''}`}>
                +
              </span>
            </button>
            
            {openIndex === index && (
              <div className="px-8 py-6 border-t border-oc-text/5 bg-white/2 text-oc-muted leading-[1.7] text-[0.95rem]">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

import React from 'react';

interface StepCardProps {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  isLast?: boolean;
}

// Icons
const linkIcon = (
  <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 17H7A5 5 0 0 1 7 7h2" />
    <path d="M15 7h2a5 5 0 1 1 0 10h-2" />
    <line x1="8" x2="16" y1="12" y2="12" />
  </svg>
);

const targetIcon = (
  <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const zapIcon = (
  <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 14l8-10-2 6h6l-8 10 2-6H4z" />
  </svg>
);

// Reusable Step Card Component
const StepCard = ({ number, title, description, icon, isLast = false }: StepCardProps) => (
  <div className={`bg-white px-[2.5rem] py-[3rem] relative transition-all ${!isLast ? 'border-r border-[rgba(74,63,53,0.12)]' : ''}`}>
    <span className="font-serif italic text-[5rem] font-light text-[rgba(139,124,106,0.12)] block mb-6">
      {number}
    </span>
    <div className="mb-5 text-[#c0392b]">
      {icon}
    </div>
    <div className="text-[1.5rem] text-[#1c1510] mb-3 font-bold">
      {title}
    </div>
    <p className="text-[0.9rem] text-[#8c7b6a] leading-[1.7]">
      {description}
    </p>
  </div>
);

export default StepCard;

// Steps Section Component (uses StepCard)
export const StepCardw = () => {
  const steps = [
    {
      number: "01",
      title: "Setting Up your Account",
      description: "Create your free account in under 2 minutes. Sign up with your email and a secure password, verify your email, then update the required credentials and security settings. Once that’s done, you’re ready to roll.",
      icon: linkIcon,
    },
    {
      number: "02",
      title: "Fund Your Account",
      description: "Navigate to the Deposit tab, choose your preferred deposit option, and complete the payment. Upload your deposit receipt, then wait for the funds to reflect in your account.",
      icon: targetIcon,
    },
    {
      number: "03",
      title: "Join a Plan",
      description: "Head over to the Plans tab and choose the plan that fits your goals and budget. Review, confirm your selection and activate it. Once that’s done, you’ll get full access to the trading activities tied to that plan.",
      icon: zapIcon,
      isLast: true,
    },
  ];

  return (
    <section id="how" className="max-w-[1320px] mx-auto py-[clamp(5rem,9vw,9rem)] px-[clamp(1.2rem,4vw,3.5rem)]">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-[32px] h-[1px] bg-[#c0392b]" />
          <span className="font-mono text-[0.62rem] tracking-[0.2em] uppercase text-[#8c7b6a]">How It Works</span>
        </div>

        <h2 className="font-serif text-[clamp(2.4rem,4vw,4.8rem)] font-light leading-[1.03] tracking-[-0.02em] text-[#1c1510] max-w-[620px] mt-2 mb-5">
          Three steps.<br />
          <em className="text-[#c0392b] italic">Zero complexity.</em>
        </h2>

       
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 border border-[rgba(74,63,53,0.12)] rounded-2xl overflow-hidden">
        {steps.map((step, idx) => (
          <StepCard key={idx} {...step} />
        ))}
      </div>
    </section>
  );
};
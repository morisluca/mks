import React from 'react';

interface PricingCardProps {
  title: string;
  value: string;
  detail: string;
  icon: React.ReactNode;
}

export const PricingCard = ({ title, value, detail, icon }: PricingCardProps) => (
  <div className="bg-white border border-oc-text/10 p-10 rounded-3xl flex flex-col items-center text-center hover:shadow-2xl hover:-translate-y-1 transition-all">
    <div className="w-16 h-16 bg-oc-accent/10 rounded-full flex items-center justify-center mb-6 text-oc-accent">
      {icon}
    </div>
    <div className="font-serif text-5xl font-light text-oc-text mb-2">{value}</div>
    <h3 className="font-bold text-oc-text uppercase tracking-widest text-xs mb-4">{title}</h3>
    <p className="text-sm text-oc-muted leading-relaxed max-w-[200px]">{detail}</p>
  </div>
);


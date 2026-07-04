import { jsx } from "react/jsx-runtime"
import React from "react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className: string;
  isDark?: boolean;
}

export const FeatureCard = ({ title, description, icon, className, isDark = false }: FeatureCardProps) => {
  return (
    <div className={`
      p-12 rounded-2xl border flex flex-col justify-between transition-all duration-300 hover:shadow-lg
      ${isDark ? 'bg-oc-text text-oc-bg border-oc-text' : 'bg-white/8 text-oc-text border-oc-text/8 hover:bg-white/12 hover:border-oc-accent/20'}
      ${className}
    `}>
      <div className="mb-8">
        {icon && <div className="mb-6 opacity-70">{icon}</div>}
        <h3 className="font-serif text-[1.6rem] font-light leading-tight mb-4 whitespace-pre-line">
          {title}
        </h3>
        {description && <p className="text-[0.9rem] opacity-75 leading-[1.6]">{description}</p>}
      </div>
    </div>
  );
};

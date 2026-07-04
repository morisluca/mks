import { PricingCard } from "./PricingCard";

export const PricingSection = () => {
  return (
    <section id="pricing" className="py-32 px-[clamp(1.2rem,4vw,3.5rem)] bg-oc-bg">
      <div className="max-w-[1320px] mx-auto text-center mb-20">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-8 h-[1px] bg-oc-accent" />
          <span className="font-mono text-[0.62rem] tracking-[0.2em] uppercase text-oc-muted">Pricing</span>
          <div className="w-8 h-[1px] bg-oc-accent" />
        </div>
        <h2 className="font-serif text-[clamp(2.4rem,4vw,4.8rem)] font-light text-oc-text mb-6 leading-none">
          Transparent by design.
        </h2>
        <p className="text-oc-muted max-w-[600px] mx-auto text-lg">
          No management fees. No monthly subscriptions. <br />
          We only succeed when you do.
        </p>
      </div>

      <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <PricingCard 
          title="Setup Fee"
          value="$0"
          detail="Connect your brokerage and start mirroring for free."
          icon={<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
        />
        <PricingCard 
          title="Performance"
          value="10%"
          detail="A small success fee only on net profitable trades."
          icon={<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>}
        />
        <PricingCard 
          title="Withdrawals"
          value="Free"
          detail="Transfer your profits back to your bank instantly."
          icon={<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 11l5 5 5-5M12 4v12M21 21H3"/></svg>}
        />
      </div>

      {/* Trust Badge */}
      <div className="mt-20 p-8 border border-dashed border-oc-text/20 rounded-2xl max-w-[600px] mx-auto bg-oc-muted/5 flex items-center gap-6">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-700 shrink-0">
          ✓
        </div>
        <p className="text-[0.75rem] text-oc-muted text-left font-medium">
          Note: Individual traders may have specific minimum allocation requirements (e.g., $1,000 min) to ensure order execution parity. See trader profiles for details.
        </p>
      </div>
    </section>
  );
};
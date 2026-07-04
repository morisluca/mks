import { FeatureCard } from "./FeatureCard";

export const FeaturesSection = () => {
  return (
    <section id="features" className="max-w-[1320px] mx-auto py-32 px-[clamp(1.2rem,4vw,3.5rem)]">
      {/* Header */}
      <div className="mb-24">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-[1px] bg-oc-accent" />
          <span className="font-mono text-[0.55rem] tracking-[0.2em] uppercase text-oc-muted font-semibold">Platform Features</span>
        </div>
        <h2 className="font-serif text-[clamp(2.4rem,4vw,4.8rem)] font-light leading-[0.95] text-oc-text max-w-[600px]">
          Built for
          <br />
          <em className="text-oc-accent italic">serious</em> investors.
        </h2>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 gap-6 h-auto md:h-[780px]">
        {/* Large Feature A */}
        <FeatureCard 
          className="md:col-span-7 md:row-span-1"
          title={"Real-Time Copy.\nZero Delay."}
          description="Trades execute in your account the millisecond they trigger. Proprietary order routing ensures fills within 0.01% of the original trade. Not lagged. Not approximated."
          icon={<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/><path d="M9 17l3 3 5-5"/></svg>}
        />

        {/* Dark Feature B */}
        <FeatureCard 
          className="md:col-span-5 md:row-span-1"
          isDark={true}
          title={"Fully Regulated.\nAlways Audited."}
          description="Compliant across major global jurisdictions. Your funds never leave your own brokerage. We only copy signals — we never hold your capital."
          icon={<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>}
        />

        {/* Analytics C */}
        <FeatureCard 
          className="md:col-span-4 md:row-span-1"
          title={"Deep Trader\nAnalytics"}
          description="24 months of audited live performance per trader. Sharpe ratio, drawdown, win rate, full trade history — all public."
          icon={<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21V3M5 21v-6M19 21V9"/></svg>}
        />

        {/* Stats D */}
        <div className="md:col-span-3 md:row-span-1 bg-oc-accent text-oc-bg p-12 rounded-2xl flex flex-col justify-center items-center text-center">
          <div className="font-serif text-[3.5rem] font-light leading-none mb-3">12K+</div>
          <div className="font-mono text-[0.7rem] uppercase tracking-widest opacity-70 font-semibold">Active Copiers</div>
        </div>

        {/* Control E */}
        <FeatureCard 
          className="md:col-span-5 md:row-span-1"
          title={"You Stay\nIn Control"}
          description="Max position size, daily loss limits, excluded instruments. Your parameters override the trader's — always."
          icon={<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 5h7M3 19h9M14 3v4M16 17v4M21 12h-9M21 19h-5M21 5h-7M8 10v4M8 12H3"/></svg>}
        />
      </div>
    </section>
  );
};
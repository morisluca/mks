import { title } from "process";

export const InstrumentsSection = () => {
  const instruments = [
    {
      title: "Stocks & ETFs",
      description: "Full-share orders or fractional allocations, instantaneous entry/exit mirroring, price-based T/P and S/L.",
      icon: "📈"
    },
    {
      title: "Indices",
      description: "Cash and futures indices; full or fractional exposure, instantaneous mirroring, price-based T/P and S/L.",
      icon: "🎯"
    },
    {
      title: "Futures & Forex",
      description: "Major, minor and exotic pairs; lot-based or fractional allocations, instantaneous entry/exit mirroring, price-based T/P and S/L.",
      icon: "💹"
    },
    {
      title: "Cryptocurrencies",
      description: "  - Spot and derivatives, exchange or wallet allocations, fractional-by-design, instantaneous mirroring, price-based T/P and S/L.",
      icon: "₿"
    },
    {
      title: "Options",
      description: " Replicate trade-by-trade: ticker, strike, expiry, premium, quantity and timestamp; calls and puts covered; supports single-leg and multi-leg structures..",
      icon: "📊"
    }
  ];

  return (
    <section id="Asset" className="max-w-[1320px] mx-auto py-32 px-[clamp(1.2rem,4vw,3.5rem)]">
      {/* Header */}
      <div className="mb-24">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-[1px] bg-oc-accent" />
          <span className="font-mono text-[0.55rem] tracking-[0.2em] uppercase text-oc-muted font-semibold">Instruments</span>
        </div>
        <h2 className="font-serif text-[clamp(2.4rem,4vw,4.8rem)] font-light leading-[0.95] text-oc-text max-w-[600px]">
          What you
          <br />
          can <em className="text-oc-accent italic">copy.</em>
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {instruments.map((instrument, index) => (
          <div 
            key={index} 
            className="border border-oc-text/8 bg-white/3 backdrop-blur-sm p-12 rounded-2xl hover:bg-white/5 hover:border-oc-accent/20 transition-all duration-300"
          >
            <div className="text-6xl mb-8">{instrument.icon}</div>
            <h3 className="font-serif text-[1.6rem] font-light text-oc-text mb-5">
              {instrument.title}
            </h3>
            <p className="text-oc-muted text-[0.95rem] leading-[1.65]">
              {instrument.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

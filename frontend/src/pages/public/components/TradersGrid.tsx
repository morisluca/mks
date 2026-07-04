import { TraderCard } from "./TraderCard";

export const TradersGrid = () => {
  const traders = [
    { name: 'Jake Reynolds', initial: 'JR', specialty: 'Options Specialist', followers: '847', returnRate: '+182%', rank: 'Top 1%', winRate: '74%', trades: '1,204', drawdown: '−8.2%' },
    { name: 'Elena Vance', initial: 'EV', specialty: 'Growth Stocks', followers: '1.2k', returnRate: '+94%', rank: 'Verified', winRate: '68%', trades: '412', drawdown: '−5.4%' },
    { name: 'Marcus Chen', initial: 'MC', specialty: 'Macro Swing', followers: '956', returnRate: '+126%', rank: 'Expert', winRate: '71%', trades: '820', drawdown: '−6.1%' },
  ];

  return (
    <section id="traders" className="py-32 px-[clamp(1.2rem,4vw,3.5rem)]">
      <div className="max-w-[1320px] mx-auto">
        {/* Header */}
        <div className="mb-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-[1px] bg-oc-accent" />
            <span className="font-mono text-[0.55rem] tracking-[0.2em] uppercase text-oc-muted font-semibold">Expert Traders</span>
          </div>
          
          <h2 className="font-serif text-[clamp(2.4rem,5vw,4.8rem)] font-light leading-[0.95] text-oc-text max-w-[800px]">
            Handpicked. Verified.
            <br />Consistent.
          </h2>
          <p className="text-[1rem] text-oc-muted mt-6 leading-relaxed max-w-2xl">
            Every trader passes a 6-month live performance review. No paper trading. No simulations. Real money, real results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {traders.map((t, i) => <TraderCard key={i} {...t} />)}
        </div>

        {/* View All Link */}
        <div className="text-center">
          <a href="#" className="font-bold tracking-widest uppercase text-[0.75rem] text-oc-muted hover:text-oc-accent transition-colors inline-flex items-center gap-2">
            View All 340+ Verified Traders <span className="text-lg">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};
export const ProblemSolutionSection = () => {
  return (
    <section className="max-w-[1320px] mx-auto py-32 px-[clamp(1.2rem,4vw,3.5rem)]">
      {/* Header */}
      <div className="mb-24">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-[1px] bg-oc-accent" />
          <span className="font-mono text-[0.55rem] tracking-[0.2em] uppercase text-oc-muted font-semibold">The Problem & Solution</span>
        </div>
        <h2 className="font-serif text-[clamp(2.4rem,4vw,4.8rem)] font-light leading-[0.95] text-oc-text max-w-[700px]">
          You should
          <br />
          <em className="text-oc-accent italic">know</em> this.
        </h2>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Problem Side */}
        <div className="border-l-2 border-oc-muted/20 pl-10">
          <h3 className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-oc-muted font-semibold mb-6">
            The Challenge
          </h3>
          <h4 className="font-serif text-2xl font-light text-oc-text mb-6 leading-relaxed">
            Studying the market takes time
          </h4>
          <p className="text-base text-oc-muted leading-[1.7] mb-6">
            Building and maintaining a trading strategy is hard. Options require timing, strategy, and discipline. Only 11–26% of manual investors succeed on their own.
          </p>
        </div>

        {/* Solution Side */}
        <div className="border-l-2 border-oc-accent/60 pl-10">
          <h3 className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-oc-accent font-semibold mb-6">
            The Solution
          </h3>
          <h4 className="font-serif text-2xl font-light text-oc-text mb-6 leading-relaxed">
            Beat the odds with Copy Trading
          </h4>
          <p className="text-base text-oc-muted leading-[1.7] mb-10">
            Proven success rate: over 73% of investors generate profits by copying top leaders — especially in dynamic options markets.
          </p>
          <button className="bg-oc-text text-oc-bg px-10 py-4 rounded-md font-bold tracking-widest uppercase text-[0.75rem] hover:bg-oc-text/90 transition-all">
            Start Copy Trading
          </button>
        </div>
      </div>
    </section>
  );
};

export const FinalCTASection = () => {
  return (
    <section className="py-40 px-[clamp(1.2rem,4vw,3.5rem)]">
      <div className="max-w-[1320px] mx-auto text-center">
        <h2 className="font-serif text-[clamp(2.4rem,5vw,5rem)] font-light leading-[1.05] text-oc-text mb-8 max-w-2xl mx-auto">
          Start Copying
          <br />
          the <em className="text-oc-accent italic">Best.</em>
        </h2>
        
        <p className="text-[1.05rem] text-oc-muted max-w-2xl mx-auto mb-14 leading-[1.7]">
          Join 12,000+ investors already mirroring the world's top traders. Setup takes under 5 minutes.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
          <button className="bg-oc-text text-oc-bg px-14 py-4 rounded-md font-bold tracking-widest uppercase text-[0.75rem] hover:bg-oc-text/90 transition-all hover:shadow-lg">
            Create Free Account
          </button>
          <a 
            href="#traders" 
            className="px-14 py-4 border-2 border-oc-text/30 rounded-md font-bold tracking-widest uppercase text-[0.75rem] text-oc-text hover:border-oc-accent/50 hover:text-oc-accent transition-all"
          >
            Browse Traders
          </a>
        </div>

        {/* Trust Badges */}
        <div className="pt-12 border-t border-oc-text/10">
          <p className="text-oc-muted/50 text-[0.7rem] mb-10 uppercase tracking-[0.15em] font-mono font-semibold">
            Trusted by investors worldwide
          </p>
          <div className="flex flex-wrap justify-center gap-16 text-[0.85rem]">
            <div className="flex items-center gap-2 text-oc-muted">
              <span className="text-xl">🌍</span>
              <span className="font-medium">Global</span>
            </div>
            <div className="flex items-center gap-2 text-oc-muted">
              <span className="text-xl">🔒</span>
              <span className="font-medium">Secured</span>
            </div>
            <div className="flex items-center gap-2 text-oc-muted">
              <span className="text-xl">✓</span>
              <span className="font-medium">Regulated</span>
            </div>
            <div className="flex items-center gap-2 text-oc-muted">
              <span className="text-xl">⚡</span>
              <span className="font-medium">Reliable</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

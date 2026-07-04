

export const StepsSection = () => {
  const steps = [
    {
      number: "01",
      title: "Connect Your Broker",
      description: "Link your existing brokerage in under 2 minutes via secure API. We support TradeStation, Tastytrade, Ally Invest and more."
    },
    {
      number: "02",
      title: "Choose Expert Traders",
      description: "Browse 340+ verified performers filtered by return, drawdown, win rate, and strategy. Every trader is fully audited."
    },
    {
      number: "03",
      title: "Trades Mirror Instantly",
      description: "The moment a trade fires, your account mirrors proportionally. Zero delay. Complete control to pause or stop anytime."
    }
  ];

return (
  <section
    style={{
      maxWidth: "1320px",
      margin: "0 auto",
      padding: "clamp(4rem, 7vw, 7rem) clamp(1.2rem, 4vw, 3.5rem)",
    }}
  >
    <div className="oc-reveal oc-revealed" style={{ textAlign: "center" }}>
      
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "3.5rem",
        }}
      >
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            background: "rgba(192,57,43,.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="22"
            height="22"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#c0392b"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>

        <span
          className="oc-serif text-[#1c1510] dark:text-white"
          style={{
            fontSize: "clamp(1.5rem, 2.5vw, 2.8rem)",
            fontWeight: 300,
            letterSpacing: "-0.01em",
          }}
        >
          Globally Regulated
        </span>
      </div>

      <div
        className="oc-stats-grid"
        style={{
          border: "1px solid rgba(74,63,53,0.12)",
          borderRadius: "12px",
          overflow: "hidden",
          maxWidth: "860px",
          margin: "0 auto",
          background: "white",
        }}
      >
        {/* Stat 1 */}
        <div
          style={{
            padding: "clamp(1.2rem, 3vw, 2.5rem) clamp(0.75rem, 2vw, 1.5rem)",
            textAlign: "center",
            borderRight: "1px solid rgba(74,63,53,0.12)",
          }}
        >
          <span
            className="oc-serif"
            style={{
              display: "block",
              fontSize: "clamp(2rem, 5vw, 3.8rem)",
              fontWeight: 300,
              color: "#c0392b",
              lineHeight: 1,
            }}
          >
            118+
          </span>
          <span
            className="oc-mono"
            style={{
              display: "block",
              fontSize: ".6rem",
              color: "#8c7b6a",
              textTransform: "uppercase",
              letterSpacing: ".1em",
              marginTop: ".5rem",
            }}
          >
            Active Traders
          </span>
        </div>

        {/* Stat 2 */}
        <div
          style={{
            padding: "clamp(1.2rem, 3vw, 2.5rem) clamp(0.75rem, 2vw, 1.5rem)",
            textAlign: "center",
            borderRight: "1px solid rgba(74,63,53,0.12)",
          }}
        >
          <span className="oc-serif" style={{ display: "block", fontSize: "clamp(2rem, 5vw, 3.8rem)", fontWeight: 300, color: "#c0392b", lineHeight: 1 }}>
            $10M+
          </span>
          <span className="oc-mono" style={{ display: "block", fontSize: ".6rem", color: "#8c7b6a", textTransform: "uppercase", letterSpacing: ".1em", marginTop: ".5rem" }}>
            Total Volume
          </span>
        </div>

        {/* Stat 3 */}
        <div
          style={{
            padding: "clamp(1.2rem, 3vw, 2.5rem) clamp(0.75rem, 2vw, 1.5rem)",
            textAlign: "center",
          }}
        >
          <span className="oc-serif" style={{ display: "block", fontSize: "clamp(2rem, 5vw, 3.8rem)", fontWeight: 300, color: "#c0392b", lineHeight: 1 }}>
            1M+
          </span>
          <span className="oc-mono" style={{ display: "block", fontSize: ".6rem", color: "#8c7b6a", textTransform: "uppercase", letterSpacing: ".1em", marginTop: ".5rem" }}>
            Users
          </span>
        </div>
      </div>
    </div>
  </section>
);
};
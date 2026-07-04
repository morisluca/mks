export const MarketTicker = () => {
  const stocks = [
    { symbol: 'AAPL', change: '+2.34%', isUp: true },
    { symbol: 'SPY', change: '+0.87%', isUp: true },
    { symbol: 'TSLA', change: '−1.22%', isUp: false },
    { symbol: 'NVDA', change: '+3.10%', isUp: true },
    { symbol: 'QQQ', change: '+1.05%', isUp: true },
    { symbol: 'AMZN', change: '+1.89%', isUp: true },
    { symbol: 'MSFT', change: '+0.54%', isUp: true },
    { symbol: 'META', change: '−0.33%', isUp: false },
  ];

  return (
    <div className="bg-oc-text bg-black/95 dark:bg-[#b8b88944] border-t border-b border-white/5 py-3 px-[clamp(1.2rem,4vw,3.5rem)] overflow-hidden">
      <div className="flex gap-6 animate-scroll whitespace-nowrap">
        {[...stocks, ...stocks].map((stock, idx) => (
          <div key={idx} className="flex items-center gap-2 flex-shrink-0">
            <span className="font-mono text-[0.7rem] tracking-[0.05em] text-white/40">
              {stock.symbol}{' '}
              <span className={stock.isUp ? 'text-green-400' : 'text-red-400'}>
                {stock.isUp ? '↑' : '↓'} {stock.change}
              </span>
            </span>
            <span className="text-white/10 text-[0.8rem]">·</span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 1.5rem)); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </div>
  );
};


interface TraderCardProps {
  name: string;
  initial: string;
  followers: string | number;
  returnRate: string;
  specialty: string;
  rank: string;
  winRate: string | number;
  trades: string | number;
  drawdown: string;
}

export const TraderCard = ({ name, initial, followers, returnRate, specialty, rank, winRate, trades, drawdown }: TraderCardProps) => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/[0.08] transition-all duration-300 group">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#9b2c2c] to-[#c0392b] flex items-center justify-center font-extrabold text-lg text-white shadow-lg shadow-red-900/20">
            {initial}
          </div>
          <div>
            <h4 className="font-bold text-[#f5f0e8] text-[1rem] leading-none mb-1">{name}</h4>
            <p className="text-[0.75rem] text-white/40">{specialty} • {followers} followers</p>
          </div>
        </div>
        <span className="font-mono text-[0.6rem] tracking-widest uppercase border border-oc-accent/30 text-oc-accent px-3 py-1 rounded-full">
          {rank}
        </span>
      </div>

      {/* Performance */}
      <div className="mb-6">
        <div className="font-serif text-6xl font-light text-green-400 leading-none mb-1 group-hover:scale-105 transition-transform origin-left">
          {returnRate}
        </div>
        <div className="font-mono text-[0.6rem] text-white/20 uppercase tracking-[0.15em]">12-Month Return</div>
      </div>

      {/* Progress Bar (Risk Level) */}
      <div className="h-0.5 bg-white/5 rounded-full mb-8 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-red-600 to-amber-500 w-[72%] rounded-full shadow-[0_0_8px_rgba(192,57,43,0.4)]" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-8 pt-6 border-t border-white/5">
        <div>
          <div className="font-bold text-[#f5f0e8] text-sm">{winRate}</div>
          <div className="font-mono text-[0.55rem] text-white/30 uppercase tracking-widest mt-1">Win Rate</div>
        </div>
        <div>
          <div className="font-bold text-[#f5f0e8] text-sm">{trades}</div>
          <div className="font-mono text-[0.55rem] text-white/30 uppercase tracking-widest mt-1">Trades</div>
        </div>
        <div>
          <div className="font-bold text-red-400 text-sm">{drawdown}</div>
          <div className="font-mono text-[0.55rem] text-white/30 uppercase tracking-widest mt-1">Max DD</div>
        </div>
      </div>

      <button className="w-full py-4 bg-[#c0392b] text-white font-extrabold rounded-lg text-[0.7rem] uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-red-900/10">
        Analyze Strategy
      </button>
    </div>
  );
};
import React from 'react';

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen pt-20 pb-20 px-[clamp(1.2rem,4vw,3.5rem)] max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-24 items-center overflow-hidden">
      {/* Left Content */}
      <div className="z-10">
      
      <div className="inline-flex items-center gap-2 border border-[rgba(139,124,106,.18)] bg-[rgba(139,124,106,.07)] backdrop-blur-[12px] px-[0.85rem] py-[0.38rem] rounded-full mb-10 max-w-full flex-nowrap overflow-hidden">
        <span className="w-[5px] h-[5px] rounded-full bg-green-500 flex-shrink-0 animate-pulse"></span>
        <span className="oc-mono text-[0.56rem] tracking-[0.07em] text-[#8c7b6a] whitespace-nowrap flex-shrink-0">Integrates with</span>
        <span className="oc-int-platforms flex items-center gap-2 transition-all duration-350 opacity-100 transform translate-y-0 overflow-hidden">
          <span className="inline-flex items-center gap-2">
            <span className="oc-mono text-[0.56rem] dark:text-[#fff] font-bold text-[#1c1510] whitespace-nowrap">E-Trade</span>
            <span className="text-[#8c7b6a] dark:text-[#fff] text-[0.65rem] leading-4">·</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="oc-mono text-[0.56rem] dark:text-[#fff] font-bold text-[#1c1510] whitespace-nowrap">WEBULL</span>
            <span className="text-[#8c7b6a] text-[0.65rem] dark:text-[#fff] leading-4">·</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="oc-mono text-[0.56rem] font-bold dark:text-[#fff] text-[#1c1510] whitespace-nowrap">Think or Swim</span>
          </span>
        </span>
      </div>
        
        <h1 className="font-serif  dark:text-[#fff] text-[clamp(3.8rem,6.5vw,7.5rem)] font-light leading-[0.96] tracking-[-0.025em] mb-8 text-[#1c1510]">
          Trade<br />
          Like the<br />
          <em className="text-[#c0392b] italic">Very Best.</em>
        </h1>
        
        <p className="text-[1.05rem] dark:text-[#fff] text-[#1c1510] text-oc-muted leading-[1.65] max-w-[500px] mb-14 font-normal">
          Mirror real-time stock and options trades from top-performing traders. Precision, flexibility, and transparency — straight to your fingertips.
        </p>
        
        <div className="flex flex-wrap gap-5 items-center">
          <button onClick={()=> window.location.href="/register"} className="bg-oc-text text-[#fff] bg-black/95 dark:bg-[#044a98] text-oc-bg px-12 py-4 rounded-md font-bold tracking-widest uppercase text-[0.75rem] hover:bg-oc-text/90 transition-all hover:bg-red/95 hover:shadow-lg">
            Start Copying Now
          </button>
          <a href="/login" className="text-[#1c1510] dark:text-[#fff]  font-bold tracking-widest uppercase text-[0.75rem] text-oc-muted hover:text-oc-text flex items-center gap-2 transition-colors">
            Account Area <span className="text-lg">→</span>
          </a>
        </div>
      </div>

      {/* Right Content - Floating Cards */}
      <div className="relative pt-[clamp(1rem,3vw,3rem)] flex items-start justify-center min-h-[520px]">
        <div className="relative w-full h-[520px] flex-shrink-0">
          
          {/* Card 1 - Main Trader Card */}
          <div className="absolute top-0 right-0 w-[310px] bg-white rounded-xl shadow-2xl border border-[rgba(74,63,53,0.12)] overflow-hidden z-30 transition-all hover:-translate-y-2">
            {/* Card Header */}
            <div className="px-[0.4rem] py-[1.2rem] border-b border-[rgba(74,63,53,0.12)] flex items-center justify-between">
              <h3 className="font-serif tracking-[0.12em] uppercase text-[#1c1510]">Strategy Transparency You Can Trust</h3>
              <span hidden className="flex items-center gap-[0.4rem] font-mono text-[0.58rem] text-[#3a6b35]">
                <span className="w-[6px] h-[6px] rounded-full bg-[#3a6b35]"></span>
                C
              </span>
            </div>

            {/* Card Content */}
            <div className="p-[1.4rem]">
              {/* Trader Info */}
              <div className="flex items-center gap-[0.9rem] mb-[1.2rem]">
                <div hidden className="w-[44px] h-[44px] rounded-full bg-gradient-to-br from-[#9b2c2c] to-[#c0392b] flex items-center justify-center font-extrabold text-[0.9rem] text-white">
                  JR
                </div>
                <div>
                  <div className="font-extrabold text-[0.95rem] text-[#8c7b6a]">Our clients look for trading strategies that are transparent and aligned with their goals. With our expert-curated mirror trading platform, you can follow proven approaches backed by clear performance history.</div>
                  <div className="text-[0.72rem] text-[#8c7b6a] mt-[0.1rem]" hidden>
                    Options · 847 followers
                  </div>
                </div>
              </div>

              {/* Return Rate */}
              <div className="flex justify-between items-end mb-[1rem]" hidden>
                <div className="font-serif text-[3.2rem] font-semibold text-[#3a6b35] leading-none">+182%</div>
                <div className="text-right">
                  <span className="font-mono text-[0.58rem] tracking-[0.1em] text-[#8c7b6a] uppercase block">
                    12-Month<br />Return
                  </span>
                </div>
              </div>

              {/* Stats Grid */}
              <div hidden className="grid grid-cols-3 gap-[0.5rem] pt-[1rem] border-t border-[rgba(74,63,53,0.12)]">
                <div>
                  <div className="font-extrabold text-[0.88rem] text-[#1c1510]">74%</div>
                  <div className="font-mono text-[0.55rem] text-[#8c7b6a] uppercase tracking-[0.08em] mt-[0.1rem]">Win Rate</div>
                </div>
                <div>
                  <div className="font-extrabold text-[0.88rem] text-[#1c1510]">1,204</div>
                  <div className="font-mono text-[0.55rem] text-[#8c7b6a] uppercase tracking-[0.08em] mt-[0.1rem]">Trades</div>
                </div>
                <div>
                  <div className="font-extrabold text-[0.88rem] text-[#1c1510]">−8.2%</div>
                  <div className="font-mono text-[0.55rem] text-[#8c7b6a] uppercase tracking-[0.08em] mt-[0.1rem]">Max DD</div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="flex flex-wrap gap-5 items-center mt-[1.5rem]">
                <button className="mt-[1rem] bg-[#fff] text-black border border-[#ccc] p-[0.75rem] rounded-md font-extrabold text-[0.8rem] tracking-[0.08em] uppercase cursor-pointer transition-all hover:bg-[rgba(192,57,43,0.9)]">
                  Copy This Trader
                </button>
                <a href="/login" className="mt-[1rem] bg-[#044a98] text-white border-0 p-[0.75rem] rounded-md font-extrabold text-[0.8rem] tracking-[0.08em] uppercase cursor-pointer transition-all hover:bg-[rgba(192,57,43,0.9)]">
                  Contact an Expert
                </a>
              </div>
            </div>
          </div>

          {/* Card 2 - Portfolio Performance */}
          <div  className="absolute top-85 left-10 w-[400px] bg-white/80 backdrop-blur-md rounded-xl shadow-xl border border-white/40 z-20 transition-all hover:-translate-y-2 hover:z-40">
            <div className="px-[1.4rem] py-[1.2rem] border-b border-[rgba(74,63,53,0.12)]">
              <span className="font-mono text-[0.58rem] tracking-[0.12em] uppercase text-[#8c7b6a]">Strategy Performance Review</span>
            </div>
            <div className="px-[1.4rem] py-[1.2rem] h-[220px] relative overflow-hidden">
              <div className="vimeo-container">
                <iframe src="https://player.vimeo.com/video/1093575208?autopause=0&amp;autoplay=1&amp;background=1&amp;dnt=1&amp;h=a7d6b1cb18&amp;loop=1&amp;responsive=1" loading="lazy" data-vimeo-video-id="1093575208" title="Looping hero video" data-ready="true"></iframe>
            </div>
            </div>
            <div className="px-[1.4rem] pb-[1rem]"> 
              <span className="font-mono text-[0.55rem] text-[#8c7b6a] uppercase tracking-[0.1em]">Market Growth · Last 12 Months</span>
            </div>
          </div>

          <div hidden className="absolute top-65 left-30 w-[400px] bg-white/80 backdrop-blur-md rounded-xl shadow-xl border border-white/40 z-20 transition-all hover:-translate-y-2 hover:z-40">
            <div className="px-[1.4rem] py-[1.2rem] border-b border-[rgba(74,63,53,0.12)]">
              <span className="font-mono text-[0.58rem] tracking-[0.12em] uppercase text-[#8c7b6a]">Portfolio Performance</span>
            </div>
            <div className="px-[1.4rem] py-[1.2rem] h-[120px] relative overflow-hidden">
              <svg width="100%" height="100%" viewBox="0 0 260 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3a6b35" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#3a6b35" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,80 L20,72 L40,75 L60,60 L80,55 L100,42 L120,38 L140,30 L160,25 L180,18 L200,12 L220,8 L240,5 L260,2" fill="none" stroke="#3a6b35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M0,80 L20,72 L40,75 L60,60 L80,55 L100,42 L120,38 L140,30 L160,25 L180,18 L200,12 L220,8 L240,5 L260,2 L260,100 L0,100 Z" fill="url(#cg)" />
              </svg>
            </div>
            <div className="px-[1.4rem] pb-[1rem]">
              <span className="font-mono text-[0.55rem] text-[#8c7b6a] uppercase tracking-[0.1em]">Account Growth · Last 12 Months</span>
            </div>
          </div>

          {/* Card 3 - Fill Rate Stats */}
          <div hidden className="absolute bottom-10 left-10 w-[200px] bg-white p-[1.4rem] rounded-xl shadow-lg border border-[rgba(74,63,53,0.12)] z-40 transition-all hover:scale-105">
            <div className="font-mono text-[0.58rem] tracking-[0.12em] uppercase text-[#8c7b6a] mb-[0.5rem]">Avg Fill Rate</div>
            <div className="font-serif text-[2.8rem] font-semibold text-[#3a6b35] leading-none">97%</div>
            <div className="text-[0.72rem] text-[#8c7b6a] mt-[0.3rem]">Real-time mirroring</div>
          </div>
          
        </div>
      </div>








    </section>
  );
};
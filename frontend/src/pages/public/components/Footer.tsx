import TawkTo from "@/components/layout/TawkTo";

export const Footer = () => {
  return (
    <footer className="bg-oc-text text-oc-bg border-t border-white/5 pt-16 pb-12">
      <div className="max-w-[1320px] mx-auto px-[clamp(1.2rem,4vw,3.5rem)]">
        <div className="grid md:grid-cols-[280px_1fr] gap-16 mb-16">
          {/* Brand Info */}
          <div>
            <div className="font-serif text-[1.5rem] font-semibold tracking-wide mb-3">Marketcapsync</div>
            <div className="font-mono text-[0.55rem] tracking-[0.2em] uppercase text-oc-bg/50 font-semibold"></div>
            <p className="text-[0.85rem] text-oc-bg/60 font-medium mt-4 leading-relaxed">Copy trade with the world's best investors.</p>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            <div>
              <h4 className="font-mono text-[0.65rem] tracking-[0.2em] text-oc-bg/50 mb-5 uppercase font-semibold">Platform</h4>
              <ul className="space-y-3 text-[0.85rem] text-oc-bg/80 font-medium">
                <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#Asset" className="hover:text-white transition-colors">Copy Asset</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Traders</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-mono text-[0.65rem] tracking-[0.2em] text-oc-bg/50 mb-5 uppercase font-semibold">Resources</h4>
              <ul className="space-y-3 text-[0.85rem] text-oc-bg/80 font-medium">
                <li><a href="#" className="hover:text-white transition-colors">User Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Leader Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Affiliate Guide</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-mono text-[0.65rem] tracking-[0.2em] text-oc-bg/50 mb-5 uppercase font-semibold">About</h4>
              <ul className="space-y-3 text-[0.85rem] text-oc-bg/80 font-medium">
                <li><a href="#" className="hover:text-white transition-colors">Company</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Partnership</a></li>
                <li><a href="#how" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-mono text-[0.65rem] tracking-[0.2em] text-oc-bg/50 mb-5 uppercase font-semibold">Legal</h4>
              <ul className="space-y-3 text-[0.85rem] text-oc-bg/80 font-medium">
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 pt-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[0.75rem] text-oc-bg/30 leading-relaxed">
            © 2006–2026 Marketcapsync. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-oc-bg/50 hover:text-white transition-colors">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 9-2.75 9-5.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
            </a>
            <a href="#" className="text-oc-bg/50 hover:text-white transition-colors">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path d="M9 19c6.627 0 10.246-5.481 10.246-10.24 0-.156 0-.312-.01-.468.703-.504 1.312-1.136 1.794-1.854-.646.285-1.34.468-2.072.553.744-.444 1.312-1.148 1.58-1.985-.696.41-1.466.683-2.282.854-.656-.702-1.59-1.14-2.622-1.14-1.985 0-3.595 1.61-3.595 3.595 0 .282.032.56.085.827-2.99-.15-5.646-1.582-7.424-3.756-.31.533-.49 1.15-.49 1.81 0 1.248.634 2.35 1.596 3.001-.59-.02-1.144-.182-1.628-.45-.01.016-.01.03-.01.048 0 1.742 1.239 3.195 2.886 3.525-.302.082-.62.126-.948.126-.232 0-.457-.022-.678-.065.458 1.427 1.79 2.468 3.368 2.495-1.23.963-2.779 1.537-4.462 1.537-.29 0-.575-.016-.856-.048 1.589.983 3.475 1.558 5.497 1.558z"/></svg>
            </a>
          </div>
          {/* disclaimer */}
        </div>
          <div>

          <p className="text-[0.75rem] text-oc-bg/30 leading-relaxed text-center md:text-left">
           Marketcapsync, a platform incorporated with Marketcapsync Financial Advisors (“Marketcapsync”), is a federally registered investment adviser. Marketcapsync provides a mirror trading platform associated with Marketcapsync, enabling clients to replicate trades executed by Top traders in their own accounts. In general, the platform offers nondiscretionary/consultative trading strategies to large retirement plans and other institutions whose assets are held at various banks, trust companies, broker/dealers, and insurance companies that are determined by the institutional client.

Marketcapsync has an affiliated broker/dealer, CapFinancial Securities, LLC (“CFS”), registered under the Securities Exchange Act of 1934. CFS provides brokerage services (on an ancillary basis) to clients of Marketcapsync. CFS utilizes the clearing and custodial services of Pershing, LLC (“Pershing”). Throughout this document, specific reference may be made to CFS (or “BD”). Since CFS business is connected to clients of Marketcapsync, CFS is also covered by this Business Continuity Plan.

Marketcapsync wealth and other institutional advisory clients have elected to have their accounts with Pershing Advisor Solutions (Pershing, LLC), Fidelity Institutional Brokerage Services, Charles Schwab & Co., Inc., or other third-party qualified custodian chosen by the client.
           .</p>
          </div>
          {/* <TawkTo /> */}
      </div>
    </footer>
  );
};

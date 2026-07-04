import ThemeToggle from "./ThemeToggle";
import favicon from "../assets/favicon.png";
import { useEffect, useState } from "react";
import { useGetPublicSettings } from "@/lib/api-client/generated/api";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { data: settings, isLoading } = useGetPublicSettings();
  
  const navLink =
    "text-[0.85rem] font-semibold tracking-widest uppercase text-[#8c7b6a] no-underline hover:text-[#1c1510] transition-colors";

  return (
    <>
      {/* Background effects */}
      <div className="oc-dot"></div>
      <div className="oc-ring"></div>
      <div className="oc-noise" aria-hidden="true"></div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-[600] h-[66px] flex items-center justify-between px-[clamp(1.2rem,4vw,3.5rem)] bg-[rgba(245,240,232,0.92)] dark:bg-[rgba(18,14,10,0.88)] backdrop-blur-[20px] border-b border-[rgba(74,63,53,0.12)]">

        {/* Logo */}
        <a className="flex items-center gap-3 no-underline shrink-0" href="/">
          <img src={favicon} alt="Site logo" className="w-7 h-7" />
          <div style={{ lineHeight: "1" }}>
            <div
              className="capitalize"
              style={{
                fontFamily: "var(--oc-serif,Cormorant Garamond,Georgia,serif)",
                fontSize: "1.35rem",
                fontWeight: "600",
                letterSpacing: "0.04em",
              }}
            >
              {settings?.siteName?.toLocaleUpperCase()}
            </div>
            <span className="block text-[0.55rem] tracking-[0.28em] uppercase text-[#8c7b6a] mt-[2px]">
              Marketcapsync
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-10 items-center">
          <a href="/" className={navLink}>Home</a>
          <a href="#how" className={navLink}>How It Works</a>
          <a href="#features" className={navLink}>Features</a>
          <a href="#Asset" className={navLink}>Copy Asset</a>
          <a href="#faq" className={navLink}>Q&A</a>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          <a href="/login" className={`hidden md:block ${navLink}`}>
            Sign In
          </a>

          <a
            href="/register"
            className="hidden md:block bg-[#c0392b] text-white px-[0.6rem_1.4rem] rounded-md text-[0.8rem] font-extrabold tracking-widest uppercase shadow-[0_2px_14px_rgba(192,57,43,0.4)] hover:bg-[#a93226] transition-colors"
          >
            Get Started
          </a>

          {/* Hamburger */}
          <button
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden relative w-6 h-6"
          >
            <span className={`absolute left-0 top-1 w-6 h-[2px] bg-current transition-all ${isMenuOpen ? "rotate-45 top-3" : ""}`} />
            <span className={`absolute left-0 top-3 w-6 h-[2px] bg-current transition-all ${isMenuOpen ? "opacity-0" : ""}`} />
            <span className={`absolute left-0 top-5 w-6 h-[2px] bg-current transition-all ${isMenuOpen ? "-rotate-45 top-3" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Overlay */}
      <div
        onClick={() => setIsMenuOpen(false)}
        className={`fixed inset-0 z-[598] bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Mobile Menu */}
      <div
        className={`fixed top-[66px] left-0 right-0 z-[599] bg-[rgba(245,240,232,0.97)] dark:bg-[rgba(18,14,10,0.97)] border-t border-[rgba(74,63,53,0.12)] transition-all duration-300 ${
          isMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-3 pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-5 p-6">
          <a href="/" className={navLink} onClick={() => setIsMenuOpen(false)}>Home</a>
          <a href="#how" className={navLink} onClick={() => setIsMenuOpen(false)}>How It Works</a>
          <a href="#features" className={navLink} onClick={() => setIsMenuOpen(false)}>Features</a>
          <a href="#Asset" className={navLink} onClick={() => setIsMenuOpen(false)}>Copy Asset</a>
          <a href="#faq" className={navLink} onClick={() => setIsMenuOpen(false)}>Q&A</a>
          <div className="border-t pt-4 flex flex-col gap-4">
            <a href="/login" className={navLink} onClick={() => setIsMenuOpen(false)}>
              Sign In
            </a>

            <a
              href="/register"
              className="bg-[#c0392b] text-white py-2 rounded-md text-center font-extrabold tracking-widest uppercase shadow-md hover:bg-[#a93226] transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
import { FeaturesSection } from "./components/FeaturesSection";
import { Footer } from "./components/Footer";
import { HeroSection } from "./components/HeroSection";
import { MarketTicker } from "./components/MarketTicker";
import { Navbar } from "./components/Navbar";
import { StepsSection } from "./components/StepsSection";
import { TradersGrid } from "./components/TradersGrid";
import { ProblemSolutionSection } from "./components/ProblemSolutionSection";
import { InstrumentsSection } from "./components/InstrumentsSection";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { FAQSection } from "./components/FAQSection";
import { FinalCTASection } from "./components/FinalCTASection";
import { StepCardw } from "./components/StepCard";

export default function LandingPage() {
  return (
    <div className="bg-oc-bg text-oc-text font-sans min-h-screen">
      <Navbar />
      
      <main className="pt-[66px]">
        <HeroSection />
        <MarketTicker />
        <StepCardw />
        <StepsSection />
        <ProblemSolutionSection />
        <FeaturesSection />
        <InstrumentsSection />
        {/* <TradersGrid /> */}
        <TestimonialsSection />
        <FAQSection />
        <FinalCTASection />
      </main>

      <Footer />
    </div>
  );
}
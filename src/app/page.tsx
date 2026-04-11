import { Navbar } from "@/components/Navigation/Navbar";
import { HeroSection } from "@/components/Landing/HeroSection";
import { NarrativeSection } from "@/components/Landing/NarrativeSection";
import { EngineBlueprint } from "@/components/Landing/EngineBlueprint";
import { MarketDepth } from "@/components/Landing/MarketDepth";
import { SecurityFortress } from "@/components/Landing/SecurityFortress";
import { SovereignCTA, MegaFooter } from "@/components/Landing/FinalSections";

export default function Home() {
  return (
    <main className="min-h-screen bg-background selection:bg-brand-orange selection:text-white">
      {/* Institutional Navigation */}
      <Navbar />

      {/* Cinematic Narrative Flow */}
      <div className="relative">
        {/* Phase 1: Aperture & Narrative */}
        <HeroSection />
        <NarrativeSection />

        {/* Phase 2: Technical Depth */}
        <EngineBlueprint />
        <MarketDepth />

        {/* Phase 3: Sovereign Security */}
        <SecurityFortress />
        
        {/* Phase 4: Final Invitation */}
        <SovereignCTA />
      </div>

      {/* Institutional Metadata Footer */}
      <MegaFooter />
    </main>
  );
}

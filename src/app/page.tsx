import { TopNavBar } from "@/features/landing/components/TopNavBar";
import { HeroSection } from "@/features/landing/components/HeroSection";
import { StatsRow } from "@/features/landing/components/StatsRow";
import { FeaturesGrid } from "@/features/landing/components/FeaturesGrid";
import { MarkersSection } from "@/features/landing/components/MarkersSection";
import { CtaBlock } from "@/features/landing/components/CtaBlock";
import { Footer } from "@/features/landing/components/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <TopNavBar />
      <main id="main-content" className="flex-grow">
        <HeroSection />
        <StatsRow />
        <FeaturesGrid />
        <MarkersSection />
        <CtaBlock />
      </main>
      <Footer />
    </div>
  );
}

import { TopNavBar } from "@/features/landing/components/TopNavBar";
import { HeroSection } from "@/features/landing/components/HeroSection";
import { StatsRow } from "@/features/landing/components/StatsRow";
import { CodeSnippetDemo } from "@/features/landing/components/CodeSnippetDemo";
import { FeaturesGrid } from "@/features/landing/components/FeaturesGrid";
import { Footer } from "@/features/landing/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopNavBar />
      
      {/* Main Content Area */}
      <main className="flex-grow max-w-[720px] w-full mx-auto px-6 pt-24 pb-32 flex flex-col gap-12">
        <HeroSection />
        <StatsRow />
        <CodeSnippetDemo />
        <FeaturesGrid />
      </main>

      <Footer />
    </div>
  );
}

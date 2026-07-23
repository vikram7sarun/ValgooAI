import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { MarketsLive } from "@/components/landing/MarketsLive";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { Footer } from "@/components/landing/Footer";
import { getMarketSnapshot } from "@/lib/market/mockMarketData";

export const dynamic = "force-dynamic";

export default function Home() {
  const initialQuotes = getMarketSnapshot();

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <MarketsLive initialQuotes={initialQuotes} />
        <FeaturesSection />
        <HowItWorksSection />
      </main>
      <Footer />
    </div>
  );
}

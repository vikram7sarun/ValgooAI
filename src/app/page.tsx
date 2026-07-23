import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { MarketsLive } from "@/components/landing/MarketsLive";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { Footer } from "@/components/landing/Footer";
import { getMarketSnapshot } from "@/lib/market/mockMarketData";
import { getSessionUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function Home() {
  const initialQuotes = getMarketSnapshot();
  const session = await getSessionUser();
  const navSession = session ? { role: session.role } : null;

  return (
    <div className="flex flex-1 flex-col">
      <Navbar session={navSession} />
      <main className="flex-1">
        <Hero session={navSession} />
        <MarketsLive initialQuotes={initialQuotes} />
        <FeaturesSection />
        <HowItWorksSection />
      </main>
      <Footer />
    </div>
  );
}

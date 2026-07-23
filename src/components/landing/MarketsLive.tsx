"use client";

import { useEffect, useState } from "react";
import type { MarketQuote } from "@/types/market";
import { MarketTickerBar } from "./MarketTickerBar";
import { MarketCard } from "./MarketCard";

const CATEGORY_LABEL: Record<MarketQuote["category"], string> = {
  COMMODITY: "Commodities",
  INDIA: "Indian Markets",
  FOREX: "Forex",
};

export function MarketsLive({ initialQuotes }: { initialQuotes: MarketQuote[] }) {
  const [quotes, setQuotes] = useState(initialQuotes);

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch("/api/market/snapshot");
        if (!res.ok) return;
        const data = await res.json();
        setQuotes(data.quotes);
      } catch {
        // ignore transient network errors, keep last known quotes
      }
    };
    const id = setInterval(poll, 5000);
    return () => clearInterval(id);
  }, []);

  const categories: MarketQuote["category"][] = ["COMMODITY", "INDIA", "FOREX"];

  return (
    <div id="markets">
      <MarketTickerBar quotes={quotes} />
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-semibold text-cream">Live market snapshot</h2>
        <p className="mt-2 text-sm text-muted">
          Mock pricing for demonstration — swappable for a licensed real-time feed.
        </p>
        <div className="mt-8 flex flex-col gap-10">
          {categories.map((category) => {
            const items = quotes.filter((q) => q.category === category);
            if (items.length === 0) return null;
            return (
              <div key={category}>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brown-300">
                  {CATEGORY_LABEL[category]}
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((quote) => (
                    <MarketCard key={quote.symbol} quote={quote} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

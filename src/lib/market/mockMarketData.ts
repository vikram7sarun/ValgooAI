import type { MarketQuote } from "@/types/market";

/**
 * In-memory mock market data store for the public landing-page ticker.
 * Swap-out point for a real feed: replace the body of `getMarketSnapshot()`
 * (and drop the interval below) with a call to a real market-data provider —
 * every consumer only depends on this function's return shape.
 */

const seedQuotes: MarketQuote[] = [
  { symbol: "XAU/USD", name: "Gold", category: "COMMODITY", price: 2401.5, changePct: 0.42, unit: "/oz" },
  { symbol: "XAG/USD", name: "Silver", category: "COMMODITY", price: 28.63, changePct: -0.18, unit: "/oz" },
  { symbol: "WTI", name: "Crude Oil", category: "COMMODITY", price: 78.21, changePct: 1.05, unit: "/bbl" },
  { symbol: "NIFTY 50", name: "Nifty 50", category: "INDIA", price: 24350.2, changePct: 0.63 },
  { symbol: "SENSEX", name: "Sensex", category: "INDIA", price: 80120.75, changePct: 0.58 },
  { symbol: "BANKNIFTY", name: "Bank Nifty", category: "INDIA", price: 52104.3, changePct: -0.24 },
  { symbol: "EUR/USD", name: "Euro / US Dollar", category: "FOREX", price: 1.0812, changePct: 0.09 },
  { symbol: "GBP/USD", name: "British Pound / US Dollar", category: "FOREX", price: 1.2734, changePct: -0.11 },
  { symbol: "USD/INR", name: "US Dollar / Indian Rupee", category: "FOREX", price: 83.42, changePct: 0.05 },
];

declare global {
  var __marketSnapshot: MarketQuote[] | undefined;
  var __marketTickerStarted: boolean | undefined;
}

function currentStore(): MarketQuote[] {
  if (!globalThis.__marketSnapshot) {
    globalThis.__marketSnapshot = seedQuotes.map((q) => ({ ...q }));
  }
  return globalThis.__marketSnapshot;
}

function jitter(quote: MarketQuote) {
  const pctMove = (Math.random() - 0.5) * 0.6; // +/- 0.3% per tick
  const newPrice = Math.max(0, quote.price * (1 + pctMove / 100));
  quote.changePct = Number((quote.changePct * 0.85 + pctMove).toFixed(2));
  quote.price = Number(newPrice.toFixed(quote.price < 10 ? 4 : 2));
}

export function getMarketSnapshot(): MarketQuote[] {
  return currentStore().map((q) => ({ ...q }));
}

export function startMarketDataTicker() {
  if (globalThis.__marketTickerStarted) return;
  globalThis.__marketTickerStarted = true;

  setInterval(() => {
    currentStore().forEach(jitter);
  }, 4000);
}

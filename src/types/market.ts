export type MarketCategory = "COMMODITY" | "INDIA" | "FOREX";

export interface MarketQuote {
  symbol: string;
  name: string;
  category: MarketCategory;
  price: number;
  changePct: number;
  unit?: string;
}

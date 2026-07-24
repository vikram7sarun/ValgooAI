export type TradeDirection = "BUY" | "SELL";
export type TradeTag = "FOMO" | "REVENGE" | "LATE_ENTRY" | "PERFECT_TRADE";

export const TRADE_TAGS: TradeTag[] = ["FOMO", "REVENGE", "LATE_ENTRY", "PERFECT_TRADE"];

export interface JournalEntry {
  id: string;
  instrument: string;
  direction: TradeDirection;
  entryPrice: number;
  exitPrice: number | null;
  entryTime: string;
  exitTime: string | null;
  screenshotUrl: string | null;
  reason: string | null;
  emotion: string | null;
  mistake: string | null;
  news: string | null;
  tags: TradeTag[];
  algoId: string | null;
  algoName: string | null;
  createdAt: string;
}

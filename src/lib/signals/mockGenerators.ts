import type { SignalAction } from "@/types/algo";

interface AlgoConfig {
  instrument: string;
  basePrice: number;
  metricLabel: string;
  decimals: number;
}

/**
 * Per-algo-name defaults. Any algo not listed here still works — it falls
 * back to a generic instrument/price derived from the algo id — so this
 * stays generic rather than hardcoded to a single instrument.
 */
const ALGO_CONFIG: Record<string, AlgoConfig> = {
  "Gold Algo": { instrument: "XAU/USD", basePrice: 2400, metricLabel: "price", decimals: 2 },
  "Nifty Algo": { instrument: "NIFTY 50", basePrice: 24000, metricLabel: "index", decimals: 2 },
  "EUR-USD Algo": { instrument: "EUR/USD", basePrice: 1.08, metricLabel: "price", decimals: 4 },
};

function fallbackConfig(algoId: string): AlgoConfig {
  // deterministic-ish base price per algo id so unlisted algos stay stable across ticks
  const seed = [...algoId].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return {
    instrument: "GENERIC/INSTRUMENT",
    basePrice: 100 + (seed % 900),
    metricLabel: "price",
    decimals: 2,
  };
}

const lastPriceByAlgoId = new Map<string, number>();

function pickSignal(): SignalAction {
  const r = Math.random();
  if (r < 0.4) return "BUY";
  if (r < 0.75) return "SELL";
  return "HOLD";
}

export interface MockSignal {
  instrument: string;
  signal: SignalAction;
  metric: number;
  metricLabel: string;
}

export function generateMockSignal(algoId: string, algoName: string): MockSignal {
  const config = ALGO_CONFIG[algoName] ?? fallbackConfig(algoId);
  const previous = lastPriceByAlgoId.get(algoId) ?? config.basePrice;

  const pctMove = (Math.random() - 0.5) * 0.5; // +/- 0.25% random walk per tick
  const next = Math.max(0, previous * (1 + pctMove / 100));
  lastPriceByAlgoId.set(algoId, next);

  return {
    instrument: config.instrument,
    signal: pickSignal(),
    metric: Number(next.toFixed(config.decimals)),
    metricLabel: config.metricLabel,
  };
}

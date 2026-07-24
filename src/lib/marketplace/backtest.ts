export interface BacktestReport {
  winRatePct: number;
  maxDrawdownPct: number;
  totalReturnPct: number;
  totalTrades: number;
  equityCurve: number[];
}

/**
 * Fully synthetic backtest — no real historical price data exists anywhere
 * in this app. Simulates a run of trades with a small positive edge via a
 * random walk, and derives headline stats from the resulting equity curve.
 * Swap point for later: replace this with a real backtest engine running
 * against licensed historical data, keeping the same return shape.
 */
export function runBacktest(): BacktestReport {
  const totalTrades = 40 + Math.floor(Math.random() * 20); // 40-59 trades

  let equity = 100;
  let peak = equity;
  let maxDrawdownPct = 0;
  let wins = 0;
  const equityCurve: number[] = [equity];

  for (let i = 0; i < totalTrades; i++) {
    const tradeReturnPct = (Math.random() - 0.45) * 4; // slight positive skew
    equity = Math.max(0, equity * (1 + tradeReturnPct / 100));
    equityCurve.push(Number(equity.toFixed(2)));

    if (tradeReturnPct > 0) wins++;
    peak = Math.max(peak, equity);
    const drawdownPct = ((peak - equity) / peak) * 100;
    maxDrawdownPct = Math.max(maxDrawdownPct, drawdownPct);
  }

  return {
    winRatePct: Number(((wins / totalTrades) * 100).toFixed(1)),
    maxDrawdownPct: Number(maxDrawdownPct.toFixed(1)),
    totalReturnPct: Number((equity - 100).toFixed(1)),
    totalTrades,
    equityCurve,
  };
}

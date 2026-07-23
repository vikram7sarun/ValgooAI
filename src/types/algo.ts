export type MarketType = "INDIA" | "FOREX";
export type SignalAction = "BUY" | "SELL" | "HOLD";

export interface AlgoSignalEvent {
  id: string;
  algoId: string;
  algoName: string;
  marketType: MarketType;
  instrument: string;
  signal: SignalAction;
  metric: number | null;
  metricLabel: string | null;
  timestamp: string;
}

export interface DashboardSignal {
  id: string;
  instrument: string;
  signal: SignalAction;
  metric: number | null;
  metricLabel: string | null;
  timestamp: string;
}

export interface DashboardAlgo {
  id: string;
  name: string;
  marketType: MarketType;
  description: string;
  enabledAt: string | null;
  recentSignals: DashboardSignal[];
}

export interface StrategyListItem {
  id: string;
  name: string;
  marketType: MarketType;
  description: string;
  winRatePct: number;
  maxDrawdownPct: number;
  avgReturnPct: number;
  riskLevel: string;
  deployed: boolean;
  enabledAt: string | null;
}

export interface StrategyDetail extends StrategyListItem {
  recentSignals: DashboardSignal[];
}

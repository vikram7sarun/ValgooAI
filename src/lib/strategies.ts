import { prisma } from "@/lib/prisma";
import type { StrategyListItem, StrategyDetail } from "@/types/algo";

export async function getStrategiesForUser(userId: string): Promise<StrategyListItem[]> {
  const [algos, userAlgos] = await Promise.all([
    prisma.algo.findMany({ orderBy: { name: "asc" } }),
    prisma.userAlgo.findMany({ where: { userId } }),
  ]);

  const byAlgoId = new Map(userAlgos.map((ua) => [ua.algoId, ua]));

  return algos.map((algo) => ({
    id: algo.id,
    name: algo.name,
    marketType: algo.marketType,
    description: algo.description,
    winRatePct: algo.winRatePct,
    maxDrawdownPct: algo.maxDrawdownPct,
    avgReturnPct: algo.avgReturnPct,
    riskLevel: algo.riskLevel,
    deployed: byAlgoId.get(algo.id)?.enabled ?? false,
    enabledAt: byAlgoId.get(algo.id)?.enabledAt?.toISOString() ?? null,
  }));
}

export async function getStrategyDetail(
  algoId: string,
  userId: string,
): Promise<StrategyDetail | null> {
  const [algo, userAlgo] = await Promise.all([
    prisma.algo.findUnique({
      where: { id: algoId },
      include: {
        signals: {
          orderBy: { timestamp: "desc" },
          take: 10,
        },
      },
    }),
    prisma.userAlgo.findUnique({ where: { userId_algoId: { userId, algoId } } }),
  ]);

  if (!algo) return null;

  return {
    id: algo.id,
    name: algo.name,
    marketType: algo.marketType,
    description: algo.description,
    winRatePct: algo.winRatePct,
    maxDrawdownPct: algo.maxDrawdownPct,
    avgReturnPct: algo.avgReturnPct,
    riskLevel: algo.riskLevel,
    deployed: userAlgo?.enabled ?? false,
    enabledAt: userAlgo?.enabledAt?.toISOString() ?? null,
    recentSignals: algo.signals.map((s) => ({
      id: s.id,
      instrument: s.instrument,
      signal: s.signal,
      metric: s.metric,
      metricLabel: s.metricLabel,
      timestamp: s.timestamp.toISOString(),
    })),
  };
}

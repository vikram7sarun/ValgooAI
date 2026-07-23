import { prisma } from "@/lib/prisma";
import type { DashboardAlgo } from "@/types/algo";

export async function getUserDashboardAlgos(userId: string): Promise<DashboardAlgo[]> {
  const userAlgos = await prisma.userAlgo.findMany({
    where: { userId, enabled: true },
    include: {
      algo: {
        include: {
          signals: {
            orderBy: { timestamp: "desc" },
            take: 10,
          },
        },
      },
    },
    orderBy: { enabledAt: "asc" },
  });

  return userAlgos.map(({ algo, enabledAt }) => ({
    id: algo.id,
    name: algo.name,
    marketType: algo.marketType,
    description: algo.description,
    enabledAt: enabledAt ? enabledAt.toISOString() : null,
    recentSignals: algo.signals.map((s) => ({
      id: s.id,
      instrument: s.instrument,
      signal: s.signal,
      metric: s.metric,
      metricLabel: s.metricLabel,
      timestamp: s.timestamp.toISOString(),
    })),
  }));
}

import { prisma } from "@/lib/prisma";
import { emitAlgoSignal } from "@/lib/sse/eventBus";
import { generateMockSignal } from "./mockGenerators";
import type { AlgoSignalEvent } from "@/types/algo";

const TICK_INTERVAL_MS = 5000;

declare global {
  var __signalGeneratorStarted: boolean | undefined;
}

async function tick() {
  try {
    const enabledUserAlgos = await prisma.userAlgo.findMany({
      where: { enabled: true },
      distinct: ["algoId"],
      include: { algo: true },
    });

    for (const { algo } of enabledUserAlgos) {
      const mock = generateMockSignal(algo.id, algo.name);

      const created = await prisma.algoSignal.create({
        data: {
          algoId: algo.id,
          instrument: mock.instrument,
          signal: mock.signal,
          metric: mock.metric,
          metricLabel: mock.metricLabel,
        },
      });

      const event: AlgoSignalEvent = {
        id: created.id,
        algoId: algo.id,
        algoName: algo.name,
        marketType: algo.marketType,
        instrument: created.instrument,
        signal: created.signal,
        metric: created.metric,
        metricLabel: created.metricLabel,
        timestamp: created.timestamp.toISOString(),
      };

      emitAlgoSignal(event);
    }
  } catch (err) {
    console.error("[signal-generator] tick failed:", err);
  }
}

export function startMockSignalGenerator() {
  if (globalThis.__signalGeneratorStarted) return;
  globalThis.__signalGeneratorStarted = true;

  setInterval(tick, TICK_INTERVAL_MS);
  console.log(`[signal-generator] started, tick every ${TICK_INTERVAL_MS}ms`);
}

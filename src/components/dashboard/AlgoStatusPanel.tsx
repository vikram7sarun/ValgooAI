"use client";

import { useCallback, useState } from "react";
import type { DashboardAlgo, AlgoSignalEvent } from "@/types/algo";
import { useAlgoStream } from "./useAlgoStream";
import { MarketTypeTabs } from "./MarketTypeTabs";
import { EmptyAlgosState } from "./EmptyAlgosState";

const MAX_SIGNALS_PER_ALGO = 20;

export function AlgoStatusPanel({ initialAlgos }: { initialAlgos: DashboardAlgo[] }) {
  const [algos, setAlgos] = useState(initialAlgos);

  const handleSignal = useCallback((event: AlgoSignalEvent) => {
    setAlgos((prev) =>
      prev.map((algo) =>
        algo.id === event.algoId
          ? {
              ...algo,
              recentSignals: [
                {
                  id: event.id,
                  instrument: event.instrument,
                  signal: event.signal,
                  metric: event.metric,
                  metricLabel: event.metricLabel,
                  timestamp: event.timestamp,
                },
                ...algo.recentSignals,
              ].slice(0, MAX_SIGNALS_PER_ALGO),
            }
          : algo,
      ),
    );
  }, []);

  useAlgoStream(handleSignal);

  if (algos.length === 0) {
    return <EmptyAlgosState />;
  }

  return <MarketTypeTabs algos={algos} />;
}

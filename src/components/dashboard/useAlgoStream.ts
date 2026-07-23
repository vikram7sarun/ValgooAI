"use client";

import { useEffect, useRef } from "react";
import type { AlgoSignalEvent } from "@/types/algo";

export function useAlgoStream(onSignal: (event: AlgoSignalEvent) => void) {
  const handlerRef = useRef(onSignal);

  useEffect(() => {
    handlerRef.current = onSignal;
  }, [onSignal]);

  useEffect(() => {
    const source = new EventSource("/api/algos/stream");

    source.addEventListener("signal", (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data) as AlgoSignalEvent;
        handlerRef.current(data);
      } catch {
        // ignore malformed event
      }
    });

    return () => source.close();
  }, []);
}

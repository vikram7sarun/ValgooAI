import { EventEmitter } from "events";
import type { AlgoSignalEvent } from "@/types/algo";

declare global {
  var __algoEventBus: EventEmitter | undefined;
}

export const algoEventBus = globalThis.__algoEventBus ?? new EventEmitter().setMaxListeners(0);

if (process.env.NODE_ENV !== "production") {
  globalThis.__algoEventBus = algoEventBus;
}

export const SIGNAL_EVENT = "signal";

export function emitAlgoSignal(event: AlgoSignalEvent) {
  algoEventBus.emit(SIGNAL_EVENT, event);
}

export function onAlgoSignal(listener: (event: AlgoSignalEvent) => void) {
  algoEventBus.on(SIGNAL_EVENT, listener);
  return () => algoEventBus.off(SIGNAL_EVENT, listener);
}

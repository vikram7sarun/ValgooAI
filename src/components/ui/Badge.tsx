import { ReactNode } from "react";

type Tone = "brown" | "gain" | "loss" | "muted";

const toneClasses: Record<Tone, string> = {
  brown: "bg-brown-500/15 text-brown-200 border-brown-500/30",
  gain: "bg-gain/10 text-gain border-gain/30",
  loss: "bg-loss/10 text-loss border-loss/30",
  muted: "bg-base-elevated text-muted border-border",
};

export function Badge({ tone = "brown", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}

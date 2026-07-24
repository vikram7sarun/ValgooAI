"use client";

import { TRADE_TAGS, type TradeTag } from "@/types/journal";

const TAG_LABEL: Record<TradeTag, string> = {
  FOMO: "FOMO",
  REVENGE: "Revenge",
  LATE_ENTRY: "Late Entry",
  PERFECT_TRADE: "Perfect Trade",
};

export function TagSelector({
  value,
  onChange,
}: {
  value: TradeTag[];
  onChange: (next: TradeTag[]) => void;
}) {
  const toggle = (tag: TradeTag) => {
    onChange(value.includes(tag) ? value.filter((t) => t !== tag) : [...value, tag]);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {TRADE_TAGS.map((tag) => {
        const active = value.includes(tag);
        return (
          <button
            key={tag}
            type="button"
            onClick={() => toggle(tag)}
            aria-pressed={active}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              active
                ? "border-brown-400 bg-brown-500/20 text-brown-200"
                : "border-border bg-base-elevated text-muted hover:text-cream"
            }`}
          >
            {TAG_LABEL[tag]}
          </button>
        );
      })}
    </div>
  );
}

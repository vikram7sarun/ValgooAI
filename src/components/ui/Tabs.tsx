"use client";

import { ReactNode, useState } from "react";

interface Tab {
  key: string;
  label: string;
  content: ReactNode;
}

export function Tabs({ tabs, defaultKey }: { tabs: Tab[]; defaultKey?: string }) {
  const [active, setActive] = useState(defaultKey ?? tabs[0]?.key);

  return (
    <div>
      <div className="flex gap-1 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${
              active === tab.key ? "text-cream" : "text-muted hover:text-cream"
            }`}
          >
            {tab.label}
            {active === tab.key && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-brown-400" />
            )}
          </button>
        ))}
      </div>
      <div className="pt-5">{tabs.find((t) => t.key === active)?.content}</div>
    </div>
  );
}

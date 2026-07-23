import type { DashboardAlgo } from "@/types/algo";
import { Tabs } from "@/components/ui/Tabs";
import { AlgoCard } from "./AlgoCard";

function AlgoGrid({ algos }: { algos: DashboardAlgo[] }) {
  if (algos.length === 0) {
    return <p className="text-sm text-muted">No algos enabled in this market yet.</p>;
  }
  return (
    <div className="flex flex-col gap-4">
      {algos.map((algo) => (
        <AlgoCard key={algo.id} algo={algo} />
      ))}
    </div>
  );
}

export function MarketTypeTabs({ algos }: { algos: DashboardAlgo[] }) {
  const india = algos.filter((a) => a.marketType === "INDIA");
  const forex = algos.filter((a) => a.marketType === "FOREX");

  return (
    <Tabs
      tabs={[
        { key: "india", label: `Indian Markets (${india.length})`, content: <AlgoGrid algos={india} /> },
        { key: "forex", label: `Forex (${forex.length})`, content: <AlgoGrid algos={forex} /> },
      ]}
    />
  );
}

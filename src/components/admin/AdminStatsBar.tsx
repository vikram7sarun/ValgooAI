import { Card } from "@/components/ui/Card";

interface Stat {
  label: string;
  value: string | number;
}

export function AdminStatsBar({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((s) => (
        <Card key={s.label} className="p-4">
          <p className="text-xs uppercase tracking-wide text-muted">{s.label}</p>
          <p className="mt-1 text-2xl font-semibold text-cream tabular-nums">{s.value}</p>
        </Card>
      ))}
    </div>
  );
}

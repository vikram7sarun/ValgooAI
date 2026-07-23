import type { UserAlgoToggle } from "@/types/admin";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Toggle } from "@/components/ui/Toggle";

export function UserAlgoToggleRow({
  algo,
  onToggle,
  disabled,
}: {
  algo: UserAlgoToggle;
  onToggle: (next: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <Card className="flex items-center justify-between gap-4 p-4">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-cream">{algo.name}</span>
          <Badge tone="brown">{algo.marketType}</Badge>
        </div>
        <p className="mt-1 text-xs text-muted">{algo.description}</p>
        {algo.enabled && algo.enabledAt && (
          <p className="mt-1 text-xs text-muted">
            Enabled since {new Date(algo.enabledAt).toLocaleDateString("en-IN")}
          </p>
        )}
      </div>
      <Toggle checked={algo.enabled} onChange={onToggle} disabled={disabled} />
    </Card>
  );
}

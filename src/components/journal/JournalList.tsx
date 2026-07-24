import Link from "next/link";
import type { JournalEntry } from "@/types/journal";
import { computePnlPct } from "@/lib/journalPnl";
import { Table, Thead, Th, Tr, Td } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export function JournalList({ entries }: { entries: JournalEntry[] }) {
  if (entries.length === 0) {
    return (
      <Card className="flex flex-col items-center gap-2 p-10 text-center">
        <h3 className="text-base font-semibold text-cream">No journal entries yet</h3>
        <p className="max-w-sm text-sm text-muted">
          Log your first trade — screenshot, entry/exit, reason, and how it felt.
        </p>
      </Card>
    );
  }

  return (
    <Table>
      <Thead>
        <tr>
          <Th>Instrument</Th>
          <Th>Side</Th>
          <Th>Entry</Th>
          <Th>Exit</Th>
          <Th>P&amp;L</Th>
          <Th>Strategy</Th>
          <Th>Tags</Th>
          <Th>Date</Th>
        </tr>
      </Thead>
      <tbody>
        {entries.map((entry) => {
          const pnlPct = computePnlPct(entry.direction, entry.entryPrice, entry.exitPrice);
          return (
            <Tr key={entry.id}>
              <Td>
                <Link href={`/journal/${entry.id}`} className="font-medium text-cream hover:underline">
                  {entry.instrument}
                </Link>
              </Td>
              <Td>
                <Badge tone={entry.direction === "BUY" ? "gain" : "loss"}>{entry.direction}</Badge>
              </Td>
              <Td className="tabular-nums text-muted">{entry.entryPrice}</Td>
              <Td className="tabular-nums text-muted">{entry.exitPrice ?? "Open"}</Td>
              <Td className="tabular-nums">
                {pnlPct === null ? (
                  <span className="text-muted">—</span>
                ) : (
                  <span className={pnlPct >= 0 ? "text-gain" : "text-loss"}>
                    {pnlPct >= 0 ? "+" : ""}
                    {pnlPct.toFixed(2)}%
                  </span>
                )}
              </Td>
              <Td className="text-muted">{entry.algoName ?? "Discretionary"}</Td>
              <Td>
                <div className="flex flex-wrap gap-1">
                  {entry.tags.map((tag) => (
                    <Badge key={tag} tone="brown">
                      {tag.replace("_", " ")}
                    </Badge>
                  ))}
                </div>
              </Td>
              <Td className="text-muted">{new Date(entry.entryTime).toLocaleDateString("en-IN")}</Td>
            </Tr>
          );
        })}
      </tbody>
    </Table>
  );
}

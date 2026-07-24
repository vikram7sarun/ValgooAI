"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { JournalEntry } from "@/types/journal";
import { computePnlPct } from "@/lib/journalPnl";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

function Field({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 text-sm text-cream">{value}</p>
    </div>
  );
}

export function JournalEntryDetail({ entry }: { entry: JournalEntry }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const pnlPct = computePnlPct(entry.direction, entry.entryPrice, entry.exitPrice);

  const handleDelete = async () => {
    if (!confirm("Delete this journal entry? This cannot be undone.")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/journal/${entry.id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/journal");
        router.refresh();
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold text-cream">{entry.instrument}</h1>
            <Badge tone={entry.direction === "BUY" ? "gain" : "loss"}>{entry.direction}</Badge>
          </div>
          <p className="mt-1 text-sm text-muted">
            {new Date(entry.entryTime).toLocaleString("en-IN")}
            {entry.algoName && <> · Strategy: {entry.algoName}</>}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/journal/${entry.id}/edit`}>
            <Button variant="secondary">Edit</Button>
          </Link>
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Entry price</p>
          <p className="mt-1 text-xl font-semibold text-cream tabular-nums">{entry.entryPrice}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Exit price</p>
          <p className="mt-1 text-xl font-semibold text-cream tabular-nums">
            {entry.exitPrice ?? "Open"}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wide text-muted">P&amp;L</p>
          <p className="mt-1 text-xl font-semibold tabular-nums">
            {pnlPct === null ? (
              <span className="text-muted">—</span>
            ) : (
              <span className={pnlPct >= 0 ? "text-gain" : "text-loss"}>
                {pnlPct >= 0 ? "+" : ""}
                {pnlPct.toFixed(2)}%
              </span>
            )}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Tags</p>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {entry.tags.length === 0 && <span className="text-sm text-muted">None</span>}
            {entry.tags.map((tag) => (
              <Badge key={tag} tone="brown">
                {tag.replace("_", " ")}
              </Badge>
            ))}
          </div>
        </Card>
      </div>

      {entry.screenshotUrl && (
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brown-300">
            Screenshot
          </h2>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={entry.screenshotUrl}
            alt={`${entry.instrument} trade screenshot`}
            className="max-w-2xl rounded-xl border border-border"
          />
        </div>
      )}

      <Card className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
        <Field label="Reason" value={entry.reason} />
        <Field label="Emotion" value={entry.emotion} />
        <Field label="Mistake" value={entry.mistake} />
        <Field label="News" value={entry.news} />
      </Card>
    </div>
  );
}

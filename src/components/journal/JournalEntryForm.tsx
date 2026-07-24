"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { JournalEntry, TradeTag } from "@/types/journal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { TagSelector } from "./TagSelector";

function toDatetimeLocalValue(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

interface JournalEntryFormProps {
  mode: "create" | "edit";
  entryId?: string;
  initialEntry?: JournalEntry;
  strategies: { id: string; name: string }[];
}

export function JournalEntryForm({ mode, entryId, initialEntry, strategies }: JournalEntryFormProps) {
  const router = useRouter();
  const [tags, setTags] = useState<TradeTag[]>(initialEntry?.tags ?? []);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    tags.forEach((tag) => formData.append("tags", tag));

    const url = mode === "create" ? "/api/journal" : `/api/journal/${entryId}`;
    const method = mode === "create" ? "POST" : "PATCH";

    try {
      const res = await fetch(url, { method, body: formData });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body.error ?? "Could not save journal entry");
        return;
      }
      router.push(`/journal/${body.entry.id}`);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Instrument"
          name="instrument"
          placeholder="XAU/USD"
          defaultValue={initialEntry?.instrument}
          required
        />
        <Select label="Direction" name="direction" defaultValue={initialEntry?.direction ?? "BUY"}>
          <option value="BUY">Buy</option>
          <option value="SELL">Sell</option>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Entry price"
          name="entryPrice"
          type="number"
          step="any"
          defaultValue={initialEntry?.entryPrice}
          required
        />
        <Input
          label="Entry time"
          name="entryTime"
          type="datetime-local"
          defaultValue={initialEntry ? toDatetimeLocalValue(initialEntry.entryTime) : undefined}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Exit price (optional)"
          name="exitPrice"
          type="number"
          step="any"
          defaultValue={initialEntry?.exitPrice ?? undefined}
        />
        <Input
          label="Exit time (optional)"
          name="exitTime"
          type="datetime-local"
          defaultValue={
            initialEntry?.exitTime ? toDatetimeLocalValue(initialEntry.exitTime) : undefined
          }
        />
      </div>

      <Select label="Strategy used (optional)" name="algoId" defaultValue={initialEntry?.algoId ?? ""}>
        <option value="">Discretionary / none</option>
        {strategies.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </Select>

      <Input label="Reason" name="reason" placeholder="Why did you take this trade?" defaultValue={initialEntry?.reason ?? undefined} />
      <Input label="Emotion" name="emotion" placeholder="How did you feel?" defaultValue={initialEntry?.emotion ?? undefined} />
      <Input label="Mistake" name="mistake" placeholder="What, if anything, went wrong?" defaultValue={initialEntry?.mistake ?? undefined} />
      <Input label="News" name="news" placeholder="Any relevant news/events?" defaultValue={initialEntry?.news ?? undefined} />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-muted">Tags</label>
        <TagSelector value={tags} onChange={setTags} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-muted" htmlFor="screenshot">
          Screenshot {mode === "edit" && initialEntry?.screenshotUrl ? "(replace)" : "(optional)"}
        </label>
        <input
          id="screenshot"
          name="screenshot"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="text-sm text-muted file:mr-3 file:rounded-lg file:border file:border-border file:bg-base-elevated file:px-3 file:py-1.5 file:text-cream"
        />
      </div>

      {error && <p className="text-sm text-loss">{error}</p>}

      <Button type="submit" disabled={submitting} className="self-start">
        {submitting ? "Saving…" : mode === "create" ? "Save entry" : "Save changes"}
      </Button>
    </form>
  );
}

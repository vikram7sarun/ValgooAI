"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { publishStrategySchema, type PublishStrategyInput } from "@/lib/validation/marketplace";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

export function PublishStrategyForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PublishStrategyInput>({ resolver: zodResolver(publishStrategySchema) });

  const onSubmit = async (data: PublishStrategyInput) => {
    setServerError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/marketplace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setServerError(body.error ?? "Could not publish strategy");
        return;
      }
      router.push("/marketplace");
      router.refresh();
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input label="Strategy name" placeholder="Momentum Breakout Pro" {...register("name")} error={errors.name?.message} />
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-muted" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          rows={5}
          placeholder="Explain how this strategy works, what it trades, and when it enters/exits…"
          className="w-full rounded-lg border border-border bg-base-surface px-3.5 py-2.5 text-sm text-cream placeholder:text-muted/60 focus:border-brown-400 focus:outline-none focus:ring-2 focus:ring-brown-400/50"
          {...register("description")}
        />
        {errors.description && <p className="text-xs text-loss">{errors.description.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select label="Market" defaultValue="FOREX" {...register("marketType")}>
          <option value="INDIA">India</option>
          <option value="FOREX">Forex</option>
        </Select>
        <Input
          label="Price per month (₹)"
          type="number"
          step="any"
          {...register("pricePerMonth", { valueAsNumber: true })}
          error={errors.pricePerMonth?.message}
        />
      </div>
      <p className="text-xs text-muted">
        Your strategy will be reviewed by an admin before it appears in the marketplace.
      </p>
      {serverError && <p className="text-sm text-loss">{serverError}</p>}
      <Button type="submit" disabled={submitting} className="self-start">
        {submitting ? "Publishing…" : "Publish strategy"}
      </Button>
    </form>
  );
}

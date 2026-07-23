"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validation/profile";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function ForgotPasswordForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [devResetLink, setDevResetLink] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setMessage(null);
    setDevResetLink(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      setMessage(body.message ?? "If an account exists for that email, a reset link has been sent.");
      if (body.devResetLink) {
        setDevResetLink(body.devResetLink);
      }
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        {...register("email")}
        error={errors.email?.message}
      />
      {message && <p className="text-sm text-gain">{message}</p>}
      {devResetLink && (
        <p className="rounded-lg border border-border bg-base-elevated px-3.5 py-2.5 text-xs text-muted">
          Dev mode (no email provider configured) — reset link:{" "}
          <a href={devResetLink} className="break-all text-brown-300 hover:text-brown-200">
            {devResetLink}
          </a>
        </p>
      )}
      <Button type="submit" disabled={submitting} className="mt-2 w-full">
        {submitting ? "Sending…" : "Send reset link"}
      </Button>
    </form>
  );
}

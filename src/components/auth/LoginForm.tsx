"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validation/auth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const justRegistered = searchParams.get("registered") === "1";
  const justReset = searchParams.get("reset") === "1";
  const next = searchParams.get("next");

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setServerError(body.error ?? "Login failed. Please try again.");
        return;
      }
      const { role } = await res.json();
      router.push(next ?? (role === "ADMIN" ? "/admin" : "/dashboard"));
      router.refresh();
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {justRegistered && (
        <p className="rounded-lg border border-gain/30 bg-gain/10 px-3.5 py-2.5 text-sm text-gain">
          Account created — your account is pending admin approval. You&apos;ll be able to log in
          once approved.
        </p>
      )}
      {justReset && (
        <p className="rounded-lg border border-gain/30 bg-gain/10 px-3.5 py-2.5 text-sm text-gain">
          Password reset — log in with your new password.
        </p>
      )}
      <Input
        label="Email or phone"
        placeholder="you@example.com"
        {...register("identifier")}
        error={errors.identifier?.message}
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        {...register("password")}
        error={errors.password?.message}
      />
      {serverError && <p className="text-sm text-loss">{serverError}</p>}
      <div className="flex items-center justify-between text-sm">
        <a href="/forgot-password" className="text-muted hover:text-brown-300">
          Forgot password?
        </a>
      </div>
      <Button type="submit" disabled={submitting} className="mt-2 w-full">
        {submitting ? "Logging in…" : "Log in"}
      </Button>
    </form>
  );
}

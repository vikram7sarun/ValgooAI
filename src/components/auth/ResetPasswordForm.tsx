"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validation/profile";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token },
  });

  if (!token) {
    return (
      <p className="text-sm text-loss">
        This reset link is missing its token. Please request a new one from the{" "}
        <a href="/forgot-password" className="text-brown-300 hover:text-brown-200">
          forgot password
        </a>{" "}
        page.
      </p>
    );
  }

  const onSubmit = async (data: ResetPasswordInput) => {
    setServerError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setServerError(body.error ?? "Could not reset your password");
        return;
      }
      router.push("/login?reset=1");
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <input type="hidden" {...register("token")} />
      <Input
        label="New password"
        type="password"
        {...register("password")}
        error={errors.password?.message}
      />
      <Input
        label="Confirm new password"
        type="password"
        {...register("confirmPassword")}
        error={errors.confirmPassword?.message}
      />
      {serverError && <p className="text-sm text-loss">{serverError}</p>}
      <Button type="submit" disabled={submitting} className="mt-2 w-full">
        {submitting ? "Resetting…" : "Reset password"}
      </Button>
    </form>
  );
}

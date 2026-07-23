"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema, type ChangePasswordInput } from "@/lib/validation/profile";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function ChangePasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordInput>({ resolver: zodResolver(changePasswordSchema) });

  const onSubmit = async (data: ChangePasswordInput) => {
    setServerError(null);
    setSuccessMessage(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/profile/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setServerError(body.error ?? "Could not change password");
        return;
      }
      setSuccessMessage("Password changed.");
      reset();
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Current password"
        type="password"
        {...register("currentPassword")}
        error={errors.currentPassword?.message}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="New password"
          type="password"
          {...register("newPassword")}
          error={errors.newPassword?.message}
        />
        <Input
          label="Confirm new password"
          type="password"
          {...register("confirmNewPassword")}
          error={errors.confirmNewPassword?.message}
        />
      </div>
      {serverError && <p className="text-sm text-loss">{serverError}</p>}
      {successMessage && <p className="text-sm text-gain">{successMessage}</p>}
      <Button type="submit" disabled={submitting} className="mt-2 self-start">
        {submitting ? "Updating…" : "Update password"}
      </Button>
    </form>
  );
}

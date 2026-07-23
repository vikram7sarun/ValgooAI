"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserSchema, type CreateUserInput } from "@/lib/validation/admin";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import type { AdminUser } from "@/types/admin";

export function AddUserModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (user: AdminUser) => void;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { role: "USER" },
  });

  const onSubmit = async (data: CreateUserInput) => {
    setServerError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setServerError(body.error ?? "Could not create user");
        return;
      }
      onCreated({
        id: body.id,
        name: body.name,
        email: body.email,
        phone: data.phone ?? null,
        role: body.role,
        createdAt: new Date().toISOString(),
        enabledAlgoCount: 0,
      });
      onClose();
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-base-surface p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-cream">Add user</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 flex flex-col gap-4">
          <Input label="Full name" {...register("name")} error={errors.name?.message} />
          <Input label="Email" type="email" {...register("email")} error={errors.email?.message} />
          <Input label="Phone (optional)" {...register("phone")} error={errors.phone?.message} />
          <Input
            label="Temporary password"
            type="password"
            {...register("password")}
            error={errors.password?.message}
          />
          <Select label="Role" {...register("role")}>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </Select>
          {serverError && <p className="text-sm text-loss">{serverError}</p>}
          <div className="mt-2 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Creating…" : "Create user"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

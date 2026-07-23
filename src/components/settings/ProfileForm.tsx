"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfileSchema, type UpdateProfileInput } from "@/lib/validation/profile";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

interface InitialProfile {
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
  experience: string | null;
}

export function ProfileForm({ initialProfile }: { initialProfile: InitialProfile }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: initialProfile.name,
      email: initialProfile.email,
      phone: initialProfile.phone ?? "",
      country: initialProfile.country ?? "",
      experience: initialProfile.experience ?? "",
    },
  });

  const onSubmit = async (data: UpdateProfileInput) => {
    setServerError(null);
    setSuccessMessage(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setServerError(body.error ?? "Could not update profile");
        return;
      }
      setSuccessMessage("Profile updated.");
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input label="Full name" {...register("name")} error={errors.name?.message} />
      <Input label="Email" type="email" {...register("email")} error={errors.email?.message} />
      <Input label="Phone number" type="tel" {...register("phone")} error={errors.phone?.message} />
      <div className="grid grid-cols-2 gap-4">
        <Select label="Country" {...register("country")}>
          <option value="">Select country</option>
          <option value="India">India</option>
          <option value="Other">Other</option>
        </Select>
        <Select label="Experience" {...register("experience")}>
          <option value="">Select level</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </Select>
      </div>
      {serverError && <p className="text-sm text-loss">{serverError}</p>}
      {successMessage && <p className="text-sm text-gain">{successMessage}</p>}
      <Button type="submit" disabled={submitting} className="mt-2 self-start">
        {submitting ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}

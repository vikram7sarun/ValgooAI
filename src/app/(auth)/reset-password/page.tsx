import Link from "next/link";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-cream">Set a new password</h1>
      <p className="mt-1 text-sm text-muted">Choose a new password for your account.</p>
      <div className="mt-6">
        <Suspense>
          <ResetPasswordForm />
        </Suspense>
      </div>
      <p className="mt-6 text-center text-sm text-muted">
        <Link href="/login" className="text-brown-300 hover:text-brown-200">
          Back to login
        </Link>
      </p>
    </div>
  );
}

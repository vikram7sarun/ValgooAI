import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-cream">Reset your password</h1>
      <p className="mt-1 text-sm text-muted">
        Enter your email and we&apos;ll send you a link to set a new password.
      </p>
      <div className="mt-6">
        <ForgotPasswordForm />
      </div>
      <p className="mt-6 text-center text-sm text-muted">
        <Link href="/login" className="text-brown-300 hover:text-brown-200">
          Back to login
        </Link>
      </p>
    </div>
  );
}

import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-cream">Reset your password</h1>
      <p className="mt-3 text-sm text-muted">
        Password reset isn&apos;t available yet in this preview. Please contact an administrator to
        have your password reset manually.
      </p>
      <p className="mt-6 text-center text-sm text-muted">
        <Link href="/login" className="text-brown-300 hover:text-brown-200">
          Back to login
        </Link>
      </p>
    </div>
  );
}

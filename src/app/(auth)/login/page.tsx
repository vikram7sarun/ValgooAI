import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-cream">Welcome back</h1>
      <p className="mt-1 text-sm text-muted">Log in to view your algo dashboard.</p>
      <div className="mt-6">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
      <p className="mt-6 text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-brown-300 hover:text-brown-200">
          Register
        </Link>
      </p>
    </div>
  );
}

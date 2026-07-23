import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-cream">Create your account</h1>
      <p className="mt-1 text-sm text-muted">Start tracking algo signals across Indian markets and forex.</p>
      <div className="mt-6">
        <RegisterForm />
      </div>
      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-brown-300 hover:text-brown-200">
          Log in
        </Link>
      </p>
    </div>
  );
}

import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-base px-4 py-12">
      <Link href="/" className="mb-8 text-lg font-semibold tracking-tight text-cream">
        Valgoo<span className="text-brown-400">.AI</span>
      </Link>
      <div className="w-full max-w-md rounded-2xl border border-border bg-base-surface p-8 shadow-xl">
        {children}
      </div>
    </div>
  );
}

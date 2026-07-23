"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

interface NavbarProps {
  session: { role: "USER" | "ADMIN" } | null;
}

export function Navbar({ session }: NavbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-base/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-cream">
          Valgoo<span className="text-brown-400">.AI</span>
        </Link>
        <div className="hidden items-center gap-8 text-sm text-muted md:flex">
          <a href="#markets" className="transition-colors hover:text-cream">
            Markets
          </a>
          <a href="#features" className="transition-colors hover:text-cream">
            Platform
          </a>
          <a href="#how-it-works" className="transition-colors hover:text-cream">
            How it works
          </a>
        </div>
        <div className="flex items-center gap-3">
          {session ? (
            <>
              <Link href={session.role === "ADMIN" ? "/admin" : "/dashboard"}>
                <Button variant="ghost">{session.role === "ADMIN" ? "Admin" : "Dashboard"}</Button>
              </Link>
              <Button variant="primary" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button variant="primary">Register</Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

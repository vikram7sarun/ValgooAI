"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function DashboardNav({
  name,
  role,
  impersonating = false,
}: {
  name: string;
  role: "USER" | "ADMIN";
  impersonating?: boolean;
}) {
  const router = useRouter();
  const [returning, setReturning] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const handleReturnToAdmin = async () => {
    setReturning(true);
    try {
      const res = await fetch("/api/auth/stop-impersonation", { method: "POST" });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setReturning(false);
      }
    } catch {
      setReturning(false);
    }
  };

  return (
    <div>
      {impersonating && (
        <div className="flex items-center justify-center gap-3 bg-loss/15 px-4 py-2 text-sm text-loss">
          <span>You&apos;re viewing this account as an admin.</span>
          <Button
            variant="secondary"
            className="px-3 py-1 text-xs"
            onClick={handleReturnToAdmin}
            disabled={returning}
          >
            {returning ? "Returning…" : "Return to admin"}
          </Button>
        </div>
      )}
      <header className="border-b border-border bg-base/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold tracking-tight text-cream">
            Valgoo<span className="text-brown-400">.AI</span>
          </Link>
          <div className="flex items-center gap-4">
            {role === "ADMIN" && (
              <Link href="/admin" className="text-sm text-muted hover:text-cream">
                Admin
              </Link>
            )}
            <Link href="/strategies" className="text-sm text-muted hover:text-cream">
              Strategies
            </Link>
            <Link href="/marketplace" className="text-sm text-muted hover:text-cream">
              Marketplace
            </Link>
            <Link href="/journal" className="text-sm text-muted hover:text-cream">
              Journal
            </Link>
            <Link href="/settings" className="text-sm text-muted hover:text-cream">
              Settings
            </Link>
            <span className="text-sm text-muted">{name}</span>
            <Button variant="ghost" onClick={handleLogout} className="px-3 py-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>
    </div>
  );
}

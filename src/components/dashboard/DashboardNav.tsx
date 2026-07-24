"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function DashboardNav({ name, role }: { name: string; role: "USER" | "ADMIN" }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
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
  );
}

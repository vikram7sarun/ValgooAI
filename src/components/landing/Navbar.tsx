import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Navbar() {
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
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/register">
            <Button variant="primary">Register</Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}

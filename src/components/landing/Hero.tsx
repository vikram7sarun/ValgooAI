import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-20 md:pt-28">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[500px] opacity-60"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 0%, rgba(138,90,53,0.25) 0%, rgba(11,10,9,0) 70%)",
        }}
      />
      <div className="mx-auto max-w-3xl text-center">
        <Badge tone="brown">Live mock signals · India &amp; Forex</Badge>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-cream md:text-5xl">
          Algorithmic signals for Indian markets and forex,
          <span className="text-brown-300"> delivered in real time.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-muted">
          Track curated algo strategies across gold, Nifty, and major currency pairs. Register, get
          onboarded by an admin, and watch live signal updates land on your dashboard.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link href="/register">
            <Button variant="primary" className="px-6 py-3 text-base">
              Get started
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary" className="px-6 py-3 text-base">
              Log in
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

import { Card } from "@/components/ui/Card";
import { LineChart, ShieldCheck, Radio, Globe2 } from "lucide-react";

const features = [
  {
    icon: LineChart,
    title: "Curated algo strategies",
    description:
      "Each strategy runs continuously and produces buy/sell/hold signals across commodities, Indian indices, and forex pairs.",
  },
  {
    icon: Radio,
    title: "Real-time delivery",
    description:
      "Signals stream to your dashboard the moment they're generated — no polling, no page refresh.",
  },
  {
    icon: Globe2,
    title: "India & forex, side by side",
    description:
      "Instruments are always tagged by market so you can separate your Indian market view from your forex view.",
  },
  {
    icon: ShieldCheck,
    title: "Admin-controlled access",
    description:
      "An administrator enables the exact algos each trader can see — nothing is switched on by default.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="text-2xl font-semibold text-cream">Built for focused, algorithmic execution</h2>
      <p className="mt-2 max-w-xl text-sm text-muted">
        Valgoo.AI is a signal platform — not a broker. It shows you what an algorithm sees, when it
        sees it.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <Card key={f.title} className="p-5">
            <f.icon className="h-6 w-6 text-brown-400" />
            <h3 className="mt-4 text-sm font-semibold text-cream">{f.title}</h3>
            <p className="mt-2 text-sm text-muted">{f.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

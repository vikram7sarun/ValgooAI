import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { PublishStrategyForm } from "@/components/marketplace/PublishStrategyForm";

export default async function PublishStrategyPage() {
  const session = await getSessionUser();
  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-cream">Publish a strategy</h1>
      <p className="mt-1 text-sm text-muted">
        Tell other traders what your strategy does. It&apos;ll be reviewed before going live.
      </p>
      <div className="mt-6 max-w-xl">
        <PublishStrategyForm />
      </div>
    </div>
  );
}

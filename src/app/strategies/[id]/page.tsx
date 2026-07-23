import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth/session";
import { getStrategyDetail } from "@/lib/strategies";
import { StrategyDetailView } from "@/components/strategies/StrategyDetailView";

export default async function StrategyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSessionUser();
  if (!session) {
    redirect("/login");
  }

  const { id } = await params;
  const strategy = await getStrategyDetail(id, session.sub);
  if (!strategy) {
    notFound();
  }

  return (
    <div>
      <Link href="/strategies" className="text-sm text-muted hover:text-cream">
        ← Back to strategies
      </Link>
      <div className="mt-4">
        <StrategyDetailView initialStrategy={strategy} />
      </div>
    </div>
  );
}

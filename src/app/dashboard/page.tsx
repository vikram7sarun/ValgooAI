import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { getUserDashboardAlgos } from "@/lib/dashboard";
import { AlgoStatusPanel } from "@/components/dashboard/AlgoStatusPanel";

export default async function DashboardPage() {
  const session = await getSessionUser();
  if (!session) {
    redirect("/login");
  }

  const algos = await getUserDashboardAlgos(session.sub);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-cream">Your algos</h1>
      <p className="mt-1 text-sm text-muted">
        Live signal updates stream in automatically as your enabled algos fire.
      </p>
      <div className="mt-6">
        <AlgoStatusPanel initialAlgos={algos} />
      </div>
    </div>
  );
}

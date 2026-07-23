import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { getStrategiesForUser } from "@/lib/strategies";
import { StrategyCatalog } from "@/components/strategies/StrategyCatalog";

export default async function StrategiesPage() {
  const session = await getSessionUser();
  if (!session) {
    redirect("/login");
  }

  const strategies = await getStrategiesForUser(session.sub);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-cream">Strategies</h1>
      <p className="mt-1 text-sm text-muted">
        Browse available algo strategies and deploy the ones you want running on your account.
      </p>
      <div className="mt-6">
        <StrategyCatalog initialStrategies={strategies} />
      </div>
    </div>
  );
}

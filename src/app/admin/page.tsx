import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { getAdminUsers, getAdminAlgos } from "@/lib/admin";
import { getAllListingsForAdmin } from "@/lib/marketplace";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default async function AdminPage() {
  const session = await getSessionUser();
  if (!session || session.role !== "ADMIN") {
    redirect("/login");
  }

  const [users, algos, marketplaceListings] = await Promise.all([
    getAdminUsers(),
    getAdminAlgos(),
    getAllListingsForAdmin(),
  ]);
  const pendingMarketplaceCount = marketplaceListings.filter((l) => l.status === "PENDING").length;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-cream">Admin</h1>
      <p className="mt-1 text-sm text-muted">
        Onboard users and control which algos are enabled for each account.
      </p>

      <Link href="/admin/marketplace" className="mt-6 block">
        <Card className="flex items-center justify-between p-4 hover:border-brown-500/50">
          <div>
            <h2 className="text-sm font-semibold text-cream">Marketplace moderation</h2>
            <p className="mt-1 text-xs text-muted">Review user-published strategies before they go live.</p>
          </div>
          {pendingMarketplaceCount > 0 ? (
            <Badge tone="muted">{pendingMarketplaceCount} pending</Badge>
          ) : (
            <Badge tone="gain">All caught up</Badge>
          )}
        </Card>
      </Link>

      <div className="mt-6">
        <AdminDashboardClient initialUsers={users} algos={algos} currentUserId={session.sub} />
      </div>
    </div>
  );
}

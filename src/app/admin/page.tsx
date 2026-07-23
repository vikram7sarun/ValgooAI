import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { getAdminUsers, getAdminAlgos } from "@/lib/admin";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";

export default async function AdminPage() {
  const session = await getSessionUser();
  if (!session || session.role !== "ADMIN") {
    redirect("/login");
  }

  const [users, algos] = await Promise.all([getAdminUsers(), getAdminAlgos()]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-cream">Admin</h1>
      <p className="mt-1 text-sm text-muted">
        Onboard users and control which algos are enabled for each account.
      </p>
      <div className="mt-6">
        <AdminDashboardClient initialUsers={users} algos={algos} currentUserId={session.sub} />
      </div>
    </div>
  );
}

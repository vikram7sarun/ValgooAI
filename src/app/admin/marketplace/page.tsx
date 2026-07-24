import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { getAllListingsForAdmin } from "@/lib/marketplace";
import { AdminMarketplaceTable } from "@/components/marketplace/AdminMarketplaceTable";

export default async function AdminMarketplacePage() {
  const session = await getSessionUser();
  if (!session || session.role !== "ADMIN") {
    redirect("/login");
  }

  const listings = await getAllListingsForAdmin();

  return (
    <div>
      <Link href="/admin" className="text-sm text-muted hover:text-cream">
        ← Back to admin
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-cream">Marketplace moderation</h1>
      <p className="mt-1 text-sm text-muted">
        Review published strategies before they become visible to other users.
      </p>
      <div className="mt-6">
        <AdminMarketplaceTable initialListings={listings} />
      </div>
    </div>
  );
}

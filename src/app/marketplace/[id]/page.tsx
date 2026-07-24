import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth/session";
import { getListingDetail } from "@/lib/marketplace";
import { ListingDetailView } from "@/components/marketplace/ListingDetailView";

export default async function MarketplaceListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSessionUser();
  if (!session) {
    redirect("/login");
  }

  const { id } = await params;
  const listing = await getListingDetail(id, session.sub, session.role === "ADMIN");
  if (!listing) {
    notFound();
  }

  return (
    <div>
      <Link href="/marketplace" className="text-sm text-muted hover:text-cream">
        ← Back to marketplace
      </Link>
      <div className="mt-4">
        <ListingDetailView initialListing={listing} />
      </div>
    </div>
  );
}

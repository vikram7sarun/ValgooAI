import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { getApprovedListings, getMyListings } from "@/lib/marketplace";
import { Tabs } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { MarketplaceBrowseGrid } from "@/components/marketplace/MarketplaceBrowseGrid";
import { MyListingsGrid } from "@/components/marketplace/MyListingsGrid";

export default async function MarketplacePage() {
  const session = await getSessionUser();
  if (!session) {
    redirect("/login");
  }

  const [approved, mine] = await Promise.all([
    getApprovedListings(session.sub),
    getMyListings(session.sub),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-cream">Strategy Marketplace</h1>
          <p className="mt-1 text-sm text-muted">
            Publish your own strategies, rent others&apos;, and back-test before you commit.
          </p>
        </div>
        <Link href="/marketplace/publish">
          <Button>+ Publish strategy</Button>
        </Link>
      </div>

      <div className="mt-6">
        <Tabs
          tabs={[
            {
              key: "browse",
              label: `Browse (${approved.length})`,
              content: <MarketplaceBrowseGrid initialListings={approved} />,
            },
            {
              key: "mine",
              label: `My Listings (${mine.length})`,
              content: <MyListingsGrid initialListings={mine} />,
            },
          ]}
        />
      </div>
    </div>
  );
}

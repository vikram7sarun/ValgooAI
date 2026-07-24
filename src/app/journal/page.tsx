import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { getJournalEntriesForUser } from "@/lib/journal";
import { JournalList } from "@/components/journal/JournalList";
import { Button } from "@/components/ui/Button";

export default async function JournalPage() {
  const session = await getSessionUser();
  if (!session) {
    redirect("/login");
  }

  const entries = await getJournalEntriesForUser(session.sub);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-cream">Trade Journal</h1>
          <p className="mt-1 text-sm text-muted">
            Log every trade — screenshot, entry/exit, reason, emotion, and mistakes.
          </p>
        </div>
        <Link href="/journal/new">
          <Button>+ New entry</Button>
        </Link>
      </div>
      <div className="mt-6">
        <JournalList entries={entries} />
      </div>
    </div>
  );
}

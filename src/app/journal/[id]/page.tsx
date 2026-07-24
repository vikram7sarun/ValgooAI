import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth/session";
import { getJournalEntry } from "@/lib/journal";
import { JournalEntryDetail } from "@/components/journal/JournalEntryDetail";

export default async function JournalEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSessionUser();
  if (!session) {
    redirect("/login");
  }

  const { id } = await params;
  const entry = await getJournalEntry(id, session.sub);
  if (!entry) {
    notFound();
  }

  return (
    <div>
      <Link href="/journal" className="text-sm text-muted hover:text-cream">
        ← Back to journal
      </Link>
      <div className="mt-4">
        <JournalEntryDetail entry={entry} />
      </div>
    </div>
  );
}

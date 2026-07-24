import { notFound, redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { getJournalEntry } from "@/lib/journal";
import { getStrategiesForUser } from "@/lib/strategies";
import { JournalEntryForm } from "@/components/journal/JournalEntryForm";

export default async function EditJournalEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSessionUser();
  if (!session) {
    redirect("/login");
  }

  const { id } = await params;
  const [entry, strategies] = await Promise.all([
    getJournalEntry(id, session.sub),
    getStrategiesForUser(session.sub),
  ]);

  if (!entry) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-cream">Edit trade</h1>
      <div className="mt-6">
        <JournalEntryForm mode="edit" entryId={entry.id} initialEntry={entry} strategies={strategies} />
      </div>
    </div>
  );
}

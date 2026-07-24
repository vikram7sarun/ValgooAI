import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { getStrategiesForUser } from "@/lib/strategies";
import { JournalEntryForm } from "@/components/journal/JournalEntryForm";

export default async function NewJournalEntryPage() {
  const session = await getSessionUser();
  if (!session) {
    redirect("/login");
  }

  const strategies = await getStrategiesForUser(session.sub);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-cream">Log a trade</h1>
      <div className="mt-6">
        <JournalEntryForm mode="create" strategies={strategies} />
      </div>
    </div>
  );
}

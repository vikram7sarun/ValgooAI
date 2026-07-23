import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth/session";
import { getManagedUser, getUserAlgoToggles } from "@/lib/admin";
import { UserAlgoManager } from "@/components/admin/UserAlgoManager";
import { Badge } from "@/components/ui/Badge";

export default async function ManageUserAlgosPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSessionUser();
  if (!session || session.role !== "ADMIN") {
    redirect("/login");
  }

  const { id } = await params;
  const managedUser = await getManagedUser(id);
  if (!managedUser) {
    notFound();
  }

  const algos = await getUserAlgoToggles(id);

  return (
    <div>
      <Link href="/admin" className="text-sm text-muted hover:text-cream">
        ← Back to admin
      </Link>
      <div className="mt-4 flex items-center gap-3">
        <h1 className="text-2xl font-semibold text-cream">{managedUser.name}</h1>
        <Badge tone={managedUser.role === "ADMIN" ? "brown" : "muted"}>{managedUser.role}</Badge>
      </div>
      <p className="mt-1 text-sm text-muted">{managedUser.email}</p>
      <h2 className="mt-8 mb-3 text-sm font-semibold uppercase tracking-wide text-brown-300">
        Algo access
      </h2>
      <UserAlgoManager userId={id} initialAlgos={algos} />
    </div>
  );
}

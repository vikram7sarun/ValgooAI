import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/components/settings/ProfileForm";
import { ChangePasswordForm } from "@/components/settings/ChangePasswordForm";

export default async function SettingsPage() {
  const session = await getSessionUser();
  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: { name: true, email: true, phone: true, country: true, experience: true },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-semibold text-cream">Settings</h1>
        <p className="mt-1 text-sm text-muted">Manage your profile and account security.</p>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brown-300">
          Profile
        </h2>
        <ProfileForm initialProfile={user} />
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brown-300">
          Change password
        </h2>
        <ChangePasswordForm />
      </section>
    </div>
  );
}

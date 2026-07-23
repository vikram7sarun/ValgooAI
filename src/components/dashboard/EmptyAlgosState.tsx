import { Card } from "@/components/ui/Card";

export function EmptyAlgosState() {
  return (
    <Card className="flex flex-col items-center gap-2 p-10 text-center">
      <h3 className="text-base font-semibold text-cream">No algos enabled yet</h3>
      <p className="max-w-sm text-sm text-muted">
        Your account doesn&apos;t have any algo strategies turned on. Contact an admin to get one or
        more algos enabled for your account.
      </p>
    </Card>
  );
}

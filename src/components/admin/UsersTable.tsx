"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { AdminUser } from "@/types/admin";
import { Table, Thead, Th, Tr, Td } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const PAGE_SIZE = 10;

const STATUS_TONE = {
  ACTIVE: "gain",
  PENDING: "muted",
  SUSPENDED: "loss",
} as const;

export function UsersTable({
  users,
  currentUserId,
  onDelete,
  onApprove,
  onSuspend,
}: {
  users: AdminUser[];
  currentUserId: string;
  onDelete: (id: string) => void;
  onApprove: (id: string) => void;
  onSuspend: (id: string) => void;
}) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [suspendingId, setSuspendingId] = useState<string | null>(null);
  const [impersonatingId, setImpersonatingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.phone ?? "").toLowerCase().includes(q),
    );
  }, [users, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  const handleDelete = async (user: AdminUser) => {
    if (!confirm(`Delete ${user.name} (${user.email})? This cannot be undone.`)) return;
    setDeletingId(user.id);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
      if (res.ok) {
        onDelete(user.id);
      }
    } finally {
      setDeletingId(null);
    }
  };

  const handleApprove = async (user: AdminUser) => {
    setApprovingId(user.id);
    try {
      const res = await fetch(`/api/admin/users/${user.id}/approve`, { method: "POST" });
      if (res.ok) {
        onApprove(user.id);
      }
    } finally {
      setApprovingId(null);
    }
  };

  const handleSuspend = async (user: AdminUser) => {
    setSuspendingId(user.id);
    try {
      const res = await fetch(`/api/admin/users/${user.id}/suspend`, { method: "POST" });
      if (res.ok) {
        onSuspend(user.id);
      }
    } finally {
      setSuspendingId(null);
    }
  };

  const handleImpersonate = async (user: AdminUser) => {
    setImpersonatingId(user.id);
    try {
      const res = await fetch(`/api/admin/users/${user.id}/impersonate`, { method: "POST" });
      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        const body = await res.json().catch(() => ({}));
        alert(body.error ?? "Could not log in as this user");
        setImpersonatingId(null);
      }
    } catch {
      setImpersonatingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Input
        placeholder="Search by name, email, or phone…"
        value={query}
        onChange={(e) => handleQueryChange(e.target.value)}
        className="max-w-sm"
      />

      <Table>
        <Thead>
          <tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Phone</Th>
            <Th>Role</Th>
            <Th>Status</Th>
            <Th>Algos enabled</Th>
            <Th>Joined</Th>
            <Th>Actions</Th>
          </tr>
        </Thead>
        <tbody>
          {pageItems.map((user) => (
            <Tr key={user.id}>
              <Td>{user.name}</Td>
              <Td className="text-muted">{user.email}</Td>
              <Td className="text-muted">{user.phone ?? "—"}</Td>
              <Td>
                <Badge tone={user.role === "ADMIN" ? "brown" : "muted"}>{user.role}</Badge>
              </Td>
              <Td>
                <Badge tone={STATUS_TONE[user.status]}>{user.status}</Badge>
              </Td>
              <Td>{user.enabledAlgoCount}</Td>
              <Td className="text-muted">{new Date(user.createdAt).toLocaleDateString("en-IN")}</Td>
              <Td>
                <div className="flex items-center gap-2">
                  {user.status === "PENDING" && (
                    <Button
                      variant="secondary"
                      className="px-3 py-1.5 text-xs"
                      disabled={approvingId === user.id}
                      onClick={() => handleApprove(user)}
                    >
                      {approvingId === user.id ? "Approving…" : "Approve"}
                    </Button>
                  )}
                  {user.status === "SUSPENDED" && (
                    <Button
                      variant="secondary"
                      className="px-3 py-1.5 text-xs"
                      disabled={approvingId === user.id}
                      onClick={() => handleApprove(user)}
                    >
                      {approvingId === user.id ? "Reactivating…" : "Reactivate"}
                    </Button>
                  )}
                  {user.status === "ACTIVE" && (
                    <Button
                      variant="danger"
                      className="px-3 py-1.5 text-xs"
                      disabled={user.id === currentUserId || suspendingId === user.id}
                      onClick={() => handleSuspend(user)}
                    >
                      {suspendingId === user.id ? "Suspending…" : "Suspend"}
                    </Button>
                  )}
                  {user.role !== "ADMIN" && (
                    <Button
                      variant="secondary"
                      className="px-3 py-1.5 text-xs"
                      disabled={impersonatingId === user.id}
                      onClick={() => handleImpersonate(user)}
                    >
                      {impersonatingId === user.id ? "Logging in…" : "Login as"}
                    </Button>
                  )}
                  <Link href={`/admin/users/${user.id}`}>
                    <Button variant="secondary" className="px-3 py-1.5 text-xs">
                      Manage
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    className="px-3 py-1.5 text-xs"
                    disabled={user.id === currentUserId || deletingId === user.id}
                    onClick={() => handleDelete(user)}
                  >
                    {deletingId === user.id ? "Deleting…" : "Delete"}
                  </Button>
                </div>
              </Td>
            </Tr>
          ))}
          {pageItems.length === 0 && (
            <Tr>
              <Td colSpan={8} className="text-center text-muted">
                {users.length === 0 ? "No users yet." : "No users match your search."}
              </Td>
            </Tr>
          )}
        </tbody>
      </Table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted">
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              className="px-3 py-1.5 text-xs"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </Button>
            <Button
              variant="secondary"
              className="px-3 py-1.5 text-xs"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

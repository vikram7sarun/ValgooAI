"use client";

import Link from "next/link";
import { useState } from "react";
import type { AdminUser } from "@/types/admin";
import { Table, Thead, Th, Tr, Td } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function UsersTable({
  users,
  currentUserId,
  onDelete,
}: {
  users: AdminUser[];
  currentUserId: string;
  onDelete: (id: string) => void;
}) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  return (
    <Table>
      <Thead>
        <tr>
          <Th>Name</Th>
          <Th>Email</Th>
          <Th>Phone</Th>
          <Th>Role</Th>
          <Th>Algos enabled</Th>
          <Th>Joined</Th>
          <Th>Actions</Th>
        </tr>
      </Thead>
      <tbody>
        {users.map((user) => (
          <Tr key={user.id}>
            <Td>{user.name}</Td>
            <Td className="text-muted">{user.email}</Td>
            <Td className="text-muted">{user.phone ?? "—"}</Td>
            <Td>
              <Badge tone={user.role === "ADMIN" ? "brown" : "muted"}>{user.role}</Badge>
            </Td>
            <Td>{user.enabledAlgoCount}</Td>
            <Td className="text-muted">{new Date(user.createdAt).toLocaleDateString("en-IN")}</Td>
            <Td>
              <div className="flex items-center gap-2">
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
        {users.length === 0 && (
          <Tr>
            <Td colSpan={7} className="text-center text-muted">
              No users yet.
            </Td>
          </Tr>
        )}
      </tbody>
    </Table>
  );
}

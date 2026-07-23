"use client";

import { useState } from "react";
import type { AdminUser, AdminAlgo } from "@/types/admin";
import { AdminStatsBar } from "./AdminStatsBar";
import { UsersTable } from "./UsersTable";
import { AddUserModal } from "./AddUserModal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export function AdminDashboardClient({
  initialUsers,
  algos,
  currentUserId,
}: {
  initialUsers: AdminUser[];
  algos: AdminAlgo[];
  currentUserId: string;
}) {
  const [users, setUsers] = useState(initialUsers);
  const [modalOpen, setModalOpen] = useState(false);

  const stats = [
    { label: "Total users", value: users.length },
    { label: "Admins", value: users.filter((u) => u.role === "ADMIN").length },
    { label: "Algos", value: algos.length },
    { label: "Active enrollments", value: algos.reduce((sum, a) => sum + a.activeUserCount, 0) },
  ];

  return (
    <div className="flex flex-col gap-8">
      <AdminStatsBar stats={stats} />

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brown-300">
          Algos running across all users
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {algos.map((algo) => (
            <Card key={algo.id} className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-cream">{algo.name}</span>
                <Badge tone="brown">{algo.marketType}</Badge>
              </div>
              <p className="mt-2 text-xs text-muted">{algo.description}</p>
              <p className="mt-3 text-xs text-muted">
                <span className="font-semibold text-gain">{algo.activeUserCount}</span> user
                {algo.activeUserCount === 1 ? "" : "s"} enabled
              </p>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-brown-300">
            All users
          </h2>
          <Button onClick={() => setModalOpen(true)} className="px-3 py-2 text-sm">
            + Add user
          </Button>
        </div>
        <UsersTable
          users={users}
          currentUserId={currentUserId}
          onDelete={(id) => setUsers((prev) => prev.filter((u) => u.id !== id))}
        />
      </div>

      {modalOpen && (
        <AddUserModal
          onClose={() => setModalOpen(false)}
          onCreated={(user) => setUsers((prev) => [user, ...prev])}
        />
      )}
    </div>
  );
}

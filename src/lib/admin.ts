import { prisma } from "@/lib/prisma";
import type { AdminUser, AdminAlgo, UserAlgoToggle } from "@/types/admin";

export async function getAdminUsers(): Promise<AdminUser[]> {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      createdAt: true,
      userAlgos: { where: { enabled: true }, select: { algoId: true } },
    },
  });

  return users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    role: u.role,
    status: u.status,
    createdAt: u.createdAt.toISOString(),
    enabledAlgoCount: u.userAlgos.length,
  }));
}

export async function getAdminAlgos(): Promise<AdminAlgo[]> {
  const algos = await prisma.algo.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { userAlgos: { where: { enabled: true } } } },
    },
  });

  return algos.map((a) => ({
    id: a.id,
    name: a.name,
    marketType: a.marketType,
    description: a.description,
    activeUserCount: a._count.userAlgos,
  }));
}

export async function getManagedUser(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true },
  });
}

export async function getUserAlgoToggles(userId: string): Promise<UserAlgoToggle[]> {
  const [algos, userAlgos] = await Promise.all([
    prisma.algo.findMany({ orderBy: { name: "asc" } }),
    prisma.userAlgo.findMany({ where: { userId } }),
  ]);

  const byAlgoId = new Map(userAlgos.map((ua) => [ua.algoId, ua]));

  return algos.map((algo) => ({
    id: algo.id,
    name: algo.name,
    marketType: algo.marketType,
    description: algo.description,
    enabled: byAlgoId.get(algo.id)?.enabled ?? false,
    enabledAt: byAlgoId.get(algo.id)?.enabledAt?.toISOString() ?? null,
  }));
}

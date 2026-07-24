import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import type { JournalEntry } from "@/types/journal";

const withAlgo = { algo: { select: { name: true } } } satisfies Prisma.TradeJournalEntryInclude;

type EntryWithAlgo = Prisma.TradeJournalEntryGetPayload<{ include: typeof withAlgo }>;

function toJournalEntry(entry: EntryWithAlgo): JournalEntry {
  return {
    id: entry.id,
    instrument: entry.instrument,
    direction: entry.direction,
    entryPrice: entry.entryPrice,
    exitPrice: entry.exitPrice,
    entryTime: entry.entryTime.toISOString(),
    exitTime: entry.exitTime?.toISOString() ?? null,
    screenshotUrl: entry.screenshotUrl,
    reason: entry.reason,
    emotion: entry.emotion,
    mistake: entry.mistake,
    news: entry.news,
    tags: entry.tags,
    algoId: entry.algoId,
    algoName: entry.algo?.name ?? null,
    createdAt: entry.createdAt.toISOString(),
  };
}

export async function getJournalEntriesForUser(userId: string): Promise<JournalEntry[]> {
  const entries = await prisma.tradeJournalEntry.findMany({
    where: { userId },
    include: withAlgo,
    orderBy: { entryTime: "desc" },
  });
  return entries.map(toJournalEntry);
}

export async function getJournalEntry(id: string, userId: string): Promise<JournalEntry | null> {
  const entry = await prisma.tradeJournalEntry.findFirst({
    where: { id, userId },
    include: withAlgo,
  });
  return entry ? toJournalEntry(entry) : null;
}

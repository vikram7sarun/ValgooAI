import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, authErrorResponse } from "@/lib/auth/rbac";
import { getJournalEntriesForUser, getJournalEntry } from "@/lib/journal";
import { journalEntrySchema, journalFormDataToObject } from "@/lib/validation/journal";
import { saveUploadedImage, UploadError } from "@/lib/uploads";

export async function GET() {
  try {
    const session = await requireUser();
    const entries = await getJournalEntriesForUser(session.sub);
    return NextResponse.json({ entries });
  } catch (error) {
    return authErrorResponse(error) ?? NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireUser();

    const formData = await request.formData();
    const parsed = journalEntrySchema.safeParse(journalFormDataToObject(formData));
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }
    const data = parsed.data;

    if (data.algoId) {
      const algo = await prisma.algo.findUnique({ where: { id: data.algoId } });
      if (!algo) {
        return NextResponse.json({ error: "Invalid strategy" }, { status: 400 });
      }
    }

    let screenshotUrl: string | null = null;
    const screenshot = formData.get("screenshot");
    if (screenshot instanceof File && screenshot.size > 0) {
      try {
        screenshotUrl = await saveUploadedImage(screenshot);
      } catch (err) {
        if (err instanceof UploadError) {
          return NextResponse.json({ error: err.message }, { status: 400 });
        }
        throw err;
      }
    }

    const created = await prisma.tradeJournalEntry.create({
      data: {
        userId: session.sub,
        algoId: data.algoId ?? null,
        instrument: data.instrument,
        direction: data.direction,
        entryPrice: data.entryPrice,
        exitPrice: data.exitPrice ?? null,
        entryTime: new Date(data.entryTime),
        exitTime: data.exitTime ? new Date(data.exitTime) : null,
        screenshotUrl,
        reason: data.reason ?? null,
        emotion: data.emotion ?? null,
        mistake: data.mistake ?? null,
        news: data.news ?? null,
        tags: data.tags,
      },
    });

    const entry = await getJournalEntry(created.id, session.sub);
    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    return authErrorResponse(error) ?? NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, authErrorResponse } from "@/lib/auth/rbac";
import { getJournalEntry } from "@/lib/journal";
import { journalEntrySchema, journalFormDataToObject } from "@/lib/validation/journal";
import { saveUploadedImage, deleteUploadedImage, UploadError } from "@/lib/uploads";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireUser();
    const { id } = await params;

    const entry = await getJournalEntry(id, session.sub);
    if (!entry) {
      return NextResponse.json({ error: "Journal entry not found" }, { status: 404 });
    }

    return NextResponse.json({ entry });
  } catch (error) {
    return authErrorResponse(error) ?? NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireUser();
    const { id } = await params;

    const existing = await getJournalEntry(id, session.sub);
    if (!existing) {
      return NextResponse.json({ error: "Journal entry not found" }, { status: 404 });
    }

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

    let screenshotUrl = existing.screenshotUrl;
    const screenshot = formData.get("screenshot");
    if (screenshot instanceof File && screenshot.size > 0) {
      try {
        const newUrl = await saveUploadedImage(screenshot);
        await deleteUploadedImage(existing.screenshotUrl);
        screenshotUrl = newUrl;
      } catch (err) {
        if (err instanceof UploadError) {
          return NextResponse.json({ error: err.message }, { status: 400 });
        }
        throw err;
      }
    }

    await prisma.tradeJournalEntry.update({
      where: { id },
      data: {
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

    const entry = await getJournalEntry(id, session.sub);
    return NextResponse.json({ entry });
  } catch (error) {
    return authErrorResponse(error) ?? NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireUser();
    const { id } = await params;

    const existing = await getJournalEntry(id, session.sub);
    if (!existing) {
      return NextResponse.json({ error: "Journal entry not found" }, { status: 404 });
    }

    await prisma.tradeJournalEntry.delete({ where: { id } });
    await deleteUploadedImage(existing.screenshotUrl);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return authErrorResponse(error) ?? NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

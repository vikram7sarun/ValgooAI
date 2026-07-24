import { z } from "zod";

export const journalEntrySchema = z.object({
  instrument: z.string().min(1, "Instrument is required"),
  direction: z.enum(["BUY", "SELL"]),
  entryPrice: z.coerce.number().positive("Entry price must be positive"),
  exitPrice: z.coerce.number().positive().optional().nullable(),
  entryTime: z.string().min(1, "Entry time is required"),
  exitTime: z.string().optional().nullable(),
  algoId: z.string().optional().nullable(),
  reason: z.string().optional().nullable(),
  emotion: z.string().optional().nullable(),
  mistake: z.string().optional().nullable(),
  news: z.string().optional().nullable(),
  tags: z.array(z.enum(["FOMO", "REVENGE", "LATE_ENTRY", "PERFECT_TRADE"])).default([]),
});

export type JournalEntryInput = z.infer<typeof journalEntrySchema>;

function strOrUndefined(value: FormDataEntryValue | null): string | undefined {
  if (typeof value !== "string" || value.trim() === "") return undefined;
  return value;
}

export function journalFormDataToObject(formData: FormData) {
  return {
    instrument: strOrUndefined(formData.get("instrument")),
    direction: strOrUndefined(formData.get("direction")),
    entryPrice: strOrUndefined(formData.get("entryPrice")),
    exitPrice: strOrUndefined(formData.get("exitPrice")),
    entryTime: strOrUndefined(formData.get("entryTime")),
    exitTime: strOrUndefined(formData.get("exitTime")),
    algoId: strOrUndefined(formData.get("algoId")),
    reason: strOrUndefined(formData.get("reason")),
    emotion: strOrUndefined(formData.get("emotion")),
    mistake: strOrUndefined(formData.get("mistake")),
    news: strOrUndefined(formData.get("news")),
    tags: formData.getAll("tags").filter((v): v is string => typeof v === "string"),
  };
}

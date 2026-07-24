import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "trade-screenshots");
const PUBLIC_PREFIX = "/uploads/trade-screenshots";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TO_EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

export class UploadError extends Error {}

export async function saveUploadedImage(file: File): Promise<string> {
  const ext = ALLOWED_MIME_TO_EXT[file.type];
  if (!ext) {
    throw new UploadError("Screenshot must be a PNG, JPEG, WEBP, or GIF image");
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new UploadError("Screenshot must be under 5MB");
  }

  await mkdir(UPLOAD_DIR, { recursive: true });

  const filename = `${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, filename), buffer);

  return `${PUBLIC_PREFIX}/${filename}`;
}

export async function deleteUploadedImage(publicUrl: string | null | undefined): Promise<void> {
  if (!publicUrl || !publicUrl.startsWith(PUBLIC_PREFIX)) return;
  const filename = publicUrl.slice(PUBLIC_PREFIX.length + 1);
  if (!filename || filename.includes("/") || filename.includes("..")) return;

  try {
    await unlink(path.join(UPLOAD_DIR, filename));
  } catch {
    // best-effort cleanup; ignore if already gone
  }
}

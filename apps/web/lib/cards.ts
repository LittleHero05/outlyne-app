"use client";

import {
  CARD_LIMIT_ERROR,
  CARD_PHOTOS_BUCKET,
  FREE_CARD_LIMIT,
  draftToInsert,
  type ActivityDraft,
  type OutlineColorId,
  type SavedCardRow,
} from "@outlyne/core";
import { getBrowserSupabase } from "@/lib/supabase/browser";

/** Signed URLs for private photos last this long (seconds). */
const PHOTO_URL_TTL = 60 * 60;
const COLUMNS = "id, activity, details, outline_color, photo_path, created_at";

export type SavedCard = SavedCardRow & { photoUrl: string | null };

export type SaveResult =
  | { ok: true }
  | { ok: false; reason: "limit" | "auth" | "error"; message: string };

const EXTENSIONS: Record<string, string> = {
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "image/jpeg": "jpg",
};

/** Formats every browser can show. Anything else (like iPhone HEIC) becomes JPEG. */
const WEB_SAFE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

class UnreadablePhotoError extends Error {}

/** Redraw a photo as JPEG. Works wherever this browser can display the photo. */
async function toJpeg(blob: Blob): Promise<Blob> {
  const objectUrl = URL.createObjectURL(blob);
  try {
    const image = new Image();
    image.src = objectUrl;
    // Chrome and Firefox can't read HEIC, so the photo can't be converted there.
    await image.decode().catch(() => {
      throw new UnreadablePhotoError("This browser can't read the photo");
    });
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    canvas.getContext("2d")?.drawImage(image, 0, 0);
    return await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (jpeg) => (jpeg ? resolve(jpeg) : reject(new Error("Could not convert the photo"))),
        "image/jpeg",
        0.9,
      ),
    );
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function newPhotoPath(userId: string, contentType: string): string {
  const ext = EXTENSIONS[contentType] ?? "jpg";
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  // The first folder must be the user id: storage policies check it.
  return `${userId}/${id}.${ext}`;
}

/**
 * Store the draft's photo, if any. A local photo (blob: URL) is uploaded; a
 * photo reopened from My cards is copied so each card owns its own file.
 */
async function storePhoto(
  userId: string,
  url: string | null,
  savedPhotoPath: string | null,
): Promise<string | null> {
  if (!url) return null;
  const storage = getBrowserSupabase().storage.from(CARD_PHOTOS_BUCKET);

  if (url.startsWith("http") && savedPhotoPath) {
    const ext = savedPhotoPath.split(".").pop() ?? "jpg";
    const contentType = Object.keys(EXTENSIONS).find((t) => EXTENSIONS[t] === ext) ?? "image/jpeg";
    const path = newPhotoPath(userId, contentType);
    const { error } = await storage.copy(savedPhotoPath, path);
    if (error) throw error;
    return path;
  }

  const picked = await fetch(url).then((response) => response.blob());
  const blob = WEB_SAFE_TYPES.has(picked.type) ? picked : await toJpeg(picked);
  const contentType = blob.type;
  const path = newPhotoPath(userId, contentType);
  const { error } = await storage.upload(path, blob, { contentType, upsert: false });
  if (error) throw error;
  return path;
}

export async function saveCard(
  draft: ActivityDraft,
  outlineColorId: OutlineColorId,
  savedPhotoPath: string | null,
): Promise<SaveResult> {
  const supabase = getBrowserSupabase();
  const { data } = await supabase.auth.getSession();
  const userId = data.session?.user.id;
  if (!userId) return { ok: false, reason: "auth", message: "Please sign in to save." };

  let photoPath: string | null = null;
  try {
    photoPath = await storePhoto(userId, draft.details.imagePreviewUrl, savedPhotoPath);
  } catch (error) {
    console.error("Photo upload failed", error);
    return {
      ok: false,
      reason: "error",
      message:
        error instanceof UnreadablePhotoError
          ? "This browser can't read that photo. Try a JPEG or PNG, or save from Safari."
          : "Could not upload the photo. Please try again.",
    };
  }

  const { error } = await supabase.from("cards").insert(draftToInsert(draft, outlineColorId, photoPath));
  if (!error) return { ok: true };

  // The row was rejected, so don't leave its photo behind.
  if (photoPath) await supabase.storage.from(CARD_PHOTOS_BUCKET).remove([photoPath]);
  if (error.message.includes(CARD_LIMIT_ERROR)) {
    return {
      ok: false,
      reason: "limit",
      message: `You've saved ${FREE_CARD_LIMIT} cards, the free limit. Delete one in My cards to save another.`,
    };
  }
  console.error("Save failed", error);
  return { ok: false, reason: "error", message: "Could not save the card. Please try again." };
}

async function withPhotoUrls(rows: SavedCardRow[]): Promise<SavedCard[]> {
  const paths = rows.map((row) => row.photo_path).filter((p): p is string => Boolean(p));
  const urls = new Map<string, string>();
  if (paths.length) {
    const { data } = await getBrowserSupabase()
      .storage.from(CARD_PHOTOS_BUCKET)
      .createSignedUrls(paths, PHOTO_URL_TTL);
    for (const item of data ?? []) {
      if (item.path && item.signedUrl) urls.set(item.path, item.signedUrl);
    }
  }
  return rows.map((row) => ({
    ...row,
    photoUrl: row.photo_path ? (urls.get(row.photo_path) ?? null) : null,
  }));
}

export async function listCards(): Promise<SavedCard[]> {
  const { data, error } = await getBrowserSupabase()
    .from("cards")
    .select(COLUMNS)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return withPhotoUrls((data ?? []) as SavedCardRow[]);
}

export async function getCard(id: string): Promise<SavedCard | null> {
  const { data, error } = await getBrowserSupabase()
    .from("cards")
    .select(COLUMNS)
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  const [card] = await withPhotoUrls([data as SavedCardRow]);
  return card;
}

export async function deleteCard(card: SavedCardRow): Promise<void> {
  const supabase = getBrowserSupabase();
  const { error } = await supabase.from("cards").delete().eq("id", card.id);
  if (error) throw error;
  if (card.photo_path) await supabase.storage.from(CARD_PHOTOS_BUCKET).remove([card.photo_path]);
}

/** Remove every photo, then the account (cards cascade), then sign out. */
export async function deleteAccount(): Promise<void> {
  const supabase = getBrowserSupabase();
  const { data } = await supabase.auth.getSession();
  const userId = data.session?.user.id;
  if (!userId) throw new Error("Not signed in");

  const storage = supabase.storage.from(CARD_PHOTOS_BUCKET);
  const { data: files } = await storage.list(userId, { limit: 1000 });
  const paths = (files ?? []).map((file) => `${userId}/${file.name}`);
  if (paths.length) await storage.remove(paths);

  const { error } = await supabase.rpc("delete_my_account");
  if (error) throw error;
  await supabase.auth.signOut({ scope: "local" });
}

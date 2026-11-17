import { File } from "expo-file-system";
import {
  CARD_LIMIT_ERROR,
  CARD_PHOTOS_BUCKET,
  FREE_CARD_LIMIT,
  draftToInsert,
  type ActivityDraft,
  type OutlineColorId,
  type SavedCardRow,
} from "@outlyne/core";
import { supabase } from "@/lib/supabase";

/** Signed URLs for private photos last this long (seconds). */
const PHOTO_URL_TTL = 60 * 60;

export type SaveResult =
  | { ok: true }
  | { ok: false; reason: "limit" | "error"; message: string };

export type SavedCard = SavedCardRow & { photoUrl: string | null };

function photoContentType(uri: string): string {
  const ext = uri.split("?")[0].split(".").pop()?.toLowerCase();
  if (ext === "png") return "image/png";
  if (ext === "heic") return "image/heic";
  if (ext === "webp") return "image/webp";
  return "image/jpeg";
}

function newPhotoPath(userId: string, uri: string): string {
  const ext = photoContentType(uri).split("/")[1].replace("jpeg", "jpg");
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  // The first folder must be the user id: storage policies check it.
  return `${userId}/${id}.${ext}`;
}

/**
 * Store the draft's photo, if any, and return its storage path.
 * A local file is uploaded. A photo reopened from My cards is copied, so
 * deleting either card later never removes the other card's photo.
 */
async function storePhoto(
  userId: string,
  uri: string | null,
  savedPhotoPath: string | null,
): Promise<string | null> {
  if (!uri) return null;
  const storage = supabase.storage.from(CARD_PHOTOS_BUCKET);

  if (uri.startsWith("http") && savedPhotoPath) {
    const path = newPhotoPath(userId, savedPhotoPath);
    const { error } = await storage.copy(savedPhotoPath, path);
    if (error) throw error;
    return path;
  }

  const path = newPhotoPath(userId, uri);
  const body = await new File(uri).arrayBuffer();
  const { error } = await storage.upload(path, body, {
    contentType: photoContentType(uri),
    upsert: false,
  });
  if (error) throw error;
  return path;
}

export async function saveCard(
  draft: ActivityDraft,
  outlineColorId: OutlineColorId,
  savedPhotoPath: string | null = null,
): Promise<SaveResult> {
  const { data } = await supabase.auth.getSession();
  const userId = data.session?.user.id;
  if (!userId) {
    return { ok: false, reason: "error", message: "Please sign in again to save." };
  }

  let photoPath: string | null = null;
  try {
    photoPath = await storePhoto(userId, draft.details.imagePreviewUrl, savedPhotoPath);
  } catch (error) {
    console.error("photo upload failed", error);
    return { ok: false, reason: "error", message: "Could not upload the photo. Please try again." };
  }

  const { error } = await supabase
    .from("cards")
    .insert(draftToInsert(draft, outlineColorId, photoPath));
  if (!error) return { ok: true };

  // The row was rejected, so don't leave its photo behind.
  if (photoPath) await supabase.storage.from(CARD_PHOTOS_BUCKET).remove([photoPath]);

  if (error.message.includes(CARD_LIMIT_ERROR)) {
    return {
      ok: false,
      reason: "limit",
      message: `You've saved ${FREE_CARD_LIMIT} cards, the free limit. Delete one to save another.`,
    };
  }
  console.error("saveCard failed", error);
  return { ok: false, reason: "error", message: "Could not save the card. Please try again." };
}

export async function listCards(): Promise<SavedCard[]> {
  const { data, error } = await supabase
    .from("cards")
    .select("id, activity, details, outline_color, photo_path, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  const rows = (data ?? []) as SavedCardRow[];

  const paths = rows.map((row) => row.photo_path).filter((p): p is string => Boolean(p));
  const urls = new Map<string, string>();
  if (paths.length) {
    const { data: signed } = await supabase.storage
      .from(CARD_PHOTOS_BUCKET)
      .createSignedUrls(paths, PHOTO_URL_TTL);
    for (const item of signed ?? []) {
      if (item.path && item.signedUrl) urls.set(item.path, item.signedUrl);
    }
  }

  return rows.map((row) => ({
    ...row,
    photoUrl: row.photo_path ? (urls.get(row.photo_path) ?? null) : null,
  }));
}

export async function deleteCard(card: SavedCardRow): Promise<void> {
  const { error } = await supabase.from("cards").delete().eq("id", card.id);
  if (error) throw error;
  if (card.photo_path) {
    await supabase.storage.from(CARD_PHOTOS_BUCKET).remove([card.photo_path]);
  }
}

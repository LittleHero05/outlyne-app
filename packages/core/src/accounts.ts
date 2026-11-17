import type { ActivityDraft, ActivityType } from "./types";
import type { OutlineColorId } from "./customize";

/** Keep in sync with the trigger in supabase/migrations/*_saved_cards.sql. */
export const FREE_CARD_LIMIT = 20;

/** Error message the database raises when a user hits FREE_CARD_LIMIT. */
export const CARD_LIMIT_ERROR = "card_limit_reached";

/** A row of public.cards as the apps read it. */
export type SavedCardRow = {
  id: string;
  activity: ActivityType;
  details: ActivityDraft["details"];
  outline_color: OutlineColorId;
  /** Path in the private card-photos bucket, or null for a transparent card. */
  photo_path: string | null;
  created_at: string;
};

/** Private Supabase Storage bucket for card background photos. */
export const CARD_PHOTOS_BUCKET = "card-photos";

/**
 * Turn a stored row back into a draft the card components can render.
 * Pass a signed URL for the row's photo to show it behind the card.
 */
export function rowToDraft(row: SavedCardRow, photoUrl: string | null = null): ActivityDraft {
  return {
    activity: row.activity,
    details: { ...row.details, imagePreviewUrl: photoUrl },
  } as ActivityDraft;
}

/** Shape a draft for insert: local photo URLs never leave the device. */
export function draftToInsert(
  draft: ActivityDraft,
  outlineColorId: OutlineColorId,
  photoPath: string | null = null,
) {
  return {
    activity: draft.activity,
    details: { ...draft.details, imagePreviewUrl: null },
    outline_color: outlineColorId,
    photo_path: photoPath,
  };
}

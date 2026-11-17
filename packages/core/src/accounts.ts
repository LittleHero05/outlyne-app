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
  created_at: string;
};

/** Turn a stored row back into a draft the card components can render. */
export function rowToDraft(row: SavedCardRow): ActivityDraft {
  return {
    activity: row.activity,
    details: { ...row.details, imagePreviewUrl: null },
  } as ActivityDraft;
}

/** Shape a draft for insert: local photo URLs never leave the device. */
export function draftToInsert(draft: ActivityDraft, outlineColorId: OutlineColorId) {
  return {
    activity: draft.activity,
    details: { ...draft.details, imagePreviewUrl: null },
    outline_color: outlineColorId,
  };
}

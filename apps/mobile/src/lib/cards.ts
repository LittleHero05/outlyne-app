import {
  CARD_LIMIT_ERROR,
  FREE_CARD_LIMIT,
  draftToInsert,
  type ActivityDraft,
  type OutlineColorId,
  type SavedCardRow,
} from "@outlyne/core";
import { supabase } from "@/lib/supabase";

export type SaveResult =
  | { ok: true }
  | { ok: false; reason: "limit" | "error"; message: string };

export async function saveCard(
  draft: ActivityDraft,
  outlineColorId: OutlineColorId,
): Promise<SaveResult> {
  const { error } = await supabase.from("cards").insert(draftToInsert(draft, outlineColorId));
  if (!error) return { ok: true };
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

export async function listCards(): Promise<SavedCardRow[]> {
  const { data, error } = await supabase
    .from("cards")
    .select("id, activity, details, outline_color, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as SavedCardRow[];
}

export async function deleteCard(id: string): Promise<void> {
  const { error } = await supabase.from("cards").delete().eq("id", id);
  if (error) throw error;
}

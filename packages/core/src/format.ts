import type { HabitDetails, RecipeDetails } from "./types";

/** Reading pace from pages plus a free-text duration like "1hr 03min". */
export function readingPace(pagesRead: string, time: string): string | null {
  const pages = Number(pagesRead);
  if (!Number.isFinite(pages) || pages <= 0) return null;

  const hourMatch = time.match(/(\d+)\s*h/i);
  const minMatch = time.match(/(\d+)\s*m/i);
  const hours =
    (hourMatch ? Number(hourMatch[1]) : 0) +
    (minMatch ? Number(minMatch[1]) / 60 : 0);

  if (hours <= 0) return null;
  return `${Math.round(pages / hours)} pgs/hr`;
}

/** Match Figma "4.5/5" when the user enters a bare score. */
export function formatRating(rating: string): string {
  const trimmed = rating.trim();
  if (!trimmed) return "";
  if (/\/\s*\d/.test(trimmed)) return trimmed;
  return `${trimmed}/5`;
}

export function formatStreak(days: string): string {
  const n = Number(days);
  if (!Number.isFinite(n) || n <= 0) return "—";
  return n === 1 ? "1 day" : `${n} days`;
}

export function formatMinutes(minutes: string): string {
  const n = Number(minutes);
  if (!Number.isFinite(n) || n <= 0) return "—";
  return `${n} min`;
}

export function formatHabitToday(details: HabitDetails): string {
  return details.mode === "minutes" ? formatMinutes(details.minutes) : "Done";
}

export function formatServings(servings: string): string {
  const n = Number(servings);
  if (!Number.isFinite(n) || n <= 0) return servings.trim() || "—";
  return n === 1 ? "1 serving" : `${n} servings`;
}

export function formatRecipeBy(details: RecipeDetails): string {
  if (details.source === "author" && details.author.trim()) {
    return details.author.trim();
  }
  return "Homemade";
}

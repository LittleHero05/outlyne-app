"use client";

import { forwardRef } from "react";
import {
  CardShell,
  Headline,
  Stat,
  tightPairClassName,
} from "@/components/generate/card-primitives";
import { RatingStat, formatRating } from "@/components/generate/reading-card";
import { getActivity } from "@/lib/activities";
import { getOutlineColor } from "@/lib/customize";
import type { OutlineColorId } from "@/lib/customize";
import type { RecipeDetails } from "@/types";

type RecipeCardProps = {
  details: RecipeDetails;
  outlineColorId: OutlineColorId;
  className?: string;
};

export function formatRecipeBy(details: RecipeDetails): string {
  if (details.source === "author" && details.author.trim()) {
    return details.author.trim();
  }
  return "Homemade";
}

export function formatServings(servings: string): string {
  const n = Number(servings);
  if (!Number.isFinite(n) || n <= 0) return servings.trim() || "—";
  return n === 1 ? "1 serving" : `${n} servings`;
}

export const RecipeCard = forwardRef<HTMLElement, RecipeCardProps>(
  function RecipeCard({ details, outlineColorId, className }, ref) {
    const activity = getActivity("recipe");
    const color = getOutlineColor(outlineColorId).hex;
    const rating = details.rating.trim() ? formatRating(details.rating) : null;

    return (
      <CardShell
        ref={ref}
        ariaLabel="Recipe overlay preview"
        iconSrc={activity.iconSrc}
        color={color}
        imagePreviewUrl={details.imagePreviewUrl}
        className={className}
      >
        <Headline label="Recipe" value={details.title || "Untitled"} />
        <p className="mt-1 text-sm font-medium opacity-90 sm:text-base">
          by {formatRecipeBy(details)}
        </p>

        <div className={tightPairClassName}>
          <Stat label="Cook time" value={details.cookTime || "—"} />
          <Stat label="Servings" value={formatServings(details.servings)} />
        </div>

        {rating ? (
          <div className="mt-5">
            <RatingStat rating={rating} color={color} />
          </div>
        ) : null}
      </CardShell>
    );
  },
);

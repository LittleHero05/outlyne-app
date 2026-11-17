"use client";

import { forwardRef } from "react";
import {
  CardShell,
  Headline,
  Stat,
  tightPairClassName,
} from "@/components/generate/card-primitives";
import { RatingStat } from "@/components/generate/reading-card";
import {
  formatRating,
  formatRecipeBy,
  formatServings,
  getOutlineColor,
  type OutlineColorId,
  type RecipeDetails,
} from "@outlyne/core";

type RecipeCardProps = {
  details: RecipeDetails;
  outlineColorId: OutlineColorId;
  className?: string;
};

export const RecipeCard = forwardRef<HTMLElement, RecipeCardProps>(
  function RecipeCard({ details, outlineColorId, className }, ref) {
    const color = getOutlineColor(outlineColorId).hex;
    const rating = details.rating.trim() ? formatRating(details.rating) : null;

    return (
      <CardShell
        ref={ref}
        ariaLabel="Recipe overlay preview"
        icon="recipe"
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

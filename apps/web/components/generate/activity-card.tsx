"use client";

import { forwardRef } from "react";
import { HabitCard } from "@/components/generate/habit-card";
import { ReadingCard } from "@/components/generate/reading-card";
import { RecipeCard } from "@/components/generate/recipe-card";
import { WorkoutCard } from "@/components/generate/workout-card";
import type { OutlineColorId, ActivityDraft } from "@outlyne/core";

type ActivityCardProps = {
  draft: ActivityDraft;
  outlineColorId: OutlineColorId;
  className?: string;
};

/** Renders the right overlay card for a draft. The ref is the export node. */
export const ActivityCard = forwardRef<HTMLElement, ActivityCardProps>(
  function ActivityCard({ draft, outlineColorId, className }, ref) {
    switch (draft.activity) {
      case "reading":
        return (
          <ReadingCard
            ref={ref}
            details={draft.details}
            outlineColorId={outlineColorId}
            className={className}
          />
        );
      case "workout":
        return (
          <WorkoutCard
            ref={ref}
            details={draft.details}
            outlineColorId={outlineColorId}
            className={className}
          />
        );
      case "habit":
        return (
          <HabitCard
            ref={ref}
            details={draft.details}
            outlineColorId={outlineColorId}
            className={className}
          />
        );
      case "recipe":
        return (
          <RecipeCard
            ref={ref}
            details={draft.details}
            outlineColorId={outlineColorId}
            className={className}
          />
        );
    }
  },
);

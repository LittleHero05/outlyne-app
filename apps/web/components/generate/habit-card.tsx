"use client";

import { forwardRef } from "react";
import {
  CardShell,
  Headline,
  Stat,
  tightPairClassName,
} from "@/components/generate/card-primitives";
import { getActivity } from "@/lib/activities";
import {
  formatHabitToday,
  formatStreak,
  getOutlineColor,
  type HabitDetails,
  type OutlineColorId,
} from "@outlyne/core";

type HabitCardProps = {
  details: HabitDetails;
  outlineColorId: OutlineColorId;
  className?: string;
};

export const HabitCard = forwardRef<HTMLElement, HabitCardProps>(
  function HabitCard({ details, outlineColorId, className }, ref) {
    const activity = getActivity("habit");
    const color = getOutlineColor(outlineColorId).hex;

    return (
      <CardShell
        ref={ref}
        ariaLabel="Habit overlay preview"
        iconSrc={activity.iconSrc}
        color={color}
        imagePreviewUrl={details.imagePreviewUrl}
        className={className}
      >
        <Headline label="Habit" value={details.title || "Untitled"} />

        <div className={tightPairClassName}>
          <Stat label="Streak" value={formatStreak(details.days)} />
          <Stat label="Today" value={formatHabitToday(details)} />
        </div>
      </CardShell>
    );
  },
);

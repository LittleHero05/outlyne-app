"use client";

import { forwardRef } from "react";
import {
  CardShell,
  Headline,
  Stat,
  tightPairClassName,
} from "@/components/generate/card-primitives";
import { getActivity } from "@/lib/activities";
import { getOutlineColor } from "@/lib/customize";
import type { OutlineColorId } from "@/lib/customize";
import type { HabitDetails } from "@/types";

type HabitCardProps = {
  details: HabitDetails;
  outlineColorId: OutlineColorId;
  className?: string;
};

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
          {details.mode === "minutes" ? (
            <Stat label="Today" value={formatMinutes(details.minutes)} />
          ) : (
            <Stat label="Today" value="Done" />
          )}
        </div>
      </CardShell>
    );
  },
);

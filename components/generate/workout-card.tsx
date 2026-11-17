"use client";

import { forwardRef } from "react";
import { BodyMap } from "@/components/generate/body-map";
import {
  CardShell,
  Headline,
  Stat,
  statLabelClassName,
} from "@/components/generate/card-primitives";
import { getOutlineColor } from "@/lib/customize";
import type { OutlineColorId } from "@/lib/customize";
import { formatMuscleList } from "@/lib/muscles";
import type { WorkoutDetails } from "@/types";

type WorkoutCardProps = {
  details: WorkoutDetails;
  outlineColorId: OutlineColorId;
  className?: string;
};

export const WorkoutCard = forwardRef<HTMLElement, WorkoutCardProps>(
  function WorkoutCard({ details, outlineColorId, className }, ref) {
    const color = getOutlineColor(outlineColorId).hex;
    const muscles = formatMuscleList(details.muscles);

    return (
      <CardShell
        ref={ref}
        ariaLabel="Workout overlay preview"
        color={color}
        imagePreviewUrl={details.imagePreviewUrl}
        className={className}
      >
        <Headline label="Workout" value={details.title || "Untitled"} />

        <BodyMap
          selected={details.muscles}
          color={color}
          fit="width"
          className="mt-4 w-[72%]"
        />

        <div className="mt-5">
          <Stat label="Sets" value={details.sets || "—"} />
        </div>

        {muscles ? (
          <div className="mt-4 w-full px-2">
            <p className={statLabelClassName}>Muscles</p>
            <p className="mt-1 break-words text-xs font-semibold leading-snug sm:text-sm">
              {muscles}
            </p>
          </div>
        ) : null}
      </CardShell>
    );
  },
);

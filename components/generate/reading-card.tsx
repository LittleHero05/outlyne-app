"use client";

import { forwardRef } from "react";
import {
  CardShell,
  Headline,
  Stat,
  statLabelClassName,
  tightPairClassName,
} from "@/components/generate/card-primitives";
import { BRAND } from "@/lib/assets";
import { getActivity } from "@/lib/activities";
import { getOutlineColor } from "@/lib/customize";
import type { OutlineColorId } from "@/lib/customize";
import type { ReadingDetails } from "@/types";
import { cn } from "@/lib/utils";

type ReadingCardProps = {
  details: ReadingDetails;
  outlineColorId: OutlineColorId;
  className?: string;
};

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

export function RatingLockup({
  rating,
  color,
}: {
  rating: string;
  color: string;
}) {
  return (
    <div
      className="inline-flex items-center justify-center gap-1.5"
      style={{ color }}
      aria-label={`Rating ${rating}`}
    >
      <span
        aria-hidden
        className="size-4 shrink-0 sm:size-[18px]"
        style={{
          backgroundColor: color,
          maskImage: `url(${BRAND.ratingStar})`,
          WebkitMaskImage: `url(${BRAND.ratingStar})`,
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
        }}
      />
      <span className="whitespace-nowrap text-base font-semibold sm:text-lg">
        {rating}
      </span>
    </div>
  );
}

export function RatingStat({ rating, color }: { rating: string; color: string }) {
  return (
    <div className="flex flex-col items-center">
      <p className={statLabelClassName}>Rating</p>
      <div className="mt-1">
        <RatingLockup rating={rating} color={color} />
      </div>
    </div>
  );
}

export const ReadingCard = forwardRef<HTMLElement, ReadingCardProps>(
  function ReadingCard({ details, outlineColorId, className }, ref) {
    const activity = getActivity("reading");
    const color = getOutlineColor(outlineColorId).hex;
    const pace = readingPace(details.pagesRead, details.time);
    const rating = details.rating.trim() ? formatRating(details.rating) : null;

    return (
      <CardShell
        ref={ref}
        ariaLabel="Reading overlay preview"
        iconSrc={activity.iconSrc}
        color={color}
        imagePreviewUrl={details.imagePreviewUrl}
        className={className}
      >
        <Headline label="Book title" value={details.title || "Untitled"} />

        <div className={tightPairClassName}>
          <Stat label="Pages" value={details.pagesRead || "—"} />
          <Stat label="Time" value={details.time || "—"} />
        </div>

        {pace && rating ? (
          <div className={cn(tightPairClassName, "items-end")}>
            <Stat label="Pace" value={pace} />
            <RatingStat rating={rating} color={color} />
          </div>
        ) : pace ? (
          <div className="mt-5 w-full">
            <Stat label="Pace" value={pace} />
          </div>
        ) : rating ? (
          <div className="mt-5">
            <RatingStat rating={rating} color={color} />
          </div>
        ) : null}
      </CardShell>
    );
  },
);

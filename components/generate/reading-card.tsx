"use client";

import { forwardRef } from "react";
import { ActivityIcon } from "@/components/icons/activity-icon";
import { BRAND } from "@/lib/assets";
import { getActivity } from "@/lib/activities";
import { STORY_EXPORT, getOutlineColor } from "@/lib/customize";
import type { OutlineColorId } from "@/lib/customize";
import type { ReadingDetails } from "@/types";
import { cn } from "@/lib/utils";

type ReadingCardProps = {
  details: ReadingDetails;
  outlineColorId: OutlineColorId;
  className?: string;
};

function readingPace(pagesRead: string, time: string): string | null {
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 text-center">
      <p className="text-[0.7rem] font-semibold opacity-90 sm:text-xs">{label}</p>
      <p className="mt-1 whitespace-nowrap text-base font-semibold sm:text-lg">
        {value}
      </p>
    </div>
  );
}

function RatingLockup({
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

/** Figma: Pages/Time sit close together as a centered pair, not full-width halves */
const tightPairClassName = "mt-5 inline-grid grid-cols-2 gap-x-3 sm:gap-x-4";

/**
 * Transparent Story overlay — no card fill, border, or scrim.
 * Optional photo is full-bleed content behind the stats (not a “frame”).
 */
export const ReadingCard = forwardRef<HTMLElement, ReadingCardProps>(
  function ReadingCard({ details, outlineColorId, className }, ref) {
    const activity = getActivity("reading");
    const outline = getOutlineColor(outlineColorId);
    const pace = readingPace(details.pagesRead, details.time);
    const rating = details.rating.trim() ? formatRating(details.rating) : null;
    const hasPhoto = Boolean(details.imagePreviewUrl);
    // Overlay ink always follows customize color (readable on photos the user chose).
    const contentColor = outline.hex;

    return (
      <article
        ref={ref}
        className={cn("relative w-full bg-transparent", className)}
        aria-label="Reading overlay preview"
        style={{ aspectRatio: STORY_EXPORT.cssRatio }}
      >
        <div
          className="relative flex h-full w-full flex-col items-center justify-center px-6 py-10 text-center"
          style={{
            ...(hasPhoto
              ? {
                  backgroundImage: `url(${details.imagePreviewUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined),
            color: contentColor,
          }}
        >
          <div className="relative z-10 flex w-full flex-col items-center">
            <ActivityIcon
              src={activity.iconSrc}
              alt=""
              color={outline.hex}
              className="mb-6 h-16 w-16 sm:h-20 sm:w-20"
            />
            <p className="text-[0.7rem] font-semibold opacity-90 sm:text-xs">
              Book title
            </p>
            <p className="mt-1 text-lg font-semibold leading-tight sm:text-xl">
              {details.title || "Untitled"}
            </p>

            <div className={tightPairClassName}>
              <Stat label="Pages" value={details.pagesRead || "—"} />
              <Stat label="Time" value={details.time || "—"} />
            </div>

            {pace && rating ? (
              <div className={cn(tightPairClassName, "items-end")}>
                <Stat label="Pace" value={pace} />
                <div className="flex flex-col items-center">
                  <p className="text-[0.7rem] font-semibold opacity-90 sm:text-xs">
                    Rating
                  </p>
                  <div className="mt-1">
                    <RatingLockup rating={rating} color={outline.hex} />
                  </div>
                </div>
              </div>
            ) : pace ? (
              <div className="mt-5 w-full">
                <Stat label="Pace" value={pace} />
              </div>
            ) : rating ? (
              <div className="mt-5 flex flex-col items-center">
                <p className="text-[0.7rem] font-semibold opacity-90 sm:text-xs">
                  Rating
                </p>
                <div className="mt-1">
                  <RatingLockup rating={rating} color={outline.hex} />
                </div>
              </div>
            ) : null}

            {/* Brand mark under stats — survives transparent exports better than top-left */}
            <div className="mt-8 flex flex-col items-center gap-1">
              <ActivityIcon
                src={BRAND.logoMark}
                alt=""
                color={outline.hex}
                className="size-5 sm:size-6"
              />
              <p className="text-[8px] font-semibold uppercase tracking-[0.2em] opacity-80 sm:text-[9px]">
                Outlyne
              </p>
            </div>
          </div>
        </div>
      </article>
    );
  },
);

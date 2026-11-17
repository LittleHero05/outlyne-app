"use client";

import { forwardRef, type ReactNode } from "react";
import { ActivityIcon } from "@/components/icons/activity-icon";
import { BRAND } from "@/lib/assets";
import { STORY_EXPORT } from "@/lib/customize";
import { cn } from "@/lib/utils";

export const statLabelClassName =
  "text-[0.7rem] font-semibold opacity-90 sm:text-xs";
export const statValueClassName =
  "mt-1 whitespace-nowrap text-base font-semibold sm:text-lg";

/** Figma: stat pairs sit close together as a centered pair, not full-width halves */
export const tightPairClassName = "mt-5 inline-grid grid-cols-2 gap-x-3 sm:gap-x-4";

export function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 text-center">
      <p className={statLabelClassName}>{label}</p>
      <p className={statValueClassName}>{value}</p>
    </div>
  );
}

export function Headline({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <>
      <p className={statLabelClassName}>{label}</p>
      <p className="mt-1 text-lg font-semibold leading-tight sm:text-xl">
        {value}
      </p>
    </>
  );
}

/** Small brand lockup under the stats — survives transparent exports. */
export function BrandMark({ color }: { color: string }) {
  return (
    <div className="mt-8 flex flex-col items-center gap-1">
      <ActivityIcon
        src={BRAND.logoMark}
        alt=""
        color={color}
        className="size-5 sm:size-6"
      />
      <p className="text-[8px] font-semibold uppercase tracking-[0.2em] opacity-80 sm:text-[9px]">
        Outlyne
      </p>
    </div>
  );
}

type CardShellProps = {
  ariaLabel: string;
  /** Omit to give the content more vertical room (e.g. Workout body map) */
  iconSrc?: string;
  color: string;
  imagePreviewUrl: string | null;
  className?: string;
  children: ReactNode;
};

/**
 * Transparent Story overlay — no card fill, border, or scrim.
 * Optional photo is full-bleed content behind the stats (not a “frame”).
 */
export const CardShell = forwardRef<HTMLElement, CardShellProps>(
  function CardShell(
    { ariaLabel, iconSrc, color, imagePreviewUrl, className, children },
    ref,
  ) {
    return (
      <article
        ref={ref}
        className={cn("relative w-full bg-transparent", className)}
        aria-label={ariaLabel}
        style={{ aspectRatio: STORY_EXPORT.cssRatio }}
      >
        <div
          className="relative flex h-full w-full flex-col items-center justify-center px-6 py-10 text-center"
          style={{
            ...(imagePreviewUrl
              ? {
                  backgroundImage: `url(${imagePreviewUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined),
            color,
          }}
        >
          <div className="relative z-10 flex w-full flex-col items-center">
            {iconSrc ? (
              <ActivityIcon
                src={iconSrc}
                alt=""
                color={color}
                className="mb-6 h-16 w-16 sm:h-20 sm:w-20"
              />
            ) : null}
            {children}
            <BrandMark color={color} />
          </div>
        </div>
      </article>
    );
  },
);

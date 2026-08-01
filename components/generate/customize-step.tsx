"use client";

import { buttonVariants } from "@/components/ui/button";
import { ReadingCard } from "@/components/generate/reading-card";
import { OUTLINE_COLORS, type OutlineColorId } from "@/lib/customize";
import type { CustomizeOptions, ReadingDetails } from "@/types";
import { cn } from "@/lib/utils";

type CustomizeStepProps = {
  details: ReadingDetails;
  options: CustomizeOptions;
  onChange: (options: CustomizeOptions) => void;
  onContinue: () => void;
};

export function CustomizeStep({
  details,
  options,
  onChange,
  onContinue,
}: CustomizeStepProps) {
  function setOutline(outlineColorId: OutlineColorId) {
    onChange({ ...options, outlineColorId });
  }

  return (
    <div className="mx-auto w-full max-w-md px-6 py-8 sm:py-10">
      <h1 className="text-center text-[35px] font-medium leading-tight text-outlyne-text">
        Customize
      </h1>
      <p className="mt-2 text-center text-base text-outlyne-muted">
        Pick an outline color for your Story overlay
      </p>

      <div className="mx-auto mt-8 w-full max-w-[320px] rounded-[40px] bg-[linear-gradient(45deg,#d7e8f8_25%,transparent_25%,transparent_75%,#d7e8f8_75%),linear-gradient(45deg,#d7e8f8_25%,transparent_25%,transparent_75%,#d7e8f8_75%)] bg-[length:20px_20px] bg-[position:0_0,10px_10px]">
        <ReadingCard
          details={details}
          outlineColorId={options.outlineColorId}
        />
      </div>

      <fieldset className="mt-10">
        <legend className="mb-4 text-[22px] font-medium text-outlyne-text">
          Outline color
        </legend>
        <div
          className="flex flex-wrap justify-center gap-3"
          role="radiogroup"
          aria-label="Outline color"
        >
          {OUTLINE_COLORS.map((color) => {
            const selected = options.outlineColorId === color.id;
            return (
              <button
                key={color.id}
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={color.label}
                title={color.label}
                onClick={() => setOutline(color.id)}
                className={cn(
                  "size-12 rounded-full transition-transform",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-outlyne-maroon focus-visible:ring-offset-2 focus-visible:ring-offset-outlyne-blue",
                  selected
                    ? "scale-110 ring-2 ring-outlyne-text ring-offset-2 ring-offset-outlyne-blue"
                    : "hover:scale-105",
                )}
                style={{
                  backgroundColor: color.hex,
                  border: color.swatchBorder
                    ? `2px solid ${color.swatchBorder}`
                    : "2px solid transparent",
                }}
              />
            );
          })}
        </div>
      </fieldset>

      <div className="flex justify-center pt-10">
        <button
          type="button"
          onClick={onContinue}
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "h-[63px] min-w-[182px] rounded-[20px] px-8 text-[22px] font-medium",
          )}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

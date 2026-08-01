"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { buttonVariants } from "@/components/ui/button";
import { ReadingCard } from "@/components/generate/reading-card";
import { STORY_EXPORT, type OutlineColorId } from "@/lib/customize";
import type { ReadingDetails } from "@/types";
import { cn } from "@/lib/utils";

type PreviewStepProps = {
  details: ReadingDetails;
  outlineColorId: OutlineColorId;
  onBack: () => void;
  onRestart: () => void;
};

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "reading"
  );
}

export function PreviewStep({
  details,
  outlineColorId,
  onBack,
  onRestart,
}: PreviewStepProps) {
  const cardRef = useRef<HTMLElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  async function handleDownload() {
    if (!cardRef.current || downloading) return;

    setDownloading(true);
    setError("");

    try {
      const pixelRatio = STORY_EXPORT.width / cardRef.current.offsetWidth;

      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: Math.max(pixelRatio, 2),
        // Transparent when no photo background
        backgroundColor:
          details.imagePreviewUrl == null ? "transparent" : undefined,
      });

      const link = document.createElement("a");
      link.download = `outlyne-${slugify(details.title)}.png`;
      link.href = dataUrl;
      link.click();
    } catch (downloadError) {
      console.error("Download failed:", downloadError);
      setError("Could not download. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md px-6 py-8 sm:py-10">
      <h1 className="text-center text-2xl font-medium leading-snug text-outlyne-text sm:text-[28px]">
        All achievements deserve to be shared…
      </h1>

      <div className="mx-auto mt-10 w-full max-w-[320px]">
        <ReadingCard
          ref={cardRef}
          details={details}
          outlineColorId={outlineColorId}
        />
      </div>

      <p className="mt-6 text-center text-sm text-outlyne-muted">
        Downloads as a Story-sized PNG (1080 × 1920). Overlay it onto any photo
        or carousel slide.
      </p>

      {error ? (
        <p className="mt-3 text-center text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "h-[52px] rounded-[20px] border-outlyne-text/20 bg-outlyne-surface px-6 text-lg font-medium text-outlyne-text",
          )}
        >
          Customize
        </button>
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "h-[52px] min-w-[160px] rounded-[20px] px-6 text-lg font-medium disabled:opacity-70",
          )}
        >
          {downloading ? "Downloading…" : "Download"}
        </button>
        <button
          type="button"
          onClick={onRestart}
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "h-[52px] rounded-[20px] border-outlyne-text/20 bg-outlyne-surface px-6 text-lg font-medium text-outlyne-text",
          )}
        >
          New card
        </button>
      </div>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import {
  EmailCaptureModal,
  type EmailCaptureVariant,
} from "@/components/generate/email-capture-modal";
import { ActivityCard } from "@/components/generate/activity-card";
import { downloadCardPng } from "@/lib/download-image";
import { shouldAskForEmailCapture } from "@/lib/post-download-email";
import type { OutlineColorId } from "@/lib/customize";
import type { ActivityDraft } from "@/types";
import { cn } from "@/lib/utils";

type PreviewStepProps = {
  draft: ActivityDraft;
  outlineColorId: OutlineColorId;
  onBack: () => void;
  onRestart: () => void;
};

function slugify(value: string, fallback: string) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || fallback
  );
}

function isMobileUserAgent() {
  return (
    typeof navigator !== "undefined" &&
    /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  );
}

export function PreviewStep({
  draft,
  outlineColorId,
  onBack,
  onRestart,
}: PreviewStepProps) {
  const cardRef = useRef<HTMLElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");
  const [hint, setHint] = useState("");
  // Preview never renders on the server (it is behind user interaction), so
  // reading the UA during the initial render cannot cause a hydration mismatch.
  const [mobile] = useState(isMobileUserAgent);
  const [emailVariant, setEmailVariant] =
    useState<EmailCaptureVariant | null>(null);
  const restartAfterEmailClose = useRef(false);
  const emailPromptTimeoutRef = useRef<number | null>(null);

  function clearEmailPromptTimeout() {
    if (emailPromptTimeoutRef.current != null) {
      window.clearTimeout(emailPromptTimeoutRef.current);
      emailPromptTimeoutRef.current = null;
    }
  }

  useEffect(() => {
    return () => clearEmailPromptTimeout();
  }, []);

  const closeEmailModal = useCallback(() => {
    clearEmailPromptTimeout();
    setEmailVariant(null);
    if (restartAfterEmailClose.current) {
      restartAfterEmailClose.current = false;
      onRestart();
    }
  }, [onRestart]);

  function handleNewCard() {
    clearEmailPromptTimeout();
    if (shouldAskForEmailCapture()) {
      restartAfterEmailClose.current = true;
      setEmailVariant("new-card");
      return;
    }
    onRestart();
  }

  async function handleDownload() {
    if (!cardRef.current || downloading) return;

    setDownloading(true);
    setError("");
    setHint("");

    try {
      const result = await downloadCardPng(
        cardRef.current,
        `outlyne-${draft.activity}-${slugify(draft.details.title, draft.activity)}.png`,
        // Always export with alpha — no page fill behind the overlay.
        { transparentBackground: true },
      );

      if (result === "cancelled") {
        return;
      }

      if (result === "shared") {
        setHint("Use the share sheet → Save Image or Save to Files.");
      } else if (result === "opened") {
        setHint(
          "Image opened — long-press it and choose Save Image if needed.",
        );
      }

      if (shouldAskForEmailCapture()) {
        // Let the share sheet / download settle before showing the modal.
        clearEmailPromptTimeout();
        emailPromptTimeoutRef.current = window.setTimeout(() => {
          emailPromptTimeoutRef.current = null;
          if (!shouldAskForEmailCapture()) return;
          // Don't overwrite an active new-card (or other) prompt.
          setEmailVariant((current) => current ?? "download");
        }, 400);
      }
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

      {/* Checkerboard is outside the export node so PNG stays fully transparent */}
      <div className="mx-auto mt-10 w-full max-w-[320px] rounded-[40px] bg-[linear-gradient(45deg,#d7e8f8_25%,transparent_25%,transparent_75%,#d7e8f8_75%),linear-gradient(45deg,#d7e8f8_25%,transparent_25%,transparent_75%,#d7e8f8_75%)] bg-[length:20px_20px] bg-[position:0_0,10px_10px]">
        <ActivityCard
          ref={cardRef}
          draft={draft}
          outlineColorId={outlineColorId}
        />
      </div>

      <p className="mt-6 text-center text-sm text-outlyne-muted">
        Story-sized PNG (1080 × 1920). On phone, use the share sheet to Save
        Image.
      </p>

      {error ? (
        <p className="mt-3 text-center text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      {hint ? (
        <p className="mt-3 text-center text-sm text-outlyne-text" role="status">
          {hint}
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
          {downloading
            ? "Preparing…"
            : mobile
              ? "Save / Share"
              : "Download"}
        </button>
        <button
          type="button"
          onClick={handleNewCard}
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "h-[52px] rounded-[20px] border-outlyne-text/20 bg-outlyne-surface px-6 text-lg font-medium text-outlyne-text",
          )}
        >
          New card
        </button>
      </div>

      <EmailCaptureModal
        open={emailVariant !== null}
        variant={emailVariant ?? "download"}
        onClose={closeEmailModal}
      />
    </div>
  );
}

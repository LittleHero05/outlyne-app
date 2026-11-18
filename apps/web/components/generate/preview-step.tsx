"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { SignInDialog } from "@/components/auth/sign-in-dialog";
import { saveCard } from "@/lib/cards";
import { buttonVariants } from "@/components/ui/button";
import {
  EmailCaptureModal,
  type EmailCaptureVariant,
} from "@/components/generate/email-capture-modal";
import { ActivityCard } from "@/components/generate/activity-card";
import { downloadCardPng } from "@/lib/download-image";
import { shouldAskForEmailCapture } from "@/lib/post-download-email";
import { cn } from "@/lib/utils";
import type { OutlineColorId, ActivityDraft } from "@outlyne/core";

type PreviewStepProps = {
  draft: ActivityDraft;
  outlineColorId: OutlineColorId;
  onBack: () => void;
  onRestart: () => void;
  /** True when this exact card is already in My cards. */
  alreadySaved: boolean;
  /** Stored photo of a reopened card, copied on re-save instead of re-uploaded. */
  savedPhotoPath: string | null;
  onSaved: () => void;
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
  alreadySaved,
  savedPhotoPath,
  onSaved,
}: PreviewStepProps) {
  const { session } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ text: string; error?: boolean } | null>(null);
  const [signInOpen, setSignInOpen] = useState(false);
  const hasPhoto = Boolean(draft.details.imagePreviewUrl);
  // Signed-in people already gave us their email; don't ask again.
  const askForEmail = () => !session && shouldAskForEmailCapture();

  async function runSave() {
    setSaving(true);
    setSaveMessage(null);
    const result = await saveCard(draft, outlineColorId, savedPhotoPath);
    setSaving(false);
    if (result.ok) {
      onSaved();
      setSaveMessage({ text: "Saved to My cards." });
    } else if (result.reason === "auth") {
      setSignInOpen(true);
    } else {
      setSaveMessage({ text: result.message, error: true });
    }
  }

  function handleSave() {
    if (saving || alreadySaved) return;
    if (!session) {
      setSignInOpen(true);
      return;
    }
    runSave();
  }

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
    if (askForEmail()) {
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

      if (askForEmail()) {
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
        {hasPhoto
          ? "Story-sized PNG with your photo (1080 × 1920)."
          : "Story-sized transparent PNG (1080 × 1920)."}{" "}
        On phone, use the share sheet to Save Image.
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

      <div className="mt-4 flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || alreadySaved}
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "h-[52px] min-w-[220px] rounded-[20px] border-outlyne-maroon/40 bg-transparent px-6 text-lg font-medium text-outlyne-maroon hover:bg-outlyne-surface disabled:opacity-70",
          )}
        >
          {alreadySaved
            ? "Saved to My cards"
            : saving
              ? "Saving…"
              : session
                ? "Save to my cards"
                : "Sign in to save"}
        </button>
        {saveMessage ? (
          <p
            className={cn("text-center text-sm", saveMessage.error ? "text-red-700" : "text-outlyne-text")}
            role={saveMessage.error ? "alert" : "status"}
          >
            {saveMessage.text}{" "}
            {!saveMessage.error ? (
              <Link href="/cards" className="font-medium text-outlyne-maroon underline-offset-4 hover:underline">
                View My cards
              </Link>
            ) : null}
          </p>
        ) : null}
      </div>

      <SignInDialog
        open={signInOpen}
        onClose={() => setSignInOpen(false)}
        onSignedIn={() => {
          setSignInOpen(false);
          runSave();
        }}
      />

      <EmailCaptureModal
        open={emailVariant !== null}
        variant={emailVariant ?? "download"}
        onClose={closeEmailModal}
      />
    </div>
  );
}

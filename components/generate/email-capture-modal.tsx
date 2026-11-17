"use client";

import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { markEmailCaptureDone } from "@/lib/post-download-email";
import { cn } from "@/lib/utils";

type FormStatus = "idle" | "loading" | "success" | "error";

export type EmailCaptureVariant = "download" | "new-card";

type EmailCaptureModalProps = {
  open: boolean;
  variant?: EmailCaptureVariant;
  onClose: () => void;
};

const COPY: Record<
  EmailCaptureVariant,
  { title: string; description: string; dismissLabel: string }
> = {
  download: {
    title: "Want new activities & templates?",
    description:
      "Drop your email and we'll let you know when Workout, Habit, Recipe, and new overlays drop.",
    dismissLabel: "No thanks",
  },
  "new-card": {
    title: "Looks like you're enjoying Outlyne",
    description:
      "Consider dropping your email for updates on new activities, templates, and overlay ideas as we ship them.",
    dismissLabel: "Continue without email",
  },
};

export function EmailCaptureModal({
  open,
  variant = "download",
  onClose,
}: EmailCaptureModalProps) {
  if (!open) return null;
  // Mounting the dialog fresh each time resets its form state.
  return <EmailCaptureDialog variant={variant} onClose={onClose} />;
}

function EmailCaptureDialog({
  variant,
  onClose,
}: {
  variant: EmailCaptureVariant;
  onClose: () => void;
}) {
  const titleId = useId();
  const descId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");
  const copy = COPY[variant];

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => inputRef.current?.focus(), 50);

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        markEmailCaptureDone("dismissed");
        onClose();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  function handleDismiss() {
    markEmailCaptureDone("dismissed");
    onClose();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      markEmailCaptureDone("signed_up");
      setStatus("success");
      setMessage(data.message ?? "You're on the list — thanks!");
      setEmail("");
      window.setTimeout(() => onClose(), 1200);
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-outlyne-text/40 p-4 sm:items-center"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) handleDismiss();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="w-full max-w-md rounded-[28px] bg-outlyne-surface p-6 shadow-xl sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id={titleId}
              className="text-2xl font-medium text-outlyne-text"
            >
              {copy.title}
            </h2>
            <p id={descId} className="mt-2 text-base text-outlyne-muted">
              {copy.description}
            </p>
          </div>
          <button
            type="button"
            onClick={handleDismiss}
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-[14px] text-outlyne-text transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-outlyne-maroon"
            aria-label="Close"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        {status === "success" ? (
          <p className="mt-6 text-base text-outlyne-text" role="status">
            {message}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-3">
            <Input
              ref={inputRef}
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="Email Address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={status === "loading"}
              className="h-[52px] rounded-[20px] border border-black bg-[#f0f0f0] px-5 text-lg text-outlyne-text placeholder:text-outlyne-text/70 focus-visible:ring-outlyne-maroon md:text-lg"
              aria-label="Email address"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "h-[52px] w-full rounded-[20px] text-lg font-medium disabled:opacity-70",
              )}
            >
              {status === "loading" ? "Saving…" : "Keep me posted"}
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="w-full py-2 text-sm text-outlyne-muted transition-opacity hover:opacity-70"
            >
              {copy.dismissLabel}
            </button>
            {message ? (
              <p className="text-sm text-red-700" role="alert">
                {message}
              </p>
            ) : null}
          </form>
        )}
      </div>
    </div>
  );
}

/** @deprecated use EmailCaptureModal */
export const PostDownloadEmailModal = EmailCaptureModal;

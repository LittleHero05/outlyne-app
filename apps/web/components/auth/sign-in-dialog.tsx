"use client";

import { useEffect, useId } from "react";
import { X } from "lucide-react";
import { SignInForm } from "@/components/auth/sign-in-form";

/** Sign in without leaving the page, so an unsaved card is never lost. */
export function SignInDialog({
  open,
  onClose,
  onSignedIn,
}: {
  open: boolean;
  onClose: () => void;
  onSignedIn: () => void;
}) {
  const headingId = useId();

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-outlyne-text/40 p-4 sm:items-center"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        className="relative w-full max-w-md rounded-[28px] bg-outlyne-surface p-6 shadow-xl sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-[14px] text-outlyne-text hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-outlyne-maroon"
          aria-label="Close"
        >
          <X className="size-5" aria-hidden />
        </button>
        <SignInForm headingId={headingId} onSignedIn={onSignedIn} />
      </div>
    </div>
  );
}

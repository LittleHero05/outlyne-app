"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { Logo } from "@/components/marketing/logo";
import { cn } from "@/lib/utils";

type GenerateHeaderProps = {
  onBack?: () => void;
  backLabel?: string;
  /** The page this header sits on, so the right-hand link never points to itself. */
  current?: "generate" | "cards" | "sign-in";
};

const linkClassName =
  "inline-flex min-h-11 items-center text-sm font-medium uppercase tracking-[0.15em] text-outlyne-text transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-outlyne-maroon rounded-[12px] px-1";

function AccountLink({ current }: { current: GenerateHeaderProps["current"] }) {
  const { session, loading } = useAuth();
  if (loading) return <span className="w-20" aria-hidden />;
  if (current === "cards") {
    return (
      <Link href="/generate" className={linkClassName}>
        Make a card
      </Link>
    );
  }
  if (session) {
    return (
      <Link href="/cards" className={linkClassName}>
        My cards
      </Link>
    );
  }
  if (current === "sign-in") {
    return (
      <Link href="/" className={linkClassName}>
        Home
      </Link>
    );
  }
  return (
    <Link href="/sign-in?next=/cards" className={linkClassName}>
      Sign in
    </Link>
  );
}

export function GenerateHeader({
  onBack,
  backLabel = "Back",
  current = "generate",
}: GenerateHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-outlyne-blue/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-lg items-center justify-between gap-3 px-6 py-4">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className={cn(
              "inline-flex min-h-11 items-center gap-2 rounded-[16px] px-2 text-sm font-medium text-outlyne-text",
              "transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-outlyne-maroon",
            )}
            aria-label={backLabel}
          >
            <ArrowLeft className="size-5" aria-hidden />
            <span className="hidden sm:inline">{backLabel}</span>
          </button>
        ) : (
          <Logo iconSize={36} />
        )}

        {onBack ? <Logo iconSize={36} showWordmark={false} /> : null}

        <AccountLink current={current} />
      </div>
    </header>
  );
}

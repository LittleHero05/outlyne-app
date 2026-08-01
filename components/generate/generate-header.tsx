import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/marketing/logo";
import { cn } from "@/lib/utils";

type GenerateHeaderProps = {
  onBack?: () => void;
  backLabel?: string;
};

export function GenerateHeader({
  onBack,
  backLabel = "Back",
}: GenerateHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-outlyne-blue/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-lg items-center justify-between px-6 py-4">
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

        {onBack ? <Logo iconSize={36} /> : null}

        <Link
          href="/"
          className="text-sm font-medium uppercase tracking-[0.15em] text-outlyne-text transition-opacity hover:opacity-70"
        >
          Home
        </Link>
      </div>
    </header>
  );
}

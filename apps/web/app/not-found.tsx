import Link from "next/link";
import { LogoMark } from "@/components/marketing/logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-outlyne-blue px-6 text-center">
      <LogoMark className="size-24 sm:size-28" />
      <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-outlyne-maroon sm:text-5xl">
        This page took a rest day
      </h1>
      <p className="mt-4 max-w-md text-lg text-outlyne-text/80">
        We couldn&apos;t find what you were looking for. Your progress is still waiting to be shared.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/generate"
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "h-[52px] rounded-[20px] px-8 text-lg font-medium",
          )}
        >
          Make a card
        </Link>
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "h-[52px] rounded-[20px] border-outlyne-text/20 bg-outlyne-surface px-8 text-lg font-medium text-outlyne-text",
          )}
        >
          Home
        </Link>
      </div>
    </main>
  );
}

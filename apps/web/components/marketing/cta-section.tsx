import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CtaSection() {
  return (
    <section className="bg-outlyne-blue pb-20 pt-12 lg:pb-28 lg:pt-16">
      <div className="mx-auto max-w-7xl px-6 text-center lg:px-10">
        <h2 className="mx-auto text-[clamp(2.25rem,7vw,6rem)] font-extrabold leading-[0.95] tracking-[-0.03em] text-outlyne-maroon">
          Ready to share
          <br />
          your progress?
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-outlyne-text/80 sm:text-xl">
          Pick an activity, type in your numbers, download. Under a minute.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <Link
            href="/generate"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "h-16 w-full max-w-[320px] gap-3 rounded-full px-8 text-xl font-medium shadow-[4px_4px_0_#110229] transition-transform hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#110229] sm:w-auto sm:min-w-[280px] sm:px-10",
            )}
          >
            Get Started Now
            <ArrowRight className="size-6" aria-hidden />
          </Link>
          <p className="text-sm text-outlyne-muted">Free. Sign in only if you want to save cards.</p>
        </div>
      </div>
    </section>
  );
}

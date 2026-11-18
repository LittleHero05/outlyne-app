import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ActivityOverlayCard } from "@/components/cards/activity-overlay-card";
import { LogoMark } from "@/components/marketing/logo";
import { WaitlistForm } from "@/components/marketing/waitlist-form";
import { buttonVariants } from "@/components/ui/button";
import { SHOWCASE_DRAFTS } from "@/lib/showcase-data";
import { cn } from "@/lib/utils";
import type { ActivityDraft } from "@outlyne/core";

const FAN = ["-rotate-6 translate-y-4", "-translate-y-3", "rotate-6 translate-y-4"];

/**
 * The showcase card is designed at 260px wide. Render it at that size and
 * scale the whole thing per breakpoint so the type stays legible on phones.
 */
function FannedCard({ draft, className }: { draft: ActivityDraft; className?: string }) {
  return (
    <div
      className={cn(
        "h-[231px] w-[130px] shrink-0 transition-transform duration-300 hover:z-10 hover:rotate-0 sm:h-[347px] sm:w-[195px] lg:h-[462px] lg:w-[260px]",
        className,
      )}
    >
      <div className="h-[462px] w-[260px] origin-top-left scale-50 sm:scale-75 lg:scale-100">
        <ActivityOverlayCard draft={draft} />
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section id="overview" className="scroll-mt-24 overflow-hidden bg-outlyne-surface">
      <div className="mx-auto max-w-7xl px-6 pt-10 sm:pt-14 lg:px-10 lg:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.4fr_auto] lg:gap-16">
          <div>
            <h1 className="text-[clamp(2.5rem,5.6vw,5rem)] font-extrabold leading-[1.02] tracking-[-0.03em] text-outlyne-maroon">
              Running overlays,
              <br />
              but for everything else
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-snug text-outlyne-text sm:text-2xl lg:text-[28px]">
              Type in what you did. Get a clean, Story-ready overlay for
              reading, workouts, habits and recipes. No account needed to start.
            </p>
            <Link
              href="/generate"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "mt-8 h-14 w-fit gap-3 rounded-full px-7 text-lg font-medium shadow-[4px_4px_0_#110229] transition-transform hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#110229]",
              )}
            >
              Make a card
              <ArrowRight className="size-5" aria-hidden />
            </Link>
          </div>

          <div className="flex justify-center lg:justify-end">
            <LogoMark className="size-[180px] sm:size-[220px] lg:size-[280px]" />
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-4xl lg:mt-16">
          <p className="mb-3 text-center text-sm text-outlyne-muted">
            Get notified when new activities and templates launch.
          </p>
          <WaitlistForm />
        </div>
      </div>

      {/* Cards fan out of the hero and spill into the next band. */}
      <div className="relative mx-auto mt-12 flex max-w-5xl justify-center gap-3 px-4 sm:mt-16 sm:gap-6 lg:gap-10">
        {SHOWCASE_DRAFTS.map((draft, index) => (
          <FannedCard key={draft.activity} draft={draft} className={FAN[index]} />
        ))}
      </div>
    </section>
  );
}

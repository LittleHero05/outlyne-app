import { LogoMark } from "@/components/marketing/logo";
import { WaitlistForm } from "@/components/marketing/waitlist-form";

export function HeroSection() {
  return (
    <section
      id="overview"
      className="mx-auto max-w-7xl scroll-mt-24 px-6 pb-16 pt-8 lg:px-10 lg:pb-24 lg:pt-12"
    >
      <div className="rounded-[40px] bg-outlyne-surface px-6 py-10 sm:px-10 sm:py-12 lg:rounded-[50px] lg:px-14 lg:py-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <div className="space-y-6">
            <h1 className="text-4xl font-extrabold leading-tight text-outlyne-maroon sm:text-5xl lg:text-[64px] lg:leading-[1.05]">
              Running overlays,
              <br />
              but for everything else
            </h1>
            <p className="max-w-xl text-xl leading-relaxed text-outlyne-text sm:text-2xl lg:text-[32px] lg:leading-9">
              Generate simple overlays for all activities and share them
              wherever you want
            </p>
          </div>

          <div className="flex justify-center lg:justify-end">
            <LogoMark className="size-[220px] sm:size-[260px] lg:size-[300px]" />
          </div>
        </div>

        <div className="mt-10 border-t border-outlyne-text/10 pt-8 lg:mt-12">
          <p className="mb-4 text-sm text-outlyne-muted">
            Get notified when new templates and activities launch.
          </p>
          <WaitlistForm className="max-w-2xl" />
        </div>
      </div>
    </section>
  );
}

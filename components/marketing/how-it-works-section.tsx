import { ActivityIcon } from "@/components/icons/activity-icon";
import { ACTIVITY_TILES, HOW_IT_WORKS_STEPS } from "@/lib/showcase-data";

function StepCard({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <div className="flex items-center gap-5 rounded-[38px] bg-white p-5 shadow-[4px_4px_2px_#6b2239] sm:gap-6 sm:p-6">
      <div
        className="flex size-20 shrink-0 items-center justify-center rounded-full border-2 border-outlyne-text/10 bg-white sm:size-24"
        aria-hidden
      >
        <span className="text-3xl font-semibold text-outlyne-text sm:text-4xl">
          {number}
        </span>
      </div>
      <p className="text-2xl font-medium text-outlyne-text sm:text-3xl lg:text-[38px]">
        {title}
      </p>
    </div>
  );
}

function ActivityTile({
  label,
  iconSrc,
}: {
  label: string;
  iconSrc: string;
}) {
  return (
    <div className="flex aspect-[135/165] flex-col items-center justify-center rounded-[22px] bg-outlyne-surface px-3 py-5 shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
      <ActivityIcon src={iconSrc} className="mb-3 h-14 w-14" />
      <p className="text-center text-base font-medium text-outlyne-text sm:text-lg">
        {label}
      </p>
    </div>
  );
}

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="mx-auto max-w-7xl scroll-mt-24 px-6 py-16 lg:px-10 lg:py-24"
    >
      <div className="rounded-[40px] bg-outlyne-surface px-6 py-10 sm:px-10 sm:py-12 lg:rounded-[50px] lg:px-14 lg:py-14">
        <h2 className="text-3xl font-bold text-outlyne-text sm:text-4xl lg:text-[45px]">
          How it works
        </h2>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-12">
          <div className="flex flex-col gap-5">
            {HOW_IT_WORKS_STEPS.map((step) => (
              <StepCard
                key={step.number}
                number={step.number}
                title={step.title}
              />
            ))}
          </div>

          <div className="mx-auto w-full max-w-sm rounded-[33px] border-2 border-black bg-outlyne-blue p-6 lg:max-w-none">
            <h3 className="text-center text-2xl font-medium text-outlyne-text">
              Select Activity Type
            </h3>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {ACTIVITY_TILES.map((tile) => (
                <ActivityTile
                  key={tile.label}
                  label={tile.label}
                  iconSrc={tile.iconSrc}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

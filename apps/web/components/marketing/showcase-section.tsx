import { ActivityIcon } from "@/components/icons/activity-icon";
import { ICONS } from "@/lib/assets";
import { cn } from "@/lib/utils";
import { COLORS } from "@outlyne/core";

function BigIcon({ src, className }: { src: string; className?: string }) {
  return (
    <ActivityIcon
      src={src}
      color={COLORS.accentMaroon}
      className={cn("size-14 sm:size-20 lg:size-24", className)}
    />
  );
}

/**
 * Icon-and-copy band in the spirit of a sparse editorial grid: four activity
 * icons at the edges, the message in the middle. Stacks on small screens.
 */
export function ShowcaseSection() {
  return (
    <section className="bg-outlyne-blue pb-16 pt-24 sm:pt-36 lg:pb-24 lg:pt-44">
      <div className="mx-auto grid max-w-6xl gap-y-10 px-6 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-x-12 sm:gap-y-14 lg:px-10">
        <div className="flex justify-center gap-10 sm:contents">
          <BigIcon src={ICONS.reading} className="sm:col-start-1 sm:row-start-1" />
          <BigIcon src={ICONS.workout} className="sm:col-start-3 sm:row-start-1" />
        </div>
        <h2 className="text-center text-3xl font-bold leading-tight text-outlyne-maroon sm:col-start-2 sm:row-start-1 sm:text-4xl lg:text-[52px]">
          All achievements deserve to be shared
        </h2>
        <p className="mx-auto max-w-xl text-center text-lg leading-relaxed text-outlyne-text sm:col-start-2 sm:row-start-2 sm:text-xl lg:text-2xl">
          A chapter before bed. A push day. Fourteen mornings in a row. A recipe
          that finally worked. Outlyne turns whatever you did today into a card
          that looks like it belongs on your Story.
        </p>
        <div className="flex justify-center gap-10 sm:contents">
          <BigIcon src={ICONS.habit} className="sm:col-start-1 sm:row-start-2" />
          <BigIcon src={ICONS.recipe} className="sm:col-start-3 sm:row-start-2" />
        </div>
      </div>
    </section>
  );
}

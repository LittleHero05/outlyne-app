import { ActivityOverlayCard } from "@/components/cards/activity-overlay-card";
import { SHOWCASE_CARDS } from "@/lib/showcase-data";

export function ShowcaseSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
      <h2 className="mx-auto max-w-4xl text-center text-3xl font-bold text-outlyne-text sm:text-4xl lg:text-[45px]">
        All achievements deserve to be shared
      </h2>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-10">
        {SHOWCASE_CARDS.map((card) => (
          <ActivityOverlayCard key={card.id} data={card} />
        ))}
      </div>
    </section>
  );
}

const ITEMS = ["Reading", "Workout", "Habit", "Recipe", "Your progress", "Shared"];

/** Thin scrolling band between sections. Pauses for reduced-motion users. */
export function Ticker() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div
      className="overflow-hidden border-y-2 border-outlyne-text/10 bg-outlyne-maroon py-3 text-outlyne-surface"
      aria-hidden
    >
      <div className="ticker-track flex w-max gap-10 whitespace-nowrap text-sm font-semibold uppercase tracking-[0.25em] motion-reduce:animate-none">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 gap-10">
            {row.map((item, index) => (
              <span key={`${copy}-${index}`} className="flex items-center gap-10">
                {item}
                <span className="text-outlyne-blue">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

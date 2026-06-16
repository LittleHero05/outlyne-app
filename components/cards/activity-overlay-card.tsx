import Image from "next/image";
import { ActivityIcon } from "@/components/icons/activity-icon";
import type { ShowcaseCardData } from "@/lib/showcase-data";

type ActivityOverlayCardProps = {
  data: ShowcaseCardData;
  className?: string;
};

export function ActivityOverlayCard({ data, className }: ActivityOverlayCardProps) {
  return (
    <article
      className={`relative mx-auto w-full max-w-[280px] ${className ?? ""}`}
      aria-label={`${data.activity} overlay example`}
    >
      <div className="relative aspect-[9/16] overflow-hidden rounded-[40px] shadow-lg">
        <Image
          src="/showcase/card-bg.jpg"
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 70vw, 280px"
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 py-10 text-center text-white">
          <ActivityIcon
            src={data.iconSrc}
            variant="on-photo"
            className="mb-6 h-24 w-24"
          />

          <p className="text-xs font-semibold uppercase tracking-wide opacity-90">
            {data.headlineLabel}
          </p>
          <p className="mt-1 text-xl font-semibold leading-tight">{data.headline}</p>

          <div className="mt-5 grid w-full grid-cols-2 gap-4">
            {data.stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-xs font-semibold opacity-90">{stat.label}</p>
                <p className="mt-1 text-lg font-semibold">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-5">
            <p className="text-xs font-semibold opacity-90">{data.footerLabel}</p>
            <p className="mt-1 text-lg font-semibold">{data.footerValue}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

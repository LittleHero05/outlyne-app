import Image from "next/image";
import { ActivityCard } from "@/components/generate/activity-card";
import { getActivity } from "@/lib/activities";
import type { ActivityDraft } from "@/types";
import { cn } from "@/lib/utils";

type ActivityOverlayCardProps = {
  draft: ActivityDraft;
  className?: string;
};

/**
 * Landing showcase: the real overlay card composited over a sample photo,
 * the way a user would see it in their Story.
 */
export function ActivityOverlayCard({ draft, className }: ActivityOverlayCardProps) {
  const { label } = getActivity(draft.activity);

  return (
    <div
      className={cn("relative mx-auto w-full max-w-[260px]", className)}
      aria-label={`${label} overlay example`}
    >
      <div className="relative aspect-[9/16] overflow-hidden rounded-[40px] shadow-lg">
        <Image
          src="/showcase/card-bg.jpg"
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 70vw, 280px"
        />
        <div className="absolute inset-0 bg-black/15" aria-hidden />
        <ActivityCard
          draft={draft}
          outlineColorId="white"
          className="absolute inset-0 h-full"
        />
      </div>
    </div>
  );
}

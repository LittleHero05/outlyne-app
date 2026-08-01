import { ActivityIcon } from "@/components/icons/activity-icon";
import { ACTIVITIES } from "@/lib/activities";
import type { ActivityType } from "@/types";
import { cn } from "@/lib/utils";

type ActivitySelectProps = {
  onSelect: (activity: ActivityType) => void;
};

export function ActivitySelect({ onSelect }: ActivitySelectProps) {
  return (
    <div className="mx-auto w-full max-w-md px-6 py-8 sm:py-12">
      <h1 className="text-center text-3xl font-medium leading-tight text-outlyne-text sm:text-[28px]">
        Select Activity Type
      </h1>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5">
        {ACTIVITIES.map((activity) => (
          <button
            key={activity.id}
            type="button"
            onClick={() => onSelect(activity.id)}
            className={cn(
              "flex aspect-[135/165] flex-col items-center justify-center rounded-[22px] bg-outlyne-surface px-3 py-5",
              "shadow-[0_4px_4px_rgba(0,0,0,0.25)] transition-transform",
              "hover:-translate-y-0.5 hover:shadow-[0_6px_8px_rgba(0,0,0,0.2)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-outlyne-maroon focus-visible:ring-offset-2 focus-visible:ring-offset-outlyne-blue",
              "active:translate-y-0",
            )}
          >
            <ActivityIcon
              src={activity.iconSrc}
              alt=""
              className="mb-3 h-14 w-14 sm:h-16 sm:w-16"
            />
            <span className="text-center text-lg font-medium text-outlyne-text sm:text-xl">
              {activity.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

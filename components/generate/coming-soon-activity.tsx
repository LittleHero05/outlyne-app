import { getActivity } from "@/lib/activities";
import { buttonVariants } from "@/components/ui/button";
import type { ActivityType } from "@/types";
import { cn } from "@/lib/utils";

type ComingSoonActivityProps = {
  activity: ActivityType;
  onBack: () => void;
};

export function ComingSoonActivity({
  activity,
  onBack,
}: ComingSoonActivityProps) {
  const { label } = getActivity(activity);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center px-6 py-16 text-center">
      <h1 className="text-[35px] font-medium text-outlyne-text">{label}</h1>
      <p className="mt-4 max-w-sm text-lg text-outlyne-text/80">
        This activity form is next. Reading is ready to try end-to-end first.
      </p>
      <button
        type="button"
        onClick={onBack}
        className={cn(
          buttonVariants({ variant: "default", size: "lg" }),
          "mt-10 h-[52px] min-w-[182px] rounded-[20px] px-8 text-lg font-medium",
        )}
      >
        Choose another
      </button>
    </div>
  );
}

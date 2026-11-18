import { ActivityCard } from "@/components/generate/activity-card";
import { cn } from "@/lib/utils";
import type { ActivityDraft, OutlineColorId } from "@outlyne/core";

const RENDER_WIDTH = 320;
const RENDER_HEIGHT = (RENDER_WIDTH * 16) / 9;

/**
 * The full-size card scaled down, so text keeps the same proportions as the
 * exported image instead of reflowing at a small width.
 */
export function CardThumb({
  draft,
  outlineColorId,
  width,
  className,
}: {
  draft: ActivityDraft;
  outlineColorId: OutlineColorId;
  width: number;
  className?: string;
}) {
  const scale = width / RENDER_WIDTH;
  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ width, height: RENDER_HEIGHT * scale }}
    >
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{ width: RENDER_WIDTH, height: RENDER_HEIGHT, transform: `scale(${scale})` }}
      >
        <ActivityCard draft={draft} outlineColorId={outlineColorId} />
      </div>
    </div>
  );
}

import { ShapeSvg } from "@/components/icons/shape-svg";
import { cn } from "@/lib/utils";
import {
  BODY_OPACITY,
  BODY_REGIONS,
  BODY_SILHOUETTE,
  BODY_VIEW,
  formatMuscleList,
  type BodySide,
  type MuscleGroupId,
  type Shape,
} from "@outlyne/core";

type BodyMapProps = {
  selected: MuscleGroupId[];
  color: string;
  className?: string;
  /**
   * "height": figures fill the container height (form preview with fixed h-*).
   * "width": figures scale with the container width (cards, so the map grows
   * and shrinks with the card instead of overflowing it).
   */
  fit?: "height" | "width";
};

const FIGURE_CLASS = {
  height: "h-full w-auto",
  width: "h-auto w-[40%]",
} as const;

const VIEW_BOX = `0 0 ${BODY_VIEW.width} ${BODY_VIEW.height}`;

function Figure({
  side,
  selected,
  color,
  figureClass,
}: {
  side: BodySide;
  selected: Set<MuscleGroupId>;
  color: string;
  figureClass: string;
}) {
  const regions = Object.entries(BODY_REGIONS[side]) as [MuscleGroupId, Shape[]][];
  return (
    <svg viewBox={VIEW_BOX} className={figureClass} aria-hidden>
      <g opacity={BODY_OPACITY.silhouette}>
        {BODY_SILHOUETTE.map((shape, index) => (
          <ShapeSvg key={index} shape={shape} color={color} />
        ))}
      </g>
      {regions.map(([muscle, shapes]) => (
        <g
          key={muscle}
          opacity={selected.has(muscle) ? BODY_OPACITY.active : BODY_OPACITY.idle}
        >
          {shapes.map((shape, index) => (
            <ShapeSvg key={index} shape={shape} color={color} />
          ))}
        </g>
      ))}
    </svg>
  );
}

/**
 * Front and back body silhouettes with the selected muscle groups filled
 * in the outline color. Shapes come from @outlyne/core so web and mobile match.
 */
export function BodyMap({ selected, color, className, fit = "height" }: BodyMapProps) {
  const set = new Set(selected);
  const figureClass = FIGURE_CLASS[fit];
  return (
    <div
      className={cn(
        "flex items-stretch justify-center",
        fit === "height" ? "gap-6" : "gap-[8%]",
        className,
      )}
      role="img"
      aria-label={
        selected.length ? `Muscles worked: ${formatMuscleList(selected)}` : "Body map"
      }
    >
      <Figure side="front" selected={set} color={color} figureClass={figureClass} />
      <Figure side="back" selected={set} color={color} figureClass={figureClass} />
    </div>
  );
}

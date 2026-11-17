import { cn } from "@/lib/utils";
import type { MuscleGroupId } from "@outlyne/core";

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

const VIEW_BOX = "0 0 120 250";

/** Shared silhouette: head, torso, and stroke-drawn limbs with round caps. */
function Silhouette({ color }: { color: string }) {
  return (
    <g fill={color} stroke={color} opacity={0.28}>
      <circle cx="60" cy="20" r="13" stroke="none" />
      <rect x="54" y="31" width="12" height="11" stroke="none" />
      <path
        d="M32 44 Q60 37 88 44 L85 90 Q85 100 83 118 Q60 127 37 118 Q35 100 35 90 Z"
        stroke="none"
      />
      <path
        d="M34 50 L20 96 L14 142"
        fill="none"
        strokeWidth="13"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M86 50 L100 96 L106 142"
        fill="none"
        strokeWidth="13"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M48 122 L44 180 L42 236"
        fill="none"
        strokeWidth="18"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M72 122 L76 180 L78 236"
        fill="none"
        strokeWidth="18"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

type RegionProps = { active: boolean; color: string; children: React.ReactNode };

function Region({ active, color, children }: RegionProps) {
  return (
    <g fill={color} opacity={active ? 1 : 0.14}>
      {children}
    </g>
  );
}

function FrontFigure({ selected, color, figureClass }: { selected: Set<MuscleGroupId>; color: string; figureClass: string }) {
  const is = (id: MuscleGroupId) => selected.has(id);
  return (
    <svg viewBox={VIEW_BOX} className={figureClass} aria-hidden>
      <Silhouette color={color} />
      <Region active={is("chest")} color={color}>
        <ellipse cx="47" cy="62" rx="12" ry="8" />
        <ellipse cx="73" cy="62" rx="12" ry="8" />
      </Region>
      <Region active={is("shoulders")} color={color}>
        <circle cx="34" cy="52" r="8" />
        <circle cx="86" cy="52" r="8" />
      </Region>
      <Region active={is("biceps")} color={color}>
        <ellipse cx="27" cy="76" rx="5" ry="13" transform="rotate(16 27 76)" />
        <ellipse cx="93" cy="76" rx="5" ry="13" transform="rotate(-16 93 76)" />
      </Region>
      <Region active={is("forearms")} color={color}>
        <ellipse cx="17" cy="120" rx="4.5" ry="16" transform="rotate(8 17 120)" />
        <ellipse cx="103" cy="120" rx="4.5" ry="16" transform="rotate(-8 103 120)" />
      </Region>
      <Region active={is("core")} color={color}>
        <rect x="51" y="73" width="18" height="40" rx="5" />
        <path d="M40 80 L48 77 L48 112 L42 110 Z" />
        <path d="M80 80 L72 77 L72 112 L78 110 Z" />
      </Region>
      <Region active={is("quads")} color={color}>
        <ellipse cx="47" cy="152" rx="8" ry="26" />
        <ellipse cx="73" cy="152" rx="8" ry="26" />
      </Region>
      <Region active={is("calves")} color={color}>
        <ellipse cx="43" cy="212" rx="4" ry="15" />
        <ellipse cx="77" cy="212" rx="4" ry="15" />
      </Region>
    </svg>
  );
}

function BackFigure({ selected, color, figureClass }: { selected: Set<MuscleGroupId>; color: string; figureClass: string }) {
  const is = (id: MuscleGroupId) => selected.has(id);
  return (
    <svg viewBox={VIEW_BOX} className={figureClass} aria-hidden>
      <Silhouette color={color} />
      <Region active={is("back")} color={color}>
        <path d="M44 44 L60 38 L76 44 L68 62 L52 62 Z" />
        <path d="M38 63 L82 63 L78 96 L60 104 L42 96 Z" />
      </Region>
      <Region active={is("shoulders")} color={color}>
        <circle cx="34" cy="52" r="8" />
        <circle cx="86" cy="52" r="8" />
      </Region>
      <Region active={is("triceps")} color={color}>
        <ellipse cx="27" cy="76" rx="5" ry="13" transform="rotate(16 27 76)" />
        <ellipse cx="93" cy="76" rx="5" ry="13" transform="rotate(-16 93 76)" />
      </Region>
      <Region active={is("forearms")} color={color}>
        <ellipse cx="17" cy="120" rx="4.5" ry="16" transform="rotate(8 17 120)" />
        <ellipse cx="103" cy="120" rx="4.5" ry="16" transform="rotate(-8 103 120)" />
      </Region>
      <Region active={is("core")} color={color}>
        <rect x="52" y="99" width="16" height="16" rx="4" />
      </Region>
      <Region active={is("glutes")} color={color}>
        <ellipse cx="49" cy="127" rx="10" ry="9" />
        <ellipse cx="71" cy="127" rx="10" ry="9" />
      </Region>
      <Region active={is("hamstrings")} color={color}>
        <ellipse cx="46" cy="166" rx="8" ry="24" />
        <ellipse cx="74" cy="166" rx="8" ry="24" />
      </Region>
      <Region active={is("calves")} color={color}>
        <ellipse cx="43" cy="212" rx="6" ry="17" />
        <ellipse cx="77" cy="212" rx="6" ry="17" />
      </Region>
    </svg>
  );
}

/**
 * Front and back body silhouettes with the selected muscle groups filled
 * in the outline color. Pure SVG so it exports crisply and ports to native.
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
        selected.length
          ? `Muscles worked: ${selected.join(", ")}`
          : "Body map"
      }
    >
      <FrontFigure selected={set} color={color} figureClass={figureClass} />
      <BackFigure selected={set} color={color} figureClass={figureClass} />
    </div>
  );
}

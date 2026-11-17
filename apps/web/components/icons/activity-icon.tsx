import { ShapeSvg } from "@/components/icons/shape-svg";
import { COLORS, ICON_SHAPES, type IconName } from "@outlyne/core";
import { cn } from "@/lib/utils";

type ActivityIconProps = {
  name: IconName;
  /** Any CSS color. Defaults to brand maroon. */
  color?: string;
  /** Accessible name. Omit for decorative icons. */
  label?: string;
  className?: string;
};

/**
 * Activity icons and brand marks drawn inline from @outlyne/core shape data,
 * so they tint to any outline color and export crisply with html-to-image.
 * The icon scales to fit the box set by className, keeping its proportions.
 */
export function ActivityIcon({
  name,
  color = COLORS.accentMaroon,
  label,
  className,
}: ActivityIconProps) {
  const icon = ICON_SHAPES[name];
  return (
    <svg
      viewBox={`0 0 ${icon.width} ${icon.height}`}
      preserveAspectRatio="xMidYMid meet"
      className={cn("inline-block shrink-0", className)}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {icon.shapes.map((shape, index) => (
        <ShapeSvg key={index} shape={shape} color={color} />
      ))}
    </svg>
  );
}

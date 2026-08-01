import Image from "next/image";
import { cn } from "@/lib/utils";

type ActivityIconProps = {
  src: string;
  alt?: string;
  className?: string;
  /** White icon for photo overlay cards when no outline color is set */
  variant?: "default" | "on-photo";
  /** Tints a single-color SVG via CSS mask */
  color?: string;
};

export function ActivityIcon({
  src,
  alt = "",
  className,
  variant = "default",
  color,
}: ActivityIconProps) {
  if (color) {
    return (
      <span
        role={alt ? "img" : undefined}
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : true}
        className={cn("inline-block shrink-0", className)}
        style={{
          backgroundColor: color,
          maskImage: `url(${src})`,
          WebkitMaskImage: `url(${src})`,
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
        }}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={64}
      height={64}
      className={cn(
        "object-contain",
        variant === "on-photo" && "brightness-0 invert",
        className,
      )}
    />
  );
}

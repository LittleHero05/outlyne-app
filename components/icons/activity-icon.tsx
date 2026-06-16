import Image from "next/image";
import { cn } from "@/lib/utils";

type ActivityIconProps = {
  src: string;
  alt?: string;
  className?: string;
  /** White icon for photo overlay cards */
  variant?: "default" | "on-photo";
};

export function ActivityIcon({
  src,
  alt = "",
  className,
  variant = "default",
}: ActivityIconProps) {
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

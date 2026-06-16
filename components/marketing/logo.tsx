import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/lib/assets";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  showWordmark?: boolean;
  iconSize?: number;
};

export function Logo({
  className,
  showWordmark = true,
  iconSize = 40,
}: LogoProps) {
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-2.5", className)}
      aria-label="Outlyne home"
    >
      <Image
        src={BRAND.logoMark}
        alt=""
        width={iconSize}
        height={iconSize}
        className="shrink-0"
        priority
      />
      {showWordmark ? (
        <Image
          src={BRAND.wordmark}
          alt="Outlyne"
          width={102}
          height={26}
          className="h-7 w-auto shrink-0"
          priority
        />
      ) : null}
    </Link>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src={BRAND.logoMark}
      alt=""
      width={300}
      height={300}
      className={cn(
        "size-[220px] shrink-0 sm:size-[260px] lg:size-[300px]",
        className,
      )}
      priority
    />
  );
}

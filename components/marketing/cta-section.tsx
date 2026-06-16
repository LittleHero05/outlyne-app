import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CtaSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-16">
      <div className="flex justify-center">
        <Link
          href="/generate"
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "h-14 min-w-[280px] rounded-[20px] px-10 text-xl font-medium",
          )}
        >
          Get Started Now
        </Link>
      </div>
    </section>
  );
}

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function GeneratePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <h1 className="text-3xl font-bold text-outlyne-maroon">Coming soon</h1>
      <p className="text-outlyne-text">
        The card generator is Phase B. Finish the landing page first.
      </p>
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "outline", size: "lg" }),
          "rounded-[20px]",
        )}
      >
        Back to home
      </Link>
    </main>
  );
}

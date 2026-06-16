import Link from "next/link";
import { Logo } from "@/components/marketing/logo";
import { SITE } from "@/lib/constants";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="about"
      className="mx-auto max-w-7xl scroll-mt-24 px-6 pb-12 pt-8 lg:px-10"
    >
      <div className="flex flex-col items-center gap-6 border-t border-outlyne-text/10 pt-10 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <Logo />

        <p className="max-w-md text-sm leading-relaxed text-outlyne-muted">
          Outlyne turns everyday progress into shareable overlays — reading,
          workouts, habits, and more.
        </p>

        <div className="flex flex-col items-center gap-2 sm:items-end">
          <Link
            href={SITE.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-outlyne-text underline-offset-4 hover:underline"
          >
            @outlyneapp
          </Link>
          <p className="text-sm text-outlyne-muted">
            © {year} {SITE.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

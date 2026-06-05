"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/marketing/logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "#overview", label: "Overview" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#about", label: "About us" },
] as const;

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-outlyne-blue/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Logo />

        <nav
          className="hidden items-center gap-10 lg:flex"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium uppercase tracking-[0.2em] text-outlyne-text transition-opacity hover:opacity-70"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/generate"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "h-[52px] min-w-[140px] rounded-[20px] px-6 text-lg font-medium",
            )}
          >
            Start
          </Link>
        </nav>

        <div className="flex items-center gap-3 lg:hidden">
          <Link
            href="/generate"
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "h-10 rounded-[16px] px-4 text-sm font-medium",
            )}
          >
            Start
          </Link>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-[12px] text-outlyne-text"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav
          id="mobile-nav"
          className="border-t border-outlyne-text/10 px-6 py-4 lg:hidden"
          aria-label="Mobile navigation"
        >
          <ul className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block text-sm font-medium uppercase tracking-[0.2em] text-outlyne-text"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}

import type { ReactNode } from "react";
import { GenerateHeader } from "@/components/generate/generate-header";
import { SiteFooter } from "@/components/marketing/site-footer";

/** Shared layout for the privacy policy and terms. */
export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-outlyne-blue">
      <GenerateHeader current="sign-in" />
      <main className="flex-1">
        <article className="mx-auto w-full max-w-2xl px-6 py-10 text-outlyne-text [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_li]:mt-1 [&_p]:mt-3 [&_p]:leading-relaxed [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
          <h1 className="text-4xl font-extrabold tracking-tight text-outlyne-maroon">{title}</h1>
          <p className="text-sm text-outlyne-muted">Last updated {updated}</p>
          {children}
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}

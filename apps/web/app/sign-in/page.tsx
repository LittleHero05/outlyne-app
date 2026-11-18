import type { Metadata } from "next";
import { Suspense } from "react";
import { SignInPage } from "@/components/auth/sign-in-page";
import { GenerateHeader } from "@/components/generate/generate-header";

export const metadata: Metadata = {
  title: "Sign in — Outlyne",
  description: "Sign in with your email to save Outlyne cards.",
  robots: { index: false },
};

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col bg-outlyne-blue">
      <GenerateHeader current="sign-in" />
      <main className="flex-1">
        <Suspense fallback={null}>
          <SignInPage />
        </Suspense>
      </main>
    </div>
  );
}

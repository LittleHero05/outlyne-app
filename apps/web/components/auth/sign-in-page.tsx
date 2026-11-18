"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { SignInForm } from "@/components/auth/sign-in-form";

/** Only allow same-site paths, so ?next= can't send people elsewhere. */
function safeNext(value: string | null): string {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/cards";
}

export function SignInPage() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading && session) router.replace(next);
  }, [loading, session, next, router]);

  return (
    <div className="mx-auto w-full max-w-md px-6 py-10">
      <div className="rounded-[28px] bg-outlyne-surface p-6 sm:p-8">
        <SignInForm onSignedIn={() => router.replace(next)} />
      </div>
    </div>
  );
}

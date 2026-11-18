"use client";

import { FormEvent, useId, useRef, useState } from "react";
import { FREE_CARD_LIMIT } from "@outlyne/core";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TURNSTILE_SITE_KEY, Turnstile, type TurnstileHandle } from "@/components/auth/turnstile";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import { cn } from "@/lib/utils";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Supabase's email code length is a project setting between 6 and 10 digits. */
const CODE_MIN = 6;
const CODE_MAX = 10;

const fieldClassName =
  "h-[56px] rounded-[20px] border-0 bg-white px-5 text-lg text-outlyne-text placeholder:text-outlyne-muted focus-visible:ring-outlyne-maroon md:text-lg";

/** Two steps: email, then the one-time code Supabase emails. */
export function SignInForm({
  onSignedIn,
  headingId,
}: {
  onSignedIn: () => void;
  headingId?: string;
}) {
  const emailId = useId();
  const codeId = useId();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaFailed, setCaptchaFailed] = useState(false);
  /** Set when "Send code" is pressed before the CAPTCHA has finished. */
  const [waitingForCaptcha, setWaitingForCaptcha] = useState(false);
  const turnstileRef = useRef<TurnstileHandle>(null);

  const CAPTCHA_FAILED = "We couldn't check your browser. Refresh the page and try again.";

  async function sendCode(event?: FormEvent, freshToken?: string) {
    event?.preventDefault();
    const token = freshToken ?? captchaToken;
    const trimmed = email.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(trimmed)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (TURNSTILE_SITE_KEY && !token) {
      if (captchaFailed) {
        setError(CAPTCHA_FAILED);
        return;
      }
      setError("");
      setWaitingForCaptcha(true);
      return;
    }
    setWaitingForCaptcha(false);
    setBusy(true);
    setError("");
    const { error: sendError } = await getBrowserSupabase().auth.signInWithOtp({
      email: trimmed,
      options: token ? { captchaToken: token } : undefined,
    });
    setBusy(false);
    // Each token works once, so get a fresh one for "Send a new code".
    turnstileRef.current?.reset();
    if (sendError) {
      setError(
        sendError.status === 429
          ? "Please wait a minute before asking for another code."
          : /captcha/i.test(sendError.message)
            ? "We couldn't confirm you're human. Please try again."
            : "Could not send the code. Please try again.",
      );
      return;
    }
    setEmail(trimmed);
    setStep("code");
  }

  async function verifyCode(event: FormEvent) {
    event.preventDefault();
    if (code.length < CODE_MIN) return;
    setBusy(true);
    setError("");
    const { error: verifyError } = await getBrowserSupabase().auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });
    setBusy(false);
    if (verifyError) {
      setError("That code didn't work. Check it, or send a new one.");
      return;
    }
    onSignedIn();
  }

  const primary = cn(
    buttonVariants({ variant: "default", size: "lg" }),
    "h-[52px] w-full rounded-[20px] text-lg font-medium disabled:opacity-70",
  );

  return (
    <div>
      <h2 id={headingId} className="text-2xl font-medium text-outlyne-text">
        {step === "email" ? "Sign in to save cards" : "Check your email"}
      </h2>
      <p className="mt-2 text-base text-outlyne-muted">
        {step === "email"
          ? `Save up to ${FREE_CARD_LIMIT} cards and find them on any device. No password, we email you a code.`
          : `We sent a sign-in code to ${email}. It can take a minute to arrive.`}
      </p>

      {step === "email" ? (
        <form onSubmit={sendCode} className="mt-6 space-y-3" noValidate>
          <label htmlFor={emailId} className="sr-only">
            Email address
          </label>
          <Input
            id={emailId}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={fieldClassName}
            autoFocus
          />
          <button type="submit" disabled={busy || waitingForCaptcha} className={primary}>
            {busy || waitingForCaptcha ? "Sending…" : "Send code"}
          </button>
        </form>
      ) : (
        <form onSubmit={verifyCode} className="mt-6 space-y-3">
          <label htmlFor={codeId} className="sr-only">
            Sign-in code
          </label>
          <Input
            id={codeId}
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="Enter the code"
            maxLength={CODE_MAX}
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
            className={cn(fieldClassName, "tracking-[0.3em]")}
            autoFocus
          />
          <button type="submit" disabled={busy || code.length < CODE_MIN} className={primary}>
            {busy ? "Checking…" : "Sign in"}
          </button>
          <div className="flex justify-between text-sm">
            <button
              type="button"
              className="text-outlyne-muted underline-offset-4 hover:underline"
              onClick={() => {
                setStep("email");
                setCode("");
                setError("");
              }}
            >
              Use a different email
            </button>
            <button
              type="button"
              className="text-outlyne-maroon underline-offset-4 hover:underline disabled:opacity-60"
              disabled={busy || waitingForCaptcha}
              onClick={() => sendCode()}
            >
              Send a new code
            </button>
          </div>
        </form>
      )}

      <Turnstile
        ref={turnstileRef}
        onToken={(token) => {
          setCaptchaToken(token);
          if (!token) return;
          setCaptchaFailed(false);
          // Finish a send that was waiting on the CAPTCHA.
          if (waitingForCaptcha) void sendCode(undefined, token);
        }}
        onError={() => {
          setCaptchaFailed(true);
          if (waitingForCaptcha) {
            setWaitingForCaptcha(false);
            setError(CAPTCHA_FAILED);
          }
        }}
      />

      {error ? (
        <p className="mt-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

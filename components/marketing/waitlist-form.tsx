"use client";

import { FormEvent, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type FormStatus = "idle" | "loading" | "success" | "error";

export function WaitlistForm({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setMessage(data.message ?? "You're on the list!");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <div className={className}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 sm:flex-row sm:items-stretch"
      >
        <Input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="Email Address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={status === "loading" || status === "success"}
          className="h-[52px] flex-1 rounded-[20px] border border-black bg-[#f0f0f0] px-5 text-lg text-outlyne-text placeholder:text-outlyne-text/70 focus-visible:ring-outlyne-maroon"
          aria-label="Email address"
        />
        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "h-[52px] shrink-0 rounded-[20px] px-8 text-lg font-medium disabled:opacity-70",
          )}
        >
          {status === "loading" ? "Signing up…" : "Sign up"}
        </button>
      </form>
      {message ? (
        <p
          role="status"
          className={cn(
            "mt-3 text-sm",
            status === "error" ? "text-red-700" : "text-outlyne-text",
          )}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}

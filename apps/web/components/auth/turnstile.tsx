"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

/**
 * Cloudflare Turnstile, the CAPTCHA Supabase checks before it emails a
 * sign-in code. Without NEXT_PUBLIC_TURNSTILE_SITE_KEY it renders nothing,
 * so local development works without a key.
 */
export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      appearance?: "always" | "execute" | "interaction-only";
      size?: "normal" | "flexible" | "compact";
      callback?: (token: string) => void;
      "expired-callback"?: () => void;
      "error-callback"?: () => void;
    },
  ) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<TurnstileApi> | null = null;

function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      script.onload = () =>
        window.turnstile ? resolve(window.turnstile) : reject(new Error("Turnstile missing"));
      script.onerror = () => {
        scriptPromise = null;
        reject(new Error("Turnstile failed to load"));
      };
      document.head.appendChild(script);
    });
  }
  return scriptPromise;
}

export type TurnstileHandle = {
  /** Tokens are single use: call after each request that spent one. */
  reset: () => void;
};

export const Turnstile = forwardRef<
  TurnstileHandle,
  { onToken: (token: string) => void; onError: () => void }
>(function Turnstile({ onToken, onError }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const callbacks = useRef({ onToken, onError });
  callbacks.current = { onToken, onError };

  useImperativeHandle(ref, () => ({
    reset: () => {
      callbacks.current.onToken("");
      if (widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current);
    },
  }));

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;
    let cancelled = false;
    loadTurnstile()
      .then((api) => {
        if (cancelled || !containerRef.current) return;
        widgetId.current = api.render(containerRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          // Invisible for most people; shows a checkbox only when Cloudflare is unsure.
          appearance: "interaction-only",
          size: "flexible",
          callback: (token) => callbacks.current.onToken(token),
          "expired-callback": () => callbacks.current.onToken(""),
          "error-callback": () => callbacks.current.onError(),
        });
      })
      .catch(() => {
        if (!cancelled) callbacks.current.onError();
      });
    return () => {
      cancelled = true;
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
      widgetId.current = null;
    };
  }, []);

  if (!TURNSTILE_SITE_KEY) return null;
  return <div ref={containerRef} className="mt-3 empty:hidden" />;
});

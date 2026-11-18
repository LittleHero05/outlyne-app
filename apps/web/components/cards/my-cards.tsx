"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { FREE_CARD_LIMIT, rowToDraft } from "@outlyne/core";
import { useAuth } from "@/components/auth/auth-provider";
import { SignInForm } from "@/components/auth/sign-in-form";
import { CardThumb } from "@/components/cards/card-thumb";
import { buttonVariants } from "@/components/ui/button";
import { deleteAccount, deleteCard, listCards, type SavedCard } from "@/lib/cards";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import { checkerboardStyle } from "@/lib/backdrop";
import { cn } from "@/lib/utils";

const THUMB_WIDTH = 150;

const outlineButton = cn(
  buttonVariants({ variant: "outline", size: "lg" }),
  "h-[48px] rounded-[18px] border-outlyne-text/20 bg-outlyne-surface px-5 text-base font-medium text-outlyne-text",
);

function SavedCardTile({
  card,
  onDelete,
}: {
  card: SavedCard;
  onDelete: (card: SavedCard) => Promise<void>;
}) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const title = card.details.title || "Untitled";

  return (
    <li className="flex flex-col items-center gap-2">
      <Link
        href={`/generate?card=${card.id}`}
        style={checkerboardStyle(card.outline_color, 12)}
        className="overflow-hidden rounded-[22px] shadow-[0_4px_10px_rgba(17,2,41,0.12)] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-outlyne-maroon focus-visible:ring-offset-2 focus-visible:ring-offset-outlyne-blue"
        aria-label={`Open ${card.activity} card: ${title}`}
      >
        <CardThumb
          draft={rowToDraft(card, card.photoUrl)}
          outlineColorId={card.outline_color}
          width={THUMB_WIDTH}
        />
      </Link>
      {confirming ? (
        <div className="flex items-center gap-3 text-sm" role="group" aria-label="Confirm delete">
          <button
            type="button"
            disabled={busy}
            className="font-semibold text-red-700 hover:underline disabled:opacity-60"
            onClick={async () => {
              setBusy(true);
              await onDelete(card);
              setBusy(false);
            }}
          >
            {busy ? "Deleting…" : "Delete"}
          </button>
          <button
            type="button"
            className="text-outlyne-muted hover:underline"
            onClick={() => setConfirming(false)}
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="text-sm text-outlyne-muted hover:text-outlyne-text hover:underline"
          onClick={() => setConfirming(true)}
        >
          Delete
        </button>
      )}
    </li>
  );
}

function DeleteAccount({ cardCount }: { cardCount: number }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!open) {
    return (
      <button
        type="button"
        className="text-sm text-outlyne-muted underline-offset-4 hover:text-red-700 hover:underline"
        onClick={() => setOpen(true)}
      >
        Delete account
      </button>
    );
  }

  return (
    <div className="w-full max-w-sm rounded-[22px] border border-red-200 bg-white/70 p-5 text-left">
      <p className="font-medium text-outlyne-text">Delete your account?</p>
      <p className="mt-1 text-sm text-outlyne-muted">
        {`This permanently removes your account, your ${cardCount} saved ${
          cardCount === 1 ? "card" : "cards"
        } and any photos. It can't be undone.`}
      </p>
      {error ? (
        <p className="mt-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          disabled={busy}
          className="rounded-[14px] bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800 disabled:opacity-60"
          onClick={async () => {
            setBusy(true);
            setError("");
            try {
              await deleteAccount();
            } catch (deleteError) {
              console.error("Account deletion failed", deleteError);
              setError("Could not delete the account. Please try again.");
              setBusy(false);
            }
          }}
        >
          {busy ? "Deleting…" : "Delete permanently"}
        </button>
        <button
          type="button"
          className="rounded-[14px] px-4 py-2 text-sm text-outlyne-text hover:bg-outlyne-surface"
          onClick={() => setOpen(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export function MyCards() {
  const { session, loading } = useAuth();
  const [cards, setCards] = useState<SavedCard[] | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      setCards(await listCards());
    } catch (loadError) {
      console.error("Could not load cards", loadError);
      setError("Could not load your cards. Please refresh the page.");
    }
  }, []);

  useEffect(() => {
    if (!session) return;
    // Fetching on sign-in is a subscription to external data, not derived state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [session, load]);

  async function handleDelete(card: SavedCard) {
    try {
      await deleteCard(card);
      setCards((current) => current?.filter((item) => item.id !== card.id) ?? null);
    } catch (deleteError) {
      console.error("Delete failed", deleteError);
      setError("Could not delete that card. Please try again.");
    }
  }

  if (loading) {
    return <p className="py-16 text-center text-outlyne-muted">Loading…</p>;
  }

  if (!session) {
    return (
      <div className="mx-auto w-full max-w-md px-6 py-10">
        <div className="rounded-[28px] bg-outlyne-surface p-6 sm:p-8">
          <SignInForm onSignedIn={() => undefined} />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-8 sm:py-10">
      <h1 className="text-center text-[35px] font-medium leading-tight text-outlyne-text">
        My cards
      </h1>
      <p className="mt-2 text-center text-base text-outlyne-muted">
        {cards ? `${cards.length} of ${FREE_CARD_LIMIT} saved` : "Loading…"}
      </p>

      {error ? (
        <p className="mt-4 text-center text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      {cards && cards.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-5 text-center">
          <p className="max-w-sm text-outlyne-text">
            No saved cards yet. Make one, then choose Save to my cards on the preview.
          </p>
          <Link
            href="/generate"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "h-[52px] rounded-[20px] px-8 text-lg font-medium",
            )}
          >
            Make a card
          </Link>
        </div>
      ) : null}

      {cards && cards.length > 0 ? (
        <ul className="mt-8 grid grid-cols-2 justify-items-center gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4">
          {cards.map((card) => (
            <SavedCardTile key={card.id} card={card} onDelete={handleDelete} />
          ))}
        </ul>
      ) : null}

      <div className="mt-14 flex flex-col items-center gap-4 border-t border-outlyne-text/10 pt-8">
        <p className="text-sm text-outlyne-muted">Signed in as {session.user.email}</p>
        <button
          type="button"
          className={outlineButton}
          onClick={() => getBrowserSupabase().auth.signOut({ scope: "local" })}
        >
          Sign out
        </button>
        <DeleteAccount cardCount={cards?.length ?? 0} />
      </div>
    </div>
  );
}

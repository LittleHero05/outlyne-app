"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { ActivityForm } from "@/components/generate/activity-form";
import { ActivitySelect } from "@/components/generate/activity-select";
import { CustomizeStep } from "@/components/generate/customize-step";
import { GenerateHeader } from "@/components/generate/generate-header";
import { PreviewStep } from "@/components/generate/preview-step";
import { DEFAULT_OUTLINE_COLOR_ID, createEmptyDraft, rowToDraft, type ActivityDraft, type ActivityType, type CustomizeOptions, type GeneratorStep } from "@outlyne/core";
import { getCard } from "@/lib/cards";

const DEFAULT_CUSTOMIZE: CustomizeOptions = {
  outlineColorId: DEFAULT_OUTLINE_COLOR_ID,
};

export function GenerateFlow() {
  const [step, setStep] = useState<GeneratorStep>("select");
  const [draft, setDraft] = useState<ActivityDraft | null>(null);
  const [customize, setCustomize] =
    useState<CustomizeOptions>(DEFAULT_CUSTOMIZE);
  // Set when the draft came from My cards: it's already stored, and its photo
  // can be copied server-side instead of re-uploaded.
  const [alreadySaved, setAlreadySaved] = useState(false);
  const [savedPhotoPath, setSavedPhotoPath] = useState<string | null>(null);
  const [openError, setOpenError] = useState("");

  const router = useRouter();
  const params = useSearchParams();
  const cardId = params.get("card");
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!cardId || loading) return;
    if (!session) {
      router.replace(`/sign-in?next=${encodeURIComponent(`/generate?card=${cardId}`)}`);
      return;
    }
    let active = true;
    getCard(cardId).then((card) => {
      if (!active) return;
      router.replace("/generate");
      if (!card) {
        setOpenError("We couldn't open that card. It may have been deleted.");
        return;
      }
      setDraft(rowToDraft(card, card.photoUrl));
      setCustomize({ outlineColorId: card.outline_color });
      setSavedPhotoPath(card.photo_path);
      setAlreadySaved(true);
      setStep("preview");
    });
    return () => {
      active = false;
    };
  }, [cardId, loading, session, router]);

  function resetToSelect() {
    if (draft?.details.imagePreviewUrl) {
      URL.revokeObjectURL(draft.details.imagePreviewUrl);
    }
    setStep("select");
    setDraft(null);
    setCustomize(DEFAULT_CUSTOMIZE);
    setAlreadySaved(false);
    setSavedPhotoPath(null);
    setOpenError("");
  }

  function handleSelect(activity: ActivityType) {
    setDraft(createEmptyDraft(activity));
    setStep("details");
  }

  function handleBack() {
    // Any edit makes this a new card, which can be saved again.
    setAlreadySaved(false);
    if (step === "preview") {
      setStep("customize");
      return;
    }
    if (step === "customize") {
      setStep("details");
      return;
    }
    if (step === "details") {
      resetToSelect();
    }
  }

  const backLabel =
    step === "preview"
      ? "Customize"
      : step === "customize"
        ? "Edit details"
        : "Activities";

  return (
    <div className="flex min-h-screen flex-col bg-outlyne-blue">
      <GenerateHeader
        onBack={step !== "select" ? handleBack : undefined}
        backLabel={backLabel}
      />

      <main className="flex-1">
        {cardId && !draft ? (
          <p className="py-16 text-center text-outlyne-muted">Opening your card…</p>
        ) : step === "select" || !draft ? (
          <>
            {openError ? (
              <p className="px-6 pt-6 text-center text-sm text-red-700" role="alert">
                {openError}
              </p>
            ) : null}
            <ActivitySelect onSelect={handleSelect} />
          </>
        ) : step === "details" ? (
          <ActivityForm
            draft={draft}
            onChange={setDraft}
            onSubmit={() => setStep("customize")}
          />
        ) : step === "customize" ? (
          <CustomizeStep
            draft={draft}
            options={customize}
            onChange={setCustomize}
            onContinue={() => setStep("preview")}
          />
        ) : (
          <PreviewStep
            draft={draft}
            outlineColorId={customize.outlineColorId}
            onBack={() => {
              setAlreadySaved(false);
              setStep("customize");
            }}
            onRestart={resetToSelect}
            alreadySaved={alreadySaved}
            savedPhotoPath={savedPhotoPath}
            onSaved={() => setAlreadySaved(true)}
          />
        )}
      </main>
    </div>
  );
}

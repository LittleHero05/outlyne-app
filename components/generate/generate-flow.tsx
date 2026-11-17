"use client";

import { useState } from "react";
import { ActivityForm } from "@/components/generate/activity-form";
import { ActivitySelect } from "@/components/generate/activity-select";
import { CustomizeStep } from "@/components/generate/customize-step";
import { GenerateHeader } from "@/components/generate/generate-header";
import { PreviewStep } from "@/components/generate/preview-step";
import { DEFAULT_OUTLINE_COLOR_ID } from "@/lib/customize";
import {
  createEmptyDraft,
  type ActivityDraft,
  type ActivityType,
  type CustomizeOptions,
  type GeneratorStep,
} from "@/types";

const DEFAULT_CUSTOMIZE: CustomizeOptions = {
  outlineColorId: DEFAULT_OUTLINE_COLOR_ID,
};

export function GenerateFlow() {
  const [step, setStep] = useState<GeneratorStep>("select");
  const [draft, setDraft] = useState<ActivityDraft | null>(null);
  const [customize, setCustomize] =
    useState<CustomizeOptions>(DEFAULT_CUSTOMIZE);

  function resetToSelect() {
    if (draft?.details.imagePreviewUrl) {
      URL.revokeObjectURL(draft.details.imagePreviewUrl);
    }
    setStep("select");
    setDraft(null);
    setCustomize(DEFAULT_CUSTOMIZE);
  }

  function handleSelect(activity: ActivityType) {
    setDraft(createEmptyDraft(activity));
    setStep("details");
  }

  function handleBack() {
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
        {step === "select" || !draft ? (
          <ActivitySelect onSelect={handleSelect} />
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
            onBack={() => setStep("customize")}
            onRestart={resetToSelect}
          />
        )}
      </main>
    </div>
  );
}

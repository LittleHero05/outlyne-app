"use client";

import { useState } from "react";
import { ActivitySelect } from "@/components/generate/activity-select";
import { ComingSoonActivity } from "@/components/generate/coming-soon-activity";
import { CustomizeStep } from "@/components/generate/customize-step";
import { GenerateHeader } from "@/components/generate/generate-header";
import { PreviewStep } from "@/components/generate/preview-step";
import { ReadingForm } from "@/components/generate/reading-form";
import { DEFAULT_OUTLINE_COLOR_ID } from "@/lib/customize";
import {
  EMPTY_READING_DETAILS,
  type ActivityType,
  type CustomizeOptions,
  type GeneratorStep,
  type ReadingDetails,
} from "@/types";

const DEFAULT_CUSTOMIZE: CustomizeOptions = {
  outlineColorId: DEFAULT_OUTLINE_COLOR_ID,
};

export function GenerateFlow() {
  const [step, setStep] = useState<GeneratorStep>("select");
  const [activity, setActivity] = useState<ActivityType | null>(null);
  const [readingDetails, setReadingDetails] = useState<ReadingDetails>(
    EMPTY_READING_DETAILS,
  );
  const [customize, setCustomize] =
    useState<CustomizeOptions>(DEFAULT_CUSTOMIZE);

  function resetToSelect() {
    if (readingDetails.imagePreviewUrl) {
      URL.revokeObjectURL(readingDetails.imagePreviewUrl);
    }
    setStep("select");
    setActivity(null);
    setReadingDetails(EMPTY_READING_DETAILS);
    setCustomize(DEFAULT_CUSTOMIZE);
  }

  function handleSelect(nextActivity: ActivityType) {
    setActivity(nextActivity);
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
        {step === "select" ? (
          <ActivitySelect onSelect={handleSelect} />
        ) : null}

        {step === "details" && activity === "reading" ? (
          <ReadingForm
            values={readingDetails}
            onChange={setReadingDetails}
            onSubmit={() => setStep("customize")}
          />
        ) : null}

        {step === "details" && activity && activity !== "reading" ? (
          <ComingSoonActivity activity={activity} onBack={resetToSelect} />
        ) : null}

        {step === "customize" ? (
          <CustomizeStep
            details={readingDetails}
            options={customize}
            onChange={setCustomize}
            onContinue={() => setStep("preview")}
          />
        ) : null}

        {step === "preview" ? (
          <PreviewStep
            details={readingDetails}
            outlineColorId={customize.outlineColorId}
            onBack={() => setStep("customize")}
            onRestart={resetToSelect}
          />
        ) : null}
      </main>
    </div>
  );
}

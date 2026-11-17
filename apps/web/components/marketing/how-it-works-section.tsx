"use client";

import { useEffect, useId, useState } from "react";
import { Heart, MessageCircle, Send } from "lucide-react";
import { ActivityCard } from "@/components/generate/activity-card";
import { ActivityIcon } from "@/components/icons/activity-icon";
import {
  ACTIVITY_TILES,
  HOW_IT_WORKS_STEPS,
  SHOWCASE_DRAFTS,
  type HowItWorksStepId,
} from "@/lib/showcase-data";
import { cn } from "@/lib/utils";
import type { ActivityType } from "@outlyne/core";

const AUTO_ADVANCE_MS = 4000;
const SAMPLE_DRAFT = SHOWCASE_DRAFTS[0];

function StepButton({
  number,
  title,
  active,
  id,
  controls,
  onSelect,
}: {
  number: string;
  title: string;
  active: boolean;
  id: string;
  controls: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      id={id}
      aria-selected={active}
      aria-controls={controls}
      tabIndex={active ? 0 : -1}
      onClick={onSelect}
      onFocus={onSelect}
      className={cn(
        "flex w-full items-center gap-5 rounded-[38px] p-5 text-left transition-[transform,box-shadow,background-color] sm:gap-6 sm:p-6",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-outlyne-maroon focus-visible:ring-offset-2 focus-visible:ring-offset-outlyne-surface",
        active
          ? "bg-white shadow-[4px_4px_0_#6b2239]"
          : "bg-white/60 hover:bg-white motion-safe:hover:-translate-y-0.5",
      )}
    >
      <span
        className={cn(
          "flex size-16 shrink-0 items-center justify-center rounded-full border-2 bg-white text-2xl font-semibold sm:size-20 sm:text-3xl",
          active
            ? "border-outlyne-maroon text-outlyne-maroon"
            : "border-outlyne-text/10 text-outlyne-text",
        )}
        aria-hidden
      >
        {number}
      </span>
      <span className="text-xl font-medium text-outlyne-text sm:text-2xl lg:text-[30px]">
        {title}
      </span>
    </button>
  );
}

function ActivityTile({ name, label, highlighted }: { name: ActivityType; label: string; highlighted?: boolean }) {
  return (
    <div
      className={cn(
        "flex aspect-[135/165] flex-col items-center justify-center rounded-[22px] bg-white px-3 py-4 shadow-[0_4px_4px_rgba(0,0,0,0.15)]",
        highlighted && "ring-2 ring-outlyne-maroon ring-offset-2 ring-offset-outlyne-blue",
      )}
    >
      <ActivityIcon name={name} className="mb-2 h-12 w-12" />
      <p className="text-center text-sm font-medium text-outlyne-text sm:text-base">
        {label}
      </p>
    </div>
  );
}

function MockField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-sm font-medium text-outlyne-text">{label}</p>
      <div className="flex h-11 items-center rounded-[16px] bg-white px-4 text-sm text-outlyne-text">
        {value}
      </div>
    </div>
  );
}

const CARD_WIDTH = 320;
const CARD_SCALE = 0.68;
const CARD_HEIGHT = (CARD_WIDTH * 16) / 9;

/** Render the real card at generator size, then scale it to fit the mockup. */
function ScaledCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn("relative mx-auto overflow-hidden rounded-[24px]", className)}
      style={{ width: CARD_WIDTH * CARD_SCALE, height: CARD_HEIGHT * CARD_SCALE }}
    >
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{ width: CARD_WIDTH, height: CARD_HEIGHT, transform: `scale(${CARD_SCALE})` }}
      >
        {children}
      </div>
    </div>
  );
}

const CHECKERBOARD =
  "bg-[linear-gradient(45deg,#d7e8f8_25%,transparent_25%,transparent_75%,#d7e8f8_75%),linear-gradient(45deg,#d7e8f8_25%,transparent_25%,transparent_75%,#d7e8f8_75%)] bg-[length:16px_16px] bg-[position:0_0,8px_8px]";

function StepMockup({ step }: { step: HowItWorksStepId }) {
  switch (step) {
    case "choose":
      return (
        <>
          <h3 className="text-center text-xl font-medium text-outlyne-text">
            Select Activity Type
          </h3>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {ACTIVITY_TILES.map((tile, index) => (
              <ActivityTile
                key={tile.label}
                label={tile.label}
                name={tile.id}
                highlighted={index === 0}
              />
            ))}
          </div>
        </>
      );
    case "input":
      return (
        <>
          <h3 className="text-center text-xl font-medium text-outlyne-text">
            Reading
          </h3>
          <div className="mt-5 space-y-3">
            <MockField label="Title" value={SAMPLE_DRAFT.details.title} />
            <MockField label="Pages read" value="101" />
            <MockField label="Time" value="1hr 03min" />
            <MockField label="Rating" value="4.5" />
          </div>
          <div className="mt-5 flex justify-center">
            <span className="rounded-[16px] bg-outlyne-maroon px-6 py-2.5 text-base font-medium text-white">
              Generate
            </span>
          </div>
        </>
      );
    case "generate":
      return (
        <>
          <h3 className="text-center text-xl font-medium text-outlyne-text">
            Your overlay
          </h3>
          <ScaledCard className={cn("mt-5", CHECKERBOARD)}>
            <ActivityCard draft={SAMPLE_DRAFT} outlineColorId="maroon" />
          </ScaledCard>
          <div className="mt-5 flex justify-center">
            <span className="rounded-[16px] bg-outlyne-maroon px-6 py-2.5 text-base font-medium text-white">
              Download
            </span>
          </div>
        </>
      );
    case "share":
      return (
        <>
          <h3 className="text-center text-xl font-medium text-outlyne-text">
            Add to your Story
          </h3>
          <ScaledCard className="mt-5 bg-[url(/showcase/card-bg.jpg)] bg-cover bg-center shadow-lg">
            <div className="absolute inset-0 bg-black/15" aria-hidden />
            <ActivityCard
              draft={SAMPLE_DRAFT}
              outlineColorId="white"
              className="absolute inset-0 h-full"
            />
          </ScaledCard>
          <div className="mt-5 flex items-center justify-center gap-4 text-outlyne-text" aria-hidden>
            <Heart className="size-6" />
            <Send className="size-6" />
            <MessageCircle className="size-6" />
          </div>
        </>
      );
  }
}

export function HowItWorksSection() {
  const [activeId, setActiveId] = useState<HowItWorksStepId>("choose");
  const [paused, setPaused] = useState(false);
  const baseId = useId();

  // Auto-advance through the steps until the visitor interacts.
  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      setActiveId((current) => {
        const index = HOW_IT_WORKS_STEPS.findIndex((s) => s.id === current);
        return HOW_IT_WORKS_STEPS[(index + 1) % HOW_IT_WORKS_STEPS.length].id;
      });
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(timer);
  }, [paused]);

  function select(id: HowItWorksStepId) {
    setPaused(true);
    setActiveId(id);
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    const index = HOW_IT_WORKS_STEPS.findIndex((s) => s.id === activeId);
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      select(HOW_IT_WORKS_STEPS[(index + 1) % HOW_IT_WORKS_STEPS.length].id);
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      select(
        HOW_IT_WORKS_STEPS[
          (index - 1 + HOW_IT_WORKS_STEPS.length) % HOW_IT_WORKS_STEPS.length
        ].id,
      );
    }
  }

  const panelId = `${baseId}-panel`;

  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 bg-outlyne-surface pb-12 pt-16 lg:pb-16 lg:pt-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <h2 className="text-center text-3xl font-bold text-outlyne-text sm:text-4xl lg:text-[45px]">
          How it works
        </h2>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-12">
          <div
            role="tablist"
            aria-label="How it works steps"
            aria-orientation="vertical"
            className="flex flex-col gap-4"
            onKeyDown={handleKeyDown}
          >
            {HOW_IT_WORKS_STEPS.map((step) => (
              <StepButton
                key={step.id}
                id={`${baseId}-tab-${step.id}`}
                controls={panelId}
                number={step.number}
                title={step.title}
                active={step.id === activeId}
                onSelect={() => select(step.id)}
              />
            ))}
          </div>

          <div
            id={panelId}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${activeId}`}
            onMouseEnter={() => setPaused(true)}
            className="order-first mx-auto w-full max-w-sm rounded-[33px] border-2 border-outlyne-text bg-outlyne-blue p-6 lg:order-none lg:sticky lg:top-28 lg:max-w-none"
          >
            <div key={activeId} className="motion-safe:animate-in motion-safe:fade-in motion-safe:duration-300">
              <StepMockup step={activeId} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

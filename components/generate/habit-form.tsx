"use client";

import { useId } from "react";
import {
  ChoiceChip,
  Field,
  FormShell,
  ImageField,
  fieldClassName,
} from "@/components/generate/form-primitives";
import { Input } from "@/components/ui/input";
import type { HabitDetails, HabitMode } from "@/types";

type HabitFormProps = {
  values: HabitDetails;
  onChange: (values: HabitDetails) => void;
  onSubmit: () => void;
};

const MODES: { id: HabitMode; label: string }[] = [
  { id: "complete", label: "Completed today" },
  { id: "minutes", label: "Minutes today" },
];

export function HabitForm({ values, onChange, onSubmit }: HabitFormProps) {
  const titleId = useId();
  const daysId = useId();
  const minutesId = useId();
  const modeId = useId();

  function update(partial: Partial<HabitDetails>) {
    onChange({ ...values, ...partial });
  }

  return (
    <FormShell title="Habit" onSubmit={onSubmit}>
      <Field label="Habit" htmlFor={titleId}>
        <Input
          id={titleId}
          name="title"
          required
          autoComplete="off"
          placeholder="e.g. Morning walk"
          value={values.title}
          onChange={(event) => update({ title: event.target.value })}
          className={fieldClassName}
        />
      </Field>

      <Field label="Days so far" htmlFor={daysId}>
        <Input
          id={daysId}
          name="days"
          type="number"
          inputMode="numeric"
          min={0}
          required
          placeholder="e.g. 14"
          value={values.days}
          onChange={(event) => update({ days: event.target.value })}
          className={fieldClassName}
        />
      </Field>

      <div>
        <p id={modeId} className="mb-2 text-[22px] font-medium text-outlyne-text">
          Today
        </p>
        <div
          role="radiogroup"
          aria-labelledby={modeId}
          className="flex flex-wrap gap-2"
        >
          {MODES.map((mode) => (
            <ChoiceChip
              key={mode.id}
              role="radio"
              label={mode.label}
              selected={values.mode === mode.id}
              onToggle={() => update({ mode: mode.id })}
            />
          ))}
        </div>
      </div>

      {values.mode === "minutes" ? (
        <Field label="Minutes" htmlFor={minutesId}>
          <Input
            id={minutesId}
            name="minutes"
            type="number"
            inputMode="numeric"
            min={0}
            required
            placeholder="e.g. 32"
            value={values.minutes}
            onChange={(event) => update({ minutes: event.target.value })}
            className={fieldClassName}
          />
        </Field>
      ) : null}

      <ImageField
        imagePreviewUrl={values.imagePreviewUrl}
        onChange={(imagePreviewUrl) => update({ imagePreviewUrl })}
      />
    </FormShell>
  );
}

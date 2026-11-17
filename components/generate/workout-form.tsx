"use client";

import { useId } from "react";
import { BodyMap } from "@/components/generate/body-map";
import {
  ChoiceChip,
  Field,
  FormShell,
  ImageField,
  fieldClassName,
} from "@/components/generate/form-primitives";
import { Input } from "@/components/ui/input";
import { COLORS } from "@/lib/constants";
import { MUSCLE_GROUPS, type MuscleGroupId } from "@/lib/muscles";
import type { WorkoutDetails } from "@/types";

type WorkoutFormProps = {
  values: WorkoutDetails;
  onChange: (values: WorkoutDetails) => void;
  onSubmit: () => void;
};

export function WorkoutForm({ values, onChange, onSubmit }: WorkoutFormProps) {
  const titleId = useId();
  const setsId = useId();
  const musclesId = useId();

  function update(partial: Partial<WorkoutDetails>) {
    onChange({ ...values, ...partial });
  }

  function toggleMuscle(id: MuscleGroupId) {
    const muscles = values.muscles.includes(id)
      ? values.muscles.filter((m) => m !== id)
      : [...values.muscles, id];
    update({ muscles });
  }

  return (
    <FormShell title="Workout" onSubmit={onSubmit}>
      <Field label="Title" htmlFor={titleId}>
        <Input
          id={titleId}
          name="title"
          required
          autoComplete="off"
          placeholder="e.g. Push Day"
          value={values.title}
          onChange={(event) => update({ title: event.target.value })}
          className={fieldClassName}
        />
      </Field>

      <Field label="Total sets" htmlFor={setsId}>
        <Input
          id={setsId}
          name="sets"
          type="number"
          inputMode="numeric"
          min={0}
          required
          placeholder="e.g. 24"
          value={values.sets}
          onChange={(event) => update({ sets: event.target.value })}
          className={fieldClassName}
        />
      </Field>

      <div>
        <p id={musclesId} className="mb-2 text-[22px] font-medium text-outlyne-text">
          Muscles worked
        </p>
        <div className="rounded-[27px] bg-outlyne-surface/80 p-5">
          <BodyMap
            selected={values.muscles}
            color={COLORS.accentMaroon}
            className="h-[170px]"
          />
          <div
            role="group"
            aria-labelledby={musclesId}
            className="mt-5 flex flex-wrap justify-center gap-2"
          >
            {MUSCLE_GROUPS.map((group) => (
              <ChoiceChip
                key={group.id}
                label={group.label}
                selected={values.muscles.includes(group.id)}
                onToggle={() => toggleMuscle(group.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <ImageField
        imagePreviewUrl={values.imagePreviewUrl}
        onChange={(imagePreviewUrl) => update({ imagePreviewUrl })}
      />
    </FormShell>
  );
}

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
import type { RecipeDetails, RecipeSource } from "@outlyne/core";

const SOURCES: { id: RecipeSource; label: string }[] = [
  { id: "homemade", label: "Homemade" },
  { id: "author", label: "By someone else" },
];

type RecipeFormProps = {
  values: RecipeDetails;
  onChange: (values: RecipeDetails) => void;
  onSubmit: () => void;
};

export function RecipeForm({ values, onChange, onSubmit }: RecipeFormProps) {
  const titleId = useId();
  const cookTimeId = useId();
  const servingsId = useId();
  const ratingId = useId();
  const sourceId = useId();
  const authorId = useId();

  function update(partial: Partial<RecipeDetails>) {
    onChange({ ...values, ...partial });
  }

  return (
    <FormShell title="Recipe" onSubmit={onSubmit}>
      <Field label="Title" htmlFor={titleId}>
        <Input
          id={titleId}
          name="title"
          required
          autoComplete="off"
          placeholder="e.g. Lemon pasta"
          value={values.title}
          onChange={(event) => update({ title: event.target.value })}
          className={fieldClassName}
        />
      </Field>

      <div>
        <p id={sourceId} className="mb-2 text-[22px] font-medium text-outlyne-text">
          Recipe by
        </p>
        <div
          role="radiogroup"
          aria-labelledby={sourceId}
          className="flex flex-wrap gap-2"
        >
          {SOURCES.map((source) => (
            <ChoiceChip
              key={source.id}
              role="radio"
              label={source.label}
              selected={values.source === source.id}
              onToggle={() => update({ source: source.id })}
            />
          ))}
        </div>
      </div>

      {values.source === "author" ? (
        <Field label="Author" htmlFor={authorId}>
          <Input
            id={authorId}
            name="author"
            required
            autoComplete="off"
            placeholder="e.g. Ina Garten or @handle"
            value={values.author}
            onChange={(event) => update({ author: event.target.value })}
            className={fieldClassName}
          />
        </Field>
      ) : null}

      <Field label="Cook time" htmlFor={cookTimeId}>
        <Input
          id={cookTimeId}
          name="cookTime"
          required
          placeholder="e.g. 45 min"
          value={values.cookTime}
          onChange={(event) => update({ cookTime: event.target.value })}
          className={fieldClassName}
        />
      </Field>

      <Field label="Servings" htmlFor={servingsId}>
        <Input
          id={servingsId}
          name="servings"
          type="number"
          inputMode="numeric"
          min={1}
          required
          placeholder="e.g. 4"
          value={values.servings}
          onChange={(event) => update({ servings: event.target.value })}
          className={fieldClassName}
        />
      </Field>

      <Field label="Rating (optional)" htmlFor={ratingId}>
        <Input
          id={ratingId}
          name="rating"
          placeholder="e.g. 4.5"
          value={values.rating}
          onChange={(event) => update({ rating: event.target.value })}
          className={fieldClassName}
        />
      </Field>

      <ImageField
        imagePreviewUrl={values.imagePreviewUrl}
        onChange={(imagePreviewUrl) => update({ imagePreviewUrl })}
      />
    </FormShell>
  );
}

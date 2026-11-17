"use client";

import { useId } from "react";
import {
  Field,
  FormShell,
  ImageField,
  fieldClassName,
} from "@/components/generate/form-primitives";
import { Input } from "@/components/ui/input";
import type { ReadingDetails } from "@/types";

type ReadingFormProps = {
  values: ReadingDetails;
  onChange: (values: ReadingDetails) => void;
  onSubmit: () => void;
};

export function ReadingForm({ values, onChange, onSubmit }: ReadingFormProps) {
  const titleId = useId();
  const pagesId = useId();
  const timeId = useId();
  const ratingId = useId();

  function update(partial: Partial<ReadingDetails>) {
    onChange({ ...values, ...partial });
  }

  return (
    <FormShell title="Reading" onSubmit={onSubmit}>
      <Field label="Title" htmlFor={titleId}>
        <Input
          id={titleId}
          name="title"
          required
          autoComplete="off"
          placeholder="Book title"
          value={values.title}
          onChange={(event) => update({ title: event.target.value })}
          className={fieldClassName}
        />
      </Field>

      <Field label="Pages read" htmlFor={pagesId}>
        <Input
          id={pagesId}
          name="pagesRead"
          type="number"
          inputMode="numeric"
          min={0}
          required
          placeholder="e.g. 42"
          value={values.pagesRead}
          onChange={(event) => update({ pagesRead: event.target.value })}
          className={fieldClassName}
        />
      </Field>

      <Field label="Time" htmlFor={timeId}>
        <Input
          id={timeId}
          name="time"
          required
          placeholder="e.g. 1hr 03min"
          value={values.time}
          onChange={(event) => update({ time: event.target.value })}
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

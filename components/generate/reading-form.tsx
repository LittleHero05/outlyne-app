"use client";

import { FormEvent, type ReactNode, useId, useRef } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ReadingDetails } from "@/types";
import { cn } from "@/lib/utils";

type ReadingFormProps = {
  values: ReadingDetails;
  onChange: (values: ReadingDetails) => void;
  onSubmit: () => void;
};

const fieldClassName =
  "h-[67px] rounded-[27px] border-0 bg-outlyne-surface/80 px-5 text-lg text-outlyne-text placeholder:text-outlyne-muted focus-visible:ring-outlyne-maroon md:text-lg";

export function ReadingForm({ values, onChange, onSubmit }: ReadingFormProps) {
  const titleId = useId();
  const pagesId = useId();
  const timeId = useId();
  const ratingId = useId();
  const imageId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function update(partial: Partial<ReadingDetails>) {
    onChange({ ...values, ...partial });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  function handleImageChange(file: File | null) {
    if (values.imagePreviewUrl) {
      URL.revokeObjectURL(values.imagePreviewUrl);
    }

    if (!file) {
      update({ imagePreviewUrl: null });
      return;
    }

    update({ imagePreviewUrl: URL.createObjectURL(file) });
  }

  return (
    <div className="mx-auto w-full max-w-md px-6 py-8 sm:py-10">
      <h1 className="text-center text-[35px] font-medium leading-tight text-outlyne-text">
        Reading
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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

        <Field label="Upload Image" htmlFor={imageId}>
          <input
            ref={fileInputRef}
            id={imageId}
            name="image"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) =>
              handleImageChange(event.target.files?.[0] ?? null)
            }
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              fieldClassName,
              "flex w-full items-center text-left transition-opacity hover:opacity-90",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-outlyne-maroon",
            )}
          >
            <span
              className={
                values.imagePreviewUrl
                  ? "text-outlyne-text"
                  : "text-outlyne-muted"
              }
            >
              {values.imagePreviewUrl ? "Image selected" : "Choose a photo (optional)"}
            </span>
          </button>
          {values.imagePreviewUrl ? (
            <p className="mt-2 text-sm text-outlyne-muted">
              Photo will appear behind your overlay stats.
            </p>
          ) : null}
        </Field>

        <div className="flex justify-center pt-4">
          <button
            type="submit"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "h-[63px] min-w-[182px] rounded-[20px] px-8 text-[22px] font-medium",
            )}
          >
            Generate
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-[22px] font-medium text-outlyne-text"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

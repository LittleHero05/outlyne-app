"use client";

import { FormEvent, type ReactNode, useId, useRef } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const fieldClassName =
  "h-[67px] rounded-[27px] border-0 bg-outlyne-surface/80 px-5 text-lg text-outlyne-text placeholder:text-outlyne-muted focus-visible:ring-outlyne-maroon md:text-lg";

export function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
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
      {hint ? <p className="mt-2 text-sm text-outlyne-muted">{hint}</p> : null}
    </div>
  );
}

export function FormShell({
  title,
  onSubmit,
  children,
}: {
  title: string;
  onSubmit: () => void;
  children: ReactNode;
}) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <div className="mx-auto w-full max-w-md px-6 py-8 sm:py-10">
      <h1 className="text-center text-[35px] font-medium leading-tight text-outlyne-text">
        {title}
      </h1>
      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {children}
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

type ImageFieldProps = {
  imagePreviewUrl: string | null;
  onChange: (imagePreviewUrl: string | null) => void;
};

/** Optional background photo. Revokes the previous object URL on change. */
export function ImageField({ imagePreviewUrl, onChange }: ImageFieldProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File | null) {
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    onChange(file ? URL.createObjectURL(file) : null);
  }

  return (
    <Field
      label="Upload Image"
      htmlFor={id}
      hint={imagePreviewUrl ? "Photo will appear behind your overlay stats." : undefined}
    >
      <input
        ref={inputRef}
        id={id}
        name="image"
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => handleFile(event.target.files?.[0] ?? null)}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn(
          fieldClassName,
          "flex w-full items-center text-left transition-opacity hover:opacity-90",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-outlyne-maroon",
        )}
      >
        <span className={imagePreviewUrl ? "text-outlyne-text" : "text-outlyne-muted"}>
          {imagePreviewUrl ? "Image selected" : "Choose a photo (optional)"}
        </span>
      </button>
    </Field>
  );
}

type ChoiceChipProps = {
  label: string;
  selected: boolean;
  onToggle: () => void;
  role?: "checkbox" | "radio";
};

/** Pill toggle used for muscle groups and the habit mode switch. */
export function ChoiceChip({
  label,
  selected,
  onToggle,
  role = "checkbox",
}: ChoiceChipProps) {
  return (
    <button
      type="button"
      role={role}
      aria-checked={selected}
      onClick={onToggle}
      className={cn(
        "inline-flex min-h-11 items-center rounded-full px-4 py-2 text-base font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-outlyne-maroon focus-visible:ring-offset-2 focus-visible:ring-offset-outlyne-blue",
        selected
          ? "bg-outlyne-maroon text-white"
          : "bg-outlyne-surface/80 text-outlyne-text hover:bg-outlyne-surface",
      )}
    >
      {label}
    </button>
  );
}

import type { OutlineColorId } from "@/lib/customize";

export type ActivityType = "reading" | "workout" | "habit" | "recipe";

export type GeneratorStep = "select" | "details" | "customize" | "preview";

export type ReadingDetails = {
  title: string;
  pagesRead: string;
  time: string;
  rating: string;
  imagePreviewUrl: string | null;
};

export const EMPTY_READING_DETAILS: ReadingDetails = {
  title: "",
  pagesRead: "",
  time: "",
  rating: "",
  imagePreviewUrl: null,
};

export type CustomizeOptions = {
  outlineColorId: OutlineColorId;
};

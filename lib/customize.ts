export type OutlineColorId =
  | "maroon"
  | "ink"
  | "white"
  | "cloud"
  | "sky"
  | "slate";

export type OutlineColor = {
  id: OutlineColorId;
  hex: string;
  label: string;
  /** Border ring on the swatch so pale colors stay visible */
  swatchBorder?: string;
};

/** MVP presets — lock to Figma tokens when customize screen is designed */
export const OUTLINE_COLORS: OutlineColor[] = [
  { id: "maroon", hex: "#6B2239", label: "Maroon" },
  { id: "ink", hex: "#110229", label: "Ink" },
  { id: "white", hex: "#FFFFFF", label: "White", swatchBorder: "#110229" },
  { id: "cloud", hex: "#EFEFEE", label: "Cloud", swatchBorder: "#110229" },
  { id: "sky", hex: "#B7D9FF", label: "Sky", swatchBorder: "#110229" },
  { id: "slate", hex: "#8F90A6", label: "Slate" },
];

export const DEFAULT_OUTLINE_COLOR_ID: OutlineColorId = "maroon";

export function getOutlineColor(id: OutlineColorId): OutlineColor {
  return (
    OUTLINE_COLORS.find((color) => color.id === id) ?? OUTLINE_COLORS[0]
  );
}

/** Single export size — Story. Users can overlay onto carousel posts themselves. */
export const STORY_EXPORT = {
  label: "Story",
  cssRatio: "9 / 16",
  width: 1080,
  height: 1920,
} as const;

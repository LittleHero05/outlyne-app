import type { MuscleGroupId } from "./muscles";
import type { Shape } from "./shapes";

export const BODY_VIEW = { width: 120, height: 250 } as const;

/** Opacity of the grey figure, an unselected region, and a selected one. */
export const BODY_OPACITY = { silhouette: 0.28, idle: 0.14, active: 1 } as const;

/** Head, neck, torso, and stroke-drawn limbs. Same for front and back. */
export const BODY_SILHOUETTE: Shape[] = [
  { kind: "circle", cx: 60, cy: 20, r: 13 },
  { kind: "rect", x: 54, y: 31, width: 12, height: 11 },
  { kind: "path", d: "M32 44 Q60 37 88 44 L85 90 Q85 100 83 118 Q60 127 37 118 Q35 100 35 90 Z" },
  { kind: "stroke", d: "M34 50 L20 96 L14 142", strokeWidth: 13, linecap: "round" },
  { kind: "stroke", d: "M86 50 L100 96 L106 142", strokeWidth: 13, linecap: "round" },
  { kind: "stroke", d: "M48 122 L44 180 L42 236", strokeWidth: 18, linecap: "round" },
  { kind: "stroke", d: "M72 122 L76 180 L78 236", strokeWidth: 18, linecap: "round" },
];

const shoulders: Shape[] = [
  { kind: "circle", cx: 34, cy: 52, r: 8 },
  { kind: "circle", cx: 86, cy: 52, r: 8 },
];
const upperArms: Shape[] = [
  { kind: "ellipse", cx: 27, cy: 76, rx: 5, ry: 13, rotate: 16 },
  { kind: "ellipse", cx: 93, cy: 76, rx: 5, ry: 13, rotate: -16 },
];
const forearms: Shape[] = [
  { kind: "ellipse", cx: 17, cy: 120, rx: 4.5, ry: 16, rotate: 8 },
  { kind: "ellipse", cx: 103, cy: 120, rx: 4.5, ry: 16, rotate: -8 },
];

export type BodySide = "front" | "back";

/** Muscle regions per side. A group missing from a side is not drawn there. */
export const BODY_REGIONS: Record<BodySide, Partial<Record<MuscleGroupId, Shape[]>>> = {
  front: {
    chest: [
      { kind: "ellipse", cx: 47, cy: 62, rx: 12, ry: 8 },
      { kind: "ellipse", cx: 73, cy: 62, rx: 12, ry: 8 },
    ],
    shoulders,
    biceps: upperArms,
    forearms,
    core: [
      { kind: "rect", x: 51, y: 73, width: 18, height: 40, rx: 5 },
      { kind: "path", d: "M40 80 L48 77 L48 112 L42 110 Z" },
      { kind: "path", d: "M80 80 L72 77 L72 112 L78 110 Z" },
    ],
    quads: [
      { kind: "ellipse", cx: 47, cy: 152, rx: 8, ry: 26 },
      { kind: "ellipse", cx: 73, cy: 152, rx: 8, ry: 26 },
    ],
    calves: [
      { kind: "ellipse", cx: 43, cy: 212, rx: 4, ry: 15 },
      { kind: "ellipse", cx: 77, cy: 212, rx: 4, ry: 15 },
    ],
  },
  back: {
    back: [
      { kind: "path", d: "M44 44 L60 38 L76 44 L68 62 L52 62 Z" },
      { kind: "path", d: "M38 63 L82 63 L78 96 L60 104 L42 96 Z" },
    ],
    shoulders,
    triceps: upperArms,
    forearms,
    core: [{ kind: "rect", x: 52, y: 99, width: 16, height: 16, rx: 4 }],
    glutes: [
      { kind: "ellipse", cx: 49, cy: 127, rx: 10, ry: 9 },
      { kind: "ellipse", cx: 71, cy: 127, rx: 10, ry: 9 },
    ],
    hamstrings: [
      { kind: "ellipse", cx: 46, cy: 166, rx: 8, ry: 24 },
      { kind: "ellipse", cx: 74, cy: 166, rx: 8, ry: 24 },
    ],
    calves: [
      { kind: "ellipse", cx: 43, cy: 212, rx: 6, ry: 17 },
      { kind: "ellipse", cx: 77, cy: 212, rx: 6, ry: 17 },
    ],
  },
};

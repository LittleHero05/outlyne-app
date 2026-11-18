import { previewBackdrop, type OutlineColorId } from "@outlyne/core";
import type { CSSProperties } from "react";

/** Checkerboard behind transparent previews; dark for pale outline colors. */
export function checkerboardStyle(id: OutlineColorId, cell = 20): CSSProperties {
  const { base, check } = previewBackdrop(id);
  const tile = `linear-gradient(45deg, ${check} 25%, transparent 25%, transparent 75%, ${check} 75%)`;
  return {
    backgroundColor: base,
    backgroundImage: `${tile}, ${tile}`,
    backgroundSize: `${cell}px ${cell}px`,
    backgroundPosition: `0 0, ${cell / 2}px ${cell / 2}px`,
  };
}

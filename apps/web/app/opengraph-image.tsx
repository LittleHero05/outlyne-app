import { ImageResponse } from "next/og";
import { COLORS, ICON_SHAPES } from "@outlyne/core";

export const alt = "Outlyne: running overlays, but for everything else";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const HEADLINE = "Running overlays, but for everything else";
const SUBLINE = "Story-ready cards for reading, workouts, habits and recipes.";

/**
 * Inter at one weight, subset to the given text, from Google Fonts (the same
 * source next/font uses for the site). Returns null offline so the image still
 * renders with the default font.
 */
async function loadInter(weight: 400 | 800, text: string): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Inter:wght@${weight}&text=${encodeURIComponent(text)}`,
    ).then((response) => response.text());
    const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((response) => response.arrayBuffer());
  } catch {
    return null;
  }
}

/** Link preview for shares on Instagram, iMessage, X and the like. */
export default async function OpengraphImage() {
  const [bold, regular] = await Promise.all([loadInter(800, HEADLINE), loadInter(400, SUBLINE)]);
  const fonts = [
    ...(bold ? [{ name: "InterBold", data: bold, weight: 800 as const, style: "normal" as const }] : []),
    ...(regular ? [{ name: "InterRegular", data: regular, weight: 400 as const, style: "normal" as const }] : []),
  ];
  const logo = ICON_SHAPES.logo;
  const logoPath = logo.shapes[0].kind === "path" ? logo.shapes[0].d : "";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "80px 96px",
          background: COLORS.surfaceOffWhite,
          borderBottom: `24px solid ${COLORS.backgroundBlue}`,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 760 }}>
          <div
            style={{
              fontSize: 84,
              fontWeight: 800,
              lineHeight: 1.02,
              color: COLORS.accentMaroon,
              letterSpacing: -2,
              fontFamily: bold ? "InterBold" : undefined,
            }}
          >
            {HEADLINE}
          </div>
          <div
            style={{
              marginTop: 32,
              fontSize: 34,
              color: COLORS.textPrimary,
              fontFamily: regular ? "InterRegular" : undefined,
            }}
          >
            {SUBLINE}
          </div>
        </div>
        <svg width="260" height="260" viewBox={`0 0 ${logo.width} ${logo.height}`}>
          <path d={logoPath} fill={COLORS.accentMaroon} fillRule="evenodd" />
        </svg>
      </div>
    ),
    {
      ...size,
      fonts: fonts.length ? fonts : undefined,
    },
  );
}

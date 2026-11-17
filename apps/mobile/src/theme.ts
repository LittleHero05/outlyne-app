import { COLORS } from "@outlyne/core";

/** Brand tokens come from @outlyne/core so web and native stay in sync. */
export const theme = {
  colors: {
    blue: COLORS.backgroundBlue,
    maroon: COLORS.accentMaroon,
    surface: COLORS.surfaceOffWhite,
    text: COLORS.textPrimary,
    muted: COLORS.textMuted,
    white: "#ffffff",
  },
  radius: { sm: 14, md: 20, lg: 27, xl: 40 },
  space: { xs: 6, sm: 10, md: 16, lg: 24, xl: 32 },
} as const;

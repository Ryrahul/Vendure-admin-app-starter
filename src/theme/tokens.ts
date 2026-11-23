/**
 * Vendure design tokens for React Native / Expo.
 *
 * Generated from the Vendure design system (single source of truth, also consumed
 * by the Vendure web dashboard via @vendure-io/design-tokens ^2.0.0):
 *   https://github.com/vendurehq/design  (commit 5375f89, 2026-11-22)
 *   https://github.com/vendurehq/vendure packages/dashboard (commit 3482d08)
 *
 * All colors were authored in OKLCH and converted to sRGB hex (OKLab -> linear sRGB
 * -> gamma; out-of-gamut channels clipped per-channel, matching what browsers render
 * on sRGB displays). Translucent tokens (CSS `color-mix(in oklab, X p%, transparent)`)
 * are emitted as 8-digit #RRGGBBAA, which React Native supports and which composites
 * identically to the web.
 *
 * IMPORTANT design rules (skills/vendure-tokens/references/token-decisions.md):
 *  - `primary` is NEAR-BLACK (light) / NEAR-WHITE (dark), not blue. Vendure Blue is
 *    `brand` and is rationed for identity moments (logo, selection, highlights).
 *  - "Neutral by default, tone for state, brand for identity."
 *  - Surface ladder: background (canvas) < surface (content pane) < surfaceRaised/card < overlay.
 */

/* ------------------------------------------------------------------ */
/* Raw palettes — source: vendurehq/design@5375f89 packages/design-tokens/src/tokens/colors.ts                       */
/* ------------------------------------------------------------------ */
/** Vendure Blue, hue 231. brand[500] = #17c1ff per source comment (computed #16c1fe). */
export const brand = {
  '50': '#e8f8ff',
  '100': '#ceedfe',
  '200': '#9edfff',
  '300': '#76d4ff',
  '400': '#55ccff',
  '500': '#16c1fe',
  '600': '#009ede',
  '700': '#007bb9',
  '800': '#005989',
  '900': '#003c5f',
  '950': '#00263d',
} as const;
/** "Whisper cool" neutrals (near-gray, slight bias to hue 231). */
export const neutral = {
  '50': '#f2f6f7',
  '100': '#e5e8ea',
  '200': '#d2d5d6',
  '300': '#b5b8b9',
  '400': '#95999b',
  '500': '#6f7274',
  '600': '#535658',
  '700': '#3c4043',
  '800': '#262a2c',
  '900': '#131719',
  '950': '#050809',
} as const;
export const successScale = {
  '50': '#edf9ed',
  '100': '#d8efd8',
  '200': '#b8e1b8',
  '300': '#8aca8b',
  '400': '#54b05a',
  '500': '#098926',
  '600': '#02721c',
  '700': '#005810',
  '800': '#04420f',
  '900': '#043009',
  '950': '#011d04',
} as const;
export const warningScale = {
  '50': '#fbf4e6',
  '100': '#f7e6c3',
  '200': '#edd198',
  '300': '#dbb155',
  '400': '#cf9b00',
  '500': '#c18200',
  '600': '#946900',
  '700': '#714f00',
  '800': '#553b00',
  '900': '#362600',
  '950': '#1e1400',
} as const;
export const destructiveScale = {
  '50': '#fff0ee',
  '100': '#ffdcd7',
  '200': '#ffc0ba',
  '300': '#fb9890',
  '400': '#ea6a64',
  '500': '#cc272e',
  '600': '#ac1922',
  '700': '#861118',
  '800': '#650e12',
  '900': '#490d0e',
  '950': '#2c0807',
} as const;
/** Info is hue 250 — deliberately distinct from brand (231). */
export const infoScale = {
  '50': '#ebf7ff',
  '100': '#cfebff',
  '200': '#add9ff',
  '300': '#7abdff',
  '400': '#3b9cf6',
  '500': '#0072da',
  '600': '#005db8',
  '700': '#004794',
  '800': '#00356f',
  '900': '#002750',
  '950': '#001730',
} as const;
/** Chart categorical slots. ORDER IS the colorblind-safety mechanism — do not reorder. */
export const viz = {
  '1': '#3578b8',
  '2': '#5a9f5d',
  '3': '#864a94',
  '4': '#b48c2b',
  '5': '#bb5752',
} as const;

/* ------------------------------------------------------------------ */
/* Semantic themes — source: vendurehq/design@5375f89 packages/design-tokens/src/tokens/semantic.ts (lightTheme/darkTheme)
 * plus dashboard extensions devMode/devModeForeground from
 * vendure/packages/dashboard/vite/vite-plugin-theme.ts. Keys are camelCased
 * CSS variable names (e.g. --card-foreground -> cardForeground).
 * ------------------------------------------------------------------ */
export const lightColors = {
  background: '#eff2f4',
  foreground: '#050809',
  surface: '#f6f9fb',
  surfaceRaised: '#ffffff',
  overlay: '#ffffff',
  inset: '#0000000d',
  scrim: '#0000001a',
  card: '#ffffff',
  cardForeground: '#050809',
  popover: '#ffffff',
  popoverForeground: '#050809',
  primary: '#131719',
  primaryForeground: '#f2f6f7',
  brand: '#17c1ff',
  brandForeground: '#050809',
  secondary: '#05080912',
  secondaryForeground: '#131719',
  muted: '#0508090d',
  mutedForeground: '#535658',
  accent: '#05080914',
  accentForeground: '#131719',
  destructive: '#ac1922',
  destructiveForeground: '#fff6f5',
  destructiveSubtle: '#ffdcd7',
  destructiveSubtleForeground: '#490d0e',
  destructiveBorder: '#ffc0ba',
  success: '#02721c',
  successForeground: '#f4faf4',
  successSubtle: '#d8efd8',
  successSubtleForeground: '#043009',
  successBorder: '#b8e1b8',
  warning: '#c18200',
  warningForeground: '#1e1400',
  warningSubtle: '#f7e6c3',
  warningSubtleForeground: '#362600',
  warningBorder: '#edd198',
  info: '#005db8',
  infoForeground: '#f4f9ff',
  infoSubtle: '#cfebff',
  infoSubtleForeground: '#002750',
  infoBorder: '#add9ff',
  neutralSubtle: '#e5e8ea',
  neutralSubtleForeground: '#131719',
  neutralBorder: '#d2d5d6',
  codeHighlight: '#0072da1a',
  codeHighlightAccent: '#0072da',
  codeDiffAdd: '#0989261a',
  codeDiffAddAccent: '#098926',
  codeDiffRemove: '#cc272e1a',
  codeDiffRemoveAccent: '#cc272e',
  codeInline: '#05080912',
  codeInlineBorder: '#ced1d3',
  border: '#ced1d3',
  input: '#ced1d3',
  controlBorder: '#838789',
  ring: '#6f7274',
  chart1: '#3578b8',
  chart2: '#5a9f5d',
  chart3: '#864a94',
  chart4: '#b48c2b',
  chart5: '#bb5752',
  sidebar: '#eff2f4',
  sidebarForeground: '#2a2e31',
  sidebarPrimary: '#131719',
  sidebarPrimaryForeground: '#f2f6f7',
  sidebarAccent: '#e7eaec',
  sidebarAccentForeground: '#131719',
  sidebarBorder: '#ced1d3',
  sidebarRing: '#6f7274',
  devMode: '#55ccff',
  devModeForeground: '#00263d',
} as const;

export const darkColors: { [K in keyof typeof lightColors]: string } = {
  background: '#050809',
  foreground: '#e2e5e7',
  surface: '#0a0e10',
  surfaceRaised: '#0f1214',
  overlay: '#131719',
  inset: '#00000066',
  scrim: '#00000066',
  card: '#0f1214',
  cardForeground: '#e2e5e7',
  popover: '#131719',
  popoverForeground: '#eceff1',
  primary: '#e5e8ea',
  primaryForeground: '#131719',
  brand: '#17c1ff',
  brandForeground: '#050809',
  secondary: '#e2e5e712',
  secondaryForeground: '#eceff1',
  muted: '#e2e5e70a',
  mutedForeground: '#8c9092',
  accent: '#e2e5e717',
  accentForeground: '#eceff1',
  destructive: '#cc272e',
  destructiveForeground: '#fff6f5',
  destructiveSubtle: '#490d0e66',
  destructiveSubtleForeground: '#fb9890',
  destructiveBorder: '#650e12',
  success: '#02721c',
  successForeground: '#f4faf4',
  successSubtle: '#04300966',
  successSubtleForeground: '#8aca8b',
  successBorder: '#04420f',
  warning: '#c18200',
  warningForeground: '#1e1400',
  warningSubtle: '#36260066',
  warningSubtleForeground: '#dbb155',
  warningBorder: '#553b00',
  info: '#005db8',
  infoForeground: '#f4f9ff',
  infoSubtle: '#00275066',
  infoSubtleForeground: '#7abdff',
  infoBorder: '#00356f',
  neutralSubtle: '#13171966',
  neutralSubtleForeground: '#b5b8b9',
  neutralBorder: '#262a2c',
  codeHighlight: '#0072da1a',
  codeHighlightAccent: '#0072da',
  codeDiffAdd: '#0989261a',
  codeDiffAddAccent: '#098926',
  codeDiffRemove: '#cc272e1a',
  codeDiffRemoveAccent: '#cc272e',
  codeInline: '#e2e5e712',
  codeInlineBorder: '#e2e5e72b',
  border: '#e2e5e72b',
  input: '#e2e5e72b',
  controlBorder: '#e2e5e766',
  ring: '#6f7274',
  chart1: '#3578b8',
  chart2: '#5a9f5d',
  chart3: '#864a94',
  chart4: '#b48c2b',
  chart5: '#bb5752',
  sidebar: '#050809',
  sidebarForeground: '#cbced0',
  sidebarPrimary: '#e5e8ea',
  sidebarPrimaryForeground: '#131719',
  sidebarAccent: '#0f1214',
  sidebarAccentForeground: '#eceff1',
  sidebarBorder: '#262a2c',
  sidebarRing: '#6f7274',
  devMode: '#55ccff',
  devModeForeground: '#00263d',
};

export type ThemeColors = { [K in keyof typeof lightColors]: string };

/* ------------------------------------------------------------------ */
/* Order / payment / fulfillment state -> StatusBadge tone.
 * Source: vendure/packages/dashboard/src/lib/utils/state-type.ts (orderStateDictionary)
 * Badge styling: design/packages/ui/src/components/molecules/status-badge.tsx
 *   - always "subtle": bg = {tone}Subtle, text = {tone}SubtleForeground, border = {tone}Border
 *   - critical -> destructive* slots; progress -> neutral* slots + pulsing dot in infoSubtleForeground
 *   - pill (radius.full), height 20, paddingX 8, text xs (12) weight 500, optional 6px dot
 * Unknown/custom states fall back to 'neutral'.
 * ------------------------------------------------------------------ */
export type StatusTone = 'neutral' | 'info' | 'success' | 'warning' | 'critical' | 'progress';

export const orderStateTone: Record<string, StatusTone> = {
  Created: 'neutral',
  Draft: 'neutral',
  AddingItems: 'neutral',
  ArrangingPayment: 'warning',
  PaymentAuthorized: 'info',
  PaymentSettled: 'neutral',
  PartiallyShipped: 'info',
  Shipped: 'neutral',
  PartiallyDelivered: 'info',
  Delivered: 'neutral',
  Modifying: 'progress',
  ArrangingAdditionalPayment: 'warning',
  Cancelled: 'neutral',
  // payment / fulfillment states
  Authorized: 'info',
  Settled: 'neutral',
  Declined: 'critical',
  Error: 'critical',
  Pending: 'warning',
  Completed: 'neutral',
};

/** Customer status — source: dashboard src/app/routes/_authenticated/_customers/components/customer-status-badge.tsx */
export const customerStatusTone: Record<string, StatusTone> = {
  verified: 'success',
  registered: 'info',
  guest: 'neutral',
};

export function statusBadgeColors(tone: StatusTone, c: ThemeColors) {
  const slot = tone === 'critical' ? 'destructive' : tone === 'progress' ? 'neutral' : tone;
  return {
    background: c[`${slot}Subtle` as keyof ThemeColors],
    foreground: c[`${slot}SubtleForeground` as keyof ThemeColors],
    border: c[`${slot}Border` as keyof ThemeColors],
    dot: tone === 'progress' ? c.infoSubtleForeground : c[`${slot}SubtleForeground` as keyof ThemeColors],
  };
}

/* ------------------------------------------------------------------ */
/* Radius — source: vendurehq/design@5375f89 packages/design-tokens/src/tokens/radii.ts (rem * 16 -> px)
 * Usage in @vendure-io/ui: Button/Input = md (4), Card = xl (8),
 * Badge/StatusBadge = 4xl (24, pill).
 * ------------------------------------------------------------------ */
export const radius = {
  none: 0,
  sm: 2,
  md: 4,
  lg: 6,
  xl: 8,
  '2xl': 12,
  '3xl': 16,
  '4xl': 24,
  full: 9999,
} as const;

/* ------------------------------------------------------------------ */
/* Spacing — the design system defines NO spacing tokens
 * (design/docs/design-tokens.md: "use Tailwind's default spacing scale").
 * Tailwind v4 default: 1 unit = 0.25rem = 4px. Component metrics below are from
 * design/packages/ui/src/components/atoms/{button,input,card}.tsx.
 * ------------------------------------------------------------------ */
export const spacing = {
  0: 0, 0.5: 2, 1: 4, 1.5: 6, 2: 8, 2.5: 10, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48, 16: 64,
} as const;

export const componentMetrics = {
  buttonHeight: 36, buttonHeightSm: 32, buttonHeightXs: 24, buttonPaddingX: 10,
  inputHeight: 36, inputPaddingX: 10,
  cardPadding: 24, cardPaddingSm: 16, cardGap: 24, cardGapSm: 16,
  badgeHeight: 20, badgePaddingX: 8,
} as const;

/* ------------------------------------------------------------------ */
/* Typography — source: vendurehq/design@5375f89 packages/design-tokens/src/tokens/typography.ts and css/fonts.css
 * Web uses Fontsource variable fonts: Inter (body/UI), Public Sans (headings),
 * Geist Mono (code; ligatures liga/calt disabled). All three are on Google Fonts:
 *   @expo-google-fonts/inter, @expo-google-fonts/public-sans, @expo-google-fonts/geist-mono
 * The family names below match the @expo-google-fonts export names (load them with useFonts).
 * RN needs one family name per weight, hence the per-weight map.
 * ------------------------------------------------------------------ */
export const fontFamily = {
  body: { 400: 'Inter_400Regular', 500: 'Inter_500Medium', 600: 'Inter_600SemiBold', 700: 'Inter_700Bold' },
  heading: { 400: 'PublicSans_400Regular', 500: 'PublicSans_500Medium', 600: 'PublicSans_600SemiBold', 700: 'PublicSans_700Bold' },
  mono: { 400: 'GeistMono_400Regular', 500: 'GeistMono_500Medium', 600: 'GeistMono_600SemiBold', 700: 'GeistMono_700Bold' },
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
} as const;

export const fontWeight = { normal: '400', medium: '500', semibold: '600', bold: '700' } as const;

/** em values from source; multiply by fontSize for RN letterSpacing (px). */
export const letterSpacingEm = { tighter: -0.05, tight: -0.025, normal: 0, wide: 0.025 } as const;

/** Named text styles (source: textStyles in typography.ts). lineHeight converted to px. */
export const typography = {
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacingEm,
  styles: {
    pageTitle: { fontFamily: fontFamily.heading[600], fontSize: 24, lineHeight: 28.8, letterSpacing: -0.6, fontWeight: '600' },
    sectionTitle: { fontFamily: fontFamily.heading[600], fontSize: 18, lineHeight: 23.4, letterSpacing: -0.45, fontWeight: '600' },
    cardTitle: { fontFamily: fontFamily.heading[600], fontSize: 16, lineHeight: 22.4, fontWeight: '600' },
    body: { fontFamily: fontFamily.body[400], fontSize: 14, lineHeight: 21, fontWeight: '400' },
    caption: { fontFamily: fontFamily.body[400], fontSize: 12, lineHeight: 16.8, fontWeight: '400' },
    code: { fontFamily: fontFamily.mono[400], fontSize: 14, lineHeight: 21, fontWeight: '400' },
  },
} as const;

/* ------------------------------------------------------------------ */
/* Shadows — source: vendurehq/design@5375f89 packages/design-tokens/src/tokens/shadows.ts (Tailwind-style, black at 5–25%).
 * `css` works with RN >= 0.76 boxShadow (New Architecture); `native` is the
 * legacy iOS shadow* / Android elevation approximation (first layer only).
 * ------------------------------------------------------------------ */
export const shadows = {
  '2xs': { css: '0 1px 1px 0 rgba(0,0,0,0.05)', native: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 1, elevation: 1 } },
  xs: { css: '0 1px 2px 0 rgba(0,0,0,0.05)', native: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 } },
  sm: { css: '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)', native: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 } },
  md: { css: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)', native: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 4 } },
  lg: { css: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)', native: { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 15, elevation: 8 } },
  xl: { css: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)', native: { shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.1, shadowRadius: 25, elevation: 12 } },
  '2xl': { css: '0 25px 50px -12px rgba(0,0,0,0.25)', native: { shadowColor: '#000', shadowOffset: { width: 0, height: 25 }, shadowOpacity: 0.25, shadowRadius: 50, elevation: 16 } },
} as const;

/* ------------------------------------------------------------------ */
/* Motion — source: vendurehq/design@5375f89 packages/design-tokens/src/tokens/motion.ts
 * ------------------------------------------------------------------ */
export const motion = {
  duration: { instant: 0, fast: 100, normal: 200, slow: 300, slower: 500 },
  easing: {
    default: [0.4, 0, 0.2, 1], in: [0.4, 0, 1, 1], out: [0, 0, 0.2, 1], spring: [0.175, 0.885, 0.32, 1.275],
  },
} as const;

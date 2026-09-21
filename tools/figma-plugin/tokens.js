// Static extraction data for the ABox Figma proof.
// Values are transcribed by hand from the current production sources.
// This file intentionally does NOT import from src/ — the plugin runs inside
// Figma and must stay outside the application module graph.
//
// Sources:
//   src/styles.css                      (foundation roles, light theme)
//   src/components/abox/status-badge.tsx (canonical StatusBadge)

const ABOX_TOKENS = {
  meta: {
    phase: "52A",
    extractedFrom: ["src/styles.css", "src/components/abox/status-badge.tsx"],
  },

  // oklch(L C H) exactly as declared in src/styles.css :root (light mode).
  // Converted to sRGB at run time; the conversion is a recorded Figma
  // limitation (Figma has no oklch colour space), never a production change.
  color: {
    "background/base": { oklch: [1.0, 0.0, 0.0], css: "--background" },
    "foreground/base": { oklch: [0.22, 0.025, 265], css: "--foreground" },
    "card/base": { oklch: [1.0, 0.0, 0.0], css: "--card" },
    "primary/base": { oklch: [0.31, 0.09, 265], css: "--primary" },
    "sage/base": { oklch: [0.55, 0.085, 195], css: "--sage" },
    "warning/base": { oklch: [0.72, 0.125, 75], css: "--warning" },
    "destructive/base": { oklch: [0.55, 0.185, 25], css: "--destructive" },
    "info/base": { oklch: [0.55, 0.12, 250], css: "--info" },
  },

  typography: {
    "ABox/Body/Base": {
      family: "Inter Tight",
      weight: 400,
      styleNames: ["Regular"],
      size: 16,
      lineHeightPercent: 150,
      letterSpacingPercent: 0,
      css: "--font-sans",
    },
  },

  // Transcribed from the StatusBadge class list:
  // "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5
  //  text-[10px] font-semibold uppercase tracking-[0.12em] border"
  statusBadge: {
    traceabilityId: "abox/StatusBadge",
    source: "src/components/abox/status-badge.tsx",
    paddingX: 10, // px-2.5
    paddingY: 2, // py-0.5
    gap: 6, // gap-1.5
    cornerRadius: 9999, // rounded-full
    borderWidth: 1, // border
    dotSize: 6, // h-1.5 w-1.5
    text: {
      family: "Inter Tight",
      weight: 600, // font-semibold
      styleNames: ["SemiBold", "Semi Bold", "DemiBold", "Demi Bold"],
      size: 10, // text-[10px]
      letterSpacingEm: 0.12, // tracking-[0.12em]
      uppercase: true,
    },
    // Proof uses two real tones from the Tone union. The remaining tones
    // (warning, muted, destructive, info) are deliberately out of scope here.
    proofTones: ["sage", "primary"],
    toneVar: { sage: "sage/base", primary: "primary/base" },
    // color-mix(in oklch, var(--tone) X%, ...) has no Figma equivalent.
    // The proof resolves the mixes numerically and records the limitation.
    mix: { text: 0.88, background: 0.12, border: 0.34 },
  },
};

if (typeof module !== "undefined") module.exports = { ABOX_TOKENS };

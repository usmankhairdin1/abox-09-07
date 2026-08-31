/**
 * ABox decorative SVG system — Midnight Citron edition.
 * Intentional, geometric, purposeful primitives. Everything uses
 * semantic tokens; no random blobs. Anchored to layout edges; respects
 * reduced motion.
 */
import { cn } from "@/lib/utils";

interface BaseProps {
  className?: string;
  tone?: "ink" | "ember" | "moss" | "hairline";
}

const strokeOf = (tone: BaseProps["tone"]) =>
  tone === "ember" ? "var(--primary)"
  : tone === "moss" ? "var(--sage)"
  : tone === "hairline" ? "var(--hairline)"
  : "var(--ink)";

/* ------------------------------------------------------------------ */
/* OrbitalRings — concentric SVG rings with a citron dot on the outer
 * ring. Slowly rotates. The signature ABox mark used on shells + hero. */
export function OrbitalRings({
  className, size = 480, tone = "hairline", animated = true,
}: BaseProps & { size?: number; animated?: boolean }) {
  const c = size / 2;
  const rings = [c - 20, c - 60, c - 110, c - 170, c - 236].filter((r) => r > 6);
  return (
    <svg
      aria-hidden viewBox={`0 0 ${size} ${size}`} width={size} height={size}
      className={cn("pointer-events-none absolute", animated && "animate-orbit-slow", className)}
    >
      {rings.map((r, i) => (
        <circle key={r} cx={c} cy={c} r={r}
          fill="none" stroke={strokeOf(tone)}
          strokeWidth={0.75} opacity={0.35 - i * 0.05} strokeDasharray={i === 1 ? "2 6" : undefined}
        />
      ))}
      {/* accent ring */}
      <circle cx={c} cy={c} r={rings[0]} fill="none" stroke="var(--primary)" strokeWidth={1} opacity={0.55} />
      {/* orbital dot — rotates about the true ring centre */}
      <g
        className={cn(animated && "animate-orbit")}
        style={{ transformBox: "view-box", transformOrigin: `${c}px ${c}px` }}
      >
        <circle cx={c + (rings[0] ?? 0)} cy={c} r={4} fill="var(--primary)" />
        <circle cx={c + (rings[0] ?? 0)} cy={c} r={9} fill="none" stroke="var(--primary)" strokeWidth={0.75} opacity={0.4} />
      </g>
    </svg>
  );
}

/* Dot Field — precise dotted grid with radial mask */
export function DotField({ className, size = 22, tone = "hairline" }: BaseProps & { size?: number }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_80%)]",
        className,
      )}
      style={{
        backgroundImage: `radial-gradient(${strokeOf(tone)} 1px, transparent 1.5px)`,
        backgroundSize: `${size}px ${size}px`,
        opacity: 0.6,
      }}
    />
  );
}

/* Aurora wash — soft violet + citron gradient blobs behind hero */
export function Aurora({ className }: { className?: string }) {
  return <div aria-hidden className={cn("pointer-events-none absolute inset-0 aurora", className)} />;
}

/* Corner Crop — L-shape blueprint marks anchored to corners of a card */
export function CornerCrop({
  className, size = 22, tone = "ember",
}: BaseProps & { size?: number }) {
  const s = strokeOf(tone);
  const Line = ({ style }: { style: React.CSSProperties }) => (
    <span aria-hidden className="pointer-events-none absolute" style={{ background: s, ...style }} />
  );
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
      {/* TL */}
      <Line style={{ top: 0, left: 0, width: size, height: 1 }} />
      <Line style={{ top: 0, left: 0, width: 1, height: size }} />
      {/* TR */}
      <Line style={{ top: 0, right: 0, width: size, height: 1 }} />
      <Line style={{ top: 0, right: 0, width: 1, height: size }} />
      {/* BL */}
      <Line style={{ bottom: 0, left: 0, width: size, height: 1 }} />
      <Line style={{ bottom: 0, left: 0, width: 1, height: size }} />
      {/* BR */}
      <Line style={{ bottom: 0, right: 0, width: size, height: 1 }} />
      <Line style={{ bottom: 0, right: 0, width: 1, height: size }} />
    </div>
  );
}

const round6 = (n: number) => parseFloat(n.toFixed(6));

/* Radial ticks — dial markings around a circle. Great for hero + metric */
export function RadialTicks({
  className, size = 260, count = 60, tone = "hairline",
}: BaseProps & { size?: number; count?: number }) {
  const c = size / 2, r = c - 6;
  const ticks = Array.from({ length: count }, (_, i) => i);
  return (
    <svg aria-hidden viewBox={`0 0 ${size} ${size}`} width={size} height={size}
      className={cn("pointer-events-none absolute", className)}
    >
      {ticks.map((i) => {
        const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
        const x1 = round6(c + Math.cos(angle) * r);
        const y1 = round6(c + Math.sin(angle) * r);
        const long = i % 5 === 0;
        const inner = long ? r - 10 : r - 5;
        const x2 = round6(c + Math.cos(angle) * inner);
        const y2 = round6(c + Math.sin(angle) * inner);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={long ? "var(--ink)" : strokeOf(tone)}
          strokeWidth={long ? 1 : 0.6} opacity={long ? 0.6 : 0.35} />;
      })}
    </svg>
  );
}

/* Ticker Rule — horizontal rule with numbered tick labels */
export function TickerRule({
  className, labels = ["01", "02", "03", "04", "05"], tone = "hairline",
}: BaseProps & { labels?: string[] }) {
  return (
    <div className={cn("relative flex w-full items-center gap-3", className)} aria-hidden>
      <div className="h-px flex-1" style={{ background: strokeOf(tone) }} />
      {labels.map((l, i) => (
        <div key={l + i} className="flex items-center gap-2">
          <span className="text-serial">{l}</span>
          <div className="h-2 w-px" style={{ background: strokeOf(tone) }} />
        </div>
      ))}
      <div className="h-px flex-1" style={{ background: strokeOf(tone) }} />
    </div>
  );
}

/* Numeric column — vertical serials for side rails */
export function MarqueeSerial({
  className, items,
}: { className?: string; items: Array<{ n: string; label?: string }> }) {
  return (
    <ol className={cn("flex flex-col gap-3", className)} aria-hidden>
      {items.map((it) => (
        <li key={it.n} className="flex items-baseline gap-2">
          <span className="text-serial w-8">{it.n}</span>
          {it.label && <span className="text-eyebrow">{it.label}</span>}
        </li>
      ))}
    </ol>
  );
}

/* Isometric Stack — three offset rounded squares, editorial hero motif */
export function IsoStack({ className, size = 220 }: { className?: string; size?: number }) {
  return (
    <svg aria-hidden viewBox="0 0 220 220" width={size} height={size}
      className={cn("pointer-events-none absolute", className)}
    >
      <defs>
        <linearGradient id="isoA" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="var(--primary)" stopOpacity="0.9" />
          <stop offset="1" stopColor="var(--sage)" stopOpacity="0.75" />
        </linearGradient>
      </defs>
      <g transform="translate(30 40)">
        <rect x="0" y="60" width="120" height="120" rx="20" fill="var(--panel)" stroke="var(--hairline)" />
        <rect x="24" y="30" width="120" height="120" rx="20" fill="var(--surface)" stroke="var(--hairline)" />
        <rect x="48" y="0"  width="120" height="120" rx="20" fill="url(#isoA)" />
      </g>
    </svg>
  );
}

/* GlassPanel — a rounded translucent surface used for hero framing */
export function GlassPanel({
  children, className,
}: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("glass rounded-3xl", className)} style={{ boxShadow: "var(--shadow-plate)" }}>
      {children}
    </div>
  );
}

/* Masthead Mark — label + rule + trailing pulse */
export function MastheadMark({
  serial, label, className,
}: { serial?: string; label?: string; className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)} aria-hidden>
      {serial && <span className="text-serial">{serial}</span>}
      <div className="h-px w-16 origin-left animate-hairline" style={{ background: "var(--foreground)" }} />
      {label && <span className="text-eyebrow">{label}</span>}
      <span className="relative flex h-2 w-2">
        <span className="absolute inset-0 rounded-full bg-primary animate-pulse-ring" />
        <span className="relative h-2 w-2 rounded-full bg-primary" />
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Health / insurance themed decor — purposeful, editorial, hand-tuned. */
/* ------------------------------------------------------------------ */

/* HealthPulseShield — a stylized shield outline with a heartbeat trace
 * cutting across the middle. Anchors any Health Insurance surface. */
export function HealthPulseShield({
  className, size = 360, animated = true,
}: { className?: string; size?: number; animated?: boolean }) {
  const w = size, h = Math.round(size * 1.05);
  return (
    <svg
      aria-hidden viewBox={`0 0 ${w} ${h}`} width={w} height={h}
      className={cn("pointer-events-none absolute", className)}
    >
      <defs>
        <linearGradient id="hps-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="var(--primary)" stopOpacity="0.14" />
          <stop offset="1" stopColor="var(--primary)" stopOpacity="0.00" />
        </linearGradient>
        <linearGradient id="hps-stroke" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="var(--primary)" stopOpacity="0.85" />
          <stop offset="1" stopColor="var(--sage)" stopOpacity="0.75" />
        </linearGradient>
      </defs>
      {/* Outer shield */}
      <path
        d={`M ${w * 0.5} ${h * 0.06}
            L ${w * 0.92} ${h * 0.20}
            L ${w * 0.92} ${h * 0.55}
            Q ${w * 0.92} ${h * 0.82} ${w * 0.5} ${h * 0.96}
            Q ${w * 0.08} ${h * 0.82} ${w * 0.08} ${h * 0.55}
            L ${w * 0.08} ${h * 0.20} Z`}
        fill="url(#hps-fill)" stroke="url(#hps-stroke)" strokeWidth={1.25}
      />
      {/* Inner shield hairline */}
      <path
        d={`M ${w * 0.5} ${h * 0.13}
            L ${w * 0.85} ${h * 0.24}
            L ${w * 0.85} ${h * 0.55}
            Q ${w * 0.85} ${h * 0.76} ${w * 0.5} ${h * 0.88}
            Q ${w * 0.15} ${h * 0.76} ${w * 0.15} ${h * 0.55}
            L ${w * 0.15} ${h * 0.24} Z`}
        fill="none" stroke="var(--hairline)" strokeWidth={1}
      />
      {/* Heartbeat trace */}
      <g transform={`translate(0 ${h * 0.5})`}>
        <line x1={w * 0.12} y1="0" x2={w * 0.34} y2="0" stroke="var(--ink)" strokeOpacity="0.35" strokeWidth={1} />
        <polyline
          points={`${w * 0.34},0 ${w * 0.40},-6 ${w * 0.44},22 ${w * 0.48},-40 ${w * 0.52},34 ${w * 0.56},-14 ${w * 0.60},6 ${w * 0.66},0`}
          fill="none" stroke="var(--primary)" strokeWidth={1.75} strokeLinejoin="round" strokeLinecap="round"
          className={animated ? "animate-drift" : undefined}
        />
        <line x1={w * 0.66} y1="0" x2={w * 0.88} y2="0" stroke="var(--ink)" strokeOpacity="0.35" strokeWidth={1} />
      </g>
      {/* Cross emblem, subtle */}
      <g transform={`translate(${w * 0.5} ${h * 0.28})`} opacity="0.55">
        <rect x="-14" y="-4" width="28" height="8" rx="1.5" fill="var(--primary)" />
        <rect x="-4" y="-14" width="8" height="28" rx="1.5" fill="var(--primary)" />
      </g>
      {/* Tick marks along inner arc */}
      {Array.from({ length: 9 }).map((_, i) => {
        const t = i / 8;
        const angle = Math.PI * (0.15 + t * 0.7);
        const cx = w * 0.5, cy = h * 0.55;
        const r1 = w * 0.36, r2 = w * 0.38;
        const x1 = cx + Math.cos(angle) * r1;
        const y1 = cy + Math.sin(angle) * r1;
        const x2 = cx + Math.cos(angle) * r2;
        const y2 = cy + Math.sin(angle) * r2;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--ink)" strokeOpacity="0.35" strokeWidth={0.75} />;
      })}
    </svg>
  );
}

/* CoverageWeave — three offset rounded tiles labelled with product initials.
 * Editorial "layered coverage" illustration used to anchor product bento. */
export function CoverageWeave({
  className, size = 260, labels = ["H", "D", "V"],
}: { className?: string; size?: number; labels?: [string, string, string] | string[] }) {
  return (
    <svg aria-hidden viewBox="0 0 260 260" width={size} height={size}
      className={cn("pointer-events-none absolute", className)}
    >
      <defs>
        <linearGradient id="cw-a" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="var(--primary)" stopOpacity="0.16" />
          <stop offset="1" stopColor="var(--primary)" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="cw-b" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="var(--sage)" stopOpacity="0.14" />
          <stop offset="1" stopColor="var(--sage)" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {/* Back tile */}
      <g transform="translate(20 60) rotate(-6 70 70)">
        <rect width="140" height="140" rx="22" fill="url(#cw-b)" stroke="var(--hairline)" />
        <text x="18" y="118" fontFamily="var(--font-display)" fontSize="72" fill="var(--sage)" fillOpacity="0.55">{labels[1]}</text>
      </g>
      {/* Middle tile */}
      <g transform="translate(60 40) rotate(3 70 70)">
        <rect width="140" height="140" rx="22" fill="var(--card)" stroke="var(--hairline)" />
        <text x="18" y="118" fontFamily="var(--font-display)" fontSize="72" fill="var(--ink)" fillOpacity="0.35">{labels[2]}</text>
      </g>
      {/* Front tile — health emphasis */}
      <g transform="translate(100 20)">
        <rect width="140" height="140" rx="22" fill="url(#cw-a)" stroke="var(--primary)" strokeOpacity="0.5" />
        <text x="18" y="118" fontFamily="var(--font-display)" fontSize="72" fill="var(--primary)">{labels[0]}</text>
        {/* corner ticks */}
        <path d="M120 12 L132 12 L132 24" stroke="var(--primary)" strokeWidth="1" fill="none" />
        <path d="M120 128 L132 128 L132 116" stroke="var(--primary)" strokeWidth="1" fill="none" />
      </g>
    </svg>
  );
}

/* BlueprintGrid — subtle blueprint-style grid with major/minor lines,
 * masked to the section. Replaces radial glow section backgrounds. */
export function BlueprintGrid({ className, tone = "hairline" }: BaseProps) {
  const s = strokeOf(tone);
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 [mask-image:linear-gradient(180deg,transparent,black_18%,black_82%,transparent)]",
        className,
      )}
      style={{
        backgroundImage: `
          linear-gradient(to right, ${s} 1px, transparent 1px),
          linear-gradient(to bottom, ${s} 1px, transparent 1px),
          linear-gradient(to right, color-mix(in oklab, ${s} 50%, transparent) 1px, transparent 1px),
          linear-gradient(to bottom, color-mix(in oklab, ${s} 50%, transparent) 1px, transparent 1px)
        `,
        backgroundSize: "120px 120px, 120px 120px, 24px 24px, 24px 24px",
        opacity: 0.55,
      }}
    />
  );
}

/* PolicyLines — layered horizontal contour lines suggesting policy pages /
 * documents stacking. Sits behind cards without glowing. */
export function PolicyLines({
  className, count = 14,
}: { className?: string; count?: number }) {
  return (
    <svg aria-hidden viewBox="0 0 400 240" preserveAspectRatio="none"
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    >
      {Array.from({ length: count }).map((_, i) => {
        const y = 18 + i * 15;
        const w = 100 + ((i * 37) % 220);
        return (
          <line key={i} x1="40" y1={y} x2={40 + w} y2={y}
            stroke="var(--ink)" strokeOpacity={0.06 + (i % 3) * 0.02} strokeWidth={1} />
        );
      })}
      <rect x="40" y="16" width="8" height={count * 15} fill="var(--primary)" fillOpacity="0.5" />
    </svg>
  );
}

/* FamilySilhouette — minimal line-art of three connected figures
 * (adult, adult, child) inside a dotted arc. Human-anchor for insurance. */
export function FamilySilhouette({
  className, size = 240,
}: { className?: string; size?: number }) {
  return (
    <svg aria-hidden viewBox="0 0 240 180" width={size} height={(size * 180) / 240}
      className={cn("pointer-events-none absolute", className)}
    >
      <path d="M20 150 Q120 60 220 150" fill="none" stroke="var(--hairline)" strokeWidth="1" strokeDasharray="2 5" />
      {/* Left adult */}
      <g transform="translate(60 90)" stroke="var(--ink)" strokeOpacity="0.55" fill="none" strokeWidth="1.25">
        <circle cx="0" cy="0" r="12" />
        <path d="M-18 46 Q-18 20 0 20 Q18 20 18 46" />
      </g>
      {/* Right adult */}
      <g transform="translate(180 90)" stroke="var(--ink)" strokeOpacity="0.55" fill="none" strokeWidth="1.25">
        <circle cx="0" cy="0" r="12" />
        <path d="M-18 46 Q-18 20 0 20 Q18 20 18 46" />
      </g>
      {/* Child, center front — primary tone */}
      <g transform="translate(120 108)" stroke="var(--primary)" fill="none" strokeWidth="1.5">
        <circle cx="0" cy="0" r="9" />
        <path d="M-13 34 Q-13 15 0 15 Q13 15 13 34" />
      </g>
      {/* Ground line */}
      <line x1="30" y1="150" x2="210" y2="150" stroke="var(--ink)" strokeOpacity="0.35" strokeWidth="1" />
      <line x1="30" y1="150" x2="60" y2="150" stroke="var(--primary)" strokeWidth="1.5" />
    </svg>
  );
}

/* Legacy re-exports kept for older imports */
export const HairlineGrid = DotField;
export const ConcentricArcs = OrbitalRings;
export const DiagonalWeave = DotField;
export const PlateFrame = ({ children, className }: { children: React.ReactNode; className?: string; offset?: number }) => (
  <GlassPanel {...(className ? { className } : {})}>{children}</GlassPanel>
);

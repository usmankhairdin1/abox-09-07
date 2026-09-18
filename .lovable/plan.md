# Phase 29 — Canonical Surface Definition & Single-Consumer Proof (PLAN ONLY)

No production file is created or modified by this document. Implementation begins only after this plan is separately approved.

## 1. Objective

Create one canonical source for the genuinely shared ABox plain/elevated card-surface styling, and prove it against exactly ONE real existing production panel with byte-identical output. The canonical source is not a generic replacement for card-like UI.

Remain independently owned and untouched: KpiCard, PlanCard, EmptyState, Lucie Section/Stat, Lucie-app Section/StatCard, M06 surfaces, M08 governance structures, shells, ModuleTabs, dialogs/drawers/popovers, and every other experience-specific component.

## 2. Canonical source

New file (only new file in this phase): `src/components/abox/surface.tsx`

API:

```text
Surface(
  props: React.HTMLAttributes<HTMLDivElement> & {
    padding?: "none" | "sm" | "md" | "lg";
    elevated?: boolean;
    interactiveHover?: boolean;
    decor?: boolean;
  }
)
```

Rules: renders a native `<div>` only; ref forwarded to that div; all other div props spread unchanged. No `as`, no Slot, no `asChild`, no polymorphism, no element substitution.

Padding: default `md`; `md` = `p-5`, `sm` = `p-4`, `lg` = `p-6`, `none` = no padding class.

`elevated`, `interactiveHover`, `decor` are opt-in and each emits only the existing proven treatment (shadow-card / existing hover / card-brackets-edge-sheen respectively). All three default off.

## 3. Class ownership

Canonical source owns only: `rounded-2xl`, `border`, `border-border`, `bg-card`, the selected padding variant, and any explicitly enabled elevated / interactiveHover / decor classes.

Consumer keeps everything else: layout, flex/grid, responsive classes, responsive padding overrides, typography, text styling, width/height, positioning, margins, gaps, colspan, route-specific behavior, content, interaction semantics. Consumer `className` is merged last via `cn`.

## 4. Shared class helper

`surfaceClass(opts)` is exported from the same file and built from the same internal class definitions Surface uses, so one edit propagates to both. It exists so existing native `<Link>` and `<button>` card consumers can adopt the canonical classes later without changing element type, DOM structure, href, handlers, focus behavior, keyboard behavior or accessibility semantics. No Link or button is converted into a Surface wrapper — ever, and none is touched in Phase 29.

## 5. Representative proof consumer

Selected at execution start, not now. Criteria: a real existing Group A panel using the exact dominant string `rounded-2xl border border-border bg-card p-5`, on a naturally reachable route, non-interactive, no hover, no shadow, no decor, no special behavior. No synthetic or invented surface.

Recorded at selection: route, file, line, source hash, verbatim current class attribute.

## 6. Pre-implementation capture

For the panel, per viewport: element tag; full panel DOM hierarchy; child structure; all attributes; verbatim class attribute; inline style; text/content; computed styles; bounding rectangle of the panel; bounding rectangles of all direct children.

Computed styles include at minimum: padding, margin, gap, border width, border style, border color, border radius, background, box-shadow, overflow, alignment, text-align, min-height, transition, and contained text font-family, font-size, weight, line-height, color.

## 7. Responsive proof

Captured independently at 1440px, 834px and 390px — no inference between viewports. Each viewport verifies geometry, wrapping, spacing, padding, content placement, `documentElement.scrollWidth`, `documentElement.clientWidth`, and zero horizontal overflow.

## 8. Implementation boundary

May create `src/components/abox/surface.tsx`; may modify only the one selected consumer. No other consumer, route, CSS token (added, renamed or altered), branding/white-label file, Marketplace Asset Management file, or reference/design-system file changes.

## 9. Post-implementation proof

Repeat the full capture at all three viewports. Required: identical element type, DOM hierarchy, child structure, attributes, content, inline style; byte-for-byte identical class attribute; identical computed styles; identical bounding rectangles; identical responsive behavior; zero horizontal overflow.

Computed-style equality alone is not sufficient. Any class-string difference blocks the phase unless explicitly explained and proven unavoidable.

On any parity failure: immediately revert the consumer to its original literal class string, migrate nothing else, classify the consumer as an exception, report the exact discrepancy.

## 10. Accessibility and behavior

Panel stays a native div: no role, no ARIA additions, not focusable. All existing focusable descendants, links, handlers, keyboard behavior and navigation unchanged. No interactive consumer is part of this phase.

## 11. Validation

`npx tsgo --noEmit`; production build; ESLint on `src/components/abox/surface.tsx` and the single migrated consumer. Pre-existing findings are recorded separately and left unfixed; any new error blocks completion.

## 12. Git / hash validation

Record git status before and after; consumer source hash before and after; canonical Surface source hash after creation. Expected changed files: `src/components/abox/surface.tsx` and exactly one consumer — nothing else.

## 13. Rollback

The consumer reverts to its original literal class string in a single edit. The new file can be left unimported or deleted with no effect on any other file. No parity ⇒ no migration.

## 14. Final report

On completion the report carries exactly the 31 requested sections: Status; Selected representative consumer; Route; File and line; Before source hash; After source hash; New Surface source hash; Files changed; Files explicitly confirmed untouched; Surface API implemented; Native-div / no-polymorphism proof; Shared class ownership proof; Before/after DOM comparison; Before/after class-string comparison; Before/after computed-style comparison; Before/after geometry comparison; 1440px proof; 834px proof; 390px proof; Accessibility proof; Behavior/navigation proof; Horizontal-overflow proof; Typecheck result; Build result; ESLint result; Git status; Rollback readiness; Any discrepancy or exception; Confirmation no additional consumer was migrated; Confirmation branding/white-label and Marketplace Asset Management untouched; Confirmation reference/design-system files untouched.

## 15. Authorization

No production implementation occurs until this plan is separately approved. Nothing here authorizes creating the component, editing a consumer, or migrating any other consumer.

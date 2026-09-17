# ABox Design System — as built

Status: describes the implementation as it exists in this repository. Everything below was
verified in code. Nothing here is aspirational; opportunities that are *not* implemented are
listed separately at the end and marked as such.

Live references:

- `/design-system` — technical, live component and token reference (unlisted route).
- `/design-guide` — management-facing brand and design guide (unlisted route).

Neither page is linked from any navigation, header, sidebar or existing page. Both consume the
production tokens and components directly, so they cannot drift from the product.

---

## 1. Architecture

```text
src/styles.css                 design tokens (single source of truth)
        |
src/components/ui/*            shadcn primitives  (focus, keyboard, disabled behaviour)
        |
src/components/abox/*          ABox business components (status, plans, shells, headers)
        |
src/routes/*                   application pages
        |
/design-system, /design-guide  reference pages (same tokens, same components)
```

Rule: a page composes ABox components; an ABox component composes UI primitives; every layer
reads tokens. No layer hardcodes a color.

## 2. Tokens — `src/styles.css`

`src/styles.css` is the only place design values are defined. It contains:

- `@theme inline` — maps CSS variables into Tailwind utilities (`--color-*`, `--radius-*`,
  `--font-*`, `--shadow-*`).
- `:root` — light theme values (oklch).
- `.dark` — dark theme overrides.
- A compatibility block exposing `--ai`, `--surface-1/2/3`, `--brand-accent` for the governed
  Lucie/M0x surfaces.

Token families:

| Family | Tokens |
| --- | --- |
| Canvas & surfaces | `background`, `surface`, `panel`, `card`, `popover`, `sidebar` (+ foregrounds) |
| Brand | `primary`, `primary-soft`, `sage`, `sage-soft`, `secondary`, `accent`, `ai` (+ foregrounds) |
| Semantic | `success`, `warning`, `destructive`, `info`, `muted` (+ foregrounds) |
| Lines & focus | `border`, `border-strong`, `hairline`, `input`, `ring` |
| Charts | `chart-1` … `chart-5` |
| Metal tiers | `metal-bronze`, `metal-expanded-bronze`, `metal-silver`, `metal-gold`, `metal-platinum`, `metal-catastrophic` (+ `-fg` pairs) |
| Radius | `radius-sm` 6px → `radius-4xl` 36px; `--radius` 0.875rem base |
| Shadows | `shadow-card`, `shadow-elevated`, `shadow-drawer`, `shadow-plate`, `shadow-glow` |
| Fonts | `font-sans` Inter Tight, `font-display` Bricolage Grotesque (`font-serif`/`font-mono` alias these) |

Contrast standard: dark token backgrounds take light foregrounds and light backgrounds take dark
foregrounds. Metal tiers encode this explicitly through their paired `-fg` tokens.

`src/lib/design-tokens.ts` lists token *names* and plain-language usage for the reference pages.
It deliberately holds no values — values are read at runtime with `getComputedStyle`.

## 3. Typography

- Display and `h1`–`h3`: Bricolage Grotesque, weight 600, tight tracking (set in `@layer base`).
- Body, labels, data: Inter Tight, with `ss01`/`cv11` features and tabular numerals for figures.
- Utilities: `text-display` (headline treatment), `text-eyebrow` (uppercase context label),
  `text-serial` (identifiers, carrier meta).
- Page titles are owned by `PageHeader`: default variant `text-3xl md:text-4xl`, compact variant
  `text-xl md:text-2xl`.

No additional fonts are loaded and no component defines its own family.

## 4. Spacing, radius, elevation

- 4px base rhythm; the steps in genuine use are 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64.
- Web-experience pages share a centred container: `mx-auto max-w-[88rem] px-4 md:px-8`.
  Headers are full-width by design. Internal dashboards keep their own shell widths.
- Radius rises with surface size (inputs `sm` → plan tiles and KPI cards `2xl`).
- Shadows are cool navy-tinted and used on cards and overlays only.

## 5. Component ownership

**`src/components/ui/`** — 49 shadcn primitives (button, input, select, tabs, table, dialog,
drawer, sheet, sidebar, tooltip, …). These own interaction and accessibility behaviour. Do not
fork them into ABox; extend by composition.

**`src/components/abox/`** — business components, each the single owner of its pattern:

| Component | Owns |
| --- | --- |
| `page-header.tsx` | Page title block; `default` and `compact` variants |
| `plan-card.tsx` | Plan tile (stacked + horizontal), price, match, best-match indicator |
| `metal-badge.tsx` | Metal tier badge; the only consumer of the metal tokens |
| `status-badge.tsx` | Six semantic tones for lifecycle, readiness, network, exchange, HSA |
| `kpi-card.tsx` | Metric tile with tone, delta and icon |
| `carrier-mark.tsx` | Deterministic illustrative carrier monogram (not official logos) |
| `data-table.tsx` | Table with columns, caption, empty state, row click |
| `empty-state.tsx` | Empty result treatment |
| `module-tabs.tsx` | Workspace module tab strip |
| `overflow-text.tsx` | Ellipsis + hover/focus reveal for long names and IDs |
| `product-switcher.tsx` | Shopping product strip |
| `shopping-path-bar.tsx` | Shopping mode bar (Guide me / Browse myself) |
| `quote-edit-panel.tsx` | Inline quote editing over the shared quote store |
| `marketplace-shell.tsx`, `member-shell.tsx`, `internal-shell.tsx` | The three layout shells |
| `logo.tsx` | `AboxMark` in four tones |
| `action-pill.ts` | The repeated rounded action button/link class strings |
| `motion.tsx`, `decor/` | Shared motion and structural decoration |

**`src/components/design/reference-kit.tsx`** — documentation-only wrappers (section, swatch,
stage, table of contents) used by the two reference pages. It renders production components; it
never defines design values.

## 6. Action pill — the one pattern centralized in this pass

The rounded action button/link treatment was written inline in 33 route files. The exact strings
now live in `src/components/abox/action-pill.ts` as `ACTION_PILL`:

`primaryXs`, `primaryMd`, `primaryLg`, `outlineXs`, `outlineSm`, `outlineSmCard`, `outlineMd`,
`outlineLg`.

The exported values are byte-identical to the previous inline strings, and only call sites whose
`className` matched an entry exactly were updated (64 occurrences). Call sites with bespoke
variations were intentionally left unchanged.

## 7. Relationship to branding / white-label

Runtime brand configuration lives in the existing application:
`/marketplace/admin/brand`, `/marketplace/admin/assets`, `/app/jet/branding`, and the marketplace
store. Tenant brand values map into the token layer via `--brand-accent` and the marketplace
branding state.

The design system **documents**; branding **configures**. The reference pages contain no editor,
no persistence and no duplicate brand model.

## 8. Status, plan and state conventions

- Status is always words plus color, never color alone.
- Exchange status is stated explicitly on every plan tile (`On-exchange` / `Off-exchange`).
- Filter chips reuse the exact badge components shown in results, at full opacity; selection is
  announced with `aria-pressed`.
- States in use: default, hover, focus, selected, disabled, loading (skeleton), error (inline,
  destructive), success.

## 9. Figma mapping (preparation only — no conversion performed)

| Implementation | Figma equivalent |
| --- | --- |
| CSS custom property in `src/styles.css` | Variable (in a Light/Dark collection) |
| `src/components/ui/*` primitive | Component |
| `src/components/abox/*` component | Component |
| `Button` variant / `ACTION_PILL` key | Variant property |
| Hover / focus / disabled / loading | Interactive state or boolean property |
| `AboxMark`, `CarrierMark` | Asset / component set |
| Shell + `max-w-[88rem]` container | Layout grid / frame template |

## 10. Known opportunities — NOT implemented

Recorded honestly; each was left alone because changing it could alter rendered output.

1. Roughly 40 remaining bespoke pill/button class strings differ slightly from the eight canonical
   entries (extra margins, `disabled:` modifiers, `justify-center`, `py-3` sizing). They can be
   folded in only with per-site visual verification.
2. Several routes build cards with repeated `rounded-2xl border border-border bg-card p-5`
   markup. A `SurfaceCard` component could own this, but border tokens vary (`border` vs
   `hairline`) across call sites.
3. `src/routes/plans.index.tsx` uses one literal `bg-black/40` for the mobile filter scrim.
4. Section heading sizes vary between internal routes (`text-xl`, `text-2xl`); there is no shared
   `SectionHeading` component.
5. `plan-o-assistant.tsx` and `planai-assistant.tsx` coexist; consolidation is a behavioural
   change, not a styling one.

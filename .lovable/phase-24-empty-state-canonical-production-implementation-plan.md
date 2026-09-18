# PHASE 24 — EmptyState Canonical Production Implementation Plan (PLAN ONLY)

No production file was created, edited, renamed, migrated, normalized or fixed while producing this document. All browser observation was read-only.

---

## 1. Executive summary

One shared ABox EmptyState exists and is used by **8 production files / 8 production call sites**, all in the web-experience and marketplace surfaces. Alongside it the codebase contains a second, dormant `EmptyState` definition in the Lucie-app kit with **zero production consumers**, an assistant-kit `ConversationEmptyState`, an `EmptyRows` paragraph in the M08 kit with an equivalent inline paragraph in the M06 kit, a string-based `empty` fallback in the Lucie `Table`, and the ABox `DataTable`'s own `td[colspan]` empty row. These are distinct mechanisms serving distinct surfaces; none is merged, ranked or selected as a winner here.

The shared component renders identically across all seven reachable consumer states at 1440/834/390 with no page-level overflow and no console errors. Its API is small and fully covered by observed usage, but two structural facts are recorded as unresolved: the primary action is not part of the component (each consumer passes a `Link`/`button` with an identical repeated class string), and the title renders as `<p>`, not a heading.

---

## 2. Current source-of-truth evidence

`src/components/abox/empty-state.tsx` is the only shared empty-state component consumed by production routes. It is not canonical merely by name — it is the only definition with production consumers in the web-experience surface, established by import and call-site measurement below.

---

## 3. Exact source path and hash

| Item | Value |
| --- | --- |
| Path | `src/components/abox/empty-state.tsx` |
| md5 | `6cfba448d43364417d733a56ad819b72` |
| Exports | `EmptyState` (component); `Props` is local, not exported |
| Imports | `cn` from `@/lib/utils`, `ComponentType` (type) from `react`, `DiagonalWeave` from `./decor` |

---

## 4. Definition / importer / call-site inventory

**Definitions named or behaving as EmptyState — 3, plus 4 related mechanisms:**

| # | Definition | Path | Production consumers |
| --- | --- | --- | --- |
| 1 | `EmptyState` (ABox) | `src/components/abox/empty-state.tsx` | 8 files |
| 2 | `EmptyState` (Lucie-app kit) | `src/components/lucie-app/ui.tsx:176` | **0 detected** |
| 3 | `ConversationEmptyState` | `src/components/ai-elements/conversation.tsx:43` | assistant kit |
| 4 | `EmptyRows` | `src/components/m08/kit.tsx:343` | M08 screens |
| 5 | inline dashed empty paragraph | `src/components/m06/kit.tsx:240` | M06 screens |
| 6 | `Table` `empty` prop (string) | `src/components/lucie/ui.tsx:167` | Lucie tables |
| 7 | `DataTable` empty row (`td[colspan]`) | `src/components/abox/data-table.tsx` | 19 files (Phase 22/23) |

`src/components/ui/` contains **no** EmptyState-equivalent primitive.

**ABox EmptyState importers/call sites — 8 production files, 8 call sites** (reference routes `design-system.tsx` and `design-guide.tsx` each add one call site and are excluded from all counts):

`cart.tsx`, `plans.index.tsx`, `compare.tsx`, `review.tsx`, `handoff.tsx`, `apply.tsx`, `member.quotes.tsx`, `shared.$token.tsx`. No consumer imports a local or alternate EmptyState.

---

## 5. Complete consumer map

### A. Shared ABox EmptyState consumers

| File | Route | Props used | Variant | Conditional | Reachable? | Auth/data |
| --- | --- | --- | --- | --- | --- | --- |
| `cart.tsx` | `/cart` | `icon={ShoppingCart}`, `title`, `body`, `action` (Link `/plans`) | **only icon variant** | cart empty | yes, default state | none |
| `compare.tsx` | `/compare` | `title`, `body`, `action` (Link `/plans`) | text + action | no compare selection | yes, default | none |
| `review.tsx` | `/review` | `title`, `body`, `action` (Link `/plans`) | text + action | cart empty | yes, default | none |
| `handoff.tsx` | `/handoff` | `title`, `body`, `action` (Link `/plans`) | text + action | cart empty | yes, default | none |
| `apply.tsx` | `/apply` | `title`, `body`, `action` (Link `/plans`) | text + action | on-exchange path | yes, observed | none |
| `member.quotes.tsx` | `/member/quotes` | `title`, `body`, `action` (Link `/plans`) | text + action | no saved plans | yes, default | session restored for observation |
| `shared.$token.tsx` | `/shared/$token` | `className="mt-6"`, **dynamic** `title`, **dynamic** `body`, `action` (Link `/schedule`) | expired vs invalid ternary | invalid/expired token | invalid branch observed; **expired branch not reached** | needs a real expired token |
| `plans.index.tsx` | `/plans` | `title`, `body`, `action` (**`button`** `onClick=clearFilters`) | only `button` action | zero filter matches | **not reached** with the filter clicks attempted | needs a filter combination yielding zero plans |

All eight appear in desktop, tablet and mobile contexts (no consumer gates the empty state by breakpoint).

### B. Alternate EmptyState consumers
None detected for the Lucie-app `EmptyState`. `ConversationEmptyState` is consumed inside the assistant kit only.

### C. Route-local empty-state implementations
Dashed-border blocks appear in `routes/quote.tsx`, `routes/coverage.tsx`, `routes/member.index.tsx`, `routes/plans.$planId.tsx`, `routes/app.jet.branding.tsx`, `routes/app.jet.form-configurator.tsx`, `components/abox/quote-edit-panel.tsx`, `components/m06/screens/access.tsx`. Not all are empty states — several are dashed containers for other purposes. Each requires individual classification before any statement about migration.

### D. Table-specific empty rendering
ABox `DataTable` `td[colspan]` row; Lucie `Table` string `empty`; Lucie-app `DataTable` dashed panel; M08 `EmptyRows`; M06 inline paragraph.

### E. Untouched, unrelated
`PlaceholderScreen`, `LoadingRows`, `Skeleton`, chart empty handling, all shells, branding and marketplace screens.

---

## 6. API / prop usage matrix

```
EmptyState({ icon?, title, body?, action?, className? })
icon: ComponentType<{ className?: string }>
```

| Prop | Required | Uses (8 call sites) | Value kinds |
| --- | --- | --- | --- |
| `title` | **yes** | 8 | 6 literal, 2 dynamic (`shared.$token` ternary; the other literal-with-expression) |
| `body` | no | 8 | 7 literal, 1 dynamic ternary |
| `action` | no | 8 | ReactNode — 7 `<Link>`, 1 `<button>` |
| `icon` | no | **1** | `ShoppingCart` (`cart.tsx`) |
| `className` | no | **1** | `"mt-6"` (`shared.$token.tsx`) |

Not present in the API at all: secondary action, illustration, `children`, `size`, `tone`, `alignment`, container/border variants, min-height, loading or disabled state. Conditional rendering is entirely consumer-owned (`x.length === 0 ? <EmptyState/> : <content/>`).

---

## 7. Rendered DOM and visual-surface inventory (observed, unmodified)

```
div  (no role, no landmark, no aria-live)
  class="relative flex flex-col items-center gap-4 overflow-hidden rounded-lg
         border border-dashed border-border-strong bg-surface/60 px-6 py-14 text-center"
 ├ div.pointer-events-none.absolute.inset-0.[mask-image:…].opacity-40  [aria-hidden="true"]   (DiagonalWeave → DotField)
 └ div.relative.flex.flex-col.items-center.gap-4
   ├ div.flex.h-12.w-12.items-center.justify-center.rounded-md.border.border-hairline.bg-background   (icon variant only)
   │   └ svg  20×20  [aria-hidden]
   ├ p.text-display.text-2xl                       (title)
   ├ p.max-w-md.text-sm.text-muted-foreground      (body, optional)
   └ consumer action node
```

Computed (1440, `/cart`): padding `56px 24px`; border `1px dashed oklch(0.3 0.04 265 / 0.24)`; radius `14px`; background `oklab(0.968 … / 0.6)`; overflow hidden; `align-items: center`; gap `16px` outer and inner; `text-align: center`; `min-height: 0px`; **no shadow, no motion**. Title `Bricolage Grotesque`, 24px / 600 / 32px, `oklch(0.22 0.025 265)`. Body 14px, `oklch(0.5 0.018 265)`, `max-width: 448px`. Icon plate 48×48, radius 10px, hairline border, `oklch(1 0 0)` background; glyph 20×20 in `oklch(0.31 0.09 265)`. Action (all consumers) 114×36, fully rounded, primary background, 14px.

Geometry by route and viewport (width × height):

| Route | 1440 | 834 | 390 |
| --- | --- | --- | --- |
| /cart | 1344 × 306 | 770 × 306 | 358 × 334 |
| /compare | 1344 × 262 | 770 × 262 | 358 × 270 |
| /review | 1344 × 242 | 770 × 242 | 358 × 250 |
| /handoff | 832 × 242 | 770 × 242 | 358 × 250 |
| /member/quotes | 990 × 242 | 416 × 242 | 308 × 282 |
| /shared/\<invalid\> | 704 × 262 | 704 × 262 | 358 × 270 |
| /apply | 832 × 242 | 770 × 242 | 358 × 270 |

Width is set by each consumer's container; padding, typography, gaps, border, radius and icon dimensions are constant at every viewport (the component declares no responsive variants). Height grows only where text wraps. `document.scrollWidth == clientWidth` at 390 on all seven routes — no page-level overflow. Zero console errors across all captures.

Accessibility as observed: plain `div`, no role, no `aria-live`, no landmark; title is a `<p>` so it contributes no heading structure; the decor layer and icon glyph are `aria-hidden`; the only focusable element is the consumer's action.

---

## 8. Alternate implementation inventory

- **Lucie-app `EmptyState`** — API `{ title, body?, action? }`; renders `div.grid.justify-items-center.gap-2.py-6.text-center` with `p.text-base.font-semibold`, `p.max-w-sm.text-sm`, action wrapped in `div.mt-2`. No icon, no className, no border, no background, no decor. Zero production consumers.
- **`ConversationEmptyState`** — defaults for `title`/`description`, `icon` as ReactNode, supports `children` and spread props, `h3.font-medium.text-sm` title, `size-full … p-8`. Assistant-kit specific.
- **M08 `EmptyRows`** / **M06 inline paragraph** — a single `p.rounded-xl.border.border-dashed.border-hairline-strong/60.bg-surface/40.px-4.py-10.text-center.text-sm.text-muted-foreground`. Message only, no title, no action, no icon.
- **Lucie `Table` `empty`** — a string default `"No rows match the current filters."` rendered as a paragraph before the table is built.
- **ABox `DataTable` empty row** — `td[colspan]` `px-5 py-10 text-center text-muted-foreground` inside the table (Phase 23 evidence).
- **Route-local dashed blocks** — see consumer map C; individually unclassified.

No merging, ranking or winner selection is performed.

---

## 9. Duplicate / variant register

| # | Source | Consumers | Purpose | Visual diff | Behavioural diff | Responsive diff | A11y diff | Classification | Migration plausible? |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | ABox `EmptyState` | 8 | full-panel empty state | dashed panel, decor, 24px display title, icon plate | consumer-supplied action node | none declared | `div`, `<p>` title | **candidate** | n/a |
| 2 | Lucie-app `EmptyState` | 0 | inline empty block | no panel/border/decor, 16px title | none | none | same `div`/`p` shape | near-duplicate API, different output; **dormant** | unresolved — no consumers to migrate |
| 3 | `ConversationEmptyState` | assistant kit | chat placeholder | full-size flex, `h3` title | `children` override, spread props | `size-full` | uses heading | **specialization** | unresolved |
| 4 | M08 `EmptyRows` | M08 screens | list/table empty line | single paragraph | message only | none | paragraph only | **specialization** | unresolved |
| 5 | M06 inline paragraph | M06 screens | same as 4 | identical classes to 4 | same | none | same | duplicate **of 4**, not of 1 | unresolved |
| 6 | Lucie `Table.empty` | Lucie tables | table fallback string | paragraph | string only | none | none | **unrelated pattern** | no |
| 7 | `DataTable` empty row | 19 files | in-table empty row | table cell | colspan semantics | inherits table scroll | preserves table semantics | **unrelated pattern** (must stay in-table) | no |
| 8 | route-local dashed blocks | various | mixed | varies | varies | varies | varies | **unclassified** | requires per-file audit |

Visually similar but behaviourally different items (5 vs 1, 7 vs 1) are deliberately not collapsed.

---

## 10. Dependency analysis

| Dependency | Kind | Safe for a future canonical source? |
| --- | --- | --- |
| `cn` (`@/lib/utils`) | class merge utility | yes — already used repo-wide |
| `DiagonalWeave` (`./decor`, aliased to `DotField` at `decor/index.tsx:395`) | decorative layer | yes, but it is the component's only visual dependency and any change to `DotField` propagates to every empty state — record as a coupling |
| `ComponentType` (react type) | type only | yes |
| icons | **consumer-owned** — `ShoppingCart` is imported by `cart.tsx`, not the component | consumer-specific |
| action controls | **consumer-owned** — `Link`/`button` plus a repeated class string | consumer-specific |

No shell, route, store, animation or business-logic dependency. The component is presentation-only.

---

## 11. Foundation trace (no token created or changed)

Colour: `border-border-strong` → `oklch(0.3 0.04 265 / 0.24)`; `bg-surface/60`; `border-hairline`; `bg-background`; `text-primary`; `text-muted-foreground`; title inherits foreground. Typography: `text-display` (Bricolage Grotesque) + `text-2xl` for the title; `text-sm` for body; `max-w-md` measure. Spacing: `px-6 py-14` panel, `gap-4` outer and inner. Radius: `rounded-lg` (14px) panel, `rounded-md` (10px) icon plate. Borders: 1px dashed panel, 1px hairline plate. Shadows: none. Icon sizing: 48px plate, 20px glyph. Motion: none. Accessibility conventions: decorative elements `aria-hidden`; no roles added. Token usage is recorded, not normalized.

---

## 12. Proposed future canonicalization architecture

Candidate canonical source remains `src/components/abox/empty-state.tsx`, unchanged. Any future API proposal is limited to what existing usage already demonstrates: `title` required; `icon`, `body`, `action`, `className` optional. Observed states are exactly two — with icon (1 consumer) and without icon (7) — and two action element kinds (`Link` ×7, `button` ×1) that are consumer-owned and must keep their element type at the call site, following the ActionPill precedent from Phase 17. No size, tone, alignment, illustration, secondary-action, loading or disabled variant is proposed, because none exists in production.

---

## 13. Proposed future migration sequence (not executed)

1. Prove the existing component unchanged against the reachable gates (Group A: `/cart`, `/compare`, `/review`, `/handoff`, `/apply`, `/member/quotes`, `/shared/<invalid>`).
2. Resolve reachability for the two unproven states (`/plans` filtered-empty, `shared.$token` expired branch) before touching either consumer.
3. Only after 1–2, consider whether the repeated action class string is a separate centralization candidate — as its own decision, not as part of EmptyState.
4. Alternate systems (2–8 in the register) are not in any migration group; each needs its own approved phase.

Each step is gated on approval; nothing proceeds on an unexplained difference.

---

## 14. Future proof-gate routes

| Gate | Why | Compare |
| --- | --- | --- |
| `/cart` | the only `icon` variant | DOM, classes, computed styles, geometry, icon plate/glyph dimensions, action navigation |
| `/compare` | plain text+action default | DOM, classes, styles, geometry, content |
| `/review` | cart-dependent state | same, plus state transition when a plan is added |
| `/handoff` | narrower container (832 px at 1440) | width-driven geometry |
| `/member/quotes` | MemberShell context, narrowest containers | shell integration, geometry at 990/416/308 |
| `/shared/<invalid-token>` | only `className` override and only dynamic title/body | class-string concatenation order, dynamic content |
| `/apply` | MarketplaceShell context | shell integration |
| `/plans` filtered-empty | only `button` action | **unreached** — see §19 |

For each: DOM hierarchy, verbatim class strings, computed styles, geometry, content, iconography, action interaction and navigation, accessibility semantics, responsive behaviour at three viewports, shell context, console output.

---

## 15. Exact-preservation regression protocol

At 1440 / 834 / 390 for every gate: exact rendered output, wrapping, spacing, dimensions, responsive behaviour, action hover/focus states, page-level overflow (`scrollWidth == clientWidth`), shell integration, route/navigation behaviour, console errors, `tsgo` typecheck, build, ESLint. Pre-existing findings are recorded separately from any migration finding. If exact output cannot be preserved, the difference is logged as an unresolved migration decision — the application is not changed to match.

---

## 16. Accessibility verification plan

Verify and record (do not change): the panel remains a plain `div` with no role or `aria-live`; the title remains `<p>` and contributes no heading level; the decor layer and icon glyph remain `aria-hidden`; the consumer action is the only focusable element, reachable by Tab with a visible focus ring; content order matches DOM order; no ARIA is added, and specifically no heading promotion or `role="status"`.

---

## 17. Responsive verification plan

Three viewports per gate: panel width and height, padding, gaps, typography, icon plate and glyph, action dimensions, text wrapping, body `max-width` clamp (448px), container-driven width differences, and absence of page-level overflow. The component declares no breakpoint variants; any measured difference must be attributable to the consumer's container or to text wrapping.

---

## 18. Branding / Marketplace boundary

EmptyState imports no branding, logo, white-label or marketplace-asset module and reads no branding or marketplace store. Runtime branding remains owned by `/app/jet/branding` and `/marketplace/admin/brand`; marketplace asset state remains owned by `/marketplace/admin/assets` and `marketplace-store.ts`. This phase neither duplicates nor interferes with either, and adds no asset.

---

## 19. Risks and blockers

1. `/plans` filtered-empty was **not reached** with the filter interactions attempted; the only `button`-action consumer therefore remains unproven. It must be reached through existing filters, or treated as unproven — not manufactured.
2. The `shared.$token` **expired** branch requires a genuinely expired token; only the invalid branch was observed.
3. The action markup is duplicated verbatim at 7 call sites; touching it is a separate decision with its own risk.
4. The `<p>` title means empty states contribute no heading structure; changing it would alter accessibility output and is therefore out of scope.
5. `DiagonalWeave`/`DotField` coupling: any change there propagates to all eight empty states.
6. The dormant Lucie-app definition may be re-consumed at any time, which would change the duplicate picture.

---

## 20. Explicit unresolved decisions

Whether alternate systems merge; whether route-local dashed blocks migrate; whether kit-level `EmptyRows`/M06 paragraph migrate; whether table empty states (`DataTable`, Lucie `Table`) ever become EmptyState consumers; whether the action becomes a prop-driven control or stays a ReactNode; whether the title becomes a heading; whether `body` is renamed to `description`; whether an `icon` ReactNode form is accepted alongside `ComponentType`; whether visual differences between implementations are normalized; whether the dormant Lucie-app definition is retained; whether size/tone/alignment variants are introduced; whether `aria-live`/`role="status"` is appropriate for filtered-empty results. **All remain open.**

---

## 21. Production-change confirmation

`git status` shows no production source, route, style, foundation, component, dependency, branding or marketplace file changed. `src/components/abox/empty-state.tsx` hash remains `6cfba448d43364417d733a56ad819b72`. The only file added for this phase is this planning document. Implementation was not performed.

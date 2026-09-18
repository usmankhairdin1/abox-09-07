# Phase 24 — EmptyState Canonical Production Implementation Plan (PLAN ONLY)

Planning only. No production file is created, edited, renamed, migrated, normalized or fixed. Deliverable is one document: `.lovable/phase-24-empty-state-canonical-production-implementation-plan.md`.

## Evidence gathered (read-only, current repository)

**Candidate source:** `src/components/abox/empty-state.tsx`, md5 `6cfba448d43364417d733a56ad819b72`.

**Definitions found — three, plus related patterns:**
1. `EmptyState` in `src/components/abox/empty-state.tsx` — the candidate.
2. `EmptyState` in `src/components/lucie-app/ui.tsx:176` — different API and output, **zero production consumers detected**.
3. `ConversationEmptyState` in `src/components/ai-elements/conversation.tsx:43` — assistant-kit component with defaults, `children`, `icon` as ReactNode.
- `src/components/ui/` contains **no** EmptyState-equivalent primitive.
- `src/components/lucie/ui.tsx` has no EmptyState component; its `Table` takes an `empty` string, and `IdList` an `empty` fallback.
- `EmptyRows` in `src/components/m08/kit.tsx:343` and the equivalent inline paragraph in `src/components/m06/kit.tsx:240` are dashed-border empty paragraphs.
- Table empty states are rendered by ABox `DataTable` itself as a `td[colspan]` row (Phase 22/23 evidence) — a separate mechanism.

**ABox EmptyState consumers — 8 production files, 8 call sites** (`design-system.tsx` and `design-guide.tsx` are reference routes and excluded): `cart.tsx`, `plans.index.tsx`, `compare.tsx`, `review.tsx`, `handoff.tsx`, `apply.tsx`, `member.quotes.tsx`, `shared.$token.tsx`. All are web-experience/marketplace routes; none are dashboard routes.

**API:** `title` required; `icon`, `body`, `action`, `className` optional. Measured usage: `title` 8 (2 dynamic/ternary, 6 literal), `body` 8 (1 dynamic), `action` 8 (7 `Link`, 1 `button`), `icon` 1 (`ShoppingCart` in `cart.tsx`), `className` 1 (`mt-6` in `shared.$token.tsx`). No `children`, no secondary action, no illustration prop, no size/tone/alignment props — none exist.

**Rendered anatomy:** a single `div` (non-semantic, no landmark, no role, no aria-live) with `relative flex flex-col items-center gap-4 overflow-hidden rounded-lg border border-dashed border-border-strong bg-surface/60 px-6 py-14 text-center`, a `DiagonalWeave` decor layer at `opacity-40` (aliased to `DotField` in `decor/index.tsx:395`), an inner centered stack, an optional 48×48 icon plate (`rounded-md border border-hairline bg-background`) with a 20px `text-primary` glyph marked `aria-hidden`, `p.text-display.text-2xl` for the title, optional `p.max-w-md.text-sm.text-muted-foreground` body, and the raw `action` node. Dependencies: `cn`, `DiagonalWeave`. No motion, no shell or route coupling.

**Observation (recorded, not fixed):** the action button styling is repeated verbatim at 7 call sites as a bare class string, and the title uses `<p>` rather than a heading.

## Plan for the document

The plan document will contain all 21 required sections, built from the evidence above plus one read-only browser pass:

1. **Executive summary** — one shared ABox EmptyState with 8 production consumers, a dormant second definition, an assistant-kit variant, and separate table/kit empty mechanisms.
2–4. **Source-of-truth, path/hash, definition/importer/call-site inventory** as measured above, with reference routes excluded.
5. **Consumer map** — per file: route, implementation imported, prop configuration, whether the empty state is naturally reachable (cart/review/handoff/compare empty by default; plans requires an over-restrictive filter; member.quotes requires no saved plans; apply requires an on-exchange plan path; `shared/$token` requires an invalid or expired token), and whether authentication or seeded data is needed.
6. **API/prop usage matrix** — required/optional/omitted, literal vs dynamic vs ReactNode, className overrides, consumer-owned conditional rendering.
7. **Rendered DOM and visual-surface inventory** — captured live at 1440/834/390 on reachable routes: DOM hierarchy, verbatim class strings, computed typography, colours, dashed border, radius, background, padding, gaps, min-height, icon plate and glyph dimensions, action dimensions, alignment, focus states on the action, accessibility semantics. Read-only.
8. **Alternate implementation inventory** — ABox, lucie-app (dormant), `ConversationEmptyState`, `m08 EmptyRows`, `m06` inline paragraph, `lucie Table.empty`, ABox `DataTable` `td[colspan]`, plus route-local dashed-border blocks. No merging, no ranking.
9. **Duplicate/variant register** — per implementation: source, consumers, purpose, API, visual/behavioural/responsive/accessibility/content differences, classification as true duplicate, specialization or unrelated pattern, migration plausibility, unresolved decisions.
10. **Dependency analysis** — `cn` and `DiagonalWeave` as the only dependencies; which are safe for a future canonical source and which belong to consumers.
11. **Foundation trace** — `border-border-strong`, `bg-surface/60`, `rounded-lg`, `text-display`, `text-2xl`, `text-sm`, `text-muted-foreground`, `text-primary`, `border-hairline`, gap/padding scale, icon sizing, absence of motion and shadow. No token created or changed.
12–13. **Proposed future canonicalization architecture and migration sequence** — retain the existing source as candidate; propose API changes only where existing usage justifies them; group consumers by reachability; sequence one group at a time behind approval gates. No implementation.
14. **Future proof-gate routes** — `/cart` (icon variant, default-empty), `/plans` (filtered empty via existing filters, `button` action), `/review` and `/handoff` (cart-dependent empty), `/compare` (default empty), `/member/quotes` (saved-plans empty), `/shared/<invalid-token>` (dynamic title/body plus `className` override), `/apply` (on-exchange path — treated as possibly unreachable). For each: exactly what is compared — DOM, class strings, computed styles, geometry, content, iconography, interactions, navigation, accessibility, responsive behaviour, shell context, console.
15–17. **Exact-preservation regression, accessibility and responsive protocols** at 1440/834/390, covering wrapping, spacing, dimensions, interactive states, page-level overflow, shell integration, navigation, console, typecheck, build, lint — with pre-existing findings recorded separately.
18. **Branding/Marketplace boundary** — EmptyState touches no branding, white-label or marketplace-asset ownership; those remain owned by their existing runtime stores and admin screens.
19. **Risks and blockers** — states that cannot be reached without altering data or logic; the repeated inline action class string; the `<p>` title; the decor layer; the dormant second definition.
20. **Unresolved decisions** — whether alternate systems merge, whether route-local and kit empty states migrate, whether table empty states become EmptyState consumers, whether the action should become a prop-driven control, whether the title should become a heading, whether props are renamed, whether visual differences are normalized. All left open.
21. **Confirmation** that no production file was modified, with `git status` evidence.

## Validation

Confirm `git status` clean apart from the planning document; no production source, route, style, foundation, component, dependency, branding or marketplace file changed. Implementation is not performed.

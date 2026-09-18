# Phase 37 — Production Control Sizing & Icon Sizing Source-of-Truth (PLAN ONLY)

## 1. Objective

Determine whether repeated production control-sizing and icon-sizing patterns can be linked to one canonical source without changing a single pixel, dot, interaction, route, asset or responsive behaviour. Source-of-truth phase only — not a redesign, not normalization. Zero migration is a valid outcome.

## 2. Preservation contract

Same DOM element, hierarchy, attributes, class string (byte-identical), computed styles, dimensions, text metrics, icon geometry, spacing, hover/focus/active/disabled behaviour, keyboard behaviour, ARIA, responsive wrapping/overflow, routes, business logic, loading/error/empty behaviour, console behaviour. No height/icon-size/padding/gap/radius/colour change for consistency. No universal polymorphic Control or Icon component. No icon replacement. Branding & White-Label runtime, Marketplace Asset Management runtime, shells and reference layers untouched.

## 3. Fresh inventory methodology

Read-only sweep of production `src/routes` and `src/components/abox` (reference and excluded systems skipped). Enumerate by exact class substring, then open each call site to read element type, role, state classes and surrounding geometry. Classification never comes from counts alone. Reachability recorded per call site (public vs auth-gated) before any eligibility claim.

## 4. Control-sizing inventory (measured this phase)

Heights in use: `h-10` 136, `h-11` 65, `h-9` 32, `h-8` 29, `h-14` 5, `h-12` 5, `h-7` 4.
Square icon-control wrappers: `h-8 w-8` 9, `h-9 w-9` 8, `h-10 w-10` 5, `h-11 w-11` 4, `h-7 w-7` 1.

Pill-shaped action controls still written literally (top repeats):
| Class string | Count | Nearest canonical | Difference |
| --- | --- | --- | --- |
| `inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90` | 7 | `ACTION_PILL.primaryMd` | no `gap-1.5`, `px-5` not `px-4` |
| `inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground` | 6 | `primaryMd` | no hover rule |
| `inline-flex h-10 items-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground` | 5 | `primaryMd` | no gap, no hover |
| `inline-flex h-10 items-center rounded-full border border-border px-4 text-sm hover:bg-accent` | 3 | `outlineMd` | no gap, no `font-medium` |
| `inline-flex h-8 items-center gap-1 rounded-full border border-border px-3 text-xs hover:bg-accent` | 3 | `outlineXs` | no `font-medium` |
| `inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground` (+`disabled:opacity-60` on two) | 4 | `primaryLg` | no gap, `px-5` not `px-6`, no hover |

Plus a long tail of one-off destructive, sage, ghost and disabled variants.

## 5. Icon-sizing inventory

Bare icon size classes: `h-4 w-4` 146, `h-3.5 w-3.5` 44, `h-3 w-3` 29, `h-5 w-5` 14, `h-8 w-8` 6, `h-6 w-6` 1, `size-5` 1, `size-3.5` 1. The `size-*` pair are isolated outliers against an overwhelmingly `h-N w-N` vocabulary.

## 6. Ownership map

| Source | md5 | Owns |
| --- | --- | --- |
| `abox/action-pill.ts` | 64024bf5… | 8 exact pill class strings (primary Xs/Md/Lg, outline Xs/Sm/SmCard/Md/Lg) |
| `abox/action-pill-component.tsx` | 4c9fb916… | `ActionPill` native button + `actionPillClass()` for Link/anchor consumers |
| `abox/control.tsx` | 1c6efd5c… | form-control surface: height (`h-10`/`h-11`), `w-full rounded-lg border border-border bg-background px-3`, opt-in focus ring. Class-level only |
| `ui/button.tsx` | f7a5102d… | shadcn sizes default `h-9 px-4 py-2`, sm `h-8`, lg `h-10 px-8`, icon `h-9 w-9`, icon-sm `h-8 w-8` — imported by 11 route files; ABox pills are a deliberately separate rounded-full system and must not be merged into it |
| `ui/input.tsx` / `checkbox.tsx` / `switch.tsx` / `tabs.tsx` | — | `h-9` input, `h-4 w-4` checkbox, `h-5 w-9` switch, `h-9` tab list — primitive-owned, untouched |
| PageHeader, KpiCard, EmptyState, field.tsx, NoticePage, StatusBadge | — | component-intrinsic sizing, ownership preserved |

## 7. Semantic taxonomy

Controls: primary / secondary / tertiary / compact / full-size action, form input, select, textarea, checkbox, radio, switch, tab, pagination, icon-only action, table row action, navigation action, dialog action, step action, auth action, and the workspace-specific (marketplace-admin, member, agent, agency) actions. Icons: icon-only control icon, leading, trailing, navigation, table/action, status, field, decorative, empty-state, page-header, component-specific, shell-specific, bespoke. Roles are never merged on shared height alone.

## 8. Existing canonical sources

ActionPill (pill actions), controlClass (form-control surface), shadcn primitives (their own controls), component-intrinsic sizing. No further canonical sizing source exists and none is proposed beyond additive ActionPill variants below.

## 9. Candidate centralization opportunities

Eligibility requires ≥2 **independently measurable** consumers. Only two groups qualify; both sit on publicly reachable routes.

**Group P1 — h-10 plain outline pill** (`inline-flex h-10 items-center rounded-full border border-border px-4 text-sm hover:bg-accent`)
- `coverage.tsx:40` — `Link`
- `compare.tsx:72` — `button`
- `plans.$planId.tsx:76` — `Link`
Distinct from `outlineMd` (which carries `gap-1.5 … font-medium`), so an additive variant is required rather than reuse.

**Group P2 — h-11 px-5 plain primary pill** (`inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground`)
- `ichra.tsx:77` — `Link`
- `schedule.tsx:107` — submit `button`
- `schedule.tsx:66` — `button` + trailing `disabled:opacity-60`
- `ai-review.tsx:130` — `button` + trailing `disabled:opacity-60`
Distinct from `primaryLg` (`gap-1.5 … px-6 … hover:bg-primary/90`). The two `disabled:` consumers stay byte-identical only because the extra class is appended last through `cn()`, matching current order — verified per consumer before migration.

**Not eligible.** Every other repeated pill string (7×, 6×, 5× groups) lives entirely on `/app/*`, `/agency/*`, `/platform/*`, `/marketplace/admin/*` — auth-gated, NOT CAPTURED, left literal.

**Icon sizing — zero migration proposed.** `h-4 w-4` spans leading control icons, nav icons, table action icons, status icons and decorative icons: identical dimensions, different semantic roles. A shared token would conflate roles while producing exactly the same string it replaces, and risks pulling wrapper/gap geometry into an icon abstraction. No icon size token, no icon registry, no `size-*` normalization. The two stray `size-*` uses are recorded as fragmentation, not repaired.

## 10. Exact equivalence criteria

Per candidate: same semantic role, element type or class-helper boundary, byte-identical emitted class string, same height/min-height, same horizontal/vertical padding, same text metrics, same border/radius, same icon geometry where an icon participates, same responsive behaviour, same hover/focus/active/disabled geometry, same accessibility semantics, no business coupling, ≥2 measurable consumers, and centralization must not conflate roles. Any failure ⇒ leave literal and record why.

## 11. Auth-gated limitations

`LOVABLE_BROWSER_AUTH_STATUS=signed_out`; `/app/*`, `/agency/*`, `/platform/*`, `/marketplace/admin/*`, `/member/*` render blank. Those consumers are inspected in source, marked NOT CAPTURED and left literal. Source repetition alone never authorizes migration.

## 12. Proposed migration batches

**Batch 0 (source, additive only).** Add two variants to `ACTION_PILL`, copied byte-for-byte from the existing literals: `outlineMdPlain` and `primaryLgPlain`. No existing variant, key, emission or API changes; `action-pill-component.tsx` untouched. New hash recorded; all eight existing variants diffed to prove unchanged.

**Batch 1 (proof consumer).** `coverage.tsx:40` only — `Link` class replaced with `actionPillClass("outlineMdPlain")`. Full evidence capture. Any measurable difference ⇒ stop, revert, record incompatibility, abandon the group.

**Batch 2.** `compare.tsx:72` (button → `ActionPill` component only if the emitted `<button>` attributes/handlers match exactly; otherwise `actionPillClass`), gated independently.

**Batch 3.** `plans.$planId.tsx:76`.

**Batch 4.** `schedule.tsx:107` proof consumer for Group P2, then **Batch 5** `ichra.tsx:77`, **Batch 6** `schedule.tsx:66` (with `disabled:opacity-60` passed as the trailing extra), **Batch 7** `ai-review.tsx:130` — each independently gated.

Any batch may end in "leave literal". Zero-migration remains acceptable if Batch 1 fails.

## 13. Exact proof methodology

Per consumer, before and after, at 1440 / 834 / 390: DOM tree, attributes, byte-compared `class` string, computed width/height/min/max, padding, gap, border, radius, font family/size/line-height/weight/letter-spacing, icon bounding box and wrapper geometry, control bounding rect, hover and focus geometry, disabled geometry where applicable, wrapping, truncation, overflow, scroll dimensions, keyboard activation, accessible name and role, route/navigation result for `Link` consumers, console output. Playwright captures written under `/tmp/browser/p37/`.

## 14. Expected source changes

`src/components/abox/action-pill.ts` — two additive keys only. Possibly `action-pill-component.tsx` untouched (types derive from the map).

## 15. Expected zero-change paths

`control.tsx` (its ownership is sufficient; no API expansion), all shadcn primitives, all icon sizing, all component-intrinsic sizing, all shells, all auth-gated routes, all reference layers, Branding runtime, Marketplace runtime, all assets.

## 16. Explicit exclusions

`/design-system`, `/design-guide`, `src/lib/design/*`, `src/components/design/*`, Branding & White-Label, Marketplace Asset Management, Lucie, Lucie-app, M06, M08, ai-elements, shells, bespoke business controls, icon-library normalization, visual redesign, new lint rules.

## 17. Governance (after implementation only)

`.lovable/manual-work-map.md` records: canonical control-sizing owners (ActionPill, controlClass, shadcn primitives, component-intrinsic), canonical icon-sizing owner (none — deliberately decentralized, with reason), intentional duplicates, excluded systems, auth-gated NOT CAPTURED consumers, deferred candidates, non-centralization reasons, and prerequisites for future migration (an authenticated session).

## 18. Validation commands

`npx tsgo --noEmit`; production build; ESLint on touched files only, compared against the pre-existing prettier baseline; `git status` and `git diff` review; Playwright verification per migrated consumer; console comparison; responsive comparison; accessibility/keyboard verification; `md5sum` of every locked source.

## 19. Locked sources / hashes

`action-pill.ts` 64024bf5f0ed7f4c1b714a9d3939e9fe (the only file permitted to change, additively), `action-pill-component.tsx` 4c9fb9167b9cf98c17b792387dd73b44, `control.tsx` 1c6efd5cf752b69d16458b6af82b5d4f, `ui/button.tsx` f7a5102d0cde43e7b5892e91bc612c43, plus page-header 5be9e6ea…, kpi-card 9279cd20…, empty-state 6cfba448…, field f35b2364…, surface 51b51b31…, notice-page 81ee6c0f…, styles.css 534cd653… — all must be unchanged at the end.

## 20. Rollback

Per consumer: restore the original literal class string and drop the import. Per source: remove the two additive keys. Rollback is independent per batch and leaves Phases 29–36 untouched.

## 21. Final acceptance criteria

Complete fresh inventory and ownership map; every candidate in exactly one bucket; each migrated consumer byte-identical in class output and measured identical in DOM, computed styles, geometry, icon geometry, states, responsive behaviour, accessibility, routing and console at all three widths; no existing ActionPill variant altered; all other locked hashes unchanged; typecheck and build clean; no new lint findings; zero icon-size changes; zero-migration accepted as success if Batch 1 fails the gate.

PLAN ONLY — nothing is implemented until this is approved.

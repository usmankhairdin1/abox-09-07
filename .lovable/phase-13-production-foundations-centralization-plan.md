# PHASE 13 — Production Foundations Centralization Plan

**PHASE 13 IS PLAN ONLY. NO PRODUCTION APPLICATION CHANGES HAVE BEEN MADE.**

**The existing rendered application is the preservation baseline. Any future foundation centralization must reproduce the existing visual, responsive, accessibility, interaction, navigation, content, branding, asset, and business-logic behavior exactly.**

If centralization of an item cannot preserve current output exactly, that item is documented as limited and deferred. Nothing is improved, cleaned up, standardized, modernized or normalized because it appears inconsistent. Observed differences may be intentional experience differences, legacy differences, route-local decisions or unresolved design decisions, and all of them are preserved.

**Measurement method.** Every count is from a search of today's code. Class and literal counts are occurrence counts across `src/routes` and `src/components` with `src/lib/design/**` and `src/components/design/**` excluded. Component counts are importing files under the same exclusion. Token values are quoted from `src/styles.css` as it stands today (480 lines, 198 custom-property declarations).

---

## SECTION 1 — CURRENT PRODUCTION FOUNDATION INVENTORY

| # | Category | Source | Token / class / literal | Current value | Usage | Representative consumers | Prod/Ref | Shared/Local | Light-dark dependent | Experience-specific | Route-specific | Centralized today | Duplicated | Safe to centralize | Blockers | Preservation risk |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Colours (raw) | `src/styles.css` `:root` L91–175, `.dark` L178–238 | oklch literals | e.g. `--primary: oklch(0.31 0.090 265)` light / `oklch(0.68 0.125 255)` dark | all themed UI | every screen | Prod | Shared | Yes | No | No | **Yes** | No | Already done | — | None |
| 2 | Semantic colour roles | `@theme inline` L32–79 | `--color-*` → `var(--*)` | 48 mappings | all | every screen | Prod | Shared | Yes | No | No | **Yes** | No | Already done | — | None |
| 3 | Backgrounds | L94 `--background: oklch(1 0 0)`, `--surface`, `--panel`, `--card`, `--popover` | tokens | white canvas, `0.968`, `0.945`, white card | all | shells, cards | Prod | Shared | Yes | No | No | **Yes** | No | Already done | — | None |
| 4 | Foregrounds | `--foreground` `oklch(0.22 0.025 265)`, `--muted-foreground` `oklch(0.50 0.018 265)`, `*-foreground` pairs | tokens | as quoted | all | all text | Prod | Shared | Yes | No | No | **Yes** | No | Already done | — | None |
| 5 | Borders | `--border` `oklch(0.30 0.04 265 / 0.10)`, `--border-strong` `/0.24`, `--hairline` `/0.11` | tokens + `border-color: var(--color-border)` default L241 | as quoted | all | cards, tables, shells | Prod | Shared | Yes | No | No | **Yes** | Three near-identical alphas coexist by design | Already done | — | None |
| 6 | Inputs | `--input` `oklch(0.30 0.04 265 / 0.16)` | token | as quoted | `ui/input.tsx` (7 importers) + raw elements | admin forms | Prod | Shared token, local usage | Yes | No | No | Token yes, usage no | Yes (raw elements) | Token already; usage no | Raw `<input>` in 15+ routes | Medium |
| 7 | Focus / ring | `--ring` = `--primary`; `::selection` L276 | token | light `oklch(0.31 0.090 265)`, dark `oklch(0.68 0.125 255)` | primitives + custom controls | all | Prod | Shared token | Yes | No | No | Token yes | Focus treatment differs per control | Token already | Custom `aria-pressed` controls define their own rings | Medium |
| 8 | Status colours / tones | `--destructive`, `--warning`, `--info`, `--success` + five tone mappers | tokens + `abox/status-badge.tsx` (87), `m06/kit.tsx` `statusTone`, `m08/kit.tsx` `OutcomeTag`, `lucie/ui.tsx` `postureTone`, `lucie-app/ui.tsx` `toneFor` | as declared | 87 + kit consumers | tables, badges | Prod | Tokens shared, vocabularies local | Yes | Yes | No | Tokens yes, tones **no** | Yes, 5 systems | Tokens already; tones no | Domain enumerations differ | High |
| 9 | Metal / tier colours | L139–151 light, L205–217 dark | `--metal-{bronze,expanded-bronze,silver,gold,platinum,catastrophic}` + `-fg` | e.g. bronze `oklch(0.56 0.105 58)` / fg `oklch(0.99 0 0)` | 1 component, 2 importers | `abox/metal-badge.tsx` | Prod | Shared | Yes | Yes (commerce) | No | **Yes** | No | Already done | — | None |
| 10 | Typography families | `@theme inline` L27–30; loaded via `src/routes/__root.tsx` L96–100 | `--font-sans` Inter Tight, `--font-display` Bricolage Grotesque, `--font-serif` and `--font-mono` both alias Bricolage/Inter Tight | as quoted; Google Fonts link also requests JetBrains Mono, which no token references | all | all text | Prod | Shared | No | No | No | **Yes** | Serif/mono are aliases, not distinct families | Already done | Changing the aliases changes `text-eyebrow`/`text-serial` | Medium |
| 11 | Typography weights | base layer L257–262 (`h1,h2,h3,.font-display` = 600) + literals | `font-medium` 445, `font-semibold` 163, `font-normal` 10, `font-bold` 1 | as measured | all | everywhere | Prod | Local | No | No | Yes | **No** | Yes | No | No weight scale exists | High |
| 12 | Typography sizes | utilities + literals | `text-sm` 847, `text-xs` 497, `text-xl` 94, `text-2xl` 61, `text-[10px]` 39, `text-base` 30, `text-lg` 29, `text-[11px]` 23, `text-3xl` 20, `text-4xl` 19, `text-5xl` 7, `text-[0.8rem]` 4, `text-[10.5px]` 3, `text-[9px]` 1 | as measured | all | everywhere | Prod | Local | No | Yes | Yes | **No** | Yes | No | Arbitrary px sizes; line-break preservation | High |
| 13 | Line heights | literals | `leading-relaxed` 20, `leading-none` 16, `leading-tight` 4, `leading-snug` 3, `leading-[0.98]` 2 | as measured | headings, body | Prod | Local | No | No | Yes | **No** | Yes | No | Wrapping risk | High |
| 14 | Tracking | base layer `-0.028em` for h1–h3 + literals | `tracking-widest` 18, `tracking-[0.18em]` 17, `tracking-tight` 10, `tracking-[0.12em]` 8, `tracking-[0.14em]` 2, `tracking-[0.08em]` 2, `tracking-wide` 1 | as measured | eyebrows, badges, headings | Prod | Partly shared (base layer) | No | No | Yes | Partly | Yes, five uppercase values | No | Five coexisting values | High |
| 15–18 | Spacing / gaps / padding / margins | Tailwind literals | `gap-2` 336, `px-3` 235, `px-5` 222, `p-5` 208, `gap-3` 183, `py-4` 169, `px-4` 154, `gap-4` 145, `gap-1.5` 133, `gap-1` 105, `py-2` 104, `py-3` 89, `p-3` 80, `p-4` 71, `gap-6` 53, `py-1.5` 51, `p-6` 47, `px-8` 36 | as measured | all | everywhere | Prod | Local | No | Yes | Yes | **No** | Yes | No | No spacing model | High |
| 19 | Containers / max widths | literals | `max-w-[88rem]` 23 (web-experience width), `max-w-3xl` 17, `max-w-lg` 14, `max-w-2xl` 14, `max-w-md` 11, `max-w-4xl` 9, `max-w-xs` 7, `max-w-xl` 6, `max-w-full` 6, `max-w-[420px]` 5, `max-w-sm` 3 | as measured | shells, routes | Prod | Repeated literal | No | Yes | Yes | **No** — `88rem` is repeated 23 times, not tokenized | Yes | Technically yes for `88rem` | Which routes count as web experience | Medium |
| 20 | Breakpoints | Tailwind defaults; no custom config | `md:` 262, `sm:` 176, `lg:` 96, `xl:` 22 | defaults | all | everywhere | Prod | Shared via Tailwind | No | Yes | Yes | **Yes** (framework) | No | n/a | — | None |
| 21 | Control heights | `ACTION_PILL`, `ui/button.tsx`, kits, routes | `h-10` 139, `h-11` 66, `h-9` 43, `h-8` 40, `h-12` 7; base layer forces `min-height: 44px` on button/a below 640px (L264–266) | as measured | all controls | Prod | Multiple | No | Yes | Yes | **No** | Yes | No | Coexisting densities; mobile min-height interacts | High |
| 22 | Control padding | literals inside `ACTION_PILL` and primitives | `px-3` / `px-4` / `px-5` / `px-6` per variant | see §8 | all controls | Prod | Partly (pills centralized) | No | Yes | Yes | Partly | Yes | Partly | Tied to height decisions | High |
| 23 | Icon sizes | literals | `h-4 w-*` 287, `h-3.5` 68, `h-5` 32, `h-6` 4 | as measured | all | everywhere | Prod | Local | No | Yes | Yes | **No** | Yes | No | No icon scale | Medium |
| 24 | Icon wrappers | components | PageHeader plate `h-9 w-9` compact / `h-12 w-12 md:h-14 md:w-14` default, `rounded-2xl`; EmptyState plate `h-12 w-12`, `rounded-md` | as quoted | PageHeader 23, EmptyState 8, shells, routes | Prod | Multiple | No | Yes | Yes | **No** | Yes | No | Differing radius and size | Medium |
| 25 | Border widths | literals | `border`, `border-b`, `border-t`, `border-dashed` | 1px default | all | everywhere | Prod | Local | No | No | Yes | **No** | Yes | No | — | Low |
| 26 | Radius | `@theme inline` L19–25: `sm 6px, md 10px, lg 14px, xl 18px, 2xl 22px, 3xl 28px, 4xl 36px`; `--radius: 0.875rem` L92 | usage literals: `rounded-2xl` 333, `rounded-full` 302, `rounded-lg` 170, `rounded-xl` 113, `rounded-md` 52, `rounded-sm` 21, `rounded-3xl` 17 | as quoted | all | everywhere | Prod | Tokens shared, choice local | No | Yes | Yes | Tokens **yes**, application **no** | Choice varies per concept | Tokens already | Which radius per concept | Medium |
| 27 | Shadows / elevation | `@theme inline` L82–87 | `--shadow-card`, `--shadow-elevated`, `--shadow-drawer`, `--shadow-plate`, `--shadow-glow`, plus alias `--shadow-overlay: var(--shadow-elevated)` L462 | as quoted | `shadow-card` 35, `shadow-glow` 9, `shadow-elevated` 6, `shadow-plate` 4; also Tailwind defaults `shadow-sm` 13, `shadow-lg` 8, `shadow-md` 7, `shadow-xs` 3 | cards, shells, plates | Prod | Tokens shared; Tailwind defaults used alongside | Yes (oklch navy tint) | No | Yes | Tokens **yes**; two shadow systems coexist | Yes | Tokens already | Tailwind default shadows are a second system | Medium |
| 28 | Opacity | literals | `/90`, `/80`, `/60`, `/40`, `opacity-40`; arbitrary colours limited to `bg-black/80` 4 and `bg-black/40` 1 | as measured | overlays, hovers | Prod | Local | No | No | Yes | **No** | Yes | No | Overlay scrims are literal, not tokenized | Low |
| 29 | Motion | `@keyframes abox-*` + classes | `.animate-fade-rise` 500ms cubic-bezier(0.2,0.7,0.2,1); `.animate-hairline` 620ms same easing, origin left; `.animate-orbit` 22s linear infinite; `.animate-orbit-slow` 60s; `.animate-drift` 6s ease-in-out infinite; `.animate-pulse-ring` 2.4s; `.animate-shimmer`; plus literals `transition-colors` 53, `transition-all` 23, `transition-transform` 20, `animate-in` 19, `animate-out` 18, `duration-300` 11, `duration-200` 9; reduced motion L268–274 | as quoted | decor, PageHeader hairline, FadeRise, shells | Prod | Keyframes shared, transitions local | No | Yes | Yes | Keyframes **yes**, transitions **no** | Transition literals repeated | Keyframes already | tw-animate-css provides a second motion system | Medium |
| 30 | Density conventions | not tokenized | expressed through control heights, padding, table rows, text sizes | n/a | all | everywhere | Prod | Local | No | Yes | Yes | **No** | Yes | No | No density model exists | High |

Categories explicitly labelled **NO SINGLE SOURCE OF TRUTH — CURRENTLY LOCAL/MULTIPLE**: typography weights, typography sizes, line heights, tracking, spacing/gaps/padding/margins, containers and max widths, control heights, control padding, icon sizes, icon wrappers, border widths, radius application, opacity, transition literals, density, status tone vocabularies.

---

## SECTION 2 — TRUE CURRENT SOURCES OF TRUTH

**A. Actual production source of truth** — `src/styles.css`: colour variables (both themes), semantic `--color-*` mappings, radius scale, font family aliases, shadow tokens, metal tier tokens, utility classes (`text-display`, `text-eyebrow`, `text-serial`, `noise-field`, `contour`, `aurora`, `glass`, `ember-underline`, `ring-pill`, `divider-warm`, `card-brackets`, `edge-sheen`), the six `abox-*` keyframes and their classes, the base layer (default border colour, heading family/weight/tracking, mobile 44px min-height, reduced motion, selection).

**B. Shared production implementation** — `src/components/abox/action-pill.ts` (33), `status-badge.tsx` (87), `metal-badge.tsx` (2), `page-header.tsx` (23), `data-table.tsx` (19), `kpi-card.tsx` (16), `empty-state.tsx` (8), `plan-card.tsx` (4), the three shells (89 / 30 / 4), `src/lib/nav-config.ts`, `src/components/ui/*` where imported (Button 22, Input 7, Select 7, Card 6, Skeleton 4, Dialog 4, Tooltip 4, Tabs 3, Textarea 3, Sheet 3, DropdownMenu 3), `src/lib/utils.ts`, `src/lib/format.ts`.

**C. Reference / specification only** — `src/lib/design/*` (118 modules), `src/components/design/reference-kit.tsx`, `src/routes/design-system.tsx`, `src/routes/design-guide.tsx`, `.lovable/design-system.md`, `roadmap.md`, `.lovable/manual-work-map.md`, `.lovable/phase-12-component-architecture-plan.md`, this document. **Verified:** no file outside these imports them. Note that `src/lib/design/iconography.ts`, `assets.ts`, `components.ts` and `icon-motion-density.ts` *mention* Tabler and Font Awesome; that is documentation text, not a production dependency. Documentation describing a token never makes it a production source.

**D. Local production implementation** — per-component literals inside `ui/*`, `abox/*` and the kits: control heights, padding, icon sizes, tracking, radius choices.

**E. Repeated production literals** — `max-w-[88rem]` 23; `gap-2` 336; `p-5` 208; `text-sm` 847; `rounded-2xl` 333; `h-10` 139; `h-4 w-4` 287; `transition-colors` 53. Also `.story-link`, referenced 90 times in production markup with **zero definitions in `src/styles.css`** — it currently contributes no styling.

**F. Route-local implementation** — hero plates in `src/routes/index.tsx`, the filter rail in `plans.index.tsx`, the add-ons block in `cart.tsx`, swatches in `app.jet.branding.tsx`, asset plates in `marketplace.admin.assets.tsx`.

**G. Experience-specific implementation** — `MarketplaceShell` + `PlanCard` + `MetalBadge` + `ShoppingPathBar` (commerce); `InternalShell` + `DataTable` + `KpiCard` + module kits (admin); `MemberShell` (member); bare layout (marketing).

**H. Runtime branding source** — `src/routes/app.jet.branding.tsx`, `src/routes/marketplace.admin.brand.tsx`.

**I. Runtime marketplace asset source** — `src/routes/marketplace.admin.assets.tsx` with `src/lib/marketplace-store.ts`.

---

## SECTION 3 — FOUNDATION CENTRALIZATION CANDIDATES

| Category | Status | Current source(s) | Consumers | Exact current differences | What would change | Output identical? | Evidence required | Approval required | Future target |
|---|---|---|---|---|---|---|---|---|---|
| Raw colours | ALREADY CENTRALIZED | `src/styles.css` | all | none | nothing | Yes | none | none | `src/styles.css` |
| Semantic roles | ALREADY CENTRALIZED | `@theme inline` | all | none | nothing | Yes | none | none | `src/styles.css` |
| Metal tiers | ALREADY CENTRALIZED | `src/styles.css` + `metal-badge.tsx` | 2 | none | nothing | Yes | none | none | existing |
| Shadows (ABox tier) | ALREADY CENTRALIZED | `@theme inline` | 54 uses | Tailwind defaults used alongside | nothing, unless the two systems converge | Yes as-is | which surfaces intend the Tailwind defaults | Design | existing; convergence NOT YET DECIDED |
| Radius tokens | ALREADY CENTRALIZED (tokens) / MULTIPLE CURRENT SOURCES (application) | tokens + 7 literal classes | all | each concept picks its own | mapping concepts to radii | Only if mapping is 1:1 with today | per-concept radius census | Design | NOT YET DECIDED |
| Font families | ALREADY CENTRALIZED | `@theme inline` + `__root.tsx` link | all | serif and mono alias other families; JetBrains Mono loaded but referenced by no token | nothing | Yes | none | Design, if aliases change | existing |
| Motion keyframes | ALREADY CENTRALIZED | `src/styles.css` | decor, headers | tw-animate-css is a second system | nothing | Yes | none | none | existing |
| Breakpoints | ALREADY CENTRALIZED (framework) | Tailwind defaults | all | none | nothing | Yes | none | none | Tailwind |
| Focus / ring | CENTRALIZATION CANDIDATE | `--ring` + per-control treatment | all | custom controls define their own rings; exchange filters intentionally suppress them | a shared focus treatment | Not provable today | per-control focus census | Design + accessibility | NOT YET DECIDED |
| Container `88rem` | CENTRALIZATION CANDIDATE | 23 literals | web-experience routes | identical literal | one variable or utility | Yes, if every one of the 23 is genuinely the same role | confirm all 23 are the web-experience container | Product | NOT YET DECIDED |
| Status tones | MULTIPLE CURRENT SOURCES | 5 mappers | 87 + kits | different tone names, different derivation (`color-mix` vs fixed classes), dot marker only in `StatusBadge` | shared shell, local vocabularies | Shell yes; vocabularies no | tone-by-tone colour comparison | Product + Design | NOT YET DECIDED |
| Typography sizes | MULTIPLE CURRENT SOURCES | utilities + 14 size literals | all | arbitrary px sizes coexist with the scale | semantic text roles | Only where 1:1 | line-break capture per screen | Design | NOT YET DECIDED |
| Spacing | MULTIPLE CURRENT SOURCES | literals | all | no model | semantic spacing roles | Unproven | full spacing census | Design | NOT YET DECIDED |
| Control heights | BLOCKED BY COMPONENT VARIATION | `ACTION_PILL`, `ui/button.tsx`, kits, routes | all | 32/36/40/44/48px coexist; mobile forces ≥44px | density roles | Only with one role per current value | per-control census | Design + Product | NOT YET DECIDED |
| Icon sizes | NEEDS EVIDENCE | literals | all | four sizes, context-driven | an icon scale | Only where 1:1 | context census | Design | NOT YET DECIDED |
| Icon wrappers | NEEDS PRODUCT/DESIGN DECISION | PageHeader, EmptyState, shells | 31+ | size and radius differ | a container component | No, without a decision | — | Design | NOT YET DECIDED |
| Card surface | BLOCKED BY COMPONENT VARIATION | `ui/card.tsx` (6) + inline pattern | dozens | padding, radius, border token, shadow presence differ | a surface foundation | No | per-instance capture | Design | NOT YET DECIDED |
| Opacity / scrims | LOCAL BY DESIGN | literals (`bg-black/80` 4, `bg-black/40` 1) | overlays | two scrim values | scrim tokens | Yes, if both kept distinct | confirm the two are different roles | Design | NOT YET DECIDED |
| Tracking | NEEDS EVIDENCE | base layer + 7 literals | eyebrows, badges, headings | five uppercase values | tracking roles | Only where 1:1 | per-use census | Design | NOT YET DECIDED |
| Transition literals | DEFERRED | `transition-colors` 53 etc. | all | duration varies (200/300/500/1000) | motion roles | Unproven | — | Design | NOT YET DECIDED |
| Density | NEEDS PRODUCT/DESIGN DECISION | implicit | all | no model | a density model | No | — | Design + Product | NOT YET DECIDED |
| Branding colour | EXPERIENCE-SPECIFIC / runtime-owned | `app.jet.branding.tsx` swatches | branding screens | reads `--primary`, `--sage`, `--background`, `--sidebar` | nothing | Yes | none | none | stays runtime-owned |
| `.story-link` | NEEDS EVIDENCE | referenced 90×, defined 0× | many routes | contributes no styling today | defining it would **change output** | No | decide intent | Design | DEFERRED |

---

## SECTION 4 — COLOUR FOUNDATION CENTRALIZATION

**CSS variables** — 198 declarations in `src/styles.css`. Light theme `:root` L91–175, dark theme `.dark, :root.dark` L178–238. Already a single production source; nothing to centralize.

**Semantic roles** — 48 `--color-*` mappings in `@theme inline` L32–79 covering background, foreground, surface, panel, card, popover, primary (+soft), secondary, sage (+soft), muted, accent, destructive, warning, info, success, border, border-strong, hairline, input, ring, 5 chart colours and 8 sidebar colours.

**Component-level colour** — components reference semantic classes (`bg-primary`, `text-muted-foreground`, `border-hairline`) rather than raw values. `status-badge.tsx` derives its palette at runtime with `color-mix(in oklch, var(--tone) …)`; `metal-badge.tsx` reads `--tone`/`--tone-fg` pairs. Both are token consumers, not colour sources.

**Arbitrary colour values** — production contains only `bg-black/80` (4) and `bg-black/40` (1). No hex literals outside the stylesheet. These two scrims are recorded as distinct values and are **not** merged.

**Opacity colours** — alpha is applied through the `/nn` suffix on semantic tokens (`bg-primary/90`, `bg-surface/60`, `border-primary/30`). `--border`, `--border-strong`, `--hairline` and `--input` already carry alpha inside the token.

**Gradients** — the only production gradients are inside the `@utility` blocks: `card-brackets` (eight `linear-gradient(var(--primary), var(--primary))` corner strokes at 22px), `ember-underline`, `edge-sheen`, `aurora`, `contour`, `noise-field`. All are token-driven and centralized.

**Borders and rings** — three border alphas (0.10 / 0.24 / 0.11 light; 0.09 / 0.20 / 0.11 dark) plus `--input` and `--ring`. Visually similar, semantically distinct (`border` vs `border-strong` vs `hairline`); **not merged**.

**Shadows and glows** — five ABox shadow tokens, all oklch navy tinted, plus the alias `--shadow-overlay: var(--shadow-elevated)`. Tailwind's default `shadow-sm` / `shadow-md` / `shadow-lg` / `shadow-xs` are also used (31 occurrences combined) — a second elevation system, recorded and preserved.

**Status tones** — tokens are centralized; the five tone-mapping implementations are not. Mapping differences are semantic (module enumerations), so tone names cannot be merged without a product decision.

**Metal tiers** — six tiers, each with a theme-specific value and an explicit foreground chosen for legibility (gold and, in dark theme, all tiers use dark foregrounds). Single source, single consumer.

**Dark and light mode** — every semantic token is redefined in `.dark`; `color-scheme` is set per theme (L247, L249). Any future centralization must be verified in both themes.

**Experience and route colour** — no experience defines its own palette; differences come from which tokens each shell uses (`--sidebar*` for the internal shell, `--card`/`--surface` for commerce).

**Branding colour** — `app.jet.branding.tsx` presents swatches for `--primary`, `--sage`, `--background`, `--sidebar`. It displays and manages branding at runtime and stays runtime-owned; the generic foundation does not absorb it.

**Changes that could alter output** — defining `.story-link`; converting Tailwind default shadows to ABox tokens; merging the three border alphas; merging the two black scrims; converting any `color-mix` derivation to a fixed token. All are flagged, none are proposed.

---

## SECTION 5 — TYPOGRAPHY FOUNDATION CENTRALIZATION

**Families and loading** — `--font-sans` Inter Tight; `--font-display` Bricolage Grotesque; `--font-serif` and `--font-mono` are aliases that resolve to Bricolage Grotesque and Inter Tight respectively, so "mono" text is not monospaced today. Fonts load from a Google Fonts `<link>` in `src/routes/__root.tsx` (L96–100), which also requests **JetBrains Mono 400/500 — referenced by no token and therefore not rendered**.

**Base layer** — `html { font-family: var(--font-sans) }`, `body { font-feature-settings: "ss01","cv11" }`, and `h1, h2, h3, .font-display { font-family: var(--font-display); font-weight: 600; letter-spacing: -0.028em; font-variation-settings: "wdth" 102, "opsz" 32 }`. This is shared typography and is already centralized.

**Weights** — `font-medium` 445, `font-semibold` 163, `font-normal` 10, `font-bold` 1, plus the base-layer 600 for headings.

**Sizes** — `text-sm` 847, `text-xs` 497, `text-xl` 94, `text-2xl` 61, `text-[10px]` 39, `text-base` 30, `text-lg` 29, `text-[11px]` 23, `text-3xl` 20, `text-4xl` 19, `text-5xl` 7, `text-[0.8rem]` 4, `text-[10.5px]` 3, `text-[9px]` 1.

**Line heights** — `leading-relaxed` 20, `leading-none` 16, `leading-tight` 4, `leading-snug` 3, `leading-[0.98]` 2 (PageHeader default title).

**Tracking** — base `-0.028em` for headings; `tracking-widest` 18, `tracking-[0.18em]` 17, `tracking-tight` 10, `tracking-[0.12em]` 8, `tracking-[0.14em]` 2, `tracking-[0.08em]` 2, `tracking-wide` 1.

**Utility classes** — `text-display` (display family), `text-eyebrow` (mono alias, muted foreground), `text-serial` (mono alias, muted foreground). All three are single-source.

**Semantic roles** — heading, display title, eyebrow, body, muted description, serial/identifier, badge label (uppercase 10px with wide tracking).

**Classification required by this phase:**
- *Existing shared typography* — families, base heading rule, the three utilities.
- *Repeated but locally expressed* — `text-sm`, `text-xs`, `font-medium`, `text-muted-foreground` combinations.
- *Intentional variation* — compact vs default PageHeader title (`text-xl md:text-2xl` vs `text-3xl md:text-4xl`), badge micro-type at `text-[10px]`.
- *Unresolved variation* — five uppercase tracking values; four arbitrary px sizes; `.story-link` referenced 90 times with no definition.
- *Unsafe to centralize* — any change touching heading sizes, line height or tracking, because wrapping and line breaks are part of the contract.

Any future typography centralization must preserve exact wrapping, line breaks, element height, alignment, truncation and responsive behaviour.

---

## SECTION 6 — SPACING & LAYOUT FOUNDATION CENTRALIZATION

Measured production usage: `gap-2` 336, `px-3` 235, `px-5` 222, `p-5` 208, `gap-3` 183, `py-4` 169, `px-4` 154, `gap-4` 145, `gap-1.5` 133, `gap-1` 105, `py-2` 104, `py-3` 89, `p-3` 80, `p-4` 71, `gap-6` 53, `py-1.5` 51, `p-6` 47, `px-8` 36.

Containers: `max-w-[88rem]` 23 (the agreed web-experience width, applied per route rather than by a shared container), `max-w-3xl` 17, `max-w-lg` 14, `max-w-2xl` 14, `max-w-md` 11, `max-w-4xl` 9, `max-w-xs` 7, `max-w-xl` 6, `max-w-full` 6, `max-w-[420px]` 5, `max-w-sm` 3.

Responsive spacing uses Tailwind prefixes: `md:` 262, `sm:` 176, `lg:` 96, `xl:` 22.

Shell spacing lives inside `internal-shell.tsx` (501 lines), `marketplace-shell.tsx` (223) and `member-shell.tsx` (145), each with its own header height, gutter and content padding. Card spacing varies per instance (`p-5` dominant, `p-3`/`p-4`/`p-6` also common). Control spacing is carried by `ACTION_PILL` for pills and by per-component literals elsewhere.

No new spacing scale is invented. A scale *could* be derived from the frequency distribution above, and that possibility is recorded as **FUTURE ONLY — NOT IMPLEMENTED**. Existing variations — different card padding, control density, page rhythm, experience-specific gutters — are preserved as recorded facts, not defects.

---

## SECTION 7 — SHAPE, ELEVATION & SURFACE FOUNDATION

**Radius** — token scale `6 / 10 / 14 / 18 / 22 / 28 / 36px` plus `--radius: 0.875rem`. Applied usage: `rounded-2xl` 333, `rounded-full` 302, `rounded-lg` 170, `rounded-xl` 113, `rounded-md` 52, `rounded-sm` 21, `rounded-3xl` 17, plus side-specific variants. Tokens centralized; per-concept choice is not.

**Border widths and colours** — 1px throughout via the base rule `* { border-color: var(--color-border) }`; `border-dashed` used by `EmptyState`; three border alpha tokens kept distinct.

**Shadows and elevation** — two coexisting systems: ABox tokens (`shadow-card` 35, `shadow-glow` 9, `shadow-elevated` 6, `shadow-plate` 4, plus `--shadow-drawer` and the `--shadow-overlay` alias) and Tailwind defaults (`shadow-sm` 13, `shadow-lg` 8, `shadow-md` 7, `shadow-xs` 3, `shadow-none` 6). Recorded, not normalized.

**Surface treatments** — `--background`, `--surface`, `--panel`, `--card`, `--popover`, plus `glass` (`color-mix(in oklab, var(--card) 82%, transparent)` with a hairline border), `aurora`, `noise-field`, `contour`, `ring-pill` (`inset 0 0 0 1px var(--hairline)`), `divider-warm`, `card-brackets`, `edge-sheen`. All utilities are single-source.

**Multiple card surface implementations** — `ui/card.tsx` (6 importers) versus the inline `rounded-* border border-*` pattern concentrated in `marketplace.admin.content.tsx` (15), `agency.organizations.$organizationId.index.tsx` (13), `quote.tsx` (10), `platform.organizations.$organizationId.override.tsx` (10), `marketplace.admin.brand.tsx` (10), plus `DefinitionCard`, `BlockerCard`, `KpiCard`, `PlanCard`. Padding, radius, border token and shadow presence differ per instance. Recorded, not normalized.

**Overlays and scrims** — `bg-black/80` (4) and `bg-black/40` (1). Two distinct values, preserved separately.

Future centralization is documented only where exact preservation is provable: the radius and shadow token layers already are; the application of them is not.

---

## SECTION 8 — CONTROL SIZING & DENSITY FOUNDATION

Global rule: below 640px the base layer forces `button, a { min-height: 44px }` (L264–266). Any future control token must reproduce this interaction.

| Family | Exact current values | Consumers | Component source | Experience | Responsive | Future shared token technically safe? | Blockers |
|---|---|---|---|---|---|---|---|
| Action pills | `h-8` + `px-3` + `text-xs`; `h-9` + `px-3` + `text-sm`; `h-10` + `px-4`; `h-11` + `px-5`/`px-6`; all `rounded-full` | 33 importing files | `abox/action-pill.ts` | all four | mobile min-height applies | Yes for the pill family only | none within the family |
| Buttons (primitive) | CVA sizes in `ui/button.tsx` | 22 | `ui/button.tsx` | admin, forms | as above | Yes within the primitive | coexists with pills and `Btn` |
| Buttons (kit) | `m06/kit.tsx` `Btn` | m06 screens | `m06/kit.tsx` | admin | as above | Separate family | experience variation |
| Inputs | `ui/input.tsx` (7) + raw `<input>` in 15+ routes | mixed | multiple | admin, marketing | — | No | raw elements |
| Selects | `ui/select.tsx` (7), `lucie/ui.tsx` `Select`, raw `<select>` | mixed | multiple | admin | — | No | three implementations |
| Textareas | `ui/textarea.tsx` (3) + raw | mixed | multiple | admin, branding | — | No | raw elements |
| Checkbox / radio / switch | 1 importer each | few | `ui/*` | admin | — | Yes, low reach | most toggles are custom `aria-pressed` buttons |
| Tabs | `ui/tabs.tsx` (3) panel tabs; `abox/module-tabs.tsx` (2) `py-1.5 px-3 text-xs rounded-full` link tabs | 5 | two | admin | — | Separate concepts | different semantics |
| Badges | `StatusBadge` `px-2.5 py-0.5 text-[10px] tracking-[0.12em]`; `MetalBadge` identical geometry; `ui/badge.tsx` (1) | 90 | three | all | — | Geometry yes; tone no | tone vocabularies |
| Icon-only controls | `h-8`/`h-9` squares and circles in shells and tables | shells, tables | multiple | all | mobile min-height applies | No | no container model |
| Table controls | row and cell padding inside `data-table.tsx` and `lucie/Table` | 19 + Lucie | two | admin | — | No | density differs |
| Pagination | none in production (`ui/pagination.tsx` unused) | 0 | — | — | — | n/a | DEFERRED |
| Compact controls | `h-8` 40, `text-xs`, `gap-1` | toolbars, filters | multiple | commerce, admin | — | No | no density model |

Overall height distribution: `h-10` 139, `h-11` 66, `h-9` 43, `h-8` 40, `h-12` 7. The 36px and 40px families (and the 32/44/48px ones) are preserved exactly as they are; **no standard is chosen here.**

---

## SECTION 9 — ICON FOUNDATION

- **lucide-react** — the production icon library, imported across the application; icons are sized with utility classes rather than the `size` prop.
- **Tabler** — `@tabler/icons-react` is used by exactly one production file, `src/components/icons/tooth-icon.tsx` (`IconDental`), which currently has **zero production importers**; other Tabler mentions are in reference modules only.
- **Font Awesome** — present in `package.json`, referenced only by reference modules (`src/lib/design/assets.ts`, `iconography.ts`). No production usage.
- **Inline SVG** — decorative marks in `src/components/abox/decor/index.tsx`, `logo.tsx` (`AboxMark`, `AboxWordmark`) and `carrier-mark.tsx` (deterministic monogram).
- **Size syntax** — `h-4 w-4` 287, `h-3.5 w-3.5` 68, `h-5 w-5` 32, `h-6 w-6` 4. No `size` prop convention, no scale.
- **Icon-only controls** — shell and table affordances; the mobile 44px min-height rule applies to any of them rendered as `button`/`a`.
- **Decorative icons** — marked `aria-hidden` in `PageHeader`, `EmptyState`, `StatusBadge` (the tone dot) and decor.
- **Stroke behaviour** — lucide defaults; no production override found.
- **Circular containers** — `PageHeader` icon plate (`rounded-2xl`, `h-9`/`h-12`/`md:h-14`, `border-border bg-surface`), `EmptyState` plate (`rounded-md`, `h-12 w-12`, `border-hairline bg-background`), plus shell and route plates.
- **State-dependent treatment** — icon colour follows the parent's text colour token; no separate icon state system.

No library or size is consolidated. A future central icon foundation would need to preserve every size, every container geometry, every `aria-hidden` decision and the mobile min-height interaction.

---

## SECTION 10 — MOTION FOUNDATION

**Shared motion foundation** (`src/styles.css`, single source):

| Class | Keyframe | Timing | Easing | Behaviour |
|---|---|---|---|---|
| `.animate-fade-rise` | `abox-fade-rise` | 500ms | `cubic-bezier(0.2,0.7,0.2,1)` | both; entrance |
| `.animate-hairline` | `abox-hairline-draw` | 620ms | same | `transform-origin: left`; PageHeader underline |
| `.animate-orbit` | `abox-orbit` | 22s | linear | infinite; decor |
| `.animate-orbit-slow` | `abox-orbit` | 60s | linear | infinite; decor |
| `.animate-drift` | `abox-drift` | 6s | ease-in-out | infinite; decor (2 uses) |
| `.animate-pulse-ring` | `abox-pulse-ring` | 2.4s | `cubic-bezier(0.2,0.7,0.2,1)` | infinite |
| `.animate-shimmer` | `abox-shimmer` | as declared | — | loading sheen |

**Local / framework motion** — `transition-colors` 53, `transition-all` 23, `transition-transform` 20, `transition-opacity` 4, `duration-300` 11, `duration-200` 9, `duration-500` 1, `duration-1000` 1, `ease-linear` 4, `ease-in-out` 1; `animate-in` 19 and `animate-out` 18 from `tw-animate-css` (imported at `src/styles.css` line 3); `animate-pulse` 5 and `animate-spin` 1 from Tailwind.

**Page motion** — `src/components/abox/motion.tsx` (`FadeRise`), used by `PageHeader` and one route.

**Reduced motion** — `src/styles.css` L268–274 clamps animation duration, iteration count and transition duration globally; `motion.tsx` documents respecting the same preference.

Nothing is changed or consolidated. Preservation covers timing, easing, direction, trigger, visibility and reduced-motion behaviour for every entry above.

---

## SECTION 11 — FOUNDATION → COMPONENT PROPAGATION MODEL

**Foundation:** `--primary`
Current source: `src/styles.css` L108 (light `oklch(0.31 0.090 265)`), L190 (dark `oklch(0.68 0.125 255)`)
Semantic role: primary action colour; also `--ring`, `--chart-1`, `card-brackets` strokes, `::selection`
Current components: `ui/button.tsx` (22), `ACTION_PILL` (33), icon accents, `EmptyState` icon
Future source: existing production source
Propagation: `--primary` → `--color-primary` / `--ring` → Button + pills → routes
Potential non-consumers: `--sidebar-primary` (separate token), branding swatch display
Risk: a change reaches selection colour, focus rings, chart 1 and bracket decoration simultaneously
Regression contract: every action surface, focus ring, chart, bracket decoration and text selection in both themes

**Foundation:** `--tone` derivation in `abox/status-badge.tsx`
Current source: component-level `color-mix(in oklch, var(--tone) 88% | 12% | 34%, …)`
Semantic role: status tone shell
Current components: `StatusBadge`
Verified consumers: 87 importing files
Future source: NOT YET DECIDED
Propagation: tokens → StatusBadge → 87 files
Non-consumers: `m06 StatusTag`, `m08 OutcomeTag`, `lucie Tag`, `lucie-app StatusChip`, `ui/badge.tsx`
Risk: highest fan-out of any component in the app
Regression contract: every tone in both themes, plus the dot marker and border mix

**Foundation:** radius tokens
Current source: `@theme inline` L19–25
Semantic role: shape scale
Current components: all, via seven literal classes
Future source: existing tokens; per-concept mapping NOT YET DECIDED
Propagation: tokens → component class choice → screens
Non-consumers: `rounded-full` pills and badges (shape, not scale)
Risk: a mapping change silently alters 300+ surfaces
Regression contract: per-concept screenshot census

**Foundation:** `max-w-[88rem]`
Current source: 23 literals across web-experience routes
Semantic role: web-experience container width
Future source: FUTURE FILE — NOT CREATED / NOT YET DECIDED
Propagation: container → web-experience routes only
Non-consumers: dashboard routes, which must not inherit it
Risk: capturing a dashboard route by mistake
Regression contract: width and gutter at three viewports per route

**Foundation:** `--font-display` + base heading rule
Current source: `src/styles.css` L28, L257–262
Semantic role: display typography
Current components: `PageHeader` (23), `text-display` (used across routes; `index.tsx` 12, `app.index.tsx` 7)
Future source: existing production source
Propagation: family + weight + tracking → headings everywhere
Non-consumers: Lucie `PageHead` and `lucie-app PageHeader`, which set their own type
Risk: any change alters line breaks across the app
Regression contract: exact wrapping and element height per heading

---

## SECTION 12 — FOUNDATION → SCREEN TRACEABILITY

Confirmed against today's code:

```text
--primary -> action surface -> ACTION_PILL.primaryMd -> page action cluster -> shopping -> /plans
--border  -> surface edge   -> inline card pattern    -> detail page       -> admin    -> /agency/organizations/$id
--metal-* -> tier indicator -> MetalBadge             -> plan tile         -> shopping -> /plans
--tone    -> status tone    -> StatusBadge            -> table row         -> admin    -> /marketplace/admin/*
--font-display -> heading   -> PageHeader             -> page header       -> all      -> 23 routes
--sidebar*-> shell rail     -> InternalShell          -> workspace shell   -> admin    -> 89 routes
```

| Trace | Foundation | Semantic role | Component | Pattern | Experience | Screen | Status |
|---|---|---|---|---|---|---|---|
| Primary action | `--primary` | action surface | `ACTION_PILL`, `ui/button.tsx` | action cluster | all | 33 / 22 files | Confirmed |
| Secondary action | `--border`, `--accent` | bordered action | `ACTION_PILL.outline*` | action cluster | all | same files | Confirmed |
| Page heading | `--font-display`, base rule | display type | `PageHeader` | page header | all | 23 routes | Confirmed |
| Body text | `--foreground`, `--muted-foreground`, `text-sm` | body / muted | none (literals) | — | all | everywhere | Unowned — no component |
| Card surface | `--card`, `--border`, radius tokens | surface | `ui/card.tsx` + inline | surface pattern | all | dozens | Partly unknown — inline instances have no owner |
| Status badge | status tokens + `--tone` | status tone | `StatusBadge` | table row / detail | all | 87 files | Confirmed |
| Tier display | `--metal-*` | tier indicator | `MetalBadge` | plan tile / filter chip | commerce | 2 files | Confirmed |
| Table | `--border`, `--hairline`, spacing literals | data grid | `DataTable`, `lucie/Table`, raw `<table>` | table screen | admin | 19 + 6 | Confirmed, multi-source |
| Form field | `--input`, `--ring` | field | `ui/form.tsx`, `m06 Field`, raw elements | form layout | admin | 15+ | Multi-source |
| Shell navigation | `--sidebar*` | navigation surface | 3 shells + `nav-config.ts` | shell | all | 123 files | Confirmed (marketplace nav inline) |
| Control sizing | height literals | density | `ACTION_PILL`, `ui/button.tsx`, kits | all patterns | all | everywhere | Future decision — no density role exists |

No unsupported relationship is asserted; unresolved links are marked above.

---

## SECTION 13 — EXPERIENCE BOUNDARIES

| Foundation / concept | Web / Marketing | Shopping / Commerce | Dashboard / Admin | Member / Account | Posture |
|---|---|---|---|---|---|
| Colour tokens | inherit | inherit | inherit (+ `--sidebar*`) | inherit | Global |
| Typography families | inherit | inherit | inherit | inherit | Global |
| Motion keyframes | used heavily (decor) | light | light | light | Global |
| Radius tokens | inherit | inherit | inherit | inherit | Global |
| `max-w-[88rem]` | yes | yes | **no — dashboards excluded** | yes | Shared with variants |
| Control heights | `h-11` prominent | `h-10`/`h-9` | `h-9`/`h-8` dense | `h-10` | Shared with variants |
| Status tones | rare | commerce statuses | module enumerations | account statuses | Experience-specific vocabularies |
| Metal tiers | no | yes | no | no | Experience-specific |
| Shell | none | `MarketplaceShell` (30) | `InternalShell` (89) | `MemberShell` (4) | Experience-specific |
| Card surface | route-local plates | plan tiles | admin cards | settings cards | Route-specific / shared with variants |
| Decorative utilities | yes | some | rare | rare | Intentionally local |

Experience-specific design is not flattened. A future shared foundation may support different component variants where actual experience differences require it.

---

## SECTION 14 — BRANDING & MARKETPLACE BOUNDARY

**Branding & White-Label remains runtime-owned. Marketplace Assets remains runtime-owned.**

- `/app/jet/branding` → `src/routes/app.jet.branding.tsx` — renders palette swatches for `--primary`, `--sage`, `--background`, `--sidebar`, logo / mark / favicon upload placeholders, and disclosure text. Uses `InternalShell`, `StatusBadge`, `SCREENS`.
- `src/routes/marketplace.admin.brand.tsx` — marketplace-level brand screen; contains 10 inline card surfaces and 9 raw input elements.
- `src/routes/marketplace.admin.assets.tsx` — asset management for `AssetType` LOGO / MARK / FAVICON / HERO; upload creates an id via `crypto.randomUUID().slice(0, 8)`, records `SCANNING`, then transitions to `VALID` after 900ms.
- `src/lib/marketplace-store.ts` — runtime store holding asset records and marketplace state.
- Brand marks are code-drawn (`src/components/abox/logo.tsx`: `AboxMark` 3 production importers, `AboxWordmark` 0) and the favicon is `public/favicon.ico`.

No runtime branding configuration moves into the design reference layer. Asset ownership, the upload/scan/validate/retire lifecycle, and logo / favicon / wordmark / white-label behaviour are unchanged and stay out of scope for every foundation phase. Future shared components may **read** branding configuration through the existing runtime store or CSS variables; they may never own, persist, validate or default it.

---

## SECTION 15 — FUTURE PRODUCTION FOUNDATION FILE MAP

| Category | Current source | Future target source | Status | Production file(s) | Expected consumers | Migration requirement | Preservation risk | Approval |
|---|---|---|---|---|---|---|---|---|
| Raw colours | `src/styles.css` | same | ALREADY CENTRALIZED | `src/styles.css` | all | none | none | none |
| Semantic roles | `src/styles.css` | same | ALREADY CENTRALIZED | `src/styles.css` | all | none | none | none |
| Metal tiers | `src/styles.css` + `metal-badge.tsx` | same | ALREADY CENTRALIZED | both | 2 | none | none | none |
| Shadow tokens | `src/styles.css` | same | ALREADY CENTRALIZED | `src/styles.css` | 54 uses | none for tokens | Tailwind default shadows coexist | none |
| Radius tokens | `src/styles.css` | same | ALREADY CENTRALIZED | `src/styles.css` | all | none | mapping not centralized | none |
| Font families | `src/styles.css` + `__root.tsx` | same | ALREADY CENTRALIZED | both | all | none | alias semantics | Design if changed |
| Motion keyframes | `src/styles.css` | same | ALREADY CENTRALIZED | `src/styles.css` | decor, headers | none | tw-animate-css coexists | none |
| Container `88rem` | 23 route literals | NOT YET DECIDED | CANDIDATE | 23 route files | web-experience routes | confirm all 23 share one role | capturing a dashboard route | Product |
| Focus / ring treatment | `--ring` + per control | NOT YET DECIDED | CANDIDATE | many | all controls | per-control census | suppressed rings are intentional | Design + a11y |
| Typography scale | utilities + literals | NOT YET DECIDED | MULTIPLE SOURCES | many | all text | line-break capture | wrapping | Design |
| Spacing scale | literals | FUTURE FILE — NOT CREATED | MULTIPLE SOURCES | many | all | full census | layout shift | Design |
| Control density | `ACTION_PILL`, `ui/button.tsx`, kits | NOT YET DECIDED | BLOCKED | many | all controls | per-control census | 44px mobile rule | Design + Product |
| Icon scale | literals | NOT YET DECIDED | NEEDS EVIDENCE | many | all icons | context census | optical sizing | Design |
| Icon container | PageHeader / EmptyState / shells | FUTURE FILE — NOT CREATED | NEEDS DECISION | 3+ | 31+ | geometry capture | radius/size differ | Design |
| Card surface | `ui/card.tsx` + inline | NOT YET DECIDED | BLOCKED | dozens | dozens | per-instance capture | padding variance | Design |
| Status tone vocabulary | 5 mappers | NOT YET DECIDED | MULTIPLE SOURCES | 5 files | 87 + kits | tone comparison | domain meaning | Product + Design |
| Scrim / overlay | 2 literals | NOT YET DECIDED | LOCAL BY DESIGN | 5 uses | overlays | confirm two roles | dialog dimming | Design |
| `.story-link` | referenced 90×, undefined | DEFERRED | NEEDS EVIDENCE | many routes | many | decide intent | defining it changes output | Design |

No future file is created, and no placeholder production token is introduced.

---

## SECTION 16 — CONTROLLED MIGRATION SEQUENCE (future, not performed)

1. **Freeze current baseline** — capture the rendered application before anything moves.
2. **Capture exact current values** — computed styles, not source classes, for every item in scope.
3. **Establish a foundation source only where proven safe** — categories marked ALREADY CENTRALIZED need no work; candidates proceed only with proof of identical output.
4. **Introduce compatibility aliases only if technically necessary and output-preserving** — never for tidiness.
5. **Verify source/consumer relationships** — confirm each consumer before it is touched.
6. **Migrate one verified consumer family at a time** — never more.
7. **Compare rendered output** — against the step-2 capture for that family.
8. **Compare all interaction states** — hover, focus, active, selected, disabled, loading, error.
9. **Compare responsive states** — desktop, tablet, mobile, including the 640px min-height rule.
10. **Verify accessibility behaviour** — roles, labels, `aria-*`, focus order, keyboard operation, reduced motion.
11. **Verify business behaviour** — routing, forms, state, persistence.
12. **Verify branding and marketplace boundaries** — unchanged ownership and workflow.
13. **Continue only after explicit approval** — per family.

No big-bang migration. No mass find-and-replace. No automatic normalization. Any divergence reverts the family immediately; divergence is never accepted as an improvement.

---

## SECTION 17 — EXACT REGRESSION CONTRACT

Everything below must be **identical** before and after any future foundation migration. No tolerance threshold exists and none may be introduced.

**Visual** — colours (both themes), gradients, opacity, typography family, font loading, weight, size, line height, tracking, wrapping and line breaks, spacing, dimensions, alignment, borders, radius, shadows, elevation, icons and icon size, decorative elements (`noise-field`, `contour`, `aurora`, `glass`, `card-brackets`, `edge-sheen`, `ember-underline`, `ring-pill`, `divider-warm`), animations.

**Responsive** — desktop, tablet and mobile; every `sm:` / `md:` / `lg:` / `xl:` behaviour; the 640px `min-height: 44px` rule; wrapping, stacking, scrolling, overflow, content visibility.

**Interaction** — hover, focus and focus-visible ring, active, selected and `aria-pressed`, disabled, loading, error, success, expanded/collapsed, dialogs, drawers, dropdowns, forms, validation.

**Functional** — routes, navigation and active states, links and destinations, business logic, data behaviour, state behaviour, persistence (cart, shopping mode, quote, wizard), authentication behaviour where applicable.

**Brand / assets** — branding, white-label behaviour, marketplace assets, logos, favicon, wordmark, previews, and the upload → scan → validate → retire workflow.

**Reduced motion** — the clamped durations at `src/styles.css` L268–274 must behave identically.

---

## SECTION 18 — FUTURE MANUAL CHANGE MAP

| If I want to change… | Current source | Future canonical source | Current propagation | Future propagation | Safe now? | Blocker |
|---|---|---|---|---|---|---|
| Global primary colour | `src/styles.css` `--primary` | same | whole app, both themes | unchanged | **Yes** | also moves ring, chart-1, selection, brackets |
| Page background | `src/styles.css` `--background` | same | whole app | unchanged | **Yes** | none |
| Card surface | `ui/card.tsx` + inline pattern | NOT YET DECIDED | only the 6 importers | would reach dozens | No | padding variance |
| Border | `--border` / `--border-strong` / `--hairline` | same | whole app | unchanged | **Yes** | three roles must stay distinct |
| Radius | `--radius-*` tokens | tokens exist; mapping NOT YET DECIDED | only where tokens are used | would reach 900+ class uses | Partly | per-concept literals |
| Shadow | `--shadow-*` tokens | same | token consumers only | unchanged | **Yes** | Tailwind default shadows unaffected |
| Body typography | base layer + `text-sm` literals | NOT YET DECIDED | base layer only | would reach 847 uses | Partly | wrapping |
| Heading typography | base layer L257–262 | same | all h1–h3 and `.font-display` | unchanged | **Yes** | line breaks must be verified |
| Spacing | literals | FUTURE FILE — NOT CREATED | none | would reach everything | No | no model |
| Control height | `ACTION_PILL` + primitives + kits | NOT YET DECIDED | pills: 33 files | would reach all controls | Partly | densities coexist |
| Button | `ui/button.tsx` | NOT YET DECIDED | 22 files | would reach all actions | Partly | three treatments |
| Action pill | `abox/action-pill.ts` | same | 33 files | unchanged | **Yes** | none |
| Status badge | `abox/status-badge.tsx` | shell same; vocabularies NOT YET DECIDED | 87 files | would reach kit tags too | Shell yes | 5 tone systems |
| Icon size | literals | NOT YET DECIDED | none | would reach 391 uses | No | no scale |
| Animation | `src/styles.css` keyframes | same | `animate-*` consumers | unchanged | **Yes** | tw-animate-css separate |
| Shell | three shell files + `nav-config.ts` | NOT YET DECIDED | per shell | would reach all three | Partly | marketplace nav inline |
| Branding | `app.jet.branding.tsx`, `marketplace.admin.brand.tsx` | stays runtime-owned | branding screens | unchanged | **Yes** | out of foundation scope |
| Marketplace asset | `marketplace.admin.assets.tsx`, `marketplace-store.ts` | stays runtime-owned | asset screens | unchanged | **Yes** | out of foundation scope |

No future source in this table exists today unless it is named as an existing file.

---

## SECTION 19 — OPEN DECISION REGISTER

**D1 — Should the 23 `max-w-[88rem]` literals become one shared container?**
Evidence: 23 identical literals across web-experience routes; dashboards deliberately excluded. Implementations: per-route literal. Options in code: keep literals, or a shared wrapper. Would change: where the width is declared. Risk: capturing a dashboard route. Owner: Product. Status: OPEN.

**D2 — Should repeated spacing literals become semantic variables?**
Evidence: `gap-2` 336, `p-5` 208, `px-5` 222, `px-3` 235. Implementations: literals only. Options: keep literals, or derive roles from the distribution. Would change: potentially every layout. Risk: layout shift. Owner: Design. Status: OPEN.

**D3 — Should card surfaces share a foundation?**
Evidence: `ui/card.tsx` 6 importers versus an inline pattern with up to 15 instances in one file; padding, radius, border token and shadow presence differ. Options: keep separate, variants, or one surface. Would change: dozens of screens. Risk: high. Owner: Design. Status: OPEN.

**D4 — Do 36px and 40px controls need separate density roles?**
Evidence: `h-10` 139, `h-11` 66, `h-9` 43, `h-8` 40, `h-12` 7, plus the 640px 44px rule. Options: preserve all five, or define density roles. Would change: every control. Risk: high. Owner: Design + Product. Status: OPEN.

**D5 — Do the multiple page-header structures require separate variants?**
Evidence: `abox/PageHeader` 23 (two variants), `lucie/PageHead`, `lucie-app/PageHeader`, inline `text-display` headings (`index.tsx` 12, `app.index.tsx` 7). Options: keep three, or variants of one. Would change: heading type and spacing. Risk: line breaks. Owner: Design. Status: OPEN.

**D6 — Should status tones remain experience-aware?**
Evidence: five tone mappers with different vocabularies; `StatusBadge` derives colour with `color-mix`, kits use fixed classes. Options: shared shell with local vocabularies, or full convergence. Would change: 87 files plus kit consumers. Risk: high. Owner: Product + Design. Status: OPEN.

**D7 — Should icon-size families be tokenized?**
Evidence: `h-4` 287, `h-3.5` 68, `h-5` 32, `h-6` 4. Options: keep literals, or an icon scale. Would change: optical alignment everywhere. Risk: medium. Owner: Design. Status: OPEN.

**D8 — Are the Tailwind default shadows intentionally separate from the ABox shadow tokens?**
Evidence: `shadow-card` 35, `shadow-glow` 9, `shadow-elevated` 6, `shadow-plate` 4 alongside `shadow-sm` 13, `shadow-lg` 8, `shadow-md` 7, `shadow-xs` 3. Options: keep both, or map the defaults onto tokens. Would change: elevation on those surfaces. Risk: medium. Owner: Design. Status: OPEN.

**D9 — Are the seven radius classes intentionally per-concept?**
Evidence: `rounded-2xl` 333, `rounded-full` 302, `rounded-lg` 170, `rounded-xl` 113, `rounded-md` 52, `rounded-sm` 21, `rounded-3xl` 17. Options: keep as-is, or map concepts to radii. Would change: 900+ surfaces. Risk: high. Owner: Design. Status: OPEN.

**D10 — What is `.story-link` meant to do?**
Evidence: referenced 90 times in production markup, defined nowhere in `src/styles.css`, therefore currently inert. Options: leave inert, remove references, or define it. Would change: defining it would alter rendered output in 90 places. Risk: high. Owner: Design. Status: OPEN.

**D11 — Should the serif and mono font aliases stay pointed at the existing families, and should JetBrains Mono remain loaded?**
Evidence: `--font-serif` and `--font-mono` both resolve to existing families; the `__root.tsx` font link requests JetBrains Mono, which no token references. Options: keep as-is, repoint the aliases, or stop loading the unused family. Would change: `text-eyebrow` and `text-serial` rendering, or network payload only. Risk: medium for aliases, low for the load. Owner: Design. Status: OPEN.

**D12 — Should the five uppercase tracking values converge?**
Evidence: `tracking-widest` 18, `tracking-[0.18em]` 17, `tracking-[0.12em]` 8, `tracking-[0.14em]` 2, `tracking-[0.08em]` 2. Options: keep all five, or define tracking roles. Would change: badge and eyebrow widths. Risk: medium. Owner: Design. Status: OPEN.

**D13 — Should focus treatment be centralized given some controls intentionally suppress rings?**
Evidence: `--ring` is a single token; exchange filters deliberately render no visible ring while keeping `aria-pressed`. Options: shared treatment with documented exceptions, or leave per-control. Would change: focus visibility. Risk: accessibility. Owner: Design + accessibility. Status: OPEN.

No decision above is answered, ranked or prioritized here.

---

## SECTION 20 — PHASE 14 DEPENDENCY GATE

Phase 14 (Canonical Production Component Library) cannot safely begin until:

1. **Foundation ownership** is settled for every category still marked MULTIPLE CURRENT SOURCES — components cannot consume a foundation that has no owner.
2. **Canonical source decisions** D1–D13 are answered, or the affected components are explicitly excluded from Phase 14.
3. **Component dependencies** are fixed: control sizing (D4), card surface (D3), status tone (D6) and icon container decisions all feed directly into component APIs.
4. **Unresolved duplicates** from Phase 12 §7 have a stated disposition — coexist or converge — for each concept entering Phase 14.
5. **Experience boundaries** are confirmed per component, so variants are designed rather than discovered mid-migration.
6. **Regression baseline** exists: the step-1/step-2 captures of §16, covering every route at three viewports in both themes, with interaction states.
7. **Branding and marketplace boundaries** are re-confirmed unchanged.

Phase 14 is not started.

---

## SECTION 21 — FINAL FILE-LEVEL PLAN

| Item | Current file | Future file | Action in future | Phase | Status | Approval required |
|---|---|---|---|---|---|---|
| Colour tokens | `src/styles.css` | same | none | 13 | ALREADY CENTRALIZED | No |
| Semantic roles | `src/styles.css` | same | none | 13 | ALREADY CENTRALIZED | No |
| Radius tokens | `src/styles.css` | same | none; mapping deferred | 13 | ALREADY CENTRALIZED | No |
| Shadow tokens | `src/styles.css` | same | none | 13 | ALREADY CENTRALIZED | No |
| Font families | `src/styles.css`, `src/routes/__root.tsx` | same | none | 13 | ALREADY CENTRALIZED | Only if aliases change |
| Motion keyframes | `src/styles.css` | same | none | 13 | ALREADY CENTRALIZED | No |
| Metal tiers | `src/styles.css`, `src/components/abox/metal-badge.tsx` | same | none | 13 | ALREADY CENTRALIZED | No |
| Action pill | `src/components/abox/action-pill.ts` | same | possible component form | 14 | CANDIDATE | Yes |
| Status badge shell | `src/components/abox/status-badge.tsx` | same | possible canonical shell | 14 | BLOCKED BY DUPLICATE | Yes |
| Tone vocabularies | `src/components/m06/kit.tsx`, `src/components/m08/kit.tsx`, `src/components/lucie/ui.tsx`, `src/components/lucie-app/ui.tsx` | NOT YET DECIDED | decision only | 14 | OPEN (D6) | Yes |
| Page header | `src/components/abox/page-header.tsx` (+ Lucie files) | NOT YET DECIDED | decision only | 14 | OPEN (D5) | Yes |
| Card surface | `src/components/ui/card.tsx` + inline routes | NOT YET DECIDED | decision only | 14/15 | OPEN (D3) | Yes |
| Control density | `src/components/ui/button.tsx`, `action-pill.ts`, `m06/kit.tsx` | NOT YET DECIDED | decision only | 14 | OPEN (D4) | Yes |
| Container width | 23 route files using `max-w-[88rem]` | NOT YET DECIDED | decision only | 13/15 | OPEN (D1) | Yes |
| Spacing scale | route and component literals | FUTURE FILE — NOT CREATED | decision only | 15 | OPEN (D2) | Yes |
| Icon scale | route and component literals | NOT YET DECIDED | decision only | 14 | OPEN (D7) | Yes |
| Icon container | `page-header.tsx`, `empty-state.tsx`, shells | FUTURE FILE — NOT CREATED | decision only | 14 | OPEN | Yes |
| `.story-link` | referenced across routes, undefined in `src/styles.css` | NOT YET DECIDED | decision only | 13 | OPEN (D10) | Yes |
| Branding | `src/routes/app.jet.branding.tsx`, `src/routes/marketplace.admin.brand.tsx` | same | none — runtime-owned | — | OUT OF SCOPE | No |
| Marketplace assets | `src/routes/marketplace.admin.assets.tsx`, `src/lib/marketplace-store.ts` | same | none — runtime-owned | — | OUT OF SCOPE | No |
| Reference layer | `src/lib/design/*`, `src/components/design/reference-kit.tsx`, `src/routes/design-system.tsx`, `src/routes/design-guide.tsx` | same | none — specification only | 17 | REFERENCE ONLY | No |

---

## VALIDATION RECORD

1. Only `.lovable/phase-13-production-foundations-centralization-plan.md` was created — confirmed.
2. No production source file changed — confirmed.
3. No route changed — confirmed.
4. No component changed — confirmed.
5. No token value changed — confirmed.
6. No styling changed — confirmed.
7. No branding changed — confirmed.
8. No marketplace asset behaviour changed — confirmed.
9. No navigation changed — confirmed.
10. No reference page changed — confirmed.
11. All important counts re-measured from today's production code — confirmed.
12. All cited file paths exist — confirmed.
13. Production sources are separated from reference/specification sources in §2 — confirmed.
14. No new production token invented — confirmed.
15. No duplicate merged — confirmed.
16. No component renamed — confirmed.
17. No component deleted — confirmed.
18. No winner, ranking or score assigned — confirmed.
19. No normalization performed — confirmed.
20. The plan is implementation-ready but not implemented — confirmed.

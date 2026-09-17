# Phase 13 — Production Foundations Centralization Plan (plan-only)

Plan-only phase. No production file is created, modified, renamed, deleted, refactored, migrated, centralized or normalized. No route, page, component, class, token, typography value, spacing value, colour, border, radius, shadow, icon, animation, control height, navigation entry, branding behaviour, marketplace asset behaviour, content or accessibility behaviour changes. The running application stays exactly as it is.

## What gets produced

Exactly one new file: `.lovable/phase-13-production-foundations-centralization-plan.md`, containing the 21 sections you listed plus the validation record.

It opens with the two required statements verbatim:

- "PHASE 13 IS PLAN ONLY. NO PRODUCTION APPLICATION CHANGES HAVE BEEN MADE."
- "The existing rendered application is the preservation baseline. Any future foundation centralization must reproduce the existing visual, responsive, accessibility, interaction, navigation, content, branding, asset, and business-logic behavior exactly."

Phase 1–12 records are navigation only. Every count and value in the document is re-measured against today's code.

## Evidence already re-measured for this plan

- `src/styles.css`: 198 custom-property declarations across `@theme inline`, `:root`, `.dark`, the alias block and the utility/keyframe layers; `prefers-reduced-motion` handled at line 268.
- Radius usage: `rounded-2xl` 333, `rounded-full` 302, `rounded-lg` 170, `rounded-xl` 113, `rounded-md` 52, `rounded-sm` 21, `rounded-3xl` 17.
- Shadows: `shadow-card` 35, `shadow-sm` 13, `shadow-glow` 9, `shadow-lg` 8, `shadow-md` 7, `shadow-elevated` 6, `shadow-plate` 4.
- Spacing: `gap-2` 336, `px-3` 235, `px-5` 222, `p-5` 208, `gap-3` 183, `py-4` 169, `px-4` 154, `gap-4` 145, `gap-1.5` 133, `gap-1` 105.
- Containers: `max-w-[88rem]` 23 (the web-experience width), plus `max-w-3xl` 17, `max-w-lg` 14, `max-w-2xl` 14, `max-w-md` 11.
- Control heights: `h-10` 139, `h-11` 66, `h-9` 43, `h-8` 40, `h-12` 7.
- Icon sizes: `h-4` 287, `h-3.5` 68, `h-5` 32, `h-6` 4.
- Motion: `transition-colors` 53, `transition-all` 23, `transition-transform` 20, `animate-in` 19, `animate-out` 18, `duration-300` 11, `duration-200` 9.
- Arbitrary colours in production are rare: `bg-black/80` 4, `bg-black/40` 1; no hex literals found outside the stylesheet.

## How the sections get built

**§1 inventory (30 categories)** — walk `src/styles.css` line by line for declared tokens, then measure literal usage across `src/routes` and `src/components` with the reference layer excluded. Each item records source file, token/class/literal, exact current value, measured usage count, representative consumers, production vs reference, shared vs local, light/dark dependence, experience and route specificity, whether already centralized, whether duplicated, whether safe to centralize, blockers, preservation risk. No count is invented; anything unmeasurable is marked as such.

**§2 true sources of truth** — classify each foundation into your nine buckets (A–I), re-confirming by import search that `src/lib/design/*` and `src/components/design/reference-kit.tsx` have no production importers and therefore stay specification-only.

**§3 candidates** — one neutral status per category from your list. No ranking, no scoring, no "best" unless the code already shows a single objective source. Each records current sources, consumers, exact differences, what would have to change, whether output could stay identical, evidence required, approvals required, and a future target or `NOT YET DECIDED`.

**§4 colour** — CSS variables, semantic roles, component-level colour, Tailwind utilities, the two arbitrary black overlays, opacity colours, gradients, borders, rings, shadows/glows, the five tone systems, the six metal tiers and their `-fg` pairs, both themes, experience and route colours, branding colour. Visually similar colours are only recorded as similar, never merged; the document flags any centralization that could alter output.

**§5 typography** — families and the serif/mono aliases, loading via the root-route link, weights, sizes, line heights, tracking literals, the `text-display`/`text-eyebrow`/`text-serial` utilities, semantic roles, numeric/serial text, responsive typography, route-local and experience typography. Explicitly split into shared / repeated-but-local / intentional variation / unresolved variation / unsafe to centralize. Preservation of exact wrapping, line breaks, height, alignment and truncation is stated as binding.

**§6 spacing and layout** — measured frequencies above plus section, card, control, grid, flex, container, gutter, shell, header and responsive spacing. No new scale is invented; any derivable scale is labelled FUTURE ONLY. Existing variations (card padding, control density, page rhythm) are preserved as recorded facts.

**§7 shape, elevation, surface** — radius and shadow tokens versus the literal usage above, border widths and colours, surface treatments, opacity, `glass`, `aurora`, `noise-field`, `contour`, `card-brackets`, `edge-sheen`, overlays and scrims including `bg-black/80` and `bg-black/40`. Centralization is documented only where exact preservation is provable.

**§8 control sizing and density** — per control family: exact current value, consumers, component source, experience, responsive behaviour, technical safety of a future shared token, blockers. The 36px/40px (and 32/44/48px) coexistence is preserved as-is with no standard chosen.

**§9 icons** — `lucide-react` usage, the single Tabler `IconDental`, inline decorative SVG in `decor/` and auth, the installed-but-unused Font Awesome, size syntax, icon-only controls, `aria-hidden` handling, stroke behaviour, circular containers and state-dependent treatment. No library or size is consolidated.

**§10 motion** — the six `abox-*` keyframes and `animate-*` classes, the transition/duration/easing literals measured above, hover transitions, loading animation, decorative motion, `FadeRise` page motion and the `prefers-reduced-motion` block at `src/styles.css:268`. Preservation covers timing, easing, direction, trigger, visibility and reduced-motion behaviour.

**§11 propagation model** — representative foundation families in your exact format (foundation, current source, semantic role, current component, verified consumers with counts, future source or `NOT YET DECIDED` / `FUTURE FILE — NOT CREATED`, propagation chain, intentional non-consumers, preservation risk, regression contract).

**§12 traceability** — foundation → semantic role → component → pattern → experience → screen for primary action, secondary action, page heading, body text, card surface, status badge, metal tier, table, form field, shell navigation and control sizing, using Phase 9/10 traces only where today's code confirms them. Unconfirmed links are marked unknown/future decision.

**§13 experience boundaries** — Web/Marketing, Shopping/Commerce, Dashboard/Admin, Member/Account; each centralization marked global, shared-with-variants, experience-specific, route-specific or intentionally local. Nothing is flattened.

**§14 branding and marketplace** — `/app/jet/branding`, `src/routes/app.jet.branding.tsx`, `src/routes/marketplace.admin.brand.tsx`, `src/routes/marketplace.admin.assets.tsx`, `src/lib/marketplace-store.ts` recorded as runtime-owned, with the boundary stated: future shared components may read branding configuration, never own or store it.

**§15 future file map** — CURRENT SOURCE / FUTURE TARGET SOURCE / STATUS / PRODUCTION FILE(S) / EXPECTED CONSUMERS / MIGRATION REQUIREMENT / PRESERVATION RISK / APPROVAL REQUIRED, using only an existing file, `NOT YET DECIDED`, or `FUTURE FILE — NOT CREATED`.

**§16 migration sequence** — your 13 stages, with explicit prohibitions on big-bang migration, mass find-and-replace and automatic normalization, and the rule that compatibility aliases appear only when technically necessary and output-preserving.

**§17 regression contract** — the full visual / responsive / interaction / functional / brand-and-asset enumeration in exact-preservation language. No tolerance threshold is defined anywhere.

**§18 future manual change map** — per request: CURRENT SOURCE, FUTURE CANONICAL SOURCE, CURRENT PROPAGATION, FUTURE PROPAGATION, SAFE NOW?, BLOCKER. Future sources are never described as existing.

**§19 open decision register** — only decisions that survive objective code inspection, each with QUESTION, CURRENT EVIDENCE, CURRENT IMPLEMENTATIONS, OPTIONS PRESENT IN CODE, WHAT WOULD CHANGE, PRESERVATION RISK, REQUIRED OWNER/APPROVAL, STATUS. Unanswered and unranked.

**§20 Phase 14 gate** — what the Canonical Production Component Library cannot begin without: foundation ownership, canonical source decisions, component dependencies, unresolved duplicates, control sizing decisions, experience boundaries, regression baseline.

**§21 final table** — ITEM / CURRENT FILE / FUTURE FILE / ACTION IN FUTURE / PHASE / STATUS / APPROVAL REQUIRED, real files only.

## Validation before reporting complete

Confirm that only `.lovable/phase-13-production-foundations-centralization-plan.md` was created; no production source, route, component, token value, styling, branding, marketplace behaviour, navigation or reference page changed; every count came from today's code; every cited path exists; production and reference sources are separated; no token invented, no duplicate merged, no component renamed or deleted; no winner, ranking or score; no normalization performed; the plan is implementation-ready but not implemented. Then report `PHASE 13 PLAN COMPLETE — NO PRODUCTION CHANGES MADE` with the requested summary.

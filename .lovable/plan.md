# Phase 12 — Production Component Architecture & Canonicalization Plan

Plan-only phase. Nothing in the running application changes: no page, route, component, token, style, class, icon, animation, navigation, business rule, branding or marketplace behaviour. The only file written is one planning document.

## What gets produced

A single document, `.lovable/phase-12-component-architecture-plan.md`, containing the 15 sections you listed. It is an architecture audit describing how a future centralized production component system *could* be built, never an implementation of one. The document opens with an explicit statement that Phase 12 does not implement the architecture, and with the preservation contract requiring exact visual and behavioural equivalence after any future migration.

Phase 1–11 records, `.lovable/manual-work-map.md`, `.lovable/design-system.md` and `roadmap.md` are used only to know where to look. Every architectural claim is re-verified against today's source.

## Evidence already confirmed

- `src/components/ui/` holds 49 primitive files; `src/components/abox/` holds 27 modules plus `decor/`; `src/lib/design/` holds 118 reference modules.
- Production import counts (excluding `src/lib/design/` and `src/components/design/`): Button 22, Select 7, Input 7, Card 6, Skeleton 4, Dialog 4, Tooltip 4, Tabs 3, Textarea 3, Sheet 3, DropdownMenu 3, Alert 1, Badge 1, Checkbox 1, RadioGroup 1, Popover 1, Switch 1.
- `ui/table.tsx` and `ui/pagination.tsx` have zero production importers — recorded as installed-but-unused, not as removal candidates.

## How each section gets built

**Sections 1–2 (inventory, classification)** — every file in `src/components/ui/`, `src/components/abox/`, the three shells, the route-local kits (`src/components/m06/`, `src/components/m08/`, `src/components/lucie/`, `src/components/lucie-app/`, `src/components/ai-elements/`, `src/components/icons/`) and repeated inline implementations found by class-signature search across `src/routes/`. Each row: name, path, export, category, consumer list and count, representative routes, shared vs route-local, whether reference code imports it, visual and behavioural responsibility, whether it is already a genuine shared source, and whether the same concept exists more than once. Classification (foundation / primitive / component / compound / pattern / experience pattern / route-local / runtime-owned) comes from observed usage, not folder name.

**Section 3 (canonical candidates)** — for each candidate concept in your list that the code actually supports: current implementations and files, consumers, variants, states, sizes, density, responsive and accessibility behaviour as written, concrete differences between implementations, whether the difference looks experience-driven, blockers, dependencies, migration risk. Status is one of your neutral labels only. No winner, rank or score anywhere.

**Section 4 (foundations)** — walk `src/styles.css` top to bottom plus every literal found in components for the 20 categories listed. Each records current production source, one-source-or-many, exact token/class/literal locations, consumers, whether centralization is achievable with zero output change, what needs approval, what stays local. Categories with more than one definition get the label **NO SINGLE SOURCE OF TRUTH — CURRENTLY LOCAL/MULTIPLE** with the real file list. No new token is invented.

**Section 5 (propagation model)** — a dependency model per candidate: what the future source would control, which consumers inherit, which deliberately do not, surviving local overrides and experience extensions, breakage surface, required regression checks. Drawn as ```text chains from `src/styles.css` through foundation, shared component, pattern, screen.

**Section 6 (experience boundaries)** — Web/Marketing, Shopping/Commerce, Dashboard/Admin, Member/Account, mapped from the shells and route prefixes that actually exist. Each concept marked globally shared, shared-with-variants, experience-specific or route-specific. Intentional differences are preserved, not flattened.

**Section 7 (duplicate register)** — neutral A/B records for cards/surfaces, page headers, form fields, tables, navigation, assistants, empty states, action groups, control sizing (36px vs 40px), icon containers, status/tone systems, route-local kits and shells. Files, consumers, concrete visual and behavioural differences, whether experience-specific, decision required, migration risk. Nothing merged, no winner.

**Sections 8–9 (migration architecture, regression contract)** — the twelve-step future sequence, with the rule that no component may replace an existing implementation until its current rendered and behavioural contract is captured first. The regression contract enumerates every surface you listed across desktop, tablet and mobile, and states exact preservation with no tolerance language.

**Section 10 (future manual change map)** — per concept: CURRENT SOURCE, FUTURE CANONICAL SOURCE, CURRENTLY CENTRALIZED?, FUTURE PROPAGATION SCOPE, BLOCKERS. Future sources are always labelled future.

**Sections 11–12 (boundaries)** — reference layer (`src/lib/design/*`, `reference-kit.tsx`, `/design-system`, `/design-guide`, the three markdown records) is re-confirmed by import search to have no production consumers and stays reference-only. Branding (`src/routes/app.jet.branding.tsx`, `src/routes/marketplace.admin.brand.tsx`) and marketplace assets (`src/routes/marketplace.admin.assets.tsx`, `src/lib/marketplace-store.ts`) stay runtime-owned; the document describes only how future shared components could *read* branding configuration without owning its data or storage.

**Section 13 (roadmap)** — Phases 13–17 with purpose, likely production files, what may change, what is protected, prerequisites, regression requirements and approval gate. None executed.

**Section 14 (file-level target map)** — per candidate: current file(s), and a future target that is either the existing production source where evidence supports it, `NOT YET DECIDED`, or `FUTURE FILE — NOT CREATED`.

**Section 15 (decision register)** — only decisions that must be made before implementation, unanswered unless the code gives objective evidence. Unranked, unprioritized.

Anything improvable is recorded as **FUTURE OPPORTUNITY — NOT IMPLEMENTED**.

## Validation

1. Confirm nothing under `src/`, `public/`, config or package files was created, modified or deleted — only the Phase 12 document is written.
2. Confirm no production component, token, route, navigation, branding or marketplace code changed.
3. Confirm every path named in the document exists.
4. Confirm every consumer count came from a search of today's code.
5. Confirm every duplicate record cites concrete differences from the files.
6. Confirm no winner, ranking, score or recommendation appears.
7. Confirm current and future architecture are visibly separated, and every future source is labelled future.
8. Confirm the document states Phase 12 does not implement the architecture and that the preservation contract demands exact equivalence.

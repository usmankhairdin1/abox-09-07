# Manual Work, Presentation & Source-of-Truth Map — audit plan

Audit only. No production file is created, modified, renamed or deleted, and nothing is refactored, migrated, normalised or consolidated. The only file written is the audit document itself.

## What gets produced

One document, `.lovable/manual-work-map.md`, with the 13 sections you listed plus the two handoff summaries. It is a navigation and ownership map of the codebase as it exists today, not a design-system phase. If you would rather have it as a page on `/design-guide` or delivered in chat instead, say so and the destination changes; nothing else about the plan does.

Every claim in it is produced by reading the current code. Phase 1–11 records are used only to know where to look, never quoted as fact without confirming the file still says it.

## Files and areas to inspect

**Foundations** — `src/styles.css` in full: the `@theme inline` block (radius scale, font families including the serif and mono aliases that both point at existing families), colour variables, the `.dark` block, any `@utility` and `@custom-variant` rules, and any class defined there. This establishes which foundation categories genuinely have a single production source and which do not.

**Shared components** — every file in `src/components/abox/` (action-pill.ts, page-header.tsx, status-badge.tsx, metal-badge.tsx, kpi-card.tsx, data-table.tsx, empty-state.tsx, plan-card.tsx, carrier-mark.tsx, internal-shell.tsx, marketplace-shell.tsx, member-shell.tsx, module-tabs.tsx, product-switcher.tsx, quote-edit-panel.tsx, shopping-path-bar.tsx, planai-assistant.tsx, plan-o-assistant.tsx, downline-wizard-stepper.tsx, downline-context-banner.tsx, overflow-text.tsx, logo.tsx, motion.tsx, save-continue-button.tsx, placeholder-screen.tsx, suspended-marketplace-notice.tsx, theme-toggle.tsx, decor/) and the primitives in `src/components/ui/` that have real consumers.

**Shells and navigation** — the three shells, reading where each one's destination list, collapse breakpoint and account control actually live, and whether navigation is configured in data or written inline.

**Branding runtime** — `src/routes/app.jet.branding.tsx` and `src/routes/marketplace.admin.brand.tsx`, plus whatever store, state module or server function they read and write, and the logo/wordmark/favicon sources (`src/components/abox/logo.tsx`, `public/favicon.ico`).

**Marketplace assets** — `src/routes/marketplace.admin.assets.tsx` and its store, upload, validation, preview and retirement behaviour, plus neighbouring admin routes only where the asset flow reaches into them.

**Experience and route-local UI** — `src/routes/index.tsx`, `plans.index.tsx`, `cart.tsx`, `member.settings.tsx`, `agency.my-organization.tsx`, and the M06, M08, Lucie and ai-elements route kits, to record what is genuinely route-local.

**Reference layer** — the ~100 modules in `src/lib/design/`, `src/components/design/reference-kit.tsx`, `src/routes/design-system.tsx`, `src/routes/design-guide.tsx`, `.lovable/design-system.md`, `roadmap.md`.

## How each claim gets verified

- **Production versus reference** — a file is reference-only when no file outside `src/lib/design/`, `src/components/design/` and the two design routes imports it. Verified by searching for importers of each module, not by its folder name. The map states, per group, whether production imports it and whether editing it changes the running product.
- **Manual edit locations** — for each of the 28 categories (global colours through navigation configuration) the map names the file and the exact variable, export or class that actually produces the rendered result. A category only gets a single file when a search shows one definition; otherwise it is labelled **NO SINGLE SOURCE OF TRUTH — CURRENTLY LOCAL/MULTIPLE** with the real file list. No centralised file is invented.
- **Component consumers** — counted by searching for each import across `src/`, split into shared, route-local and reference-only, with a plain statement of whether editing the component reaches more than one screen.
- **Management destinations** — each destination is opened in a browser to confirm it renders and to confirm what it does and does not control. `/design-guide` is described as the management-facing reference, `/design-system` as the technical reference; neither is described as a theme editor, because neither writes anything the product reads.
- **Branding and marketplace ownership** — verified by reading the route and its store to see where the value is persisted and read back at runtime, confirming these stay runtime-owned and separate from the design-guide documentation.
- **Source-of-truth warnings** — each entry lists the actual files, their consumers, the concrete difference between them and what would happen if one were edited by hand. No winner, no ranking, no cleanup advice.
- **The "If I want to change X" table** — built last, from the verified rows above, so every lookup points at a file that was actually read. Where a change touches several files, the table says so instead of naming one.

## Document structure

1. Management presentation map (A–J, each with path, route file, production or reference, audience, what it teaches, what it does not control)
2. Manual production edit map (A–AB, task → file → export → consumers → affects → does not affect)
3. Component edit map
4. Design token and foundation edit map (category → file → token → consumers → global or local → edit impact)
5. Branding and white-label map (management view, runtime implementation, storage)
6. Marketplace asset map
7. Design-system reference map, grouped as foundations, components, patterns, experiences, graph, governance, Figma, reference UI, documentation
8. "If I want to change X" quick table
9. "What not to edit" map, with its opposite: production files that do change the product
10. Production versus reference matrix
11. Source-of-truth warnings
12. Management handoff — the five destinations, in plain language
13. Developer handoff — where to start, with an explicit warning about the concepts implemented in more than one place

Anything that is obviously improvable is recorded as **FUTURE OPPORTUNITY — NOT IMPLEMENTED**. No recommendation, consolidation, migration, renaming, deletion, new component or token change is proposed.

## Validation

1. Confirm no file under `src/`, `public/` or any configuration path was created, modified or deleted — only `.lovable/manual-work-map.md` is written.
2. Confirm the running application is untouched: no build or typecheck change is needed, and the representative routes (`/`, `/plans`, `/cart`, `/agency/my-organization`, `/app/jet/branding`, `/marketplace/admin/assets`) render exactly as now.
3. Confirm every file path named in the document exists.
4. Confirm every consumer count in the document came from a search, not from the earlier phase records.
5. Confirm every category with more than one definition carries the NO SINGLE SOURCE OF TRUTH label.
6. Confirm no recommendation, winner, rank, score or priority appears anywhere in the document.
7. Confirm branding and marketplace assets are described as runtime-owned and distinct from the design-guide documentation.

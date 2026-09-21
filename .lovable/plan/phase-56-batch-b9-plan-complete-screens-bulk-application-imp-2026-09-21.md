# Phase 56 / Batch B9 Plan — Complete Screens / Bulk Application Import

## 1. Scope lock
B9 will be implemented only in the existing ABox Figma/plugin reference layer after approval. It will not touch `src/**`, backend, migrations, app behavior, publishing, permanent sync, or runtime ownership boundaries.

## 2. Source audit basis
Use actual source as the authority, not screenshots or inferred product ideas. The audit will read route declarations, route-local UI, shared ABox components, governed M06/M08 registries, shell components, navigation metadata, and B1–B8 plugin outputs before producing B9 objects.

## 3. Verified starting inventory
Current read-only audit found 154 TSX route files, 153 `createFileRoute` declarations, one root layout file, 5 layout-only routes, 6 redirect-only routes, and 142 content route files. These counts are input evidence for B9, not final frame totals.

## 4. Excluded routes
B9 will not create screen frames for redirect-only routes or layout-only route gates. Verified exclusions are `/admin`, `/app/admin`, `/app/object`, `/dashboard`, `/my-work`, `/object`, plus layout-only `/agency`, `/app`, `/marketplace`, `/member`, and `/platform`; `__root` remains a root wrapper, not a screen.

## 5. Complete derived route/screen inventory
The approved implementation will generate a deterministic B9 inventory from source with one record per source-backed screen composition. Each record will include route path, source file, shell family, screen identity if present, content classification, states, overlays, interaction notes, responsive metadata, and source references.

## 6. Inventory arithmetic
The arithmetic will start from 142 content route files, then reconcile governed multi-section routes and embedded governed screens. The final count must be derived by the B9 extractor and verified against source, with explicit additions and exclusions documented rather than using the current provisional count as final.

## 7. Governed M06/M08 treatment
The 12 `/agency/workforce/*` route files require special handling because they compose M06/M08 governed screens through shared route hosts. B9 will derive frames from registered source-backed M06/M08 screen definitions only, not from guessed tab names or duplicated wrapper chrome.

## 8. Screen frame rules
B9 will create native editable top-level Figma `FRAME` nodes only on `05 Screens`. It will not create components, component sets, styles, variables, pages, image-only screenshots, flattened imports, or frames on any B0–B8 page; source-backed prototype reactions are allowed only where B9 proves a deterministic Figma target.

## 9. Reuse of B1–B8
All B9 frames will reuse existing B1 variables, B2 typography tokens, B3 styles, B4/B5 components, B6 patterns, B7 shells, and B8 experience references where applicable. Missing required prerequisites will stop the run instead of inventing substitutes.

## 10. Shell ownership boundaries
InternalShell, MarketplaceShell, and MemberShell remain app-owned shell families and will be represented as reused native structures from B7. Branding/White-Label and Marketplace asset ownership stays with the runtime app surfaces; B9 will not centralize or move those responsibilities.

## 11. Layout and responsive metadata
Each generated frame will carry source-backed Auto Layout settings and metadata for canonical desktop, plus responsive evidence recorded from the route/component source. Responsive metadata is descriptive unless existing native objects already support the required behavior.

## 12. Interactions, states, overlays, and motion
B9 will audit every source-backed interaction and classify it as A) directly representable in Figma prototype, B) representable through existing B4/B5 component state/variant, C) runtime/business-logic dependent and therefore visual-state/metadata only, or D) unsupported/ambiguous and not created. Category A interactions will become native Figma prototype reactions with resolved generated B9 screen/state targets, supported trigger types, and source-backed transition/animation mappings. Category B hover, focus, pressed, active, selected, expanded, and disabled states will prefer existing B4/B5 variants/states over duplicate whole screens. Category C will never fake API, database, auth, pricing, subsidy, or other runtime logic; if a source-backed visual destination exists, B9 may connect to that visual state, otherwise it records metadata/limitations only. Category D is recorded but not invented.

B9 will audit navigation links, buttons, tabs, wizard next/back, menus, drawers/sheets, dialogs, popovers, filters, compare actions, route-changing cards, and close/dismiss actions. It will map them to generated Figma targets only when the target is deterministic. Motion and animation will be copied only where production source provides an unambiguous mapping that Figma supports faithfully; approximations and unsupported source animation will be labeled rather than silently converted, and Smart Animate relationships will not be invented.

## 13. Bulk creation experience
The plugin UI will expose one invisible-to-user bulk operation: `Create All Screens`. Internal batching may exist for safety, but there will be no manual per-screen import workflow and no user-facing per-route creation controls.

## 14. Deterministic identity
Every B9 frame and source-backed prototype reaction will use deterministic names, source signatures, plugin data keys, ordering, and placement. Dynamic routes will preserve parameter identity as source metadata, not expanded fake examples unless an existing source fixture requires one. Signatures will include prototype source identity, target identity, trigger, action, supported transition/animation mapping, and state target where applicable.

## 15. Idempotency and conflict handling
Run 1 must create the missing approved B9 screen frames plus valid source-backed prototype reactions. Run 2 must create zero duplicate frames and zero duplicate reactions, preserve existing IDs, and verify identical signatures. Existing valid reactions with matching signatures are reused. Conflicting names, duplicate plugin IDs, conflicting prototype mappings, missing prerequisites, or changed protected B0–B8 assets must halt with a clear report and must not be silently overwritten.

## 16. B0–B8 protection
B9 verification will assert the seven library pages remain in order, earlier pages retain their expected counts and signatures, and no B0–B8 assets are modified, moved, renamed, deleted, or recreated. Only `05 Screens` may receive B9 screen frames.

## 17. Verification checklist
The B9 verifier will check page placement, top-level frame type, native editability, source signatures, inventory arithmetic, route coverage, excluded-route exclusions, shell mapping, component/pattern reuse, no images-as-screens, no new foundations, no app-source changes, and no publishing. It will verify every source-backed interaction was classified, Category A interactions have native Figma prototype reactions, targets resolve to the correct generated screen/state, supported hover/state behavior is represented through variants/states where appropriate, supported transitions/animations match the source classification, runtime-only limitations are reported, no destinations or interactions are invented, and Run 2 leaves no duplicate prototype reactions.

## 18. Real-Figma verification sequence
After approval and implementation, proof requires Figma Desktop against the ABox Design System — Library file: run `Create All Screens`, run `Verify All Screens`, run `Create All Screens` again, then run verify again. Evidence must include real node IDs, zero screen creations on the second create run, and zero duplicate reactions. Then open representative Internal, Marketplace, and Member flows in Figma Presentation/Prototype mode; click and hover through mapped interactions; verify navigation reaches the correct generated targets; verify supported state transitions and animations; and verify runtime-only limitations are clearly reported rather than falsely simulated. Offline checks remain labeled as offline only.

## 19. Files expected to change after approval
Expected reference-layer changes only: `tools/figma-plugin/extract-b9.mjs`, `tools/figma-plugin/tokens-b9.js`, `tools/figma-plugin/plugin.js`, `tools/figma-plugin/build.mjs`, `tools/figma-plugin/ui.html`, `tools/figma-plugin/README.md`, `tools/figma-plugin/code.js`, and `.lovable/manual-work-map.md`. No `src/**` file changes are planned.

## 20. Non-goals and stop conditions
No migrations, no production app edits, no permanent Lovable-to-Figma sync, no publishing, no manual per-screen import, no screenshots/HTML/flattening, and no invented functionality. B9 recreates the application's design and prototype representation; it does not execute React, JavaScript, backend APIs, database operations, authentication logic, pricing engines, or other runtime business logic inside Figma. Figma remains a standalone imported design/prototype artifact. Stop if the source inventory cannot be proven, B1–B8 prerequisites are missing, source-backed prototype targets cannot be resolved, prototype mappings conflict, or a real Figma write/read path is unavailable for final native proof.

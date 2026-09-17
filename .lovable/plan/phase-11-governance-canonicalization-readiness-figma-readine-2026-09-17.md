# Phase 11 — Governance, Canonicalization Readiness & Figma Readiness

Reference layer only. Nothing in the running application changes: no route, component, style, token, spacing, type, colour, layout, responsive rule, content, icon, navigation, business logic, branding or marketplace asset is touched. No duplicate is merged, renamed, deleted or migrated. No winner is selected, nothing is ranked or scored, and no Figma file, component, variable or asset is created.

## What this phase produces

Phases 1–10 recorded what exists. Phase 11 records what is *decidable*: for each area, whether the evidence already settles the question, or whether a person has to decide — and exactly what that decision would cost. It is an audit and a decision framework, not a migration.

## Files to create (all under `src/lib/design/`)

| File | Purpose |
| --- | --- |
| `canonical-readiness-types.ts` | Additive types only. Controlled vocabularies for readiness state, subject type, decision type, blocker, approval kind, Figma readiness. Reuses `SpecLabel`, `Ownership`, `DependencyNode`. No numeric scores. |
| `canonical-candidates.ts` | Register of areas that *could* become canonical later. Each record separates CURRENT IMPLEMENTATION, OBSERVED VARIATION, POTENTIAL CANONICAL TARGET and REQUIRED DECISION. Unordered — no ranking, no "best". |
| `canonical-decision-register.ts` | Every unresolved question carried forward from Phases 5–10, stated as a decision: options that genuinely exist in code, consequence of each, who must approve, whether Figma work is blocked, whether production migration would be needed. No recommendation. |
| `canonical-boundaries.ts` | Formal ownership boundary map across foundations, semantic roles, core components, compounds, patterns, experience patterns, runtime branding, marketplace assets, route-local kits, shells and business logic. Built from Phase 4–10 ownership evidence. |
| `change-governance.ts` | The future change process per layer (foundation → role → component → compound → pattern → experience pattern → screen): owner, evidence required, what may change independently, which consumers must be checked, and when visual, accessibility, responsive or product approval is triggered. |
| `migration-readiness.ts` | Conceptual ten-stage model (discovery, decision, canonical spec, compatibility design, pilot consumer, regression validation, staged migration, consumer verification, cleanup, documentation). No target chosen, nothing ranked, nothing performed. |
| `regression-contract.ts` | What must remain provably unchanged during any future canonicalization, the evidence that proves it, and representative route and viewport coverage. |
| `figma-readiness.ts` | Per-area audit — foundation variables, semantic variables, type styles, component definitions, variants, states, properties, patterns, experience extensions, naming, hierarchy, accessibility metadata, responsive, density, content model, asset ownership, brand boundary, library governance — each marked READY, PARTIAL, BLOCKED or FUTURE DECISION with its blocker. |
| `figma-library-readiness.ts` | Proposed future library structure mapped from the Phase 8–10 specifications. Groupings the evidence does not justify are recorded as FUTURE DECISION rather than asserted. |
| `naming-readiness.ts` | Current name, current usage, conflict or ambiguity, future naming proposal, migration impact. Proposals stay proposals; nothing is renamed. |
| `accessibility-readiness.ts` | Keyboard, focus visibility, disabled, labels, decorative icons, icon-only controls, semantic HTML, ARIA, screen reader, touch targets, reduced motion, contrast roles, error and success states — current evidence and the gap, no implementation change. |
| `content-readiness.ts` | Whether each component and pattern has a content model complete enough for a component library: required and optional content, labels, descriptions, actions, numeric content, long text, empty, error, loading, and the bilingual and readability notes already recorded. No copy is changed. |
| `experience-readiness.ts` | Per experience (Web/Marketing, Shopping/Commerce, Dashboard/Admin, Member/Account): shared core behaviour, genuine extensions, intentional differences, unresolved differences, ownership, Figma implication. Differences are preserved, never flattened. |
| `readiness-registry.ts` | The single Phase 11 assembly point. Joins by id to the Phase 8 `spec-registry`, Phase 9 `graph-registry` and Phase 10 `pattern-registry`. Exposes lookups (`readinessFor(id)`, `decisionsBlocking(id)`, `figmaBlockers()`) plus counts, and an integrity check that surfaces any readiness record whose subject id is absent from the earlier registries. |

## Relationship to Phases 8, 9 and 10

- Phase 8 supplies the component specifications; Phase 11 references spec ids, never re-declares components.
- Phase 9 supplies the dependency graph; consumer counts, impact reach and screen traceability are read by traversal, never copied.
- Phase 10 supplies the pattern layer; candidates and decisions point at `pat.*` ids.
- No second graph, no second component/pattern/screen/foundation inventory. The integrity check in `readiness-registry.ts` makes any drift visible instead of silent.

## Readiness model

Categorical only, no scores: READY FOR FUTURE DECISION, NEEDS EVIDENCE, NEEDS OWNER, NEEDS PRODUCT DECISION, NEEDS DESIGN DECISION, NEEDS TECHNICAL DECISION, BLOCKED BY DUPLICATE, BLOCKED BY EXPERIENCE VARIATION, DEFERRED, NOT APPLICABLE. Each record carries the evidence that produced its state; where the code does not answer, the state is NEEDS EVIDENCE with the reason, never an inference.

## Candidate areas to audit

Only where Phase 1–10 evidence supports a record: actions and action pills, page headers, section headers, cards and surfaces, form fields, status badges, tables and data presentation, KPI/metric groups, navigation, dialogs and drawers, empty states, loading states, plan/product presentation, result toolbars, icon containers, typography roles, spacing roles, control sizing, status and tone vocabulary. Known blockers already on record — tabular presentation, form composition, assistant surfaces, screen opening headers, three shell navigations, the unowned loading/error area, 36px vs 40px controls, card padding, stacking breakpoints, the unused pagination primitive — become decision records, not fixes.

## Reference page changes

`/design-system` gains concise technical sections: canonicalization readiness, candidate register, decision register, ownership boundaries, change governance, migration readiness, regression contract, Figma readiness, Figma library blueprint, naming readiness, accessibility readiness, content readiness, experience readiness.

`/design-guide` gains management sections: what canonical means; what does not become canonical automatically; how decisions are recorded; who owns foundations, components, patterns and experiences; how production changes get approved; why duplicates stay until decided; how visual regression protects the live product; what must be settled before a real Figma library exists; how Figma and production would stay aligned.

Existing reference-kit helpers are reused (`SpecMatrixTable`, `DefinitionRows`, `DuplicateRegisterTable`, `RuleList`, `ArchLabelChip`, `MigrationList`, `FigmaSectionTable`, `CriteriaTable`, `TraceabilityCard`). At most two additive helpers if an existing one genuinely cannot present a record — expected candidates: a readiness-state table and a decision card. Both routes stay unlisted and direct-URL only.

## Documentation

`.lovable/design-system.md` gains a Phase 11 section; `roadmap.md` gains the Phase 11 milestone. Every statement is labelled CURRENT IMPLEMENTATION, OBSERVED VARIATION, UNOWNED, FUTURE OPPORTUNITY, FUTURE DECISION, or Figma READY / PARTIAL / BLOCKED. No future decision is written as settled and no proposed Figma piece is written as existing.

## Validation

1. `bunx tsgo --noEmit`; 2. lint changed files, acknowledging only the known fast-refresh warning; 3. production build; 4–7. `/design-system` and `/design-guide` on desktop and mobile; 8. zero new console errors; 9. regression pass on `/`, `/plans`, `/cart`, `/agency/my-organization`, `/app/jet/branding`, `/marketplace/admin/assets`; 10. confirm no production file changed; 11. confirm no navigation, header, sidebar or breadcrumb link to the reference routes; 12. Phase 1–10 sections intact; 13. Branding & White-Label intact; 14. Marketplace Asset Management intact; 15. no duplicate merged, renamed, deleted or migrated; 16. no production token changed; 17. no Figma component, variable, asset or library created; 18. no duplicated registry, graph or inventory; 19. every readiness conclusion traced to evidence; 20. no candidate presented as a selected winner.

## Production preservation

Only `src/lib/design/*`, `src/components/design/reference-kit.tsx`, `src/routes/design-system.tsx`, `src/routes/design-guide.tsx`, `.lovable/design-system.md` and `roadmap.md` are created or modified. The new modules are imported solely by the two reference routes and never by application code. The running product stays pixel-, behaviour-, route-, responsive-, branding- and asset-identical.

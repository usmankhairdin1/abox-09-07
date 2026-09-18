# Phase 46 — Governance Enforcement Batch B (E3: runtime branding / reference boundary)

PLAN ONLY. No files changed in this phase.

## 1. Executive summary

E3 protects one exact invariant: **reference/design material must not import runtime branding, marketplace state, or runtime asset ownership.** The audit below shows the repository is already fully compliant — zero such imports exist — so E3 can be shipped as a configuration-only ESLint boundary that freezes the current architecture with zero new findings and zero production source changes.

The enforcement target is the runtime store module `src/lib/marketplace-store.ts` (which owns both the Brand record and Marketplace Asset Management) plus the runtime branding/asset admin route modules. It is deliberately **not** `src/components/abox/logo.tsx`, which both reference routes legitimately import as a documented mark example.

E5/E6/E7 are not included.

## 2. Fresh E3 import/dependency audit (measured)

Reference/design surface: `src/lib/design/**` (118 files), `src/components/design/reference-kit.tsx`, `src/lib/design-tokens.ts`, and the two reference routes `src/routes/design-system.tsx`, `src/routes/design-guide.tsx`.

- `src/lib/design/**`: every import is a relative sibling reference module (`./types`, `./component-spec-types`, `./graph-*`, `./spec-*`, `./pattern-*`, etc.) plus one `lucide-react` import. **Zero** imports of any runtime module. No barrel file re-exports runtime code into this tree.
- `src/components/design/reference-kit.tsx`: imports `react`, `@/lib/utils`, `@/lib/design-tokens` only.
- `src/lib/design-tokens.ts`: imports nothing.
- Reference routes: import shadcn primitives, canonical ABox presentation components (`page-header`, `kpi-card`, `status-badge`, `metal-badge`, `carrier-mark`, `plan-card`, `empty-state`, `data-table`, `overflow-text`, `action-pill`, `logo`), plus `@/lib/sample-data` and `@/lib/products`. **Zero** imports of `@/lib/marketplace-store`, no `getActiveBrand`/`getDraftBrand`/`getAssets` usage, no Supabase or auth-session import.

Current E3 violations: **0**.

Brand-name strings, colour literals and logo examples inside the reference data are documentation content, not ownership dependencies, and are explicitly outside the rule's target.

## 3. Exact runtime branding ownership paths

- `src/lib/marketplace-store.ts` — canonical White-Label owner: the `Brand` interface, `marketplaceStore`, `useMarketplaceState`, `getActiveBrand`, `getDraftBrand`, `getActiveContent`, `getDraftContent`.
- `src/routes/marketplace.admin.brand.tsx`, `marketplace.admin.preview.tsx`, `marketplace.admin.compare.tsx`, `marketplace.admin.releases*.tsx` — runtime branding administration flows.
- `src/components/abox/logo.tsx` — static ABox mark/wordmark. Production-owned, but it is not runtime White-Label state; it stays importable by the reference routes.

## 4. Exact runtime asset ownership paths

There is no separate asset module. Marketplace Asset Management lives inside the same store (`AssetType`, `MarketplaceAsset`, `getAssets`) with `src/routes/marketplace.admin.assets.tsx` as its admin surface. Restricting `@/lib/marketplace-store` therefore covers the asset boundary in one pattern; the admin route module is restricted alongside the branding routes.

## 5. E3 candidate enforcement rule

Extend the existing Phase 45 reference-layer override block in `eslint.config.js` — the block already scoped to `src/routes/design-system.tsx`, `src/routes/design-guide.tsx`, `src/components/design/**`, `src/lib/design/**`, `src/lib/design-tokens.ts` — with one additional `patterns` group:

- `@/lib/marketplace-store`
- `@/routes/marketplace.admin.*`
- relative escapes: `**/lib/marketplace-store`, `**/marketplace.admin.*`

Message: "Reference/design material is documentation-only. Runtime branding (Brand record, getActiveBrand/getDraftBrand) and Marketplace Asset Management are production-owned and must not be imported here."

No new plugin, framework, script or registry. The E3 patterns are defined once as a shared constant next to the existing E1/E2/E4 constants.

## 6. Direct vs relative import handling

The alias form `@/lib/marketplace-store` is the only form used anywhere in the repository today. The relative glob `**/lib/marketplace-store` is added so a reference file cannot bypass the rule with `../../lib/marketplace-store`. `no-restricted-imports` matches the literal specifier, so both forms are needed; neither can match anything outside the override's five-path file scope.

## 7. Reference-route / design-layer handling

The rule is applied to exactly the same enumerated file set that E1 exempts. Reference-to-reference imports (`./types`, `@/lib/design-tokens`, `@/components/design/reference-kit`) stay valid — they are untouched by E3 and remain exempt from E1. Reference routes keep importing canonical presentation components and sample data; only the runtime store and branding/asset admin modules become unreachable from that tree.

## 8. Interaction with Phase 45 E1/E2/E4

- E1 (production → reference, forbidden) and E3 (reference → runtime branding, forbidden) run in opposite directions and share no path, so no rule contradicts another and no cycle is created.
- The reference override keeps the existing `server-only` path entry and the E2 patterns verbatim; E3 is appended to that same array. E1 remains absent from the override, which is what makes the reference exception work.
- The main production block and the three shell overrides are not edited; E1/E2/E4 behaviour is byte-identical in effect.

## 9. Severity and expected findings

**Error.** The boundary is binary (a module either imports the runtime store or it does not), current compliance is zero violations, and a warning would be invisible inside the 16,783-finding backlog. Expected new findings: **0**. If any real violation surfaces, the rule is not shipped as an error — the violation is classified in the plan record and no production migration is performed to make the rule pass.

## 10. False-positive / false-negative analysis

- Reference routes: no false positive; they import no runtime store today, and the components they do import stay allowed.
- `src/lib/design/**`: fully relative imports; no pattern can match them.
- `src/components/design/**` and `src/lib/design-tokens.ts`: import only `react`, `@/lib/utils` and each other.
- `logo.tsx`: intentionally not restricted — documented exception; restricting it would break both reference routes with no ownership justification.
- Documentation sample data (brand strings, colours, file-path strings such as `"src/components/ui/table.tsx"`) is text, never an import — unmatched by design.
- Production code that legitimately owns branding is outside the override's file scope and is unaffected.
- A new reference file added under the enumerated directory globs inherits the rule automatically; a new reference **route** added outside those paths would not — the plan records that any new reference route must be added to both the E1 exception list and the E3 scope in the same change.
- Known false negative, accepted: `@/lib/cart-store`, `@/lib/auth-session` and `@/integrations/supabase/*` are runtime state but outside the named E3 scope; they are not restricted in this batch and are documented as a limitation rather than a broadened pattern.

## 11. Validation matrix

| Check | Expectation |
| --- | --- |
| Baseline lint capture (post-Phase-45) | 16,783 findings |
| Full lint after change | 16,783, `no-restricted-imports` findings 0 |
| Negative control via `eslint --stdin` in `src/lib/design/graph-registry.ts` and `src/routes/design-system.tsx` | `@/lib/marketplace-store` and `../../lib/marketplace-store` both blocked |
| Negative control in a production file (`src/routes/plans.tsx`) | `@/lib/marketplace-store` still allowed |
| Reference-to-reference probes (`./types`, `@/lib/design-tokens`) | allowed |
| E1 probes (production importing `@/lib/design/*` blocked; reference route allowed) | unchanged |
| E2 probe (`@/components/ui/table` blocked everywhere) | unchanged |
| E4 probe (sibling shell import blocked inside a shell, allowed in a route) | unchanged |
| `server-only` probe | still blocked |
| `tsgo` typecheck | clean |
| Production build | OK |
| `git diff --check` / `git diff --stat -- src/` | clean / empty |
| Import-count re-scan (reference→runtime 0, `ui/table` 0, `ui/pagination` 0, shell-to-shell 0) | unchanged |
| Read-only public-route spot check (`/`, `/plans`, `/design-system`, `/design-guide`) | renders, no console errors |

## 12. Source/hash integrity

SHA-256 before and after, all must be unchanged: `src/lib/marketplace-store.ts`, `src/components/abox/logo.tsx`, the three shells, `src/styles.css`, `src/routes/marketplace.admin.assets.tsx`, `src/routes/marketplace.admin.brand.tsx`, `src/routes/design-system.tsx`, `src/routes/design-guide.tsx`, `src/components/design/reference-kit.tsx`, `src/lib/design-tokens.ts`, plus the Phase 45 canonical set. `eslint.config.js` is the only file whose hash is expected to change.

## 13. Expected file diff

- `eslint.config.js` — E3 patterns constant plus its addition to the existing reference-layer override.
- `.lovable/manual-work-map.md` — Phase 46 governance block, appended after implementation only.

No script, no registry, no `src/` change.

## 14. Rollback

Remove the E3 constant and its reference in the reference-layer override, returning that block to `server-only` + E2 patterns, and delete the Phase 46 governance block. Phase 45 E1/E2/E4 remain intact and are re-probed after rollback. No production source rollback is needed. Then rerun typecheck, build, full lint, `git diff --check`, and confirm hashes.

## 15. Governance update

After implementation only, record in `.lovable/manual-work-map.md`: the exact E3 invariant, the restricted runtime branding/asset paths, the file scope, current importer count (0), the logo exception and its reasoning, the accepted false negatives (cart-store, auth-session, Supabase client), severity, validation results, zero-production-change status, and that E5/E6/E7 remain deferred.

## 16. Not included

E5 (raw hex/oklch scan), E6 (consumer-count report), E7 (duplicate-definition scan) are **not** part of this batch. No scanner, generator or registry is created.

## 17. Readiness

Ready. E3 has a precise statically enforceable boundary, the repository is already compliant, the rule cannot collide with E1/E2/E4, no production source needs to change, and rollback is a single-file revert.

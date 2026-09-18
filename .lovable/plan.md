# Phase 43 — Branding / White-Label Propagation & Asset Ownership Audit (PLAN ONLY)

Audit-only. No production file, asset, logo, colour, route or runtime ownership changes. Preservation rule: not one pixel, not one dot.

## 1. Fresh branding inventory

Brand marks (code-drawn, no image files):
- `src/components/abox/logo.tsx` — `AboxMark` (inline SVG, 4 tones) and `AboxWordmark`. The only brand-mark source in production.
- Production consumers of `AboxMark`: `marketplace-shell.tsx` (3), `internal-shell.tsx` (3), `member-shell.tsx` (2), `placeholder-screen.tsx` (2), `planai-assistant.tsx` (2), `plan-o-assistant.tsx` (2), `routes/index.tsx` (2), `routes/quote.tsx` (2), `routes/app.jet.branding.tsx` (1). All other matches (26 files) are in `src/lib/design/**`, `design-system.tsx`, `design-guide.tsx` — documentation only.
- Image assets: `public/favicon.ico` only. `src/assets` does not exist. No logo PNG/SVG file ships.
- Literal brand text in production source: 37 occurrences of `ABox` / `Agency in a Box` across `src/routes` and `src/components`, plus route `head()` titles suffixed `— ABox`, plus `__root.tsx` title `ABox — Agency in a Box Wireframes`, plus footer `© <year> JET / ABox`.

Branding tokens / configuration:
- `src/styles.css` — foundation colour roles (`--primary`, `--primary-soft`, `--sage`, `--sidebar-*`) in light and dark blocks. Design-system roles, not tenant values.
- Runtime tenant brand record: `Brand` type in `src/lib/marketplace-store.ts` (`display_name`, `tagline_en/es`, `headline_en/es`, `intro_en/es`, `primary_color`, `accent_color`, `logo_asset_id`, `favicon_asset_id`, `status`, `version`). Seeded active brand `brand-active-001`: display name `ABox`, tagline `Agency in a Box`, `primary_color #c05a2e`, `accent_color #2e6b5e`.
- `app.jet.branding.tsx` lists four foundation swatches (`--primary`, `--sage`, `--background`, `--sidebar`) as literal oklch strings — a display copy, not a source.

## 2. Runtime ownership map

| Value | Canonical runtime owner | Notes |
| --- | --- | --- |
| Tenant display name, tagline, headline, intro, primary/accent colour, logo/favicon asset ids | `marketplace-store.ts` Brand record (active/draft, versioned, published via Publication Review) | Real source; consumers depend on it |
| Brand mark artwork | `components/abox/logo.tsx` (code-drawn) | Not tenant-configurable today |
| Foundation colour roles | `src/styles.css` | Non-configurable |
| Marketplace asset lifecycle (upload/scan/validate/retire) | `marketplace-store.ts` assets + `marketplace.admin.assets.tsx` | Separate owner; seeded empty |
| Favicon / document titles | route `head()` + `__root.tsx` static `/favicon.ico` | Static, not tenant-driven |
| Branding & White-Label admin screens | `app.jet.branding.tsx`, `marketplace.admin.brand.tsx` | Runtime-owned surfaces |

## 3. White-Label propagation graph

```text
Brand record (marketplace-store, ACTIVE version)
  -> getActiveBrand(mkt)
       -> marketplace-shell.tsx   display_name ?? "ABox", tagline_en ?? "Agency in a Box"  (header + footer)
       -> routes/index.tsx        headline_en || fallback, intro_en || fallback
       -> marketplace.admin.*     brand editing, compare, preview, review (auth-gated)
  -> getDraftBrand(mkt)
       -> marketplace.admin.brand / preview / compare / releases.* (auth-gated)

Brand record ->/-> InternalShell, MemberShell   (NOT connected: literal "ABox")
Brand record ->/-> favicon, document titles     (NOT connected: static)
Brand colours ->/-> stylesheet roles            (NOT connected by design)
```

Only two publicly measurable consumers read the brand record: the marketplace shell and the landing route.

## 4. Shell-by-shell branding ownership

- `marketplace-shell.tsx` — Class B. Reads `getActiveBrand`, owns presentation plus its own `?? "ABox"` / `?? "Agency in a Box"` fallbacks, and an independent literal `JET / ABox` in the footer.
- `internal-shell.tsx` — Class G. Renders literal `ABox` twice plus `aria-label="ABox home"`; entity name default `Cedar Grove Insurance` is a prop default, not brand data. Does not read the brand record.
- `member-shell.tsx` — Class G. Renders literal `ABox`. Does not read the brand record.
- No shell duplicates the brand record or holds tenant configuration state. Shells stay independent; no merge proposed.

## 5. Asset ownership map

| Asset | Owner | Tenant-specific | Interchangeable |
| --- | --- | --- | --- |
| `AboxMark` inline SVG | design/component layer (code-drawn) | No | n/a |
| `AboxWordmark` | same | No | n/a |
| `public/favicon.ico` | static production | No | No |
| `logo_asset_id` / `favicon_asset_id` on Brand | Marketplace Asset Management | Yes | Never copy into the design layer |
| `public/registers/*.json` | governed registers, not branding | No | No |
| Decorative motifs in `components/abox/decor` | design layer | No | No |

No duplicate image files exist, so no asset consolidation question arises.

## 6. Duplicate-source register

- D1 — Literal `ABox` / `Agency in a Box` in 37 production locations while a runtime `display_name` exists. Two shells and all route titles bypass the runtime owner.
- D2 — Fallback strings duplicated inside `marketplace-shell.tsx` rather than defaulted at the store.
- D3 — Foundation oklch values re-typed as literals in `app.jet.branding.tsx` swatch list.
- D4 — `#c05a2e` / `#2e6b5e` brand colours live in seed data only and never reach any rendered style; the live preview blocks in `marketplace.admin.brand.tsx` are the only consumers.
- D5 — `src/lib/design/**` documents brand components extensively but no production file imports it; boundary intact.

## 7. Candidate register

| ID | Source | Consumers | Class | Evidence | Safe now |
| --- | --- | --- | --- | --- | --- |
| C1 | Runtime `display_name` | InternalShell, MemberShell literals | D/J | Both shells auth-gated; wiring them would change rendered text the moment a tenant renames | No |
| C2 | Runtime `tagline_en` | marketplace-shell fallback literals | C | Already correct propagation; moving defaults into the store changes no output but also fixes nothing | No |
| C3 | Route `head()` titles `— ABox` | 40+ routes | E | Static metadata, prerendered; runtime brand is not available at head time | No |
| C4 | `favicon_asset_id` | `__root.tsx` static favicon | F/K | Belongs to Marketplace Asset Management; wiring it crosses the asset boundary | No |
| C5 | Brand `primary_color` / `accent_color` | none rendered outside admin preview | K | No theme application path exists; connecting it would repaint the app | No |
| C6 | `AboxMark` | 9 production consumers | A/B | Already single-sourced | n/a |
| C7 | `app.jet.branding.tsx` swatch literals | one screen | H | Route-specific display copy | No |

## 8. Public / measurable proof routes

`/` (landing, marketplace shell — brand name, tagline, headline, intro), `/plans`, `/compare`, `/cart`, `/review`, `/handoff`, `/quote`, `/select`, `/faq` (marketplace shell header/footer brand name + tagline + `AboxMark`). Verify at 1440 / 834 / 390: mark presence and dimensions, brand name and tagline text, wrapping, header/footer placement, responsive visibility, accessible name `"<brandName> home"`.

## 9. Auth-gated / NOT CAPTURED

`/app/*` (incl. `app.jet.branding`), `/agency/*`, `/platform/*`, `/marketplace/admin/*` (brand, preview, compare, releases, assets), `/member/*`. Source-inspected only. No runtime parity inferred, no session or tenant state fabricated.

## 10. Exact-equivalence requirements (future migration)

Identical rendered text, mark geometry, DOM tree, class output, attributes, computed styles, responsive behaviour at all three viewports, fallback path when the brand record is absent, asset resolution path, loading behaviour, accessibility tree and accessible names, route/navigation behaviour, no tenant/business coupling change, no Marketplace Asset Management boundary crossing, at least two independently verifiable consumers.

## 11. Proposed future migration batches

None in this phase. If C1 is ever approved, it would run as: Batch 0 — additive read helper only; Batch 1 — one shell behind a full parity gate; later shells each behind their own gate. Requires runtime access to an authenticated shell, which does not exist today.

## 12. Validation gates

For any future branding migration: runtime source trace, asset identity/path, DOM and class diff, attribute diff, computed styles, dimensions, responsive checks at 1440/834/390, fallback and loading behaviour, accessibility tree, keyboard where relevant, navigation behaviour, tenant behaviour, asset-boundary check, console clean, `tsgo`, build, lint against the existing 16,783-finding baseline, locked-source hashes, `git diff --check`.

## 13. Rollback strategy

Zero migration means the production rollback surface is empty; only the governance block in `.lovable/manual-work-map.md` would be reverted. Any future migration restores byte-identical source, reruns all gates and re-verifies hashes; any unexpected diff stops the work and restores exactly.

## 14. Governance updates (after implementation only)

Append a Phase 43 block to `.lovable/manual-work-map.md` recording: the Brand record as canonical runtime White-Label owner; Marketplace Asset Management as separate asset owner; `logo.tsx` as sole brand-mark source; shells own presentation only and stay independent; runtime branding may never be duplicated into `src/lib/design/**`, `src/components/design/**`, `/design-system` or `/design-guide`; no asset duplication or consolidation by visual similarity; future parity requirements; auth-gated NOT-CAPTURED rule; zero migration valid.

## 15. Expected changed files

Plan only — none. After eventual execution: `.lovable/manual-work-map.md` only.

## 16. Expected production migrations

ZERO. Branding is already runtime-owned by the Brand record, the brand mark is already single-sourced, no duplicate assets exist, and the design/reference layer holds documentation only. The literal-brand-name bypass (C1) is recorded as a future candidate that cannot be proven today because both affected shells are auth-gated.

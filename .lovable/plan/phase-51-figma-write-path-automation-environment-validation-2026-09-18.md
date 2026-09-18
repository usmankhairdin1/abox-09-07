# Phase 51 — Figma Write-Path & Automation Environment Validation (PLAN ONLY)

Audit-only phase. No Figma file is created or changed, no production code is touched, no plugin is installed, and Batch 0 from Phase 50 does not start. The only file this phase would write is a governance block appended to `.lovable/manual-work-map.md`.

## 1. Executive finding (based on what is verifiable right now)

**NOT READY — USER/ENVIRONMENT SETUP REQUIRED.**

Verified in this environment:
- No cloud Figma connector exists for this workspace; the connector catalogue returns no Figma app MCP.
- No active desktop session is connected. The documented path is Lovable Desktop + Figma Desktop in Dev Mode with the local MCP server enabled.
- That desktop connection is **read-only**. It inspects Figma; it cannot create variables, styles, components or frames.
- Nothing Figma-related exists in the project beyond reference/blueprint modules under `src/lib/design/` (figma-variables, figma-library, figma-readiness and similar), which are documentation data, not a write path.

Conclusion: no write-capable Figma path is verified today. A write path requires a mechanism that runs inside Figma (a plugin) or an authorised Figma API/Make workflow, and each of those needs user setup and confirmation before any generation batch.

## 2. What the phase produces

A single governance block recording:

1. Executive finding
2. Candidate Figma workflows
3. Read vs write capability matrix
4. Verified/unverified status per workflow
5. Required desktop applications
6. Required permissions
7. Plugin / Make / MCP dependency
8. User-action prerequisites
9. Native-object validation strategy
10. Determinism strategy
11. Rollback strategy
12. Security model
13. Traceability readiness
14. Batch 0 readiness criteria
15. Exact blockers
16. Recommended future implementation sequence

## 3. Workflow classification

Each candidate workflow is recorded against a fixed field set (tool, execution environment, required apps, permissions, authentication, input source, output destination, native objects it can create, variables / styles / components / variants+properties / Auto Layout / pages+sections / instances / library publishing / update-in-place support, determinism, limitations, verification status) and assigned exactly one class:

- VERIFIED WRITE-CAPABLE
- VERIFIED READ-ONLY
- AVAILABLE BUT REQUIRES USER SETUP
- UNVERIFIED
- UNSUITABLE FOR NATIVE LIBRARY GENERATION

Candidates to be recorded: Lovable cloud connector, Lovable Desktop + Figma Dev Mode local MCP, Figma plugin executed by the user inside Figma, Figma REST API with a user token, Figma Make, and manual construction. Only the first two can be classified from direct evidence here; the rest are recorded UNVERIFIED or REQUIRES USER ACTION and are never described as available.

No capability is claimed from documentation alone. Anything not observable in this environment is marked UNVERIFIED, REQUIRES USER ACTION, REQUIRES EXTERNAL SETUP, or NOT AVAILABLE IN CURRENT ENVIRONMENT. No credentials, plugin IDs or endpoints are invented.

## 4. User-action prerequisite checklist

Recorded as a short list containing only genuinely required steps, each tagged mandatory or conditional, and each tied to the workflow it unblocks. The checklist explicitly separates steps required for reading Figma from steps required for writing to Figma, so no unnecessary setup is requested.

## 5. Native-object validation strategy

Defines, for a future implementation phase only, how generated content is proven to be native and editable rather than an image: per-object-type checks for variables, text styles, effect styles, components, component sets, variants, component properties, instances, Auto Layout frames, editable text, editable vector layers, and page/section hierarchy. Evidence must come from structural inspection (node type, bound variables, property definitions, layout mode, publishable library entries), never screenshots alone. A single image or flattened node anywhere in the target file fails validation.

## 6. Determinism, rollback, security, traceability

- **Determinism:** stable variable names, component names, variant and property names, hierarchy and `abox/<export-name>` traceability identity; no duplicate components on re-run; update-in-place preferred. If update-in-place cannot be guaranteed by the chosen path, the limitation is recorded before Batch 0 rather than worked around.
- **Rollback:** all generation targets a dedicated scratch Figma file owned for this purpose; nothing is published to a shared library until validation passes; production code and runtime branding are never part of any rollback because they are never written.
- **Security:** any token lives only in the user's local environment or Figma session; nothing is committed to ABox source; generated reports must be checked for file keys or tokens before being written.
- **Traceability:** confirms the chosen path can carry `abox/<export-name>` identity into Figma naming or plugin data without adding any Figma metadata to production source.

## 7. Batch 0 readiness criteria

Phase 52 stays blocked until every mandatory criterion is verified: a verified write-capable path, authenticated user, correct permissions, an available target file, proven native variable creation, proven native component creation, proven component-property/variant creation, proven Auto Layout, understood re-run behaviour, understood rollback, no production mutation, no runtime branding transfer, no flattened workflow. Any unverified mandatory item leaves the status NOT READY.

## 8. Boundaries preserved

Phases 1–50 stand unchanged. Production remains the canonical design-system source; Figma is a generated representation. The future workflow never takes ownership of tenant runtime branding, Marketplace Asset Management, live data, business logic, routing, authentication, production governance, E5/E6/E7 enforcement, shell merging, or route-local production ownership.

## 9. Validation for this phase

No `src/` diff, no asset/route/branding change, all Phase 49 hashes unchanged, lint/typecheck/build unchanged from baseline, governance report byte-identical on rerun.

## 10. Rollback for this phase

Remove the Phase 51 governance block from `.lovable/manual-work-map.md`. Nothing else changes.

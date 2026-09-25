# Screen Governance & Traceability — Current-State Assessment (no changes)

This is an assessment only. Nothing in the app, database or plugin is modified. Approving this simply records the assessment; the next prompt will design the capability.

## Summary

Screens are governed today by **convention and static documents**, not by an enforced system. There are four separate "screen identity" lists that never check against each other, approval is a text label rather than a workflow, and the database has solid audit/event history for business records — but nothing for screens.

## 1. Screen identification

- **Four separate ID spaces:**
  - App screen list — `src/lib/screens.ts` (`SCREENS`, keys like `UX-009`, `SCR_AGENCY_SETUP`).
  - Governed packet screens — `src/lib/governed/types.ts` (`GovernedScreen {id, slug, module, …}`), with `m00/m04/m05/m06.index.ts` (IDs like `SCR-M06-001..035`).
  - M08 — `src/lib/m08/registry.ts` (`SCR-M08-###`).
  - Figma plugin — `tools/figma-plugin/tokens-b9.js` / `tokens-current-app.js` (keys like `current:route:/plans`, plus signature strings).
- **Stability:** by policy only. The comment in `governed/types.ts` says IDs "must never be renamed, renumbered, reused or removed", but no code enforces it.
- **Duplicates possible:** yes. `SCREENS` is a plain object, so a repeated key silently overwrites the earlier one. `screenById()` returns the first match it finds. Nothing checks IDs across the four lists. The duplicate hard-stops in the Figma plugin only look inside one generation run (`extract-b9.mjs:447`, `extract-current-app.mjs:48, 214–232`). The live example: `SCR_AGENCY_SETUP` and `UX-009` are shared by several routes.

## 2. Governance controls

| Control | State |
|---|---|
| Lock a Screen ID | Does not exist |
| Prevent ID reuse | Stated only in a comment; not enforced |
| Governed/approved status | Text field only (`status: "APPROVED"`, `"APPROVED_SPEC"` in governed index files); no workflow |
| Ownership | Does not exist (no owner field on `GovernedScreen`) |
| Prevent duplicate screens | Only inside a single Figma generation run |
| Tell "modify existing" from "new" | Does not exist |

## 3. Traceability

- **Module → Packet:** exists as a static map. `MODULE_PACKET` in `src/lib/governed/index.ts` maps a module to one packet name.
- **Packet → Screen:** partial. The governed screens carry a `module` field, and so inherit the packet by lookup. There is no per-screen record of which packet created it or later modified it.
- **Change/impact:**
  - Hand-written change logs: `docs/m00|m05|m06/CHANGE_CONTROL_LOG.md`, with records like `CCL-M06-001..010`.
  - Delta/impact registers: `DELTA_REGISTERS`, loaded as static JSON from `public/registers/`.
  - The M06 log itself records the gap (`CONF-M06-002` / `CCL-M06-005`): the screen register has empty route, permission and capability fields.
- **Dates and diffs:** screens have no created or modified timestamps, and there is no version-to-version diff.

## 4. Data model and architecture

- **Database:** no screen, screen-version or approval tables. The reusable infrastructure is:
  - `m00.audit_event` (event_code, actor, tenant, correlation_id, occurred_at, payload_hash, metadata, version).
  - `m00.outbox_event` and `lucie_m05.event_outbox` (aggregate_type, aggregate_id, aggregate_version, causation_id).
  - `lucie_m05.schema_version_evidence` (artifact_sha256 — schema releases, not screens).
  - `public.m00_emit(...)`, which emits typed events.
  - `lucie_m05.organization_duplicate_candidate` detects duplicate organizations, not screens.
- **Code:**
  - Types: `GovernedScreen`.
  - Lookups: `screenBySlug`, `screenById`.
  - Registers: the `useRegisters()` hook.
  - In-app demo change records: `src/lib/m00-change-control.ts` (`CHG-001..003`), not linked to the docs logs.
- **Tooling:**
  - The Figma extractors produce `sourceSignature`, `structureSignature`, `bindingSignature` and `signature` hashes per screen.
  - `scripts/governance-report.mjs` detects duplicate code export names. It only reports and never blocks.

## 5. Build packet consumption

There is **no mechanism** that reads a packet and outputs "these existing screens are modified, these new screens are created". Packets are only consumed as hand-generated static index files plus Markdown change logs.

## 6. Versioning and audit history

- **Available:**
  - Generic audit and event history for business records (the database tables above).
  - Build-time content hashes for Figma screen frames.
  - Hand-written change logs.
- **Missing:** everything screen-specific:
  - Version history and snapshots.
  - Who or what changed a screen, and when.
  - Which source artifact caused the change.

## 7. Duplicate and impact detection

| Signal | State |
|---|---|
| Screen ID | Only within one Figma run; not across the four lists |
| Screen name | Only within one Figma run (B9 names, current-app frame names) |
| Route | Only in the current-app extractor's route inventory |
| Component | Code export names only (report-only) |
| Functional purpose / other metadata | Does not exist |
| "Packet refers to an existing screen" | Does not exist |

## 8. Assessment

Categories: A = implemented, B = partial/reusable, C = possible with current architecture, D = needs new architecture.

| Capability | Exists | Partial | Does not exist | Evidence | Cat. |
|---|---|---|---|---|---|
| Unique Screen ID | | X | | 4 unlinked ID spaces; no global check | B |
| Screen Registry | | X | | `screens.ts`, `governed/*.index.ts`, `m08/registry.ts`, Figma tokens | B |
| Screen ID Locking | | | X | Policy comment only | D |
| Screen Versioning | | | X | Figma hashes are per-run fingerprints, not history | C/D |
| Screen Change History | | | X | Only hand-written logs in `docs/*/CHANGE_CONTROL_LOG.md` | D |
| Build Packet → Screen | | X | | `MODULE_PACKET` + screen `module` field | B |
| Module → Screen | | X | | `GovernedScreen.module` (governed screens only) | B |
| Screen → Build Packet | | X | | Derivable only via module; no modified-by record | B/D |
| Impacted Screen Tracking | | | X | Delta registers are static; `CCL-M06-005` open | C/D |
| New Screen Tracking | | | X | None | D |
| Duplicate Screen Detection | | X | | Figma per-run checks; governance-report export names | B |
| Audit Trail | | X | | `m00.audit_event` / outboxes — not screen-scoped | B/C |
| Screen Governance Status | | X | | `status` strings in governed index files | B |

## Not verified

- The contents of `public/registers/*.json` (populated or empty).
- `src/lib/m00-foundation.ts` in detail.
- Whether `governance-report.mjs` is run anywhere.

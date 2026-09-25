# Screen Governance — Pre-Design Validation Report (read-only)

This is a discovery report only. It changes no files, tables, IDs or screens. Approving it records the findings; the next step waits for your instruction.

## 1. Delta / Impact Registers

`public/registers/` holds four files: `m00.json`, `m04.json`, `m05.json` and `m06.json`. Each one is `{ meta, registers }`, and `meta.document_control` names the packet (for example `ABOX-LUCIE-M04-BP`, v1.0, `PRODUCTION_BUILD_READY`). Every register checked contains rows.

| Register | Where | Rows | Tracks | Screen-level? | Classification |
|---|---|---|---|---|---|
| Screen_Register | m04 / m05 / m06 | 36 / 30 / 35 | `screen_id` (SCR-M0x-###), name, route, roles, purpose, primary actions, states; m06 also has `owning_module`, `permission`, `capability_id`, `status` | Yes; IDs unique per file; routes filled | Populated and usable |
| Screen_Register | m00 | 34 | `screen_id` (SCR_PLATFORM_HOME style), `screen_record_id`, workspace, ownership, `requirement_ids` | Yes, but all 34 routes empty and uses a different ID format | Populated but insufficient |
| *_Impact_Register (M00/M01/M05, Prior_Module) | m00, m04, m05, m06 | 18–26 each | impact_id, prior_module, disposition, affected_requirement_ids, before/after state, owner, status | No screen IDs (0 SCR references) | Populated, unrelated to screens |
| Proposed_*_Delta_Register | m00, m04, m05, m06 | 4–17 each | delta_id, `originating_packet`, `impacted_module`, before/after definition, `affected_artifacts`, compatibility/migration, approval status | No screen IDs | Populated but insufficient; the right pattern, wrong granularity |
| Upstream_Contract_Consumption | all four | 12–39 | Contracts consumed from other modules | No | Unrelated |
| M1D_Review | m00, m04, m05 | 25 each | Cross-module decision posture | No | Unrelated |

**Answers:**
- **Registers with screen-level information:** only the Screen_Register tables.
- **Impacted screens:** no register identifies them.
- **Newly created screens:** no register identifies them.
- **Source modules or build packets:** the delta registers do, but at module and requirement level, never at screen level.
- **Reuse:** the delta-register shape (originating_packet, impacted_module, before/after, approval status) is a ready template for a "packet → screen impact" record.

**Discrepancy to note:** the M06 change log (`CONF-M06-002`) says the M06 Screen Register has empty routes and permissions. The copy in `public/registers/m06.json` has routes filled for all 35 rows. Before migrating, confirm which copy is authoritative.

## 2. M00 Foundation (`src/lib/m00-foundation.ts`)

- **What it is:** a 76-line, hand-written sample snapshot, labelled in its header as "Reference-style … sample rows". It contains:
  - Types: `M00Gate`, `M00Risk`, `M00OpenItem`, `M00Screen {id, recordId, name, workspace, purpose, status}`.
  - `M00_SNAPSHOT`: counts (screens: 52), 9 gates, risks, open items, and a short `screens` list with statuses like `IMPLEMENTED`.
- **Where it's used:** only `src/routes/app.jet.platform.tsx`, for display.
- **Relevance:** low.
  - It has no governance, locking, audit or ID-generation mechanism.
  - Its count of 52 screens does not match the 34 in the M00 Screen_Register.
  - The `M00Screen` shape (`id` plus `recordId` plus `status`) is a useful naming precedent only.
- **Reusable:** not as a foundation. Keep it as display data for the Platform page.

## 3. Governance Report (`scripts/governance-report.mjs`)

- **Detects:**
  - E5: raw colour values in code.
  - E6: how often each standard component is used.
  - E7: duplicate code export names, and names that collide with standard components.
- **Reads:** only the source files under `src/routes` and `src/components`, using the TypeScript parser. It does not read screen registers.
- **Where it runs:** only by hand, through `package.json` → `"governance:report"`. It is not part of build, dev, CI or deployment, and the file header says so.
- **Enforcement:** none; it only reports. It writes `.lovable/governance-report.json` and `.md` and never exits with an error.
- **Extensible:** yes. It is deterministic and already has a findings structure and an exception list. A screen-ID/route duplicate check across registers could be added as a new analyzer, but it would stay report-only unless it is deliberately wired in as a blocking check.

## Validation summary

| Item | Current State | Relevant to Screen Governance? | Reusable? | Gaps |
|---|---|---|---|---|
| Delta / Impact Registers | Populated. Screen_Register usable for M04–M06; insufficient for M00 (no routes). Impact and delta registers carry no screen IDs. | Yes (Screen_Register, delta pattern) | Yes: screen records as seed data; delta shape as the impact-record template | No screen-level impact; no "new vs modified"; M00 uses a different ID format; M06 route discrepancy |
| M00 Foundation | Static sample data for one page | Minimal | Naming precedent only | No mechanisms; counts don't match the M00 register |
| Governance Report | Manual, report-only code analyzer | Indirect | Yes, as a place to add screen duplicate checks | Doesn't read registers; not enforced |

## Pre-Design Conclusions

1. **Overlooked screen governance capability:** no. The only extra finding is that each module's Screen_Register already carries per-screen status and ownership fields (m06 `status`/`owning_module`, m00 `ownership`). These are documents, not an enforced capability.
2. **Screen traceability data to preserve:**
   - The four Screen_Register tables: 135 screen records carrying packet `document_control`.
   - The governed index files that hold the same IDs.
   - The `requirement_ids` links in the M00 register.
   - The delta registers' `originating_packet` history.
3. **Foundation for the new Screen Registry:**
   - Build on the packet Screen_Register structure (screen_id, route, owning_module, status) plus the delta-register pattern for impact records.
   - For history, reuse the database's existing audit and event log (`m00.audit_event`, outbox, `m00_emit`) rather than creating a new log.
   - Do not build on `m00-foundation.ts`.
4. **IDs that must be migrated, not recreated:**
   - Every packet screen ID: SCR-M04/M05/M06-###, the M00 `SCR_*` IDs, M08 SCR-M08-###.
   - The app's `SCREENS` keys (`UX-###`, `SCR_*`).
   - These are referenced by pages, change logs, Figma import keys and the B9 prototype links, so their exact values must be kept.
5. **Consolidation risks:**
   - Four ID formats (UX-###, SCR_*, SCR-M0x-###, Figma keys).
   - Some IDs are shared by several routes (`SCR_AGENCY_SETUP`, `UX-009`).
   - The M00 register has no routes, and the M06 copies disagree.
   - The two M00 screen counts differ (52 vs 34).
   - Figma frames, signatures and 682 prototype links are keyed off current IDs and routes. Renaming would break the protected Figma pages B0–B10 and Phase 59 import idempotency.
6. **Must NOT be replaced:**
   - `src/lib/screens.ts` (used by app pages and the Figma extractors).
   - `src/lib/governed/*` and `public/registers/*.json` (the module pages and `useRegisters()`).
   - `src/lib/m08/registry.ts`.
   - The Figma plugin's generated screen lists and signatures.
   - `m00.audit_event`, `m00_emit` and the outboxes, which the M00/M05 database logic depends on.
   - A new registry should reference these, not replace them.

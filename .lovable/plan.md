# Phase 52 — Figma Native Object Proof & Library Foundation (PLAN ONLY)

Status: **BLOCKED — no verified Figma write path in this workspace.** The proof sequence and library-foundation sequence below are fully specified but cannot start until the blockers in section G are cleared.

## A. Write-path status and evidence

| Workflow | Classification | Evidence from this workspace |
| --- | --- | --- |
| Cloud Figma connector | NOT AVAILABLE | No Figma entry exists in the connector catalogue; Figma is not a cloud connector on this platform. |
| Desktop-local Figma MCP (Lovable Desktop + Figma Desktop Dev Mode) | VERIFIED READ-ONLY | No active desktop session; the documented path reads Figma files and cannot write back. |
| Figma plugin executing in Figma (Plugin API) | UNVERIFIED — REQUIRES USER SETUP | No plugin exists, none installed, no plugin ID. The Plugin API is the only mechanism that can create variables, components, component sets and variant properties natively. |
| Figma REST API with a personal access token | UNVERIFIED — REQUIRES USER SETUP | No token present. REST covers variables on Enterprise plans only; it cannot create components or component sets. |
| Figma Make / screenshot import | UNSUITABLE | Produces non-deterministic or flattened output; excluded by the blueprint. |

Conclusion: prerequisites 1–4 of the request (write method, native-object capability, scratch file edit access, library publishing permission) are all **unverifiable from here**. No Figma object will be claimed as created.

## B. Required setup/proof prerequisites

Mandatory before any Phase 52 execution:

1. Choose the write mechanism — Figma plugin (recommended: only path that creates components and variants) or REST token (variables only, Enterprise).
2. Provide a dedicated scratch Figma file, with your edit access confirmed, that contains nothing else.
3. Confirm whether the target team allows library publishing (if not, Phase 52 stops at an unpublished local library).
4. If plugin: confirm you can run a development plugin in Figma Desktop and paste extraction data into it.

Conditional: Lovable Desktop + Figma Desktop Dev Mode MCP, only for read-back verification of created objects.

## C. Exact native-object proof sequence (gate — must pass before anything else)

Target: the scratch file only. Four objects, created in this order:

1. **Variable** — collection `ABox/Color/Semantic`, variable `background/base`, type COLOR, single mode `Light`, value converted from the production `--background` role.
2. **Text Style** — `ABox/Body/Base`, family/size/weight/line-height/letter-spacing copied from the production body role.
3. **Component** — `ABox/StatusBadge`, Auto Layout frame, padding/gap/radius from the canonical source, one editable text layer, fill bound to the variable from step 1.
4. **Variant** — convert to a component set with one variant property `tone` and two values drawn from the real StatusBadge tones (no invented options).

Pass criteria: all four exist as native nodes, correctly named, editable, with the variable binding live. Fail at any step → stop, record the limitation, do not proceed to D.

## D. Phase 52 library-foundation sequence (after the proof passes)

- **B0 Library foundation** — create pages `00 Foundations`, `01 Components`, `02 Patterns`, `03 Shells`, `04 Experiences`, `05 Screens`, `06 Documentation`.
- **B1 Variables** — Color/Primitive, Color/Semantic, Status, Spacing, Radius, Border, Elevation, Layout, Control sizing. Runtime tenant branding is excluded — it stays app-owned.
- **B2 Typography styles** — one text style per production typography role.
- **B3 Foundational styles** — effect styles for shadows; anything Figma cannot express exactly (oklch notation, `color-mix()`, variable-font axes, the decorative utilities, keyframes) is recorded as a limitation, never approximated into production changes.
- **B4 Canonical component foundation** — the 14 canonical families, one component set each, anatomy from source.
- **B5 Variants and properties** — only variant axes that exist in the production API; no artificial variants, no business data as variants.
- **B6 Naming and organization** — production terminology throughout; slash-path naming per the blueprint.
- **B7 Code-to-Figma mapping** — `abox/<export-name>` description metadata on every object.
- **B8 Library structure** — publish only if permission is confirmed; otherwise leave local and report.

Each batch is its own approved step; none runs inside Phase 52 planning.

## E. Source-to-Figma mapping approach

Mapping authority is the current production source plus the approved Phase 50 blueprint: `src/styles.css` for foundations, the canonical `src/components/abox/*` exports for components, and the recorded consumer counts for scope. Values are read from source, never from screenshots, never from rendered pixels. Anything without an exact Figma equivalent is recorded as a limitation rather than reinterpreted.

## F. Validation criteria for native/editable Figma objects

Per object type, structural inspection (not visual): variables resolve in a collection with a mode; text styles apply to and re-edit text; components are `COMPONENT`/`COMPONENT_SET` nodes with Auto Layout and editable text children; variants expose real properties; instances swap. A single image or flattened node anywhere in the target file fails the whole validation. Re-running generation must update in place, not duplicate — if that cannot be guaranteed, it is documented before B0.

## G. Explicit blockers

- B0-class: no verified write-capable Figma path.
- B0-class: no target scratch file with confirmed edit access.
- B1-class: library publishing permission unknown.
- B1-class: plugin vs REST decision outstanding.

## H. No ABox files modified

Nothing in the ABox codebase, reference layer, routes, assets, tokens, branding, governance files or production UI is changed by this task. The only file written is this plan. No Figma file is created, read or mutated.

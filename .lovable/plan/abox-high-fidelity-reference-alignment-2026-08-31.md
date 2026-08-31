# ABox High-Fidelity Reference Alignment

## Goal
Rebuild the visible application experience to match **Abox-final-V2** rather than reskinning the existing wireframes. Preserve routes, data, ACL behavior, backend calls, stable IDs, and existing interactions.

## Confirmed mismatch
- `/` is still titled **“ABox Platform Shell — Wireframe Map”** and displays the annotated “Global platform shell” demo.
- The current page visibly renders `SHELL_TOPBAR`, `SHELL_LEFTNAV`, `SHELL_DRAWER`, `SHELL_MAP`, and placeholder region diagrams; `SHELL_DRAWER` appears three times.
- The current shell is an attached full-width top bar plus fixed left/right columns.
- The reference shell instead uses a detached floating navigation rail, rounded glass command bar, editorial page masthead, spacious content canvas, polished dropdowns, a real contextual drawer, and a floating PlanAI assistant.
- Shared governed screens still compose `WBox`, `WRow`, placeholder lines, dashed zones, and visible implementation annotations, so token changes alone cannot make them high fidelity.

## Implementation plan

### 1. Rebuild the internal shell from the reference composition
- Port the reference `InternalShell` structure into the existing `AppShell` contract so every current route keeps working.
- Use the floating/collapsible left rail, mobile navigation sheet, pill-shaped top command bar, workspace/entity menus, global search, notifications, tasks, theme control, user menu, contextual drawer toggle, and PlanAI assistant.
- Keep all existing workspace, entity, role, ACL filtering, drawer content, and route behavior.
- Retain stable shell IDs in component constants and test/accessibility hooks, but remove technical IDs such as `SHELL_DRAWER` from normal product UI.

### 2. Replace the wireframe homepage
- Convert `/` from a shell anatomy document into a real ABox operations home modeled on the reference app.
- Use an editorial masthead, actionable work summary, KPI instruments, priority work, recent activity, and governed-estate entry points.
- Preserve access to Lucie, build packets, M00/M04/M05/M06, M1, P1, and high-fidelity estates through polished navigation/actions rather than wireframe inventory cards.
- Update route metadata to describe the production ABox workspace rather than a wireframe map.

### 3. Replace shared placeholder primitives with product components
- Keep stable component APIs where needed, but render real empty, loading, status, data-row, chart, panel, form, and action treatments.
- Remove dashed placeholder boxes, skeleton-like fake rows in ready states, and visible authoring notes from end-user surfaces.
- Move governance evidence into compact metadata/details panels where the requirement explicitly calls for it.

### 4. Bring all internal application estates onto the reference system
- Apply the same shell, masthead, spacing, buttons, cards, tables, forms, tabs, filters, badges, drawers, and responsive behavior across `/my-work`, `/dashboard`, `/object`, `/admin`, `/m00`, `/m06`, `/gov`, `/lucie`, `/m1`, `/p1`, and `/hf`.
- Preserve specialized consumer/marketplace shells while aligning them to the reference’s branded public experience.
- Replace route-level low-fidelity framing with the nearest reference pattern: dashboards, data tables, detail pages, builders, wizards, settings, or audit views.

### 5. Interaction and responsive fidelity
- Keep collapse/expand, dropdown, drawer, tabs, search, filters, wizards, role simulation, assistant, and state selectors functional.
- Match the reference motion register: restrained fade/rise entry, crisp hover elevation, active navy navigation, and reduced-motion support.
- Ensure desktop has detached rail/canvas spacing; tablet and mobile use the reference sheet/navigation patterns without overlap.

### 6. Verification
- Check every content route for its required unique title, description, Open Graph, and Twitter metadata.
- Verify representative routes from each estate at desktop and mobile sizes with browser screenshots.
- Test navigation, workspace/entity switching, drawer, assistant, menus, forms, tables, state controls, and wizard progression.
- Run project tests, lint, typecheck, and build; resolve runtime and console errors.
- Final visual gate: no visible `SHELL_*` labels, “wireframe” copy, fake placeholder rows, or shell anatomy diagrams on production-facing pages unless explicitly part of a governance evidence view.

## Technical approach
- Treat the checked-out **Abox-final-V2** components and tokens as the canonical visual source, especially its `InternalShell`, navigation configuration, right drawer, PlanAI assistant, table/card/form components, and responsive patterns.
- Adapt those patterns to the target’s existing TanStack routes and data contracts rather than importing reference business logic.
- Use semantic design tokens and shared ABox components so the result remains theme-safe and consistent.
- Make presentation changes only; no schema, API contract, permission rule, or workflow semantics will be changed.

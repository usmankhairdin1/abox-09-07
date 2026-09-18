# Phase 33 — Production Form / Input Surface Centralization (PLAN ONLY)

## 1. Scope Boundary
In scope: production form/input/control patterns under `src/**`. Out of scope and untouched: `src/lib/design/**`, `src/components/design/**`, `/design-system`, `/design-guide`, branding/white-label runtime, marketplace asset runtime, foundation-token normalization, completed ABox families (Surface, ActionPill, EmptyState), shells and overlays except where a form-control dependency must be inventoried.

## 2. Fresh Inventory Requirement
At execution start, run a fresh read-only repository-wide inventory over production `src/**` (reference layer excluded); no historical counts reused. Match at minimum: `<input`, `<textarea`, `<select`, `<label`, checkbox, radio, switch, combobox, command/search inputs, date/time inputs, range/slider, file inputs, validation/error/help text, disabled/loading states, shadcn/Radix form primitives, custom ABox form primitives, repeated control class strings, `h-9|h-10|h-11` + `rounded-lg|md|xl` + `border-border|border-input` + `bg-background|bg-muted` combinations, `appearance-none`, `focus:`/`focus-visible:`, `disabled:`, `aria-invalid`, `aria-describedby`, `aria-required`, `data-state`, `placeholder:`, cursor states. Every candidate is opened and read in source; no classification from grep alone.

## 3. Candidate Record
Per candidate record: file, line, route/screen, element/component type, native vs custom primitive, exact class string or source styling, props/API, label relationship, accessible name, role, ARIA attributes, required/optional semantics, validation behaviour, error/help text relationship, focus target, focus-visible treatment, hover/active/disabled/loading states, keyboard behaviour, pointer/touch behaviour, value/change semantics, controlled vs uncontrolled, form-library integration, browser-native behaviour, responsive overrides, inline styles, pseudo-elements, child structure, event handlers, owning system, current canonical source if any, duplicate/alternate source, eligibility, exclusion reason.

## 4. Form-System Taxonomy
Exactly one bucket per candidate, no ranking or scoring:
A. Existing canonical ABox control.
B. Existing shared UI/shadcn primitive.
C. Repeated ordinary production control candidate.
D. Experience-specific form/control composition.
E. Native one-off control.
F. Non-ABox system (Lucie, Lucie-app, M06, M08, ai-elements).
G. Explicit exclusion.

Preliminary read-only signal, to be re-measured at execution and not carried forward as fact: native `<input>/<textarea>/<select>/<label>` occurrences are concentrated in `quote.tsx` (23), `components/abox/quote-edit-panel.tsx` (20), `marketplace.admin.brand.tsx` (18), `marketplace.admin.content.tsx` (14), plus platform/agency/auth/member forms. Two control strings dominate: `h-10 w-full rounded-lg border border-border bg-background px-3` (~30 occurrences) and `mt-1 h-11 w-full rounded-lg border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-ring` (~25), with smaller `disabled:`/`bg-muted`/`tabular-nums` variants. `src/components/ui/input.tsx` uses a different vocabulary (`h-9 rounded-md border-input bg-transparent`, `focus-visible:ring-1`) and is referenced by only a handful of files. Route-local `Field` helpers exist in `apply.tsx:319`, `app.off-exchange.tsx:113`, `app.jet.module1.tsx:97`, `quote.tsx:1369`, plus `m06/kit.tsx:98` and `lucie-app/ui.tsx:239` (excluded systems).

## 5. Canonical Source Discovery
Before proposing anything, enumerate actual existing sources: `src/components/abox/**`, `src/components/ui/**` (input, textarea, select, checkbox, radio-group, switch, slider, label, form, input-group, input-otp, command, calendar), route-local form kits, shared class helpers, and any form library in use. Record for each: its exact output, its real consumer list, and whether route-local duplication of the same family exists. No new canonical component is proposed merely because duplication exists.

## 6. Exact-Output Rule
Centralization is permitted only when rendered output is byte-identical where class strings apply and preserves DOM element/component structure, attributes, class ordering, computed styles, dimensions, browser behaviour, state behaviour, accessibility tree, focus behaviour and validation behaviour. Otherwise the consumer stays literal with a documented reason.

## 7. Native-Semantics Rule
Native controls stay native unless an existing canonical source already preserves their exact semantics. Never replace `input` with `div`, `button` with `div`, `label` with a generic wrapper, `select` with a custom control, or native checkbox/radio semantics with visual-only elements. No wrapper insertion that changes focus, event propagation, layout, selector relationships or accessibility.

## 8. State Matrix
Per control family, enumerate and then measure only states that actually exist: rest, hover, focus, focus-visible, active, checked, unchecked, selected, unselected, disabled, readonly, required, invalid, valid, loading, placeholder, filled, error/help/success messaging, responsive differences. No existing state may be omitted from the audit.

## 9. Accessibility Audit
Per candidate verify: accessible name, label association (`for`/`id` or wrapping label), role, native semantics, ARIA attributes, `aria-invalid`, `aria-describedby`, `aria-required`, tab order, focus target, focus-visible treatment, keyboard interaction, disabled semantics, validation announcement, error/help text association. No redundant ARIA added.

## 10. Form Behaviour Audit
Document controlled vs uncontrolled state, default values, `onChange`/`onBlur`/`onSubmit`, validation timing, submission, reset, browser validation, keyboard submit, Enter/Escape behaviour, event propagation, parent form dependencies, field registration, field naming and value semantics. Visual similarity alone never justifies form centralization.

## 11. Responsive Verification Plan
Every batch verified independently at 1440, 834 and 390: control dimensions, label wrapping, help/error wrapping, spacing, form grid/stack behaviour, overflow (`scrollWidth` vs `clientWidth`), touch target size, focus visibility. Mobile behaviour is never inferred from desktop.

## 12. Visual Verification Plan
Before/after per eligible consumer: exact class output, DOM snapshot, computed width/height, padding, margin, border, radius, background, shadow, typography, placeholder styling, cursor, outline, outline-offset, opacity, transition, transform, pseudo-elements, disabled appearance, invalid/error appearance.

## 13. Geometry Verification
Control bounding rectangle, label rectangle, help/error rectangle, direct-child rectangles, focus outline geometry, relationship to neighbouring fields, relationship to the form/grid container.

## 14. Canonical Architecture Decision Framework
Strict priority: (1) existing canonical source with no source change; (2) existing shared UI primitive when it already owns the exact semantics and output; (3) narrow additive helper only when at least two eligible consumers share the exact treatment and all existing consumers retain byte-identical output; (4) dedicated canonical ABox control only when repeated semantics and behaviour — not looks — justify it; (5) leave literal. No universal `FormField` or `Input` abstraction for visual consistency. Note in advance: because `ui/input.tsx` emits a different vocabulary from the dominant route strings, migrating route inputs onto it would change output and is therefore ineligible under this framework; the realistic candidate is a class-level helper owning the exact dominant control string, proven on one consumer first.

## 15. API Preservation
Default position: no API changes. If an existing component is proposed as canonical, preserve its API, prop names, defaults, event signatures and controlled/uncontrolled behaviour; introduce no polymorphism. Any new API requires at least two independently verified eligible consumers.

## 16. Component Family Separation
Text input, textarea, select, checkbox, radio, switch, slider, combobox, date/time, file and search controls, and specialized business controls remain separate families. Similar looks never merge different semantics.

## 17. Existing UI Primitive Boundary
Where a shadcn/Radix primitive is already canonical for a family, no competing ABox source is created. For each such family record: actual consumers, whether output is already centralized, remaining route-local duplication, and whether exact migration is possible without modifying the primitive.

## 18. Route-Local Form Kits
Route-local kits (`apply.tsx`, `app.off-exchange.tsx`, `app.jet.module1.tsx`, `quote.tsx`, and any others found) are inventoried separately. A kit may remain route-local when semantics are experience-specific, validation/state behaviour differs, layout is coupled to business logic, or exact parity cannot be demonstrated. They are not forced into a universal abstraction.

## 19. Validation / Error Systems
Validation styling and messaging are part of the interaction contract. Audit invalid class/state, error message rendering, `aria-describedby`, `aria-invalid`, focus behaviour on error, submit behaviour, error clearing, server-side error display. Centralizing only the visual border while leaving error semantics inconsistent is prohibited.

## 20. Interactive Descendants
Audit controls containing or adjacent to buttons, links, menus, popovers, tooltips, handler-bearing icons, clear buttons and password toggles. No wrapper or structural change that alters interaction or accessibility.

## 21. Known Areas to Re-audit
Fresh inventory must cover: route-local form systems from earlier audits, existing ABox controls, `src/components/ui` controls, marketplace/admin forms, organization/admin forms, plan/quote/member forms, search/filter controls, settings forms, authentication forms, checkout/cart forms, and any family newly surfaced. Investigation targets only; no migration presumed.

## 22. Explicit Exclusions
KpiCard, PlanCard, EmptyState internals, DataTable internals, StatusBadge, ActionPill, PageHeader, Surface internals, InternalShell, MarketplaceShell, MemberShell, ModuleTabs, Lucie, Lucie-app, M06, M08, ai-elements, dialogs/drawers/sheets/popovers/menus/overlays, bespoke business controls inseparable from business logic, unsupported native replacements, controls with non-reproducible state behaviour, controls with non-identical DOM/accessibility, and auth-gated controls where parity cannot be captured (the `/app/**` internal routes render blank without a session, per Phases 31–32).

## 23. Migration Eligibility
Eligible only when all hold: repeated ordinary production pattern; canonical source already exists or a narrow source is justified; exact DOM preserved; exact semantics preserved; exact accessibility preserved; exact state matrix preserved; exact class output where required; responsive parity proven; form/value/event behaviour preserved; no excluded system; no unsafe business-logic coupling. Otherwise literal, with a documented reason.

## 24. Batch Strategy
Batch count derives from the fresh inventory. Batch 1 is exactly one proof consumer from the safest repeated ordinary control family — expected to be a publicly reachable text input on the dominant control string. Each later batch names its consumers, source, eligibility rationale, expected files, interaction/form semantics, state matrix, responsive verification, rollback, source-integrity check and validation gate. Batches are never collapsed. Zero migrations is a valid outcome.

## 25. Consumer-by-Consumer Migration Map
Produced at execution as a file:line table with classification, canonical source, eligibility, proposed migration or "remain literal", exact reason and evidence status. No migration entry is pre-committed.

## 26. Rollback
Each migration is independently reversible by restoring the original component/element, class/styling, imports and event/value behaviour. If a canonical source is changed, rollback must prove every pre-existing consumer retains exact output.

## 27. Branding Boundary
Branding & White-Label remains runtime-owned: no branding state, store, route, asset or white-label behaviour touched.

## 28. Marketplace Boundary
Marketplace Asset Management remains runtime-owned: no asset ownership, upload flow, record or runtime behaviour touched. Marketplace admin form controls may be inventoried, but migration is allowed only where it changes no runtime ownership or behaviour and parity is measured.

## 29. Reference-System Boundary
`src/lib/design/**`, `src/components/design/**`, `/design-system`, `/design-guide` untouched; no production ownership moved into the reference layer.

## 30. Foundation Boundary
No normalization of spacing, typography, control sizing, icon sizing, radius vocabulary, border vocabulary, shadow vocabulary, motion, density or token naming. Inconsistencies found (for example `h-10` vs `h-11` control heights, `focus:ring-2` vs `focus-visible:ring-1`, `border-border` vs `border-input`) are recorded as separate future opportunities only.

## 31. Governance
Existing canonical form/control sources remain the single source of truth for their families; no competing source is created. Future controls are classified through this taxonomy before central adoption. Decisions, exceptions and evidence status are recorded in `.lovable/manual-work-map.md`.

## 32. Validation Commands
Per batch: `npx tsgo --noEmit`; production build; ESLint on touched files only; console verification on affected routes; `git status` before/after; changed-file review; `md5sum` of any canonical source touched. Pre-existing findings (the prettier backlog) recorded separately from new findings; any new error blocks that batch.

## 33. Evidence Rules
Evidence is never manufactured. Unmeasurable routes or controls are reported `NOT CAPTURED`, parity is never inferred, and the consumer stays literal. Auth-gated controls remain untouched unless actual parity can be captured.

## 34. Risk Register
- Native/browser behaviour drift from element or attribute changes — mitigation: class-level helpers on unchanged native elements only.
- Focus-ring drift between `focus:ring-2 focus:ring-ring` and `focus-visible:ring-1` vocabularies — mitigation: never mix; a helper owns exactly one string.
- Validation/error semantics diverging from visual state — mitigation: error semantics audited before any visual centralization.
- Controlled/uncontrolled state drift and keyboard submit changes — mitigation: no component substitution.
- Label association and ARIA drift — mitigation: label/`id` relationships captured before and after.
- Disabled/readonly differences (`disabled:bg-muted` variants) — mitigation: treated as distinct strings, not folded together.
- Responsive field wrapping regressions — mitigation: 1440/834/390 per batch.
- shadcn vs route-local primitive collision — mitigation: no cross-vocabulary migration.
- Route-local business-logic coupling and API expansion pressure — mitigation: two-consumer rule and literal default.

## 35. Deferred Opportunities
Documented, not implemented: broader control-size normalization, foundation typography/spacing normalization, token cleanup, icon-size normalization, hover/focus vocabulary consolidation, broader form-layout architecture, Figma mapping, plus carried-over items (Phase 27 EmptyState consumers, ICHRA parity, `/app/agency` Group C cards, Phase 30 batches 2–7 measured-parity backfill).

## 36. Expected Changed Files
Unknown until the fresh inventory; expected limited to eligible production consumer files, an existing canonical production source only if strictly justified, and `.lovable/manual-work-map.md` for decisions and exceptions.

## 37. Success Criteria
Fresh inventory complete; every candidate classified; existing canonical ownership identified; no unnecessary competing source created; every migration backed by measured parity; native semantics and form behaviour unchanged; responsive and accessibility parity proven; no branding/marketplace/reference/foundation boundary crossed; zero migrations remains a valid success; final report distinguishes migrated, literal, excluded, NOT CAPTURED, source changes, consumer changes, regressions and unresolved decisions.

## 38. Final Report Requirements
The implementation report must distinguish: fresh inventory; taxonomy; canonical sources; migrated consumers; intentionally literal consumers; excluded systems; measured parity; state-level verification; form-behaviour verification; accessibility verification; responsive verification; evidence NOT CAPTURED; actual source changes; actual consumer changes; regressions; pre-existing findings; unresolved decisions; governance/exception updates.

## 39. Authorization Boundary
PLAN ONLY. No production file created, modified, deleted, renamed, migrated, refactored or formatted during planning. Implementation begins only after separate approval of this plan.

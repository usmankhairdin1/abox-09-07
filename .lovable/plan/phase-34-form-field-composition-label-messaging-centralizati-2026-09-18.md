# Phase 34 — Form-Field Composition / Label-Messaging Centralization (PLAN ONLY)

## 1. Objective
Audit repeated production form-field compositions (label + control + optional required indicator + help/error/validation messaging) and centralize only where exact measured parity can be proven across DOM, class output, spacing, typography, control styling, label association, ARIA relationships, validation behaviour, focus, keyboard, submission/reset behaviour, responsive layout and business logic. Zero migrations is a valid successful outcome.

## 2. Scope Boundary
In scope: production `src/**` field compositions — label/control/help/error/required combinations, repeated local `Field` helpers, repeated label+input wrappers, repeated validation-message compositions, repeated `aria-describedby`/error patterns, existing shared field primitives, ABox field compositions. Out of scope and untouched: `src/lib/design/**`, `src/components/design/**`, `/design-system`, `/design-guide`, branding/white-label runtime, marketplace asset runtime, foundation-token normalization, control-height normalization, focus-ring vocabulary normalization, typography/spacing normalization, icon sizing, radius/border/shadow normalization, completed ABox families, shells and overlays, Lucie, Lucie-app, M06, M08, ai-elements.

## 3. Existing Control Source Boundary
`src/components/abox/control.tsx` (Phase 33, md5 `1c6efd5cf752b69d16458b6af82b5d4f`) is locked: no change to `controlClass()`, its height options, `focusRing`, emission order or class vocabulary. This phase composes around controls only. `src/components/abox/surface.tsx` (`51b51b31bee3283794f6a05af03f2878`) likewise unchanged.

## 4. Fresh Inventory
At execution start, run a fresh read-only repository-wide inventory under production `src/**`, searching: `<label`, `<input`, `<textarea`, `<select`, `Field` helpers, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage`, `FormDescription`, `aria-describedby`, `aria-invalid`, `aria-required`, `htmlFor`, `required`, optional/error/help/description/validation/invalid/helper text, required indicators, field wrappers, `mt-1`, repeated label/control spacing, repeated error/help spacing, repeated field-grid compositions, and any form library and its field components. Every candidate is opened and read in source; no classification from grep alone.

Preliminary read-only signal, to be re-measured at execution and not carried forward as fact: two label shapes dominate — `<label className="mb-1 block text-eyebrow">` (~52 occurrences, label element above a separate control) and `<label className="block text-sm">` wrapping `<span className="text-eyebrow">` plus the control (~35), the latter concentrated in `auth.tsx` (5), `agency.downlines.new.*` (5/5/4/3/2/1), `schedule.tsx` (4), `member.settings.tsx` (3). `src/components/ui/form.tsx` exists but has no production consumers — only reference-layer files reference it. `quote.tsx` is the only route carrying `aria-describedby`/`aria-invalid` wiring (7 hits), through its own `Field` helper with hint/error slots.

## 5. Candidate Record
Per candidate record: file, line, route/screen, field purpose, native element/component, wrapper element/component, exact DOM structure, exact class strings, label text/source, `htmlFor`/`id` relationship, accessible name, role, ARIA attributes, `aria-describedby` relationship, `aria-invalid`, `aria-required`, required/optional rendering, help/description rendering, error rendering, success rendering, validation source, validation timing, focus target, focus-visible treatment, control source, `controlClass` usage, child structure, event handlers, controlled/uncontrolled state, form-library integration, responsive behaviour, inline styles, pseudo-elements, business-logic coupling, owning system, current canonical source, duplicate/alternate source, eligibility, exclusion reason.

## 6. Composition Taxonomy
Exactly one bucket per candidate, no ranking or scoring:
A. Existing canonical shared field composition.
B. Existing canonical UI/shadcn form composition.
C. Repeated ordinary production field composition candidate.
D. Route-local / experience-specific composition.
E. Native one-off composition.
F. Non-ABox system.
G. Explicit exclusion.

## 7. Canonical Source Discovery
Enumerate existing sources before proposing anything: `src/components/abox/**`, `src/components/ui/**` (notably `form.tsx` with `FormField`/`FormItem`/`FormLabel`/`FormControl`/`FormMessage`/`FormDescription`, plus `label.tsx`), route-local `Field` helpers, shared label helpers, validation-message helpers, any form-library adapter. Per source record: exact DOM, exact classes, API, semantics, real consumer list, validation model, whether it is actually canonical, and whether duplicate route-local compositions exist. No new source is created merely because compositions look similar. A source with zero production consumers is recorded as unused, not treated as canonical.

## 8. Exact Composition Rule
Centralization is permitted only where the complete composition is reproducible without changing wrapper count, wrapper element types, DOM ancestry, label/control relationship, control id/name/value, ARIA relationships, validation semantics, event propagation, focus target, spacing, responsive behaviour, class ordering or child ordering. Visual similarity is never sufficient.

## 9. Label Association Rule
Per candidate document `htmlFor`/`id`, wrapping-label semantics where used, generated IDs, duplicate-ID risk and accessible-name derivation. A centralized composition may not alter label association, and may not convert a wrapping label into an `htmlFor` pairing or vice versa.

## 10. Error / Help Semantics
Help/error/validation content is part of the component contract. Document error source, display timing, error text, help text, success text, `aria-describedby` target, `aria-invalid`, focus-on-error, submit-on-error, clearing behaviour and server-side error behaviour. Centralizing only the visual spacing around an error message is prohibited.

## 11. Required / Optional Semantics
Document the native `required` attribute, `aria-required`, visible required marker, optional marker, required text and any screen-reader-only text. Required semantics are never added or removed.

## 12. State Matrix
Per composition family enumerate and measure only states that actually exist: normal, focused, filled, placeholder, invalid, valid, disabled, readonly, required, optional, help, error, success, loading, submitted, server-error, responsive layout states. No existing state may be omitted from the audit.

## 13. Accessibility Verification
Before/after per migration: accessible name, label association, role, ARIA, `aria-describedby`, `aria-invalid`, `aria-required`, tab order, focus target, keyboard behaviour, validation announcements, error/help association, accessibility tree. No redundant ARIA introduced.

## 14. Form Behaviour Verification
Verify controlled/uncontrolled state, default value, `onChange`, `onBlur`, `onSubmit`, validation timing, reset, browser validation, keyboard submit, Enter/Escape, event propagation, form registration, field name, field value, server validation and error clearing. No behaviour moves from the consumer into a new abstraction without demonstrated parity.

## 15. Responsive Verification
Each batch independently verified at 1440, 834 and 390: label/control spacing, error/help wrapping, field width, grid/stack behaviour, neighbouring-field geometry, overflow, touch target, focus visibility. Mobile is never inferred from desktop.

## 16. Visual Verification
Before/after: exact DOM, exact class strings, computed margins, padding, typography, line height, label geometry, control geometry, help/error geometry, border/background/radius where the composition affects them, visibility, opacity, transitions, focus outline, pseudo-elements.

## 17. Geometry Verification
Label, control, help/error, wrapper and direct-child bounding rectangles; distances between label, control and error; neighbouring-field positions; form-grid positions.

## 18. Existing UI Primitive Boundary
If `src/components/ui/form.tsx` or an equivalent already owns a field composition, no competing ABox FormField is created. Inventory its actual consumers, determine whether it is canonical in practice, determine whether route-local compositions could migrate without changing output (its `FormItem`/`FormLabel`/`FormMessage` DOM and classes differ from the route compositions, so any such migration is expected to be ineligible), and leave incompatible compositions literal.

## 19. Route-Local Field Helpers
Re-audit each known helper on its own terms — shared name does not imply duplicate: `apply.tsx` `Field`, `app.off-exchange.tsx` `TextField`, `app.jet.module1.tsx` `Field`, `quote.tsx` `Field` (label + `mt-1.5` control slot + `role="alert"` error or hint with generated `-error`/`-hint` ids), plus any further helper found. Record each helper's DOM, classes, API, validation model and consumer count within its own route.

## 20. Control Source Integration
Where a field already uses `controlClass()`, a UI `Input`, a native control or another canonical control, the control itself remains unchanged. This phase centralizes only the surrounding composition, and only with proven parity.

## 21. Nested Interactive Content
Audit password toggles, clear buttons, select triggers, combobox triggers, date pickers, popovers, menus, links and icon buttons inside or adjacent to a field. No wrapper may alter event propagation, focus order or accessibility.

## 22. Business Logic Boundary
Compositions inseparable from quote calculation, eligibility logic, marketplace business rules, organization workflows, plan selection, scheduling logic, authentication flows, or bespoke validation/state machines are not centralized, even when visually similar.

## 23. Known Areas to Re-audit
Fresh inventory must cover authentication, scheduling, quote, apply, member settings, organization/admin, agency, platform, marketplace admin, search/filter forms, checkout/cart, plan/member forms, all route-local `Field` helpers, existing ABox controls and `src/components/ui` form systems. No migration presumed.

## 24. Explicit Exclusions
KpiCard, PlanCard, EmptyState, DataTable, StatusBadge, ActionPill, PageHeader, Surface, `control.tsx` internals, InternalShell, MarketplaceShell, MemberShell, ModuleTabs, Lucie, Lucie-app, M06, M08, ai-elements, dialogs/drawers/sheets/popovers/menus/overlays, bespoke state-machine forms, auth-gated compositions where parity cannot be captured (per Phase 33, `member.*`, `app.*`, `agency.*`, `platform.*` and `marketplace.admin.*` redirect to `/auth` or render blank without a session), compositions with non-identical DOM, non-identical ARIA/label semantics, or non-identical validation behaviour.

## 25. Architecture Decision Framework
Strict priority: (1) existing canonical field source with no source change; (2) existing shared UI/shadcn composition; (3) existing class/helper source already owning the exact composition; (4) narrow additive helper only when at least two eligible consumers share the exact composition and no existing source owns it; (5) dedicated ABox field composition only when repeated structure, semantics and behaviour justify it; (6) leave literal. No universal FormField abstraction for visual consistency alone.

## 26. API Preservation
Default: no API changes, no control API changes, no validation API changes, no generated-ID changes, no field-name changes, no event-signature changes. Any new API requires at least two independently verified eligible consumers.

## 27. Class Preservation
Rendered classes must remain byte-identical wherever class strings are centralized; consumer-specific classes keep original order; no reordering for tidiness. If exact class output cannot be reproduced, the consumer remains literal.

## 28. DOM Preservation
No wrapper added unless the exact existing wrapper structure is already represented by the canonical source. Never change `div` to `label` or `label` to `div`, move the input outside the label, move error or help text, alter DOM ancestry, or alter sibling order.

## 29. Batch Strategy
Batch count derives from the fresh inventory. Batch 1 is exactly one safest repeated ordinary composition on a publicly measurable route. Each later batch names consumers, canonical source, eligibility rationale, exact DOM, semantics, state matrix, responsive verification, rollback, validation gate and source-integrity check. Batches are never collapsed. Zero migrations is valid.

## 30. Consumer-by-Consumer Migration Map
Produced at execution as a file:line table with taxonomy bucket, existing canonical source, eligibility, proposed migration or "remain literal", exact reason and evidence status. No migration is pre-approved.

## 31. Rollback
Each migration independently reversible by restoring original DOM, classes, imports, validation wiring and event/value behaviour. If a canonical source changes, every existing consumer must be re-verified byte-identical.

## 32. Branding Boundary
Branding & White-Label remains runtime-owned: no branding state, store, route, asset or behaviour touched.

## 33. Marketplace Boundary
Marketplace Asset Management remains runtime-owned. Marketplace forms may be inventoried; migration only where runtime ownership and behaviour are untouched and parity is measured.

## 34. Reference Boundary
`src/lib/design/**`, `src/components/design/**`, `/design-system`, `/design-guide` untouched.

## 35. Foundation Boundary
No normalization of control heights, focus-ring vocabulary, spacing, typography, icon sizing, radius, borders, shadows, density, motion or token naming. Discovered inconsistencies (for example the two competing label shapes, `mb-1 block text-eyebrow` label elements versus `block text-sm` wrapping labels, and `mt-1` versus `mt-1.5` control gaps) are recorded as deferred opportunities.

## 36. Governance
A proven canonical composition becomes the single production source for that exact repeated composition. Interaction, validation and control semantics stay consumer-owned unless already owned by the existing canonical source. Decisions, exceptions and evidence status recorded in `.lovable/manual-work-map.md`.

## 37. Validation Commands
Per batch: `npx tsgo --noEmit`; production build; ESLint on touched files only; affected-route console verification; `git status` before/after; changed-file review; `md5sum` of any canonical source touched (and of `control.tsx` to prove it is unchanged). Pre-existing prettier findings separated from new findings; any new error blocks that batch.

## 38. Evidence Rules
Evidence is never manufactured. Unmeasurable routes or states are reported `NOT CAPTURED`, parity is never inferred, and the consumer stays literal. Auth-gated forms remain untouched unless actual parity is captured.

## 39. Risk Register
- Label association drift (wrapping label vs `htmlFor`) — mitigation: association captured before/after; no conversion permitted.
- Generated ID collisions from a shared composition — mitigation: no generated IDs introduced; existing ids preserved verbatim.
- `aria-describedby` drift when hint/error slots move — mitigation: describedby target measured in each state.
- Validation timing and focus-on-error drift — mitigation: no validation wiring moved into a new abstraction.
- Controlled/uncontrolled drift — mitigation: no control substitution.
- Wrapper/layout and responsive wrapping drift — mitigation: geometry at 1440/834/390.
- Browser validation changes from attribute relocation — mitigation: attributes stay on the same element.
- Form-library integration — mitigation: `ui/form.tsx` consumers, if any, are not touched.
- Nested interactive content — mitigation: no wrapper insertion around triggers or toggles.
- Route-local business logic and API expansion pressure — mitigation: two-consumer rule and literal default.

## 40. Deferred Opportunities
Documented only, not implemented: control-height normalization, focus-ring vocabulary consolidation, spacing and typography normalization, form-layout normalization, token cleanup, icon sizing, Figma mapping, Phase 30 measured-parity backfill, Phase 31/32 outstanding evidence (ICHRA panels, `/app/agency` cards), remaining EmptyState evidence, and the auth-gated Phase 33 control consumers.

## 41. Expected Changed Files
Unknown until the fresh inventory. Expected: eligible consumer files, an existing or narrowly justified canonical field source only if proven, and `.lovable/manual-work-map.md`. `src/components/abox/control.tsx` must remain unchanged.

## 42. Success Criteria
Fresh inventory complete; every candidate classified; existing canonical sources identified; no unnecessary competing source created; every migration backed by measured parity; label, accessibility and validation semantics unchanged; responsive parity proven; control source unchanged; branding/marketplace/reference/foundation boundaries preserved; zero migrations remains valid; final report distinguishes migrated, literal, excluded, NOT CAPTURED, source changes, consumer changes, regressions and unresolved decisions.

## 43. Final Report Requirements
The implementation report must distinguish: fresh inventory; taxonomy; canonical sources; migrated consumers; intentionally literal consumers; excluded systems; measured DOM/class/style/geometry parity; state verification; form-behaviour verification; accessibility verification; responsive verification; NOT CAPTURED evidence; actual source changes; actual consumer changes; regressions; pre-existing findings; governance/exception updates; unresolved decisions.

## 44. Authorization Boundary
PLAN ONLY. No production file created, modified, deleted, renamed, migrated, refactored or formatted during planning. Implementation begins only after separate review and approval of this Phase 34 plan.

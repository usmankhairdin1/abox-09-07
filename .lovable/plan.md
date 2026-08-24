# Module 1 Low-Fidelity Wireframes (UX-001 – UX-026)

Build the clickable low-fidelity wireframe set for Module 1 only, using the Module 1 V4 Hardening Package screen inventory as the authoritative list, the Reconciliation Package as the scope fence, and the IA Handoff Package for shell, page pattern, drawer and assistant alignment.

## Scope control

The V4 package's annotated wireframe deck defines exactly 26 screens (UX-001 … UX-026). Every one of your 24 requested wireframes maps into that set — nothing new is invented, and no broader Phase 1 capability (off-exchange enrollment, form configurator, ICHRA, commissions, B2B2C sharing, full white labeling) enters these screens.

| # Requested | Screen ID | Screen name | Scope tag |
|---|---|---|---|
| 1 | UX-001 | Marketplace Landing (branded) | Protected M1 |
| 2 | UX-002 | Product Selection & Path Choice (Plan-O entry + Browse entry) | Protected M1 |
| 4,5 | UX-003 | Quote Wizard: ZIP / county / effective date | Protected M1 |
| 6 | UX-004 | Quote Wizard: Household Members | Protected M1 |
| 3,11 | UX-005 | Plan-O Goals & Usage | Protected M1 |
| — | UX-006 | Provider & Drug Optional Lookup | Protected M1 |
| 7 | UX-007 / UX-008 | Optional Subsidy Check / Estimate & Education | Protected M1 |
| 8,10,11 | UX-009 | Plan Results (Recommended vs Browse tabs, filters) | Protected M1 |
| 9 | UX-010 | Plan Detail Panel/Page | Protected M1 |
| 12 | UX-011 | Plan Comparison | Protected M1 |
| — | UX-012 | More Coverage / Ancillary Cards (display only) | Protected M1 |
| 13 | UX-013 | Cart Drawer | Protected M1 |
| 15 | UX-014 | Review & Enroll Gate | Protected M1 |
| 14 | UX-015 | Registration / Login Gate | Protected M1 |
| 19 | UX-016 | Consumer Dashboard / Resume | Protected M1 |
| 20 | UX-017 / UX-018 | Agent Quick Quote Start / Workspace | Protected M1 |
| 21 | UX-019 | Agent Send Quote | Protected M1 |
| 17 | UX-020 | Shared Quote Read-Only View | Protected M1 |
| 23 | UX-021 | Lead Timeline & Milestones | Protected M1 |
| 18,22 | UX-022 | Schedule Time / Request Call ("I'm interested") | Protected M1 |
| 16 | UX-023 | JET / EDE Handoff Confirmation & Explanation | Protected M1 |
| 24 | UX-024 / UX-025 | M1 Config: Branding & Products / Routing & Notifications | Protected M1 |
| — | UX-026 | AI Review & Confirmation | Protected M1 |

Non-disruptive IA alignment applied to every screen (no behavior change): unified internal shell for agent/admin screens, left module nav, top global bar, right context drawer, bottom-right assistant, external branded chrome for consumer screens, configurable labels, ACL gating.

## What gets built

Two shells, one wireframe grammar:

1. **Consumer marketplace chrome** (`/m1/*`) — externally branded, simplified: logo/agency brand block, minimal nav, trust/compliance footer, no left module nav. Used by UX-001–016, 020, 022, 023.
2. **Internal unified shell** (existing `AppShell`) — used by UX-017–019, 021, 024, 025, 026, with left nav on the Marketplace & Sales module and Agent/Agency workspace context.

Every screen renders as grey-box primitives (existing `WBox`, `WLine`, `WPanel`, `IdChip`, `Annotation`, `AclNote`) plus a standard annotation rail carrying the fields you asked for: Screen ID, name, primary user, purpose, key components, primary actions, right-drawer content, assistant/help behavior, compliance & audit notes, source file, scope tag.

Navigation: a Module 1 index page lists all 26 screens grouped by flow (Consumer shopping, Registration & enroll, Handoff, Agent, Config, AI), and screens link forward along the real V4 click paths so the set is walkable end to end.

## Compliance and audit treatment

Each screen carries its own compliance callouts drawn from the V4 Compliance & AI Guardrails pack, including: no plan recommendation without disclosure of ranking basis, subsidy figures labeled estimate-only, ancillary cards non-enrolling in M1, EDE handoff disclosure and consent before leaving to the exchange, agent-of-record and licensing/appointment gate on agent send-quote, shared-quote read-only with expiry and no PII edit, audit event stamps on quote create, share, cart change, and handoff, and AI outputs marked assistive with human confirmation (UX-026).

## Technical notes

- New route files under `src/routes/m1.*.tsx`, one per screen ID, all reusing shared components — no per-screen bespoke CSS.
- New `src/components/wireframe/ScreenFrame.tsx` (annotation rail + drawer + assistant slots) and `src/components/shell/ConsumerShell.tsx` (branded external chrome).
- New `src/lib/m1.ts` holding the UX-001…026 metadata records (id, name, user, purpose, components, actions, drawer, assistant, compliance, source, scope) so the annotation rail and index page are data-driven.
- Existing shell, admin, dashboard, object and my-work routes untouched.
- Each route gets its own `head()` with a unique title and description; grey-box tokens only, no hardcoded colors.

## Out of scope for this batch

Off-exchange enrollment, form configurator, ICHRA quoting, commissions, B2B2C paper sharing, full white labeling, payments front end, and every other broader Phase 1 screen stay out — they belong to later packets per the Reconciliation Package.

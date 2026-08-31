# Lucie Prototype — Slice A–H Walkthrough App

A new, self-contained enterprise prototype at `/lucie-app`. It interprets the Lucie
requirements as a working product experience: real navigation, realistic fictional
data, working actions, and visible results. No requirement text, story IDs,
acceptance criteria or rule numbers appear anywhere in the UI.

The existing `/lucie` register spine and the governed estates stay untouched.

## What a stakeholder can do

Sign in as a persona, land on a workspace home, and walk complete journeys end to end:

```text
Consumer      Landing → Eligibility → Subsidy → Plan results → Compare →
              Plan detail → Cart → Register/consent → Application →
              Documents → Review → E-sign → Submitted → Status → Confirmation

Agency        Agency home → Onboard agent → Licenses & appointments →
              Captive rules → Readiness decision → Marketplace setup
              (branding, domain, products, preview) → Publish → Live

Employer      Start → Census → Contribution model → Results → Proposal →
              Route to agency → Confirmation

Platform      Platform home → Tenants → Roles & workspaces → Entitlements →
              Integration health → Exception queue → Audit trail → Launch gates
```

Every action produces a result: a row appears, a status chip changes, a toast
confirms, a record is created and visible on the next screen.

## Screen set (slices A–H, condensed)

Grouped by workspace; ~34 screens total, all reachable by navigation.

- **Consumer marketplace** — branded landing, eligibility intake, subsidy estimator,
  plan results (filters, sort, compare tray), plan compare, plan detail, cart,
  registration + consent, dental/vision quote add-on, application form, document
  upload, review, e-sign, submission status, confirmation.
- **Agency** — agency home, agent roster, agent onboarding wizard, licenses,
  appointments, captive constraints, readiness decision, marketplace setup wizard
  (brand, domain, product catalogue, preview, publish), participation list.
- **Employer/group** — ICHRA entry, census (table + add/import), contribution
  modelling, results, proposal, routing confirmation.
- **Platform (JET)** — platform home dashboard, tenants, role templates &
  workspace config, commercial entitlements, integration/webhook health,
  exception queue, audit explorer, launch gate board.
- **Shared** — sign-in, persona switcher, empty / loading / error / no-results /
  success states used throughout, and a "not permitted" state driven by persona.

Slice C (EDE handoff) is shown inside the consumer flow as a handoff review step
with a tracked status, not as an enrollment.

## Interaction model

- **Persona switcher** in the top bar: Consumer, Agent, Agency Admin, Employer,
  JET Admin. Switching changes navigation, home screen and which actions are
  enabled; blocked actions show a clear reason instead of disappearing silently.
- **Working actions**: create agent, approve/deny readiness, add census rows,
  publish a marketplace, run a quote, add to cart, submit an application,
  resolve an exception, flip a launch gate. Each writes to session state.
- **States**: every list has designed empty, loading (skeleton) and error
  variants; every wizard has validation and a save/resume affordance.

## Data

In-memory store with realistic fictional seed data — Northgate Insurance Group,
Meridian Health plans, sample agents, census rows, exceptions, audit entries.
Resets on reload. No backend changes, no migrations.

## Design

Reuses the existing design tokens, shadcn components and typography so the
prototype looks like the rest of the product: card-based dashboards, dense data
tables with filters, stepper wizards, side drawers for detail, modals for
confirmations, status chips, and a right-side context rail on complex screens.

## Technical notes

- New route tree `src/routes/lucie-app.*` with a dedicated shell
  (`src/components/lucie-app/`), independent of `AppShell`/`ConsumerShell`.
- Session state via a React context store in `src/lib/lucie-app/store.ts`;
  seed data in `src/lib/lucie-app/data.ts`. No Supabase usage.
- Each route gets its own `head()` metadata.
- Delivered in three batches: (1) shell, persona switcher, homes, consumer
  journey; (2) agency + marketplace setup; (3) employer ICHRA + platform ops.

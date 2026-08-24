# ABox Global Platform Shell — Low-Fidelity Wireframes (Batch 1)

Structure only: grey-box layout, neutral tokens, no branding, no color system work, no imagery. Every screen is a real clickable page so you can walk the shell rather than read about it.

Built as a wireframe app on the locked IA: 8 workspaces, 13 module containers, stable `SCR_`/`MOD_`/`SHELL_` IDs, and the drawer + assistant on every internal screen.

## What gets built

**Page 1 — Internal platform shell (`/`)**
The landing page is an annotated map of the shell itself: a labelled diagram of every region with its `SHELL_*` ID, plus the live shell wrapped around it. Regions: top global bar (brand slot, workspace switcher, entity switcher, global search, notifications, tasks, AI assistant entry, profile/settings), left navigation, main canvas, right context drawer, bottom-right assistant. Each region carries a caption explaining what it does and what configures it.

The shell is real and shared by all pages:
- Workspace switcher lists all 8 workspaces; switching changes the visible module set, entity list and labels. External workspaces are marked as not using this shell.
- Entity switcher is a relationship-derived tree (tenant, marketplace, master agency, downline agencies, partner), not a flat list.
- Global search opens a command palette with ACL-scoped, cross-object results and masked sensitive fields.
- Notifications and tasks are trays with a link to their full pages.
- Left nav renders the 13 modules, permission-filtered, using configurable labels. Modules the current role cannot access are absent, not greyed. Appointments/Paper and AI are shown as nested, never top-level. Collapses to an icon rail.
- Right context drawer with tabs: Context, Summary, Guidance, Help & FAQ, Audit, Next actions. Audit tab appears only when permitted.
- Bottom-right assistant opens a panel with Chat, FAQs and Copilot suggestions, contextual to the current page and object.

**Page 2 — My Work landing (`/my-work`)**
Tasks, assigned leads, follow-ups, messages, quotes in progress, applications/handoffs needing action, exceptions, and AI suggested next actions — each as a grey-box card with counts and row placeholders. Plus a landing-preference control (choose My Work, a dashboard, or a module as your start page) persisted locally.

**Page 3 — Dashboards & Analytics shell (`/dashboard`)**
Filter bar (workspace, entity, date range, product), performance cards, a funnel block, quote activity and lead activity blocks, a commission projection snapshot that disappears when the visibility flag is off, and a marketplace activity block. Charts are grey placeholder blocks, not real charts, at this fidelity.

**Page 4 — Object page framework (`/object`)**
One reusable pattern, demonstrated on a Lead record and switchable to other object types to prove reuse: header with name and IDs, status chip, owner/context row (entity, workspace, assigned agent, attribution), primary actions, summary area, tabbed sections, timeline, related records, notes, documents, and an audit tab that is present only when permitted. Right drawer shows object summary and next actions.

**Page 5 — Admin configuration shell (`/admin`)**
Sectioned config surface: ACL controls (roles, permissions, effective-permission preview), label configuration (editing a label live changes the nav and page copy), menu visibility, workspace configuration, branding settings (logo, palette, footer, disclaimers, legal text, contact, support links, copy, template branding — as fields, unstyled), feature flags, and help/FAQ configuration that authors the drawer and assistant content.

Left nav also lists the remaining modules with a "not in this batch" stub state so the map stays honest.

## Design notes applied

Workspaces, never portals. Labels come from config, so the same screen reads "Agency/Agent" or "Firm/Advisor". Every screen carries a short ACL/entity note stating what a lesser-permissioned viewer would not see. Drawer and assistant are present on all internal pages. Clean enterprise layout with plain language, dashed grey placeholders, and mono annotation captions so nothing reads as final design.

## Technical notes

- New: `src/lib/abox.ts` (workspaces, entity graph, modules, labels, feature flags, drawer tabs), `src/components/wireframe/primitives.tsx` (placeholder box, bar, row, annotation, ACL note), `src/components/shell/AppShell.tsx` (shell + context provider for workspace/entity/labels/drawer/assistant state).
- Routes: rewrite `src/routes/index.tsx` as the shell map; add `my-work.tsx`, `dashboard.tsx`, `object.tsx`, `admin.tsx`. Each page composes `AppShell`.
- Uses existing shadcn primitives (dropdown-menu, command, popover, tabs, sheet, table, switch, badge, separator, scroll-area, sidebar) with semantic tokens only — no hardcoded colors.
- Neutral low-fidelity token pass in `src/styles.css` plus a grotesk + mono font pair loaded via `<link>` in `__root.tsx`; per-route `head()` titles and descriptions.
- Landing preference stored in localStorage, read in an effect to avoid hydration mismatch. No backend, no data layer — all placeholder content.

Not in this batch: consumer marketplace and member workspace screens, Module 1 shopping screens, enrollment, products, commissions detail, and the remaining provisional screens.

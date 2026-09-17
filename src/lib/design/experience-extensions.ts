/**
 * Phase 10 — experience extensions.
 * DOCUMENTATION ONLY. Where one core pattern behaves differently by
 * experience, the difference is classified from the code. A difference is
 * called a separate system only where the code really shows two independent
 * implementations, never because the two look different.
 */
import type { ExperienceExtensionRecord } from "./pattern-spec-types";

export const EXPERIENCE_EXTENSIONS: ExperienceExtensionRecord[] = [
  {
    corePattern: "pat.page-header",
    experienceA: "Web / Marketing",
    behaviorA: "No shared header component; sections use inline eyebrow plus h2 at display sizes.",
    experienceB: "Shopping and Dashboard",
    behaviorB: "PageHeader component with eyebrow, icon tile, h1 and hairline.",
    classification: "separate system",
    evidence: "index.tsx writes its own section headings; PageHeader is used in 25 files elsewhere",
    status: "UNOWNED AREA",
  },
  {
    corePattern: "pat.page-header",
    experienceA: "Shopping / Commerce",
    behaviorA: "Compact variant so results stay near the top.",
    experienceB: "Dashboard / Admin",
    behaviorB: "Default variant with the full display title and hairline.",
    classification: "extension",
    evidence: "page-header.tsx variant prop, used both ways",
    status: "CURRENT IMPLEMENTATION",
  },
  {
    corePattern: "pat.card-collection",
    experienceA: "Web / Marketing",
    behaviorA: "Three-column grid of short cards.",
    experienceB: "Shopping / Commerce",
    behaviorB: "Single-column list of detailed plan cards at every width.",
    classification: "extension",
    evidence: "index.tsx line 183 versus plans.index.tsx line 345",
    status: "CURRENT IMPLEMENTATION",
  },
  {
    corePattern: "pat.table-screen",
    experienceA: "Shopping / Commerce",
    behaviorA: "No tables; results are cards.",
    experienceB: "Dashboard / Admin",
    behaviorB: "Tables with px-5 py-4 cells and horizontal scroll.",
    classification: "extension",
    evidence: "DataTable appears only in administrative routes",
    status: "CURRENT IMPLEMENTATION",
  },
  {
    corePattern: "pat.navigation",
    experienceA: "Member / Account",
    behaviorA: "Centred header plus a short icon rail that becomes a scrollable row below md.",
    experienceB: "Dashboard / Admin",
    behaviorB: "Fixed collapsible left rail with search and a sticky glass top bar.",
    classification: "separate system",
    evidence: "member-shell.tsx and internal-shell.tsx share no navigation code",
    status: "OBSERVED OVERLAP",
  },
  {
    corePattern: "pat.navigation",
    experienceA: "Web / Marketing",
    behaviorA: "Product links, cart and account in a floating header.",
    experienceB: "Shopping / Commerce",
    behaviorB:
      "The same header, with the cart label switching to 'Cart · N' and a monthly total from sm.",
    classification: "extension",
    evidence: "marketplace-shell.tsx serves both; 30 files",
    status: "CURRENT IMPLEMENTATION",
  },
  {
    corePattern: "pat.action-group",
    experienceA: "Web / Marketing",
    behaviorA: "Hero pills at h-11 for prominence.",
    experienceB: "Everywhere else",
    behaviorB: "Shared pill class string at the standard height.",
    classification: "observed variation",
    evidence: "index.tsx hero pills versus ACTION_PILL in 35 files",
    status: "OBSERVED VARIATION",
  },
  {
    corePattern: "pat.form-layout",
    experienceA: "Member / Account",
    behaviorA: "Primitive fields at h-9 inside a settings panel.",
    experienceB: "Dashboard / Admin",
    behaviorB: "Governed module kits render their own label and control arrangement.",
    classification: "separate system",
    evidence: "member.settings.tsx versus the M06 and M08 route kits",
    status: "OBSERVED DUPLICATE",
  },
  {
    corePattern: "pat.status-tier",
    experienceA: "Shopping / Commerce",
    behaviorA: "Metal tier badges including Expanded Bronze, reused in filters.",
    experienceB: "Dashboard / Admin",
    behaviorB: "Status badges for record standing; no metal tiers.",
    classification: "extension",
    evidence: "metal-badge.tsx in shopping routes; status-badge.tsx in 89 files",
    status: "CURRENT IMPLEMENTATION",
  },
  {
    corePattern: "pat.assistant",
    experienceA: "Shopping / Commerce",
    behaviorA: "PlanAI, reachable from shopping screens with session-persisted progress.",
    experienceB: "Dashboard / Admin",
    behaviorB: "Lucie surfaces and the ai-elements kit, composed separately.",
    classification: "separate system",
    evidence: "planai-assistant.tsx, plan-o-assistant.tsx, ai-elements",
    status: "OBSERVED DUPLICATE",
  },
];

export const EXTENSION_RULES: string[] = [
  "GOVERNANCE RULE — an extension keeps the core pattern's anatomy and changes only composition, density or wording.",
  "GOVERNANCE RULE — two independent implementations are recorded as separate systems, even when they look alike.",
  "GOVERNANCE RULE — a separate system is not automatically a defect. It becomes a decision only when someone approves consolidation.",
  "FUTURE DECISION — none of the separate systems above has a resolution.",
];

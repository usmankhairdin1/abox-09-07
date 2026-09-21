#!/usr/bin/env node
// Phase 55 / Batch B8 — Experiences / Journey Compositions extractor.
// Reads the production source of truth plus generated B6/B7 data and emits tokens-b8.js.
// Run from the repository root: node tools/figma-plugin/extract-b8.mjs
// Never hand-edit tokens-b8.js; never edit code.js directly.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..");
const read = (p) => readFileSync(join(root, p), "utf8");
const evalToken = (file, name) => eval(readFileSync(join(here, file), "utf8") + ";" + name);

const lineOf = (file, needle) => {
  const lines = read(file).split("\n");
  const index = lines.findIndex((line) => line.includes(needle));
  if (index === -1) throw new Error("STOP: not found in " + file + " — " + needle);
  return file + ":" + (index + 1);
};
const mustContain = (file, fragments) => {
  const text = read(file);
  for (const fragment of fragments) {
    if (!text.includes(fragment)) {
      throw new Error("B8 extraction guard failed: " + file + " does not contain " + JSON.stringify(fragment));
    }
  }
};

const ABOX_B4 = evalToken("tokens-b4.js", "ABOX_B4");
const ABOX_B5 = evalToken("tokens-b5.js", "ABOX_B5");
const ABOX_B6 = evalToken("tokens-b6.js", "ABOX_B6");
const ABOX_B7 = evalToken("tokens-b7.js", "ABOX_B7");

for (const required of [
  "ABox/Shell/Internal",
  "ABox/Shell/Marketplace",
  "ABox/Shell/Member",
]) {
  if (!ABOX_B7.shells.some((shell) => shell.name === required)) throw new Error("STOP: missing B7 shell token " + required);
}
for (const required of [
  "ABox/Pattern/KpiRow",
  "ABox/Pattern/WizardStepper",
]) {
  if (!ABOX_B6.patterns.some((pattern) => pattern.name === required)) throw new Error("STOP: missing B6 pattern token " + required);
}
for (const required of [
  "ABox/Header/PageHeader",
  "ABox/Action/ActionPill",
  "ABox/Status/StatusBadge",
  "ABox/Card/KpiCard",
  "ABox/Feedback/EmptyState",
  "ABox/Form/LabeledField",
  "ABox/Form/Input",
]) {
  const inB4 = ABOX_B4.sets.some((set) => set.name === required) || ABOX_B4.components.some((component) => component.name === required);
  if (!inB4) throw new Error("STOP: missing B4/B5 component token " + required);
}

mustContain("src/components/abox/internal-shell.tsx", ["pageTitle", "eyebrow", "actions", "railCollapsed", "Cedar Grove Insurance"]);
mustContain("src/components/abox/marketplace-shell.tsx", ['variant?: "landing" | "flow"', "showAssistant?: boolean", "showProducts?: boolean", "{withProducts && <ProductSwitcher"]);
mustContain("src/components/abox/member-shell.tsx", ["MemberShell", "MEMBER_NAV", "PlanOAssistant"]);
mustContain("src/components/abox/product-switcher.tsx", ["SHOP_PRODUCTS", "active", 'variant?: "strip" | "chips"']);
mustContain("src/components/abox/downline-wizard-stepper.tsx", ["DOWNLINE_WIZARD_STEPS", "Identity", "Activation"]);

mustContain("src/routes/agency.downlines.new.contacts.tsx", ["<InternalShell", "<DownlineWizardStepper", "Primary business contact", "Continue"]);
mustContain("src/routes/agency.downlines.new.readiness.tsx", ["Readiness review", "StatusBadge", "Create downline"]);
mustContain("src/routes/agency.downlines.new.activate.tsx", ["Activation", "is active", "View organization profile"]);
mustContain("src/routes/marketplace.admin.index.tsx", ["Marketplace administration", "Submit for activation", "Participants", "Recent changes"]);
mustContain("src/routes/marketplace.admin.readiness.tsx", ["Marketplace readiness", "Recalculate", "Overall status"]);
mustContain("src/routes/marketplace.admin.activation.tsx", ["Initial activation", "Submit to JET", "pending JET review"]);
mustContain("src/routes/select.tsx", ["How would you like to shop?", "Guide me with PlanAI", "Let me browse myself"]);
mustContain("src/routes/quote.tsx", ["Quote wizard progress", "SidePanel", "Estimated monthly subsidy"]);
mustContain("src/routes/plans.index.tsx", ["PlanAI is ranking for your priorities", "Compare", "PlanCard"]);
mustContain("src/routes/cart.tsx", ["Your selections", "Review & enroll", "Add-ons available"]);
mustContain("src/routes/review.tsx", ["Review before you enroll", "Start off-exchange application", "Continue to JET handoff"]);
mustContain("src/routes/handoff.tsx", ["Your handoff packet is prepared", "Open JET marketplace", "Continue inside ABox"]);
mustContain("src/routes/apply.tsx", ["Consent & signature", "Application readiness", "Pending carrier"]);
mustContain("src/routes/member.index.tsx", ["Welcome back", "Pick up where you left off", "KpiCard"]);
mustContain("src/routes/member.quotes.tsx", ["Saved quotes & plans", "PlanCard", "saved"]);
mustContain("src/routes/member.messages.tsx", ["Messages", "Unread"]);
mustContain("src/routes/member.settings.tsx", ["Settings", "Saving…", "Saved."]);

const component = (name) => ({ name });
const pattern = (name, variant) => ({ name, variant: variant || null });
const shell = (name, overrides) => ({ name, overrides: overrides || {} });

const ABOX_B8 = {
  meta: {
    batch: "Phase 55 / Batch B8 — experiences & journey compositions",
    page: "04 Experiences",
    generatedBy: "tools/figma-plugin/extract-b8.mjs",
    protects: ["B1", "B2", "B3", "B4", "B5", "B6", "B7"],
  },
  counts: {
    experiences: 5,
    topLevelFrames: 5,
    b1Collections: 9,
    b1Variables: 200,
    b2Variables: 19,
    b3Styles: 79,
    b4Sets: 11,
    b4Standalone: 3,
    b5Variants: 56,
    b5Physical: 59,
    b5NonVariant: 19,
    b5Exposed: 1,
    b6TopLevel: 3,
    b6PhysicalNodes: 4,
    b7TopLevel: 3,
    b7PhysicalNodes: 4,
    newVariables: 0,
    newStyles: 0,
    newComponents: 0,
    newComponentSets: 0,
    newPatterns: 0,
    newProperties: 0,
    prototypes: 0,
  },
  page: "04 Experiences",
  layout: {
    frameWidth: 1440,
    frameXGap: 1600,
    startX: 0,
    startY: 0,
  },
  experiences: [
    {
      name: "ABox/Experience/Internal/DownlineAgencyCreation",
      kind: "FRAME",
      type: "Flow",
      shell: shell("ABox/Shell/Internal", { pageTitle: "Create downline agency", eyebrow: "Contacts · SCR-M05-009", entity: "Cedar Grove Insurance" }),
      patterns: [pattern("ABox/Pattern/WizardStepper")],
      components: [
        component("ABox/Header/PageHeader"), component("ABox/Action/ActionPill"), component("ABox/Status/StatusBadge"),
        component("ABox/Form/LabeledField"), component("ABox/Form/Input"),
      ],
      states: ["identity", "contacts", "readiness", "activation"],
      signature: "ABox/Experience/Internal/DownlineAgencyCreation|FRAME|shell=Internal|states=identity,contacts,readiness,activation|patterns=WizardStepper|props=none|prototypes=0",
      sources: [
        "src/routes/agency.downlines.new.identity.tsx:67-125",
        "src/routes/agency.downlines.new.contacts.tsx:43-113",
        "src/routes/agency.downlines.new.readiness.tsx:43-89",
        "src/routes/agency.downlines.new.activate.tsx:105-154",
        "src/components/abox/downline-wizard-stepper.tsx:18-63",
        "tools/figma-plugin/tokens-b6.js:241-381",
      ],
      sequence: [
        { title: "Identity", body: "Legal name, NPN, parent assignment, duplicate warning", source: lineOf("src/routes/agency.downlines.new.identity.tsx", "Possible existing match") },
        { title: "Contacts", body: "Primary business contact, email, telephone, preferred language", source: lineOf("src/routes/agency.downlines.new.contacts.tsx", "Primary business contact") },
        { title: "Readiness review", body: "PASS / WARNING / FAIL controls before activation", source: lineOf("src/routes/agency.downlines.new.readiness.tsx", "StatusBadge") },
        { title: "Activation", body: "Activation result and organization profile handoff", source: lineOf("src/routes/agency.downlines.new.activate.tsx", "View organization profile") },
      ],
      limitations: ["Field groups are route-local composition; no new B8 form-group foundation is created."],
    },
    {
      name: "ABox/Experience/Internal/MarketplaceActivationGovernance",
      kind: "FRAME",
      type: "Journey slice",
      shell: shell("ABox/Shell/Internal", { pageTitle: "Marketplace administration", eyebrow: "Marketplace · MKT-001", entity: "Cedar Grove Insurance" }),
      patterns: [pattern("ABox/Pattern/KpiRow", { columns: "4" })],
      components: [component("ABox/Header/PageHeader"), component("ABox/Card/KpiCard"), component("ABox/Action/ActionPill"), component("ABox/Status/StatusBadge")],
      states: ["admin", "readiness", "activation"],
      signature: "ABox/Experience/Internal/MarketplaceActivationGovernance|FRAME|shell=Internal|states=admin,readiness,activation|patterns=KpiRow-4|props=none|prototypes=0",
      sources: [
        "src/routes/marketplace.admin.index.tsx:66-155",
        "src/routes/marketplace.admin.readiness.tsx:25-61",
        "src/routes/marketplace.admin.activation.tsx:25-73",
        "tools/figma-plugin/tokens-b6.js:32-52",
      ],
      sequence: [
        { title: "Operational hub", body: "Lifecycle, readiness, enabled participants, open issues", source: lineOf("src/routes/marketplace.admin.index.tsx", "Open issues") },
        { title: "Readiness controls", body: "Canonical owner, next action, recalculation", source: lineOf("src/routes/marketplace.admin.readiness.tsx", "canonical owner") },
        { title: "Initial activation", body: "Submit to JET and pending review", source: lineOf("src/routes/marketplace.admin.activation.tsx", "Submit to JET") },
      ],
      limitations: ["Quick action rail and table-like rows remain route composition; no B8 navigation or data-table foundation is created."],
    },
    {
      name: "ABox/Experience/Marketplace/PlanAIShoppingPath",
      kind: "FRAME",
      type: "Flow",
      shell: shell("ABox/Shell/Marketplace", { variant: "flow", showProducts: true, showAssistant: true, product: "ifp" }),
      patterns: [],
      components: [component("ABox/Header/PageHeader"), component("ABox/Status/StatusBadge"), component("ABox/Action/ActionPill"), component("ABox/Feedback/EmptyState")],
      states: ["select", "quote-final", "ranked-results"],
      signature: "ABox/Experience/Marketplace/PlanAIShoppingPath|FRAME|shell=Marketplace-flow|states=select,quote-final,ranked-results|patterns=none|props=none|prototypes=0",
      sources: [
        "src/routes/select.tsx:31-95",
        "src/routes/quote.tsx:378-545",
        "src/routes/quote.tsx:1235-1363",
        "src/routes/plans.index.tsx:47-190",
        "src/routes/plans.index.tsx:276-369",
        "src/components/abox/product-switcher.tsx:20-78",
      ],
      sequence: [
        { title: "Path choice", body: "Guide me with PlanAI or browse myself", source: lineOf("src/routes/select.tsx", "Guide me with PlanAI") },
        { title: "Quote outcome", body: "Six-step quote summary and estimated monthly subsidy", source: lineOf("src/routes/quote.tsx", "Estimated monthly subsidy") },
        { title: "Ranked results", body: "PlanAI explanation, filters, compare bar, plan results", source: lineOf("src/routes/plans.index.tsx", "PlanAI is ranking for your priorities") },
      ],
      limitations: ["Quote stepper, ShoppingPathBar and PlanCard are not B6/B4 foundations; they stay editable route composition inside this frame."],
    },
    {
      name: "ABox/Experience/Marketplace/EnrollmentReviewAndSubmission",
      kind: "FRAME",
      type: "Journey slice with documented branch",
      shell: shell("ABox/Shell/Marketplace", { variant: "flow", showProducts: true, showAssistant: false, product: "ifp" }),
      patterns: [],
      components: [component("ABox/Header/PageHeader"), component("ABox/Status/StatusBadge"), component("ABox/Action/ActionPill"), component("ABox/Feedback/EmptyState")],
      states: ["cart", "review", "handoff", "offexchange-application"],
      signature: "ABox/Experience/Marketplace/EnrollmentReviewAndSubmission|FRAME|shell=Marketplace-flow|states=cart,review,handoff,offexchange-application|patterns=none|props=none|prototypes=0",
      sources: [
        "src/routes/cart.tsx:36-199",
        "src/routes/review.tsx:36-136",
        "src/routes/handoff.tsx:27-119",
        "src/routes/apply.tsx:38-292",
        "src/routes/apply.tsx:296-313",
        "src/lib/cart-store.ts:1-131",
      ],
      sequence: [
        { title: "Cart", body: "Grouped selections, add-ons, total, review transition", source: lineOf("src/routes/cart.tsx", "Review & enroll") },
        { title: "Review", body: "Quote, cart and account checklist", source: lineOf("src/routes/review.tsx", "Quote details captured") },
        { title: "Handoff", body: "On-exchange handoff packet and off-exchange continuation", source: lineOf("src/routes/handoff.tsx", "Handoff packet") },
        { title: "Application", body: "Readiness, typed signature, PDF/EDI generation, pending carrier", source: lineOf("src/routes/apply.tsx", "Pending carrier") },
      ],
      limitations: ["Application stepper, checklist and handoff packet are route-specific structures; B8 does not promote them to reusable patterns."],
    },
    {
      name: "ABox/Experience/Member/ContinuationWorkspace",
      kind: "FRAME",
      type: "Continuation composition",
      shell: shell("ABox/Shell/Member"),
      patterns: [pattern("ABox/Pattern/KpiRow", { columns: "3" })],
      components: [component("ABox/Header/PageHeader"), component("ABox/Card/KpiCard"), component("ABox/Status/StatusBadge"), component("ABox/Feedback/EmptyState")],
      states: ["dashboard", "saved-quotes", "messages"],
      signature: "ABox/Experience/Member/ContinuationWorkspace|FRAME|shell=Member|states=dashboard,saved-quotes,messages|patterns=KpiRow-3|props=none|prototypes=0",
      sources: [
        "src/routes/member.index.tsx:28-110",
        "src/routes/member.quotes.tsx:19-46",
        "src/routes/member.messages.tsx:15-37",
        "src/routes/member.settings.tsx:39-103",
      ],
      sequence: [
        { title: "Dashboard", body: "Welcome back, cart KPIs, quote resume, tasks", source: lineOf("src/routes/member.index.tsx", "Welcome back") },
        { title: "Saved quotes", body: "Saved plan count and add-to-cart continuation", source: lineOf("src/routes/member.quotes.tsx", "Saved quotes & plans") },
        { title: "Messages", body: "Agent messages with unread state", source: lineOf("src/routes/member.messages.tsx", "Unread") },
      ],
      limitations: ["Saved plan cards and member message rows remain route content; no PlanCard or message-list foundation is created."],
    },
  ],
  placement: [
    { name: "ABox/Experience/Internal/DownlineAgencyCreation", x: 0, y: 0 },
    { name: "ABox/Experience/Internal/MarketplaceActivationGovernance", x: 1600, y: 0 },
    { name: "ABox/Experience/Marketplace/PlanAIShoppingPath", x: 3200, y: 0 },
    { name: "ABox/Experience/Marketplace/EnrollmentReviewAndSubmission", x: 4800, y: 0 },
    { name: "ABox/Experience/Member/ContinuationWorkspace", x: 6400, y: 0 },
  ],
  limitations: [
    "Offline/plugin-layer execution is not real Figma Desktop creation; native editable-object evidence requires running the plugin in Figma Desktop.",
    "B8 creates top-level FRAME reference compositions only, not Components or Component Sets, to avoid creating a second design-system foundation layer.",
    "No component properties, variants, responsive variants, prototype links, variables, styles, shells, patterns or primitives are created in B8.",
    "Content is not inserted into B7 shell placeholder slots; where Figma cannot faithfully slot content into a live shell instance, representative route content is a sibling region with metadata.",
    "ShoppingPathBar, PlanCard, data tables, overlays, checklists, application steppers and route-local field groups remain editable route composition because prior batches explicitly did not establish them as reusable foundations.",
    "Marketplace showProducts continues to follow B7's asymmetric rule: only flow has the product-switcher target; landing receives no synthetic placeholder.",
  ],
};

if (ABOX_B8.experiences.length !== ABOX_B8.counts.experiences) {
  throw new Error("STOP: B8 experience count mismatch.");
}
const out = "// GENERATED by tools/figma-plugin/extract-b8.mjs — do not hand-edit.\nvar ABOX_B8 = " +
  JSON.stringify(ABOX_B8, null, 2) + ";\n";
writeFileSync(join(root, "tools/figma-plugin/tokens-b8.js"), out);
console.log("wrote tools/figma-plugin/tokens-b8.js (" + out.length + " bytes)");

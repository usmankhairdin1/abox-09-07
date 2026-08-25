import type { ReactNode } from "react";

import { HfShell } from "@/components/hf/HfShell";
import {
  Alert,
  Badge,
  Bars,
  Btn,
  Card,
  Check,
  Choice,
  Disclosure,
  EmptyState,
  Field,
  Panel,
  Stat,
  Table,
  Timeline,
  type TimelineEntry,
} from "@/components/hf/ui";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ helpers */

function PageHead({
  eyebrow,
  title,
  sub,
  actions,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-0.5 font-display text-[1.375rem] font-semibold tracking-tight">
          {title}
        </h1>
        {sub ? <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{sub}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

function DrawerList({ heading, items }: { heading?: string; items: string[] }) {
  return (
    <div className="space-y-2">
      {heading ? (
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {heading}
        </p>
      ) : null}
      <ul className="space-y-2">
        {items.map((i) => (
          <li key={i} className="text-xs leading-relaxed text-foreground/80">
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Small labelled key/value stack used across configuration screens. */
function Kv({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <dl className="grid gap-2.5 sm:grid-cols-2">
      {rows.map(([k, v]) => (
        <div key={k}>
          <dt className="text-[11px] text-muted-foreground">{k}</dt>
          <dd className="mt-0.5 text-sm font-medium">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Sentence-shaped rule token, used by the configurator and scheduler. */
function RuleToken({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "accent";
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-[var(--radius)] border border-border bg-card px-2 py-1 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("font-medium", tone === "accent" && "text-primary")}>{value}</span>
    </span>
  );
}

function SectionRail({
  items,
  current,
}: {
  items: [string, "done" | "current" | "todo" | "blocked"][];
  current?: string;
}) {
  return (
    <ol className="space-y-1">
      {items.map(([label, state]) => (
        <li key={label}>
          <div
            className={cn(
              "flex items-center gap-2 rounded-[var(--radius)] px-2.5 py-2 text-xs",
              (state === "current" || label === current) && "bg-primary/[0.07] font-semibold",
            )}
          >
            <span
              className={cn(
                "grid size-4 shrink-0 place-items-center rounded-full border text-[9px]",
                state === "done" && "border-success bg-success/15 text-success",
                state === "current" && "border-primary bg-primary text-primary-foreground",
                state === "todo" && "border-border text-muted-foreground",
                state === "blocked" && "border-destructive text-destructive",
              )}
              aria-hidden="true"
            >
              {state === "done" ? "✓" : state === "blocked" ? "!" : ""}
            </span>
            <span className="min-w-0 flex-1 truncate">{label}</span>
            {state === "blocked" ? <Badge tone="danger">blocked</Badge> : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------------- HF-16 */

export function OffexIntakeScreen() {
  return (
    <HfShell
      activeModule="MOD_FORMS_ENROLLMENT"
      drawerTitle="Submission context"
      assistantContext="this off-exchange application"
      drawer={{
        Context: (
          <DrawerList
            heading="Resolved for this intake"
            items={[
              "Product — Cascade Dental Preferred 1500 (off-exchange, enrollable).",
              "Paper — Northwind Master · Cascade Care appointment #A-4471, verified.",
              "Form set — CASC-DEN-IND-2026 v3, resolved from product + state + effective date.",
              "Rate version — RV-2026-03, pinned at intake.",
            ]}
          />
        ),
        Summary: (
          <DrawerList
            items={[
              "3 of 5 readiness items complete.",
              "Two documents outstanding; signature not yet requested.",
              "Payment configured as capture-at-submission for this tenant.",
            ]}
          />
        ),
        Guidance: (
          <DrawerList
            items={[
              "Readiness is evaluated again at release — availability, appointment and rate effectiveness are re-checked.",
              "Send the resume link if the applicant must complete sensitive sections themselves.",
            ]}
          />
        ),
        Audit: (
          <DrawerList
            items={[
              "Submission created — 11:04, A. Rivera.",
              "Form set resolved — 11:04, system.",
              "SSN revealed — 11:07, A. Rivera (sensitive read).",
            ]}
          />
        ),
      }}
    >
      <PageHead
        eyebrow="Forms & Enrollment · HF-16"
        title="Off-exchange enrollment intake"
        sub="Confirm the applicant, product and effective date, resolve the carrier form set, and open a resumable submission with its readiness contract visible from the first screen."
        actions={
          <>
            <Btn variant="outline">Save &amp; resume later</Btn>
            <Btn variant="outline">Send resume link</Btn>
            <Btn>Start application</Btn>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-4">
          <Panel
            title="Applicant"
            meta="Search before create — intake attaches to an existing lead or member"
            actions={
              <Btn size="sm" variant="outline">
                Change applicant
              </Btn>
            }
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="Applicant"
                value="Marisol Herrera"
                hint="Lead L-20418 · created 12 Aug"
              />
              <Field
                label="Date of birth"
                value="•• / •• / 1987"
                sensitive
                suffix={<Badge tone="warning">reveal</Badge>}
              />
              <Field
                label="SSN"
                value="•••-••-••••"
                sensitive
                suffix={<Badge tone="warning">reveal</Badge>}
              />
              <Field label="Residence ZIP" value="85718" hint="Pima County · rating area 4" />
            </div>
          </Panel>

          <Panel
            title="Product & effective date"
            meta="Only products this agency is enabled and appointed for appear here"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="Product"
                value="Cascade Dental Preferred 1500"
                hint="Off-exchange · enrollable"
              />
              <Field label="Carrier" value="Cascade Care" />
              <Field
                label="Effective date"
                value="1 Oct 2026"
                hint="Inside availability window (1 Sep 2026 – 31 Dec 2026)"
              />
              <Field label="Coverage type" value="Applicant + spouse" />
            </div>
            <div className="mt-4">
              <Alert
                tone="accent"
                title="Form set resolved: CASC-DEN-IND-2026 v3"
                action={
                  <Btn size="sm" variant="outline">
                    Open form record
                  </Btn>
                }
              >
                Resolved from product + state (AZ) + carrier + effective date. This version is
                pinned to the submission; a later published version will not change this
                application.
              </Alert>
            </div>
          </Panel>

          <Panel title="Submission path" meta="Where this application goes when it is released">
            <div className="grid gap-3 sm:grid-cols-3">
              <Choice
                label="Standard EDI template"
                hint="834-derived carrier template, generated at release"
                selected
              />
              <Choice label="Carrier API hook" hint="Not enabled for Cascade Care" />
              <Choice label="Manual carrier portal" hint="Fallback with attached packet" />
            </div>
            <Disclosure className="mt-4">
              Off-exchange is a first-party ABox application. There is no exchange redirect on this
              path — ABox owns the full application record, the submitted output and the submission
              status.
            </Disclosure>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel title="Readiness" meta="Shown before work starts, not at submit">
            <div className="space-y-3">
              <Check checked label="Applicant identity captured" hint="Name, DOB, SSN, residence" />
              <Check checked label="Form set resolved and pinned" hint="CASC-DEN-IND-2026 v3" />
              <Check
                checked
                label="Appointment valid at effective date"
                hint="A-4471 verified · expires 14 Mar 2027"
              />
              <Check
                label="Required documents attached"
                hint="2 outstanding: proof of residence, dependent verification"
              />
              <Check label="Signature captured" hint="Not yet requested" />
              <Check
                label="Payment method captured"
                hint="Capture at submission — tenant setting"
              />
            </div>
            <div className="mt-4 rounded-[var(--radius)] border border-border bg-muted/40 px-3 py-2.5">
              <p className="text-[11px] text-muted-foreground">Hard blockers remaining</p>
              <p className="mt-0.5 font-display text-lg font-semibold">3</p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Submit stays unavailable until every hard-blocking item clears.
              </p>
            </div>
          </Panel>

          <Panel title="Save & resume">
            <Kv
              rows={[
                ["Last saved", "11:12 · auto + explicit"],
                ["Resume link", "Not sent"],
                ["Link expiry", "7 days (tenant setting)"],
              ]}
            />
            <Btn className="mt-3" variant="outline" full>
              Send resume link to applicant
            </Btn>
          </Panel>
        </div>
      </div>
    </HfShell>
  );
}

/* ------------------------------------------------------------------- HF-17 */

export function DynamicFormScreen() {
  return (
    <HfShell
      activeModule="MOD_FORMS_ENROLLMENT"
      drawerTitle="Application context"
      assistantContext="this application form"
      drawer={{
        Context: (
          <DrawerList
            heading="Runtime"
            items={[
              "Form set CASC-DEN-IND-2026 v3 · section 4 of 9.",
              "12 conditional fields currently shown, 7 hidden.",
              "Answers saved per section — resume never loses a typed section.",
            ]}
          />
        ),
        "Help & FAQ": (
          <DrawerList
            items={[
              "Why did a question appear? Each conditional field states the rule that revealed it.",
              "Who may sign? Only the applicant or an authorised legal representative — never the agent.",
            ]}
          />
        ),
        "Next actions": (
          <DrawerList
            items={["Complete dependent details", "Upload proof of residence", "Request signature"]}
          />
        ),
      }}
    >
      <PageHead
        eyebrow="Forms & Enrollment · HF-17"
        title="Dynamic application form"
        sub="The resolved carrier form set rendered as a configured runtime: conditional questions, inline validation, document capture, signature and a readiness gate — no hardcoded screens."
        actions={
          <>
            <Badge tone="neutral">CASC-DEN-IND-2026 v3</Badge>
            <Btn variant="outline">Save section</Btn>
            <Btn>Continue</Btn>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[15rem_1fr]">
        <Card className="p-3">
          <p className="px-2.5 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Sections
          </p>
          <SectionRail
            items={[
              ["1 · Applicant", "done"],
              ["2 · Residence & contact", "done"],
              ["3 · Coverage selection", "done"],
              ["4 · Dependents", "current"],
              ["5 · Health questions", "todo"],
              ["6 · Prior coverage", "todo"],
              ["7 · Documents", "blocked"],
              ["8 · Signature", "todo"],
              ["9 · Payment", "todo"],
            ]}
          />
        </Card>

        <div className="space-y-4">
          <Panel
            title="4 · Dependents"
            meta="Section state saves independently so resume is lossless"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Spouse legal name" value="Daniel Herrera" />
              <Field label="Spouse date of birth" value="•• / •• / 1985" sensitive />
              <Field
                label="Spouse SSN"
                placeholder="Completed by applicant on resume link"
                hint="Field-level ACL: this agent role may submit without viewing"
                sensitive
              />
              <Field label="Relationship start date" value="14 Jun 2011" />
            </div>

            <div className="mt-4 rounded-[var(--radius)] border border-primary/25 bg-primary/[0.05] px-3.5 py-3">
              <p className="text-[11px] font-semibold text-primary">Shown by rule</p>
              <p className="mt-1 text-xs leading-relaxed text-foreground/80">
                These four fields appear because{" "}
                <span className="font-medium">Coverage type = Applicant + spouse</span>. Changing
                coverage type hides them and clears their answers with a confirmation.
              </p>
            </div>

            <div className="mt-4">
              <Alert tone="danger" title="2 validation errors in this section">
                <ul className="mt-1 space-y-1">
                  <li>
                    Relationship start date cannot precede spouse date of birth — jump to field
                  </li>
                  <li>
                    Dependent verification document is required for spouse coverage — jump to
                    section 7
                  </li>
                </ul>
              </Alert>
            </div>
          </Panel>

          <div className="grid gap-4 md:grid-cols-2">
            <Panel title="7 · Documents" meta="Same flow, not a separate module">
              <Table
                columns={["Document", "Required for", "State"]}
                rows={[
                  [
                    "Photo ID",
                    "Submission",
                    <Badge tone="success" dot>
                      Attached
                    </Badge>,
                  ],
                  [
                    "Proof of residence",
                    "Submission",
                    <Badge tone="danger" dot>
                      Missing
                    </Badge>,
                  ],
                  [
                    "Dependent verification",
                    "Spouse coverage",
                    <Badge tone="danger" dot>
                      Missing
                    </Badge>,
                  ],
                ]}
              />
              <Btn className="mt-3" size="sm" variant="outline">
                Upload document
              </Btn>
            </Panel>

            <Panel title="8 · Signature" meta="Signer identity is captured and audited">
              <div className="space-y-3">
                <Choice
                  label="Applicant signs in session"
                  hint="Typed or drawn, captured with timestamp and IP"
                  selected
                />
                <Choice
                  label="Send signature request"
                  hint="Emailed link, expires per tenant setting"
                />
                <Choice label="Wet signature upload" hint="Fallback — allowed for this carrier" />
              </div>
              <Disclosure className="mt-4">
                No role may sign on behalf of an applicant. Support impersonation can read this form
                but cannot apply a signature or capture payment.
              </Disclosure>
            </Panel>
          </div>

          <Panel title="Readiness gate" meta="Re-evaluated at release, not just at intake">
            <div className="grid gap-3 sm:grid-cols-2">
              <Check checked label="All required sections complete" />
              <Check label="No blocking validation errors" hint="2 errors outstanding" />
              <Check checked label="Product still available at effective date" />
              <Check checked label="Appointment still valid" />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Btn variant="outline">Flag for review</Btn>
              <Btn variant="outline">Return to agent</Btn>
              <Btn>Release submission</Btn>
              <span className="text-[11px] text-muted-foreground">
                Release requires enrollment.submit · review roles can flag and return only
              </span>
            </div>
            <p className="mt-3 text-[11px] text-muted-foreground">
              Form version CASC-DEN-IND-2026 v3 · what was signed must be provable later
            </p>
          </Panel>
        </div>
      </div>
    </HfShell>
  );
}

/* ------------------------------------------------------------------- HF-18 */

export function FormConfiguratorScreen() {
  return (
    <HfShell
      activeModule="MOD_FORMS_ENROLLMENT"
      drawerTitle="Form set context"
      assistantContext="this form configuration"
      drawer={{
        Context: (
          <DrawerList
            heading="Editing"
            items={[
              "CASC-DEN-IND-2026 — draft v4 (v3 published, in force).",
              "Resolution: Cascade Care · dental · AZ, NM · effective 1 Sep 2026 onward.",
              "41 fields across 9 sections · 18 conditional rules.",
            ]}
          />
        ),
        Summary: (
          <DrawerList
            items={[
              "Impact: 27 in-flight submissions reference v3 and will keep it.",
              "Mapping complete for EDI; API mapping not required for this carrier.",
            ]}
          />
        ),
        Audit: (
          <DrawerList
            items={[
              "v3 published — 4 Aug, author J. Patel, approver R. Osei.",
              "Field 'Prior coverage carrier' deprecated — 2 Aug, J. Patel.",
            ]}
          />
        ),
      }}
    >
      <PageHead
        eyebrow="Forms & Enrollment · HF-18"
        title="Form configurator"
        sub="Author the form library and the rules that resolve it: sections, fields, conditional logic, validation, required documents, signature settings and mapping — versioned, previewed and approved."
        actions={
          <>
            <Badge tone="warning">draft v4</Badge>
            <Btn variant="outline">Preview runtime</Btn>
            <Btn>Submit for approval</Btn>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[15rem_1fr_19rem]">
        <Card className="p-3">
          <p className="px-2.5 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Form tree
          </p>
          <SectionRail
            items={[
              ["1 · Applicant", "done"],
              ["2 · Residence & contact", "done"],
              ["3 · Coverage selection", "done"],
              ["4 · Dependents", "current"],
              ["5 · Health questions", "todo"],
              ["6 · Prior coverage", "todo"],
              ["7 · Documents", "todo"],
              ["8 · Signature", "todo"],
              ["9 · Payment", "todo"],
            ]}
          />
          <Btn className="mt-3" size="sm" variant="outline" full>
            Add section
          </Btn>
        </Card>

        <div className="space-y-4">
          <Panel
            title="Field canvas — 4 · Dependents"
            meta="Drag to reorder · click a field to inspect"
          >
            <Table
              columns={["Field", "Type", "Required", "Sensitivity", "Conditional"]}
              rows={[
                [
                  "Spouse legal name",
                  "Text",
                  "Yes",
                  <Badge>standard</Badge>,
                  <Badge tone="accent">rule R-07</Badge>,
                ],
                [
                  "Spouse date of birth",
                  "Date",
                  "Yes",
                  <Badge tone="warning">sensitive</Badge>,
                  <Badge tone="accent">rule R-07</Badge>,
                ],
                [
                  "Spouse SSN",
                  "Masked text",
                  "Yes",
                  <Badge tone="danger">high</Badge>,
                  <Badge tone="accent">rule R-07</Badge>,
                ],
                [
                  "Child count",
                  "Number",
                  "No",
                  <Badge>standard</Badge>,
                  <Badge tone="accent">rule R-08</Badge>,
                ],
                [
                  "Prior coverage carrier",
                  "Text",
                  "No",
                  <Badge>standard</Badge>,
                  <Badge tone="neutral">deprecated</Badge>,
                ],
              ]}
            />
            <p className="mt-3 text-[11px] text-muted-foreground">
              A field with captured answers can be deprecated but never deleted.
            </p>
          </Panel>

          <Panel
            title="Conditional logic"
            meta="Written as sentences, reviewable by a non-engineer"
          >
            <div className="space-y-2.5">
              {[
                ["R-07", "Show", "Spouse fields", "when", "Coverage type is Applicant + spouse"],
                ["R-08", "Show", "Child fields", "when", "Coverage type includes dependents"],
                [
                  "R-12",
                  "Require",
                  "Dependent verification document",
                  "when",
                  "Any dependent is added",
                ],
              ].map(([id, verb, target, conj, cond]) => (
                <div
                  key={id}
                  className="flex flex-wrap items-center gap-2 rounded-[var(--radius)] border border-border px-3 py-2.5"
                >
                  <Badge tone="accent">{id}</Badge>
                  <RuleToken label={verb as string} value={target as string} tone="accent" />
                  <span className="text-xs text-muted-foreground">{conj}</span>
                  <RuleToken label="" value={cond as string} />
                </div>
              ))}
            </div>
            <Btn className="mt-3" size="sm" variant="outline">
              Add rule
            </Btn>
          </Panel>

          <Panel title="Validation & documents">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Cross-field validation
                </p>
                <Check checked label="Relationship start date must follow spouse date of birth" />
                <Check
                  checked
                  label="Effective date must fall inside product availability window"
                />
                <Check checked label="ZIP must resolve to a served rating area" />
              </div>
              <div className="space-y-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Required documents
                </p>
                <Check checked label="Photo ID — all submissions" />
                <Check checked label="Proof of residence — AZ, NM" />
                <Check checked label="Dependent verification — when dependents present" />
              </div>
            </div>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel title="Inspector" meta="Spouse SSN">
            <div className="space-y-3">
              <Field label="Label" value="Spouse SSN" />
              <Field label="Type" value="Masked text" />
              <Field label="Sensitivity" value="High — masked, reveal audited" sensitive />
              <Field
                label="EDI mapping"
                value="INS·REF·0F"
                hint="Maps the answer to the carrier template segment"
              />
              <Check checked label="Applicant may complete via resume link" />
              <Check checked label="Required before release" />
            </div>
          </Panel>

          <Panel title="Version & publish">
            <Kv
              rows={[
                ["Published", "v3 · 4 Aug 2026"],
                ["Draft", "v4 · 6 edits"],
                ["In-flight on v3", "27 submissions"],
                ["Approver required", "Yes · forms.approve"],
              ]}
            />
            <Alert tone="warning" title="Author cannot self-approve">
              Publication needs a second reviewer. In-flight submissions keep the version they were
              created under; v4 applies to new submissions only.
            </Alert>
          </Panel>
        </div>
      </div>
    </HfShell>
  );
}

/* ------------------------------------------------------------------- HF-19 */

export function ProductCatalogScreen() {
  return (
    <HfShell
      activeModule="MOD_PRODUCTS_PLANS"
      drawerTitle="Catalog context"
      assistantContext="the product catalog"
      drawer={{
        Context: (
          <DrawerList
            heading="Scope"
            items={[
              "Platform view — all products across all agencies.",
              "142 products · 6 lines · 11 carriers.",
              "Agency roles see only their enabled subset.",
            ]}
          />
        ),
        Summary: (
          <DrawerList
            items={[
              "3 products with stale rates — quoting stopped per tenant policy.",
              "2 products awaiting appointment before enablement can complete.",
            ]}
          />
        ),
        "Help & FAQ": (
          <DrawerList
            items={[
              "Why is a product missing for an agency? Enablement, availability rules and appointment are checked in that order.",
              "Quote-only products have no enrollment path at all — the action does not exist.",
            ]}
          />
        ),
      }}
    >
      <PageHead
        eyebrow="Products, Plans & Rates · HF-19"
        title="Product catalog"
        sub="Everything ABox can quote or enroll, with the state that matters: quotable, enrollable, enabled per agency and rate-healthy. Every marketplace and quote reads from here."
        actions={
          <>
            <Btn variant="outline">Import plans</Btn>
            <Btn>New product</Btn>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Stat label="Live products" value="142" hint="Across 11 carriers" />
        <Stat label="Enrollable" value="118" hint="24 are quote-only" />
        <Stat label="Stale rates" value="3" delta="quoting stopped" deltaTone="danger" />
        <Stat label="Awaiting appointment" value="2" hint="Enablement blocked" />
      </div>

      <Card className="p-2">
        <div className="flex flex-wrap gap-1.5">
          {[
            "All lines",
            "Medical — on-exchange",
            "Medical — off-exchange",
            "Dental",
            "Vision",
            "Accident / CI",
            "ICHRA (quote only)",
          ].map((t, i) => (
            <span
              key={t}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs",
                i === 0
                  ? "bg-foreground text-background font-medium"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              {t}
            </span>
          ))}
        </div>
      </Card>

      <Panel
        title="Catalog"
        meta="A working list, not a card gallery"
        actions={
          <Btn size="sm" variant="outline">
            Export
          </Btn>
        }
      >
        <Table
          columns={[
            "Product",
            "Line",
            "Carrier",
            "States",
            "Quotable",
            "Enrollable",
            "Agencies",
            "Rate health",
          ]}
          rows={[
            [
              "Summit Silver 3500 HSA",
              "Medical — on-exchange",
              "Blue Summit",
              "AZ, NM, NV",
              <Badge tone="success" dot>
                Yes
              </Badge>,
              <Badge tone="success" dot>
                Yes
              </Badge>,
              "34",
              <Badge tone="success" dot>
                Current
              </Badge>,
            ],
            [
              "Cascade Dental Preferred 1500",
              "Dental",
              "Cascade Care",
              "AZ, NM",
              <Badge tone="success" dot>
                Yes
              </Badge>,
              <Badge tone="success" dot>
                Yes
              </Badge>,
              "21",
              <Badge tone="success" dot>
                Current
              </Badge>,
            ],
            [
              "Meridian Vision Complete",
              "Vision",
              "Meridian",
              "AZ",
              <Badge tone="success" dot>
                Yes
              </Badge>,
              <Badge tone="success" dot>
                Yes
              </Badge>,
              "9",
              <Badge tone="warning" dot>
                Stale 6 days
              </Badge>,
            ],
            [
              "Northwind ICHRA Illustration",
              "ICHRA",
              "n/a — quoting model",
              "AZ, NM, TX",
              <Badge tone="success" dot>
                Yes
              </Badge>,
              <Badge tone="neutral">No — quote only</Badge>,
              "4",
              <Badge tone="success" dot>
                Current
              </Badge>,
            ],
            [
              "Cascade Accident Secure",
              "Accident / CI",
              "Cascade Care",
              "AZ",
              <Badge tone="danger" dot>
                Stopped
              </Badge>,
              <Badge tone="danger" dot>
                Stopped
              </Badge>,
              "6",
              <Badge tone="danger" dot>
                Stale 31 days
              </Badge>,
            ],
          ]}
        />
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Agency enablement" meta="Edited in place from the row, side sheet pattern">
          <Table
            columns={["Agency", "Enabled", "Effective", "Appointment"]}
            rows={[
              [
                "Northwind Master",
                <Badge tone="success" dot>
                  Enabled
                </Badge>,
                "1 Jan 2026",
                <Badge tone="success" dot>
                  A-4471 verified
                </Badge>,
              ],
              [
                "Harbor Point",
                <Badge tone="success" dot>
                  Enabled
                </Badge>,
                "1 Mar 2026",
                <Badge tone="success" dot>
                  Inherited
                </Badge>,
              ],
              [
                "Cedar Ridge",
                <Badge tone="danger" dot>
                  Blocked
                </Badge>,
                "—",
                <Badge tone="danger" dot>
                  No appointment
                </Badge>,
              ],
            ]}
          />
          <Alert tone="warning" title="Enablement without appointment is blocked">
            Cedar Ridge cannot be enabled for this carrier until an appointment path exists. The
            block names the missing appointment and offers a request-to-write action.
          </Alert>
        </Panel>

        <Panel title="Quote-only fence" meta="ICHRA in Phase 1">
          <p className="text-xs leading-relaxed text-muted-foreground">
            ICHRA products carry an explicit quote-only marker. There is no application, no election
            capture and no enrollment path — the enroll action does not exist on the product rather
            than appearing disabled. Any attempt to start an application against them is blocked at
            intake.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge tone="accent">quote-only</Badge>
            <Badge>no enrollment path</Badge>
            <Badge>employer-facing illustration only</Badge>
          </div>
          <Disclosure className="mt-4">
            Retire is available; delete is not. Historical quotes and policies must keep resolving
            their product, so a retired product leaves new quoting while remaining referenceable
            forever.
          </Disclosure>
        </Panel>
      </div>
    </HfShell>
  );
}

/* ------------------------------------------------------------------- HF-20 */

export function ProductBuilderScreen() {
  return (
    <HfShell
      activeModule="MOD_PRODUCTS_PLANS"
      drawerTitle="Product definition"
      assistantContext="this product definition"
      drawer={{
        Context: (
          <DrawerList
            heading="Building"
            items={[
              "Cascade Vision Clear 200 — draft, line template 'Vision'.",
              "Template pre-filled 4 rating inputs and 6 displayed attributes.",
              "Bindings: 3 of 4 complete.",
            ]}
          />
        ),
        Guidance: (
          <DrawerList
            items={[
              "Extend the dental pattern rather than special-casing a new line.",
              "Publish is blocked until a rate source is bound and, for enrollable products, a form rule.",
            ]}
          />
        ),
      }}
    >
      <PageHead
        eyebrow="Products, Plans & Rates · HF-20"
        title="Product builder"
        sub="Define a product without code: line template, rating inputs, displayed attributes, rate and form bindings, bundling. Dental is the reference ancillary — the pattern must generalise, not hardcode."
        actions={
          <>
            <Badge tone="warning">draft</Badge>
            <Btn variant="outline">Preview in marketplace</Btn>
            <Btn>Publish product</Btn>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1fr_21rem]">
        <div className="space-y-4">
          <Panel title="Definition" meta="Line template pre-fills the rest of this screen">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Product name" value="Cascade Vision Clear 200" />
              <Field
                label="Consumer display name"
                value="Vision Clear"
                hint="What the marketplace shows"
              />
              <Field
                label="Line template"
                value="Vision"
                hint="Pre-fills rating inputs and attribute slots"
              />
              <Field label="Carrier" value="Cascade Care" />
              <Field label="States" value="AZ, NM" />
              <Field
                label="Enrollment mode"
                value="Enrollable"
                hint="Quote-only removes the enrollment path entirely"
              />
            </div>
          </Panel>

          <div className="grid gap-4 md:grid-cols-2">
            <Panel title="Rating inputs" meta="Defines the quote request shape">
              <div className="space-y-2.5">
                <Check checked label="Age" />
                <Check checked label="ZIP / rating area" />
                <Check label="Tobacco" hint="Not rated for vision" />
                <Check checked label="Family composition" />
                <Check
                  label="Custom input"
                  hint="Named inputs only — no free-form formulas in Phase 1"
                />
              </div>
              <p className="mt-3 text-[11px] text-muted-foreground">
                The wizard collects exactly these inputs and nothing more.
              </p>
            </Panel>

            <Panel title="Displayed attributes" meta="Authored as the consumer card slots">
              <div className="space-y-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Card slots (max 4)
                </p>
                <Check checked label="Annual exam copay" />
                <Check checked label="Frames allowance" />
                <Check checked label="Lens coverage" />
                <Check checked label="Network" />
                <p className="pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Detail slots
                </p>
                <Check checked label="Contact lens allowance, frequency limits, exclusions" />
                <Check checked label="Document links (brochure, exclusions summary)" />
              </div>
            </Panel>
          </div>

          <Panel title="Bindings" meta="A visible contract — publish is gated on this list">
            <div className="grid gap-3 sm:grid-cols-2">
              <Check
                checked
                label="Rate source bound"
                hint="CASC-VIS-FEED · daily · last load 06:10"
              />
              <Check checked label="Availability rules set" hint="AZ, NM · 1 Nov 2026 onward" />
              <Check
                checked
                label="Commission schedule assignable"
                hint="Authored in Commissions, not here"
              />
              <Check
                label="Form resolution rule bound"
                hint="Required because this product is enrollable"
              />
            </div>
            <Alert tone="danger" title="Publish blocked — 1 binding missing">
              An enrollable product without a form resolution rule cannot be published. Bind a form
              set in the configurator, then return here.
            </Alert>
          </Panel>

          <Panel title="Bundling & cart behaviour">
            <div className="grid gap-3 sm:grid-cols-3">
              <Choice
                label="Can be added with medical"
                hint="Appears as additional coverage"
                selected
              />
              <Choice label="Standalone only" hint="Own cart, own checkout" />
              <Choice label="Requires medical in cart" hint="Blocks standalone purchase" />
            </div>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel title="Consumer preview" meta="Branded skin · the author sees the consequence">
            <Card className="p-4">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Cascade Care
              </p>
              <p className="font-display text-base font-semibold leading-snug tracking-tight">
                Vision Clear
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                <Badge>Vision</Badge>
                <Badge>PPO network</Badge>
              </div>
              <p className="mt-3 font-display text-2xl font-semibold tabular-nums">$14</p>
              <p className="text-[11px] text-muted-foreground">per month · estimate</p>
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-border pt-3 text-xs">
                <div>
                  <dt className="text-muted-foreground">Exam copay</dt>
                  <dd className="mt-0.5 font-medium">$10</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Frames allowance</dt>
                  <dd className="mt-0.5 font-medium">$200</dd>
                </div>
              </dl>
            </Card>
            <p className="mt-3 text-[11px] text-muted-foreground">
              Card slots authored above render here exactly as the marketplace will show them.
            </p>
          </Panel>

          <Panel title="Ancillary extensibility">
            <p className="text-xs leading-relaxed text-muted-foreground">
              Dental was the minimum ancillary proof required by the blueprint. Vision, accident and
              critical illness are built through the same line templates and the same four bindings
              — no per-line screens, no hardcoded dental behaviour.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {["Dental — live", "Vision — building", "Accident / CI — template ready"].map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </HfShell>
  );
}

/* ------------------------------------------------------------------- HF-21 */

const APPOINTMENT_TIMELINE: TimelineEntry[] = [
  {
    kind: "human",
    title: "NPN override applied",
    body: "Writing NPN set to 8842119 (Northwind Master) with reason 'master paper arrangement'.",
    meta: "18 Aug 2026 · 09:41",
    actor: "R. Osei",
  },
  {
    kind: "status",
    title: "Appointment verified",
    body: "Carrier confirmation letter attached and matched to licence AZ-114872.",
    meta: "3 Apr 2026 · 14:02",
    actor: "Compliance",
  },
  {
    kind: "system",
    title: "Expiry warning raised",
    body: "60-day window notice sent to agency admin and compliance queue.",
    meta: "13 Jan 2027 · 06:00",
  },
  {
    kind: "human",
    title: "Appointment created",
    body: "Cascade Care · dental, vision · AZ, NM.",
    meta: "28 Mar 2026 · 11:18",
    actor: "A. Rivera",
  },
];

export function AppointmentSetupScreen() {
  return (
    <HfShell
      activeModule="MOD_AGENCY_ENTITY"
      drawerTitle="Appointment context"
      assistantContext="this carrier appointment"
      drawer={{
        Context: (
          <DrawerList
            heading="Record"
            items={[
              "Appointment A-4471 · Cascade Care · paper owner Northwind Master.",
              "Lines: dental, vision. States: AZ, NM.",
              "Writing NPN 8842119 (overridden).",
            ]}
          />
        ),
        Summary: (
          <DrawerList
            items={[
              "Unlocks 14 products across 2 lines.",
              "21 agents inherit this appointment.",
              "Expires 14 Mar 2027 — warning band opens 13 Jan 2027.",
            ]}
          />
        ),
        Audit: (
          <DrawerList
            items={[
              "NPN override — 18 Aug, R. Osei, reason recorded.",
              "Verification — 3 Apr, Compliance.",
            ]}
          />
        ),
      }}
    >
      <PageHead
        eyebrow="Agency & Entity Management · HF-21"
        title="Carrier appointment setup"
        sub="The gate that decides whether an agency or agent may write a product at all — carrier, paper owner, states, lines, NPN in force, dates and verification state, on the object page framework."
        actions={
          <>
            <Badge tone="success" dot>
              Active
            </Badge>
            <Badge tone="success" dot>
              Verified
            </Badge>
            <Btn variant="outline">Attach document</Btn>
            <Btn>Edit appointment</Btn>
          </>
        }
      />

      <Alert tone="warning" title="Expires in 201 days — 14 Mar 2027">
        A lapsed appointment silently stops sales, so the dated warning band opens 60 days out and
        creates a compliance task. Renewal documents can be attached before expiry without
        interrupting live business.
      </Alert>

      <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-4">
          <Panel title="Appointment record">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Carrier" value="Cascade Care" />
              <Field
                label="Paper owner"
                value="Northwind Master"
                hint="Only the paper owner may edit this record"
              />
              <Field label="Lines" value="Dental, Vision" />
              <Field label="States" value="AZ, NM" />
              <Field label="Effective date" value="28 Mar 2026" />
              <Field
                label="Termination date"
                value="—"
                hint="Blocked while in-flight submissions depend on it"
              />
              <Field label="Carrier appointment number" value="CC-AZ-2026-4471" />
              <Field
                label="Writing NPN"
                value="8842119"
                hint="Overridden from agency NPN — reason recorded and audited"
                suffix={<Badge tone="warning">override</Badge>}
              />
            </div>
          </Panel>

          <div className="grid gap-4 md:grid-cols-2">
            <Panel title="Verification" meta="Separate from active state">
              <div className="space-y-2.5">
                <Check checked label="Carrier confirmation letter attached" />
                <Check checked label="Matched to licence AZ-114872 (active)" />
                <Check checked label="Matched to licence NM-90233 (active)" />
                <Check label="Renewal documentation for 2027" hint="Not yet required" />
              </div>
              <Alert tone="accent" title="'Active, unverified' is a distinct state">
                It is a real and dangerous condition, so it is chipped separately rather than
                collapsed into a single boolean. Tenant policy decides whether unverified
                appointments may quote.
              </Alert>
            </Panel>

            <Panel
              title="Downstream consequence"
              meta="An appointment nobody can trace is a compliance risk"
            >
              <Kv
                rows={[
                  ["Products unlocked", "14"],
                  ["Agencies inheriting", "2 downline"],
                  ["Agents inheriting", "21"],
                  ["In-flight submissions", "27"],
                ]}
              />
              <Btn className="mt-3" size="sm" variant="outline">
                View dependent products
              </Btn>
            </Panel>
          </div>

          <Panel title="Timeline" meta="Human, system and compliance events on one thread">
            <Timeline entries={APPOINTMENT_TIMELINE} />
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel title="Documents">
            <Table
              columns={["Document", "State"]}
              rows={[
                [
                  "Carrier confirmation",
                  <Badge tone="success" dot>
                    Verified
                  </Badge>,
                ],
                [
                  "E&O certificate",
                  <Badge tone="success" dot>
                    Current
                  </Badge>,
                ],
                [
                  "W-9",
                  <Badge tone="success" dot>
                    On file
                  </Badge>,
                ],
                ["2027 renewal packet", <Badge tone="neutral">Not required yet</Badge>],
              ]}
            />
          </Panel>

          <Panel title="Actions">
            <div className="space-y-2">
              <Btn variant="outline" full>
                Request renewal
              </Btn>
              <Btn variant="outline" full>
                Apply NPN override
              </Btn>
              <Btn variant="outline" full>
                Terminate appointment
              </Btn>
            </div>
            <Disclosure className="mt-4">
              Termination is blocked while in-flight submissions depend on this appointment, and the
              block lists them. Overrides and terminations require a reason code and are reported.
            </Disclosure>
          </Panel>
        </div>
      </div>
    </HfShell>
  );
}

/* ------------------------------------------------------------------- HF-22 */

export function PaperSplitsScreen() {
  return (
    <HfShell
      activeModule="MOD_AGENCY_ENTITY"
      drawerTitle="Paper context"
      assistantContext="this paper arrangement"
      drawer={{
        Context: (
          <DrawerList
            heading="Paper"
            items={[
              "Cascade Care paper · owner Northwind Master.",
              "Visibility: invite-only.",
              "3 access grants, 1 pending request.",
            ]}
          />
        ),
        Summary: (
          <DrawerList
            items={[
              "Split v4 effective 1 Sep 2026 · totals 100%.",
              "Previous version v3 remains visible and unaltered.",
            ]}
          />
        ),
        Audit: (
          <DrawerList
            items={[
              "Split v4 published — 22 Aug, R. Osei.",
              "Access granted to Bright Referral — 14 Aug, R. Osei.",
            ]}
          />
        ),
      }}
    >
      <PageHead
        eyebrow="Agency & Entity Management · HF-22"
        title="Paper access & revenue split configuration"
        sub="Who may write on this paper and how the resulting revenue divides — the same decision, so one screen. Access on the left, splits on the right, both effective-dated and audited."
        actions={
          <>
            <Badge tone="accent">invite-only</Badge>
            <Btn variant="outline">View version history</Btn>
            <Btn>Publish split v4</Btn>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {/* --------------------------------------------------------- access */}
        <div className="space-y-4">
          <Panel title="Visibility" meta="Plain-language consequence under each option">
            <div className="space-y-3">
              <Choice
                label="Public in the marketplace of marketplaces"
                hint="Any agency on the platform can discover this paper and request to write on it."
              />
              <Choice
                label="Invite-only"
                hint="Only entities you invite can see or request this paper. Requests still require approval."
                selected
              />
              <Choice
                label="Private"
                hint="Visible to your own subtree only. No external agency can discover or request it."
              />
            </div>
          </Panel>

          <Panel
            title="Access grants"
            meta="Upline sees the arrangement · downline sees only its own row"
          >
            <Table
              columns={["Entity", "Relationship", "Access", "Effective"]}
              rows={[
                [
                  "Harbor Point",
                  "Downline",
                  <Badge tone="success" dot>
                    Write
                  </Badge>,
                  "1 Mar 2026",
                ],
                [
                  "Cedar Ridge",
                  "Downline",
                  <Badge tone="warning" dot>
                    Quote only
                  </Badge>,
                  "1 Jun 2026",
                ],
                [
                  "Bright Referral",
                  "Referral partner",
                  <Badge tone="neutral">Refer only</Badge>,
                  "14 Aug 2026",
                ],
              ]}
            />
          </Panel>

          <Panel title="Requests to write" meta="An inbox on the record, not an email thread">
            <div className="space-y-3">
              <div className="rounded-[var(--radius)] border border-border px-3.5 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">Summit Partners LLC</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      Requested 24 Aug · dental, AZ · expires in 5 days
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Btn size="sm" variant="outline">
                      Decline
                    </Btn>
                    <Btn size="sm">Approve</Btn>
                  </div>
                </div>
                <Alert tone="warning" title="Licence check pending for NM">
                  Approval is blocked for a state or line where the requesting entity holds no valid
                  appointment or licence. AZ can be approved now; NM cannot.
                </Alert>
              </div>
              <EmptyState
                title="No other open requests"
                body="Declined requests keep their reason and stay visible in the audit trail for the retention period."
              />
            </div>
          </Panel>
        </div>

        {/* --------------------------------------------------------- splits */}
        <div className="space-y-4">
          <Panel
            title="Revenue split — v4"
            meta="Effective 1 Sep 2026 · previous versions are never rewritten"
            actions={
              <Badge tone="success" dot>
                Totals 100%
              </Badge>
            }
          >
            <Table
              columns={["Party", "Role", "Share", "Basis"]}
              rows={[
                ["Northwind Master", "Paper owner", "35%", "Commissionable revenue"],
                ["Harbor Point", "Selling agency", "45%", "Commissionable revenue"],
                ["D. Okafor", "Selling agent", "15%", "Selling agency share"],
                ["Bright Referral", "Referral partner", "5%", "Reward program RP-12"],
                [
                  <span className="font-semibold">Remainder</span>,
                  "—",
                  <span className="font-semibold text-success">0%</span>,
                  "Live — must be zero to publish",
                ],
              ]}
            />
            <p className="mt-3 text-[11px] text-muted-foreground">
              An arithmetic error here is a payment dispute, so the remainder row recalculates as
              you type and publish is blocked until it reaches zero.
            </p>
          </Panel>

          <Panel
            title="Markers set on every submission"
            meta="The keys attribution and reporting join on"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Selling agency marker" value="Harbor Point" />
              <Field label="Selling agent marker" value="D. Okafor · NPN 7712045" />
              <Field label="Writing NPN" value="8842119" hint="From appointment A-4471 override" />
              <Field label="Referral attribution" value="Bright Referral · first touch" />
            </div>
          </Panel>

          <Panel title="B2B2C nesting">
            <p className="text-xs leading-relaxed text-muted-foreground">
              A partner writing on a downline&apos;s granted paper produces a multi-party split on
              this same arrangement — not a new entity type and not a parallel hierarchy. Nesting is
              expressed as additional split rows with their own roles, which is why access and
              splits belong on one screen.
            </p>
            <Disclosure className="mt-3">
              A policy resolves exactly one split arrangement version, pinned at effective date.
              Commission calculation, projection and statements all resolve through that pinned
              version.
            </Disclosure>
          </Panel>
        </div>
      </div>
    </HfShell>
  );
}

/* ------------------------------------------------------------------- HF-23 */

export function ReferralRewardsScreen() {
  return (
    <HfShell
      activeModule="MOD_COMMISSIONS"
      drawerTitle="Program context"
      assistantContext="this referral program"
      drawer={{
        Context: (
          <DrawerList
            heading="Program"
            items={[
              "RP-12 · Bright Referral · sponsored by Northwind Master.",
              "Model: hybrid — one-time on policy effective + recurring monthly.",
              "Qualifying event: policy effective, 30-day attribution window.",
            ]}
          />
        ),
        Guidance: (
          <DrawerList
            items={[
              "Programs paying on lead creation carry the highest abuse risk and need a second approver.",
              "Deactivating a program does not cancel accrued unpaid rewards.",
            ]}
          />
        ),
      }}
    >
      <PageHead
        eyebrow="Commissions & Revenue · HF-23"
        title="Referral reward setup"
        sub="What a referral partner earns: reward model, qualifying event, attribution, caps, payout timing and the disclosure attached to the program — with a live worked example so the rules can be checked."
        actions={
          <>
            <Badge tone="success" dot>
              Active
            </Badge>
            <Btn variant="outline">Preview partner view</Btn>
            <Btn>Save program</Btn>
          </>
        }
      />

      <Panel
        title="Reward model"
        meta="The model choice changes the form, not just a dropdown value"
      >
        <div className="grid gap-3 sm:grid-cols-4">
          <Choice label="One-time per enrollment" hint="Fixed amount on the qualifying event" />
          <Choice label="Recurring monthly" hint="Paid while the policy persists" />
          <Choice label="Tiered by volume" hint="Rate rises with referral count in a period" />
          <Choice label="Hybrid" hint="One-time plus recurring" selected />
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-4">
          <Panel title="Money mechanics" meta="Hybrid — both components required">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="One-time reward" value="$45.00" hint="Per qualifying enrollment" />
              <Field label="Recurring reward" value="$4.00 / month" />
              <Field label="Recurring duration" value="12 months" />
              <Field label="Cap per partner per year" value="$25,000" />
              <Field
                label="Cap per referred policy"
                value="$93.00"
                hint="One-time + 12 recurring"
              />
              <Field label="Payout timing" value="Monthly, with statement posting" />
            </div>
          </Panel>

          <Panel
            title="Qualifying event & attribution"
            meta="Attribution is part of the reward definition"
          >
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Qualifying event
                </p>
                <Choice label="Lead created" hint="Highest risk — second approver required" />
                <Choice label="Application submitted" />
                <Choice label="Policy effective" selected />
                <Choice
                  label="Policy persists 90 days"
                  hint="Lowest risk, slowest partner payout"
                />
              </div>
              <div className="space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Attribution
                </p>
                <Field label="Window" value="30 days from referral" />
                <Field
                  label="Model"
                  value="First touch"
                  hint="Last touch also available per tenant"
                />
                <Field label="Clawback" value="Full reversal if cancelled inside 60 days" />
                <Check checked label="Attribution recorded on lead, quote and submission" />
              </div>
            </div>
          </Panel>

          <Panel title="Worked example" meta="Reward rules that cannot be checked get set wrong">
            <Table
              columns={["Assumption", "Value", "Reward"]}
              rows={[
                ["Qualifying enrollments this month", "18", "$810.00 one-time"],
                ["Active recurring policies", "126", "$504.00 recurring"],
                ["Projected reversals (60-day cancels)", "2", "− $90.00"],
                [
                  <span className="font-semibold">Total accrual</span>,
                  "—",
                  <span className="font-semibold">$1,224.00</span>,
                ],
              ]}
            />
            <p className="mt-3 text-[11px] text-muted-foreground">
              Recalculates live as the admin types. Against the $25,000 annual cap: 4.9% used this
              month.
            </p>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel title="Approval & disclosure">
            <div className="space-y-2.5">
              <Check
                checked
                label="Disclosure text authored"
                hint="Required before activation, versioned with the program"
              />
              <Check checked label="Partner acceptance captured" hint="14 Aug 2026" />
              <Check label="Second approver" hint="Not required for policy-effective programs" />
            </div>
            <Disclosure className="mt-4">
              Referral rewards are distinct from commission splits and never alter a licensed
              agent&apos;s commission. Partner-facing views show only the partner&apos;s own reward,
              never the agency&apos;s underlying commission.
            </Disclosure>
          </Panel>

          <Panel title="Accrual to date">
            <Kv
              rows={[
                ["This period", "$1,224.00"],
                ["Year to date", "$9,880.00"],
                ["Unpaid accrued", "$1,224.00"],
                ["Reversals YTD", "− $402.00"],
              ]}
            />
            <p className="mt-3 text-[11px] text-muted-foreground">
              Accruals appear on statements as a distinct reward line. ABox exports for payment; it
              does not disburse funds in Phase 1.
            </p>
          </Panel>
        </div>
      </div>
    </HfShell>
  );
}

/* ------------------------------------------------------------------- HF-24 */

export function CommissionScheduleScreen() {
  return (
    <HfShell
      activeModule="MOD_COMMISSIONS"
      drawerTitle="Schedule context"
      assistantContext="this commission schedule"
      drawer={{
        Context: (
          <DrawerList
            heading="Schedule"
            items={[
              "CS-2026-DEN-AZ · draft v3 (v2 in force).",
              "Bound to Cascade dental products on Northwind Master paper.",
              "Entity scope: Northwind Master + downline.",
            ]}
          />
        ),
        Summary: (
          <DrawerList
            items={[
              "Base PMPM + override layer + upline bonus + super bonus.",
              "Impact: 1,842 in-force policies.",
              "Contingent categories excluded from projection by default.",
            ]}
          />
        ),
        Audit: (
          <DrawerList
            items={[
              "v2 published — 1 Jan 2026, approver R. Osei.",
              "PMPM rate changed — 20 Aug, draft.",
            ]}
          />
        ),
      }}
    >
      <PageHead
        eyebrow="Commissions & Revenue · HF-24"
        title="Commission schedule setup"
        sub="Every model Phase 1 must support — PMPM, PEPM, PCPM, flat fee, percentage, contingent, overrides, upline and super bonuses — bound to product, carrier, paper, entity and effective window."
        actions={
          <>
            <Badge tone="warning">draft v3</Badge>
            <Btn variant="outline">Worked example</Btn>
            <Btn>Submit for approval</Btn>
          </>
        }
      />

      <Panel title="Model type" meta="Choosing a model changes the rate form beneath it">
        <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {[
            ["PMPM", "Per member per month", true],
            ["PEPM", "Per employee per month", false],
            ["PCPM", "Per covered person per month", false],
            ["Flat fee", "Per policy, one time", false],
            ["% of premium", "Percentage of paid premium", false],
            ["Contingent", "Category-based, at risk", false],
          ].map(([label, hint, sel]) => (
            <Choice
              key={label as string}
              label={label as string}
              hint={hint as string}
              selected={sel as boolean}
            />
          ))}
        </div>
        <p className="mt-3 text-[11px] text-muted-foreground">
          PCPM is per covered person and is deliberately distinct from PMPM at the member-count
          definition level — conflating them misprices family business.
        </p>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-[1fr_21rem]">
        <div className="space-y-4">
          <Panel
            title="Rate rows — PMPM base"
            meta="Effective-dated and stacked, never overwritten"
          >
            <Table
              columns={["Effective from", "Effective to", "Rate", "Member basis", "State"]}
              rows={[
                ["1 Jan 2027", "—", "$3.10 PMPM", "Enrolled members", "AZ"],
                ["1 Jan 2026", "31 Dec 2026", "$2.85 PMPM", "Enrolled members", "AZ"],
                ["1 Jul 2025", "31 Dec 2025", "$2.60 PMPM", "Enrolled members", "AZ"],
              ]}
            />
            <Btn className="mt-3" size="sm" variant="outline">
              Add effective-dated rate
            </Btn>
          </Panel>

          <Panel title="Layer stack" meta="Where operators lose the plot — so it is drawn">
            <ol className="space-y-2">
              {[
                ["Base", "PMPM $2.85 to selling agency", "accent"],
                ["Override", "$0.40 PMPM to Northwind Master on downline production", "neutral"],
                [
                  "Upline bonus",
                  "$0.15 PMPM above 1,500 lives in the measurement period",
                  "neutral",
                ],
                ["Super bonus", "$18,000 annual at 95% persistence and 2,500 lives", "warning"],
              ].map(([label, body, tone], i) => (
                <li key={label as string} className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-border text-[11px] font-semibold">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1 rounded-[var(--radius)] border border-border px-3 py-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium">{label}</p>
                      <Badge tone={tone as "accent" | "neutral" | "warning"}>
                        {tone === "warning" ? "annual" : "monthly"}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Panel>

          <Panel title="Worked example" meta="1,000 members, one month">
            <Table
              columns={["Layer", "Calculation", "Amount"]}
              rows={[
                ["Base PMPM", "1,000 × $2.85", "$2,850.00"],
                ["Override", "1,000 × $0.40", "$400.00"],
                ["Upline bonus", "Not met — 1,000 of 1,500 lives", "$0.00"],
                [
                  "Contingent quality category",
                  "Excluded from projection by default",
                  <Badge tone="warning">at risk</Badge>,
                ],
                [
                  <span className="font-semibold">Total commissionable</span>,
                  "—",
                  <span className="font-semibold">$3,250.00</span>,
                ],
              ]}
            />
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel title="Bindings">
            <div className="space-y-3">
              <Field label="Products" value="Cascade dental (4 products)" />
              <Field label="Carrier" value="Cascade Care" />
              <Field label="Paper" value="Northwind Master · A-4471" />
              <Field label="Entity scope" value="Northwind Master + downline" />
              <Field
                label="Effective rule"
                value="Next plan year"
                hint="Immediate and next-period also available"
              />
            </div>
            <p className="mt-3 text-[11px] text-muted-foreground">
              Schedules bind to catalog products and appointment paper; they never define either.
            </p>
          </Panel>

          <Panel title="Contingent categories">
            <div className="space-y-2.5">
              <Check
                checked
                label="Quality / persistence bonus"
                hint="Contingent — excluded from projection"
              />
              <Check
                checked
                label="Growth incentive"
                hint="Contingent — excluded from projection"
              />
              <Check label="Include contingent in projections" hint="Explicit opt-in per tenant" />
            </div>
          </Panel>

          <Panel title="Publish">
            <Alert tone="warning" title="Two-step approval · 1,842 policies affected">
              Publishing recalculates projections forward only. Posted statement periods are
              immutable and are never retroactively repriced.
            </Alert>
            <Btn className="mt-3" full>
              Request approval
            </Btn>
          </Panel>
        </div>
      </div>
    </HfShell>
  );
}

/* ------------------------------------------------------------------- HF-25 */

export function CommissionProjectionScreen() {
  return (
    <HfShell
      activeModule="MOD_COMMISSIONS"
      drawerTitle="Projection context"
      assistantContext="this projection"
      drawer={{
        Context: (
          <DrawerList
            heading="Basis"
            items={[
              "Schedule CS-2026-DEN-AZ v2 · split arrangement v3.",
              "Persistence assumption 92% · close rate on pending 40%.",
              "Horizon 12 months · Northwind Master + downline.",
            ]}
          />
        ),
        Guidance: (
          <DrawerList
            items={[
              "Projection is advisory. Only statements produce a payable amount.",
              "Posted periods are shown from the statement, never from the projection.",
            ]}
          />
        ),
      }}
    >
      <PageHead
        eyebrow="Commissions & Revenue · HF-25"
        title="Commission projection"
        sub="Expected revenue from in-force and pending business by month, product, carrier and entity — plus the internal per-deal projection an agent sees inside quote and cart."
        actions={
          <>
            <Badge tone="warning">estimate</Badge>
            <Btn variant="outline">Export</Btn>
            <Btn variant="outline">Adjust assumptions</Btn>
          </>
        }
      />

      <Card className="p-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent">Northwind Master + downline</Badge>
          <Badge>Next 12 months</Badge>
          <Badge>All products</Badge>
          <Badge>Base + override</Badge>
          <span className="ml-auto text-[11px] text-muted-foreground">
            Scope bar is always visible — the user can always answer &ldquo;what am I looking
            at&rdquo;
          </span>
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-4">
        <Stat
          label="Projected 12-month"
          value="$412,800"
          hint="Base + override, contingent excluded"
        />
        <Stat label="In-force component" value="$338,100" delta="82%" deltaTone="neutral" />
        <Stat label="Pending (weighted)" value="$74,700" hint="40% close rate applied" />
        <Stat label="Bonus accruals" value="$18,000" hint="Super bonus, at-risk" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-4">
          <Panel title="Projected commission by month" meta="One chart, one matching table">
            <Bars
              series={[31, 33, 34, 35, 34, 36, 37, 35, 34, 33, 34, 36]}
              compare={[28, 29, 30, 30, 31, 31, 32, 31, 30, 30, 31, 32]}
              labels={["S", "O", "N", "D", "J", "F", "M", "A", "M", "J", "J", "A"]}
            />
            <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-sm bg-primary" aria-hidden="true" /> Projected
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-sm bg-muted" aria-hidden="true" /> Prior 12 months
                actual
              </span>
            </div>
            <div className="mt-4">
              <Table
                columns={["Month", "In force", "Pending (weighted)", "Bonus", "Total"]}
                rows={[
                  ["Sep 2026", "$27,900", "$3,100", "—", "$31,000"],
                  ["Oct 2026", "$28,400", "$4,600", "—", "$33,000"],
                  ["Nov 2026", "$28,700", "$5,300", "—", "$34,000"],
                  ["Dec 2026", "$28,900", "$6,100", "$18,000", "$53,000"],
                ]}
              />
            </div>
          </Panel>

          <Panel
            title="Internal projection inside quote & cart"
            meta="Never rendered on a consumer surface"
          >
            <div className="rounded-[var(--radius)] border border-border bg-muted/40 px-3.5 py-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Internal only · commission.view
                  </p>
                  <p className="mt-0.5 text-sm font-medium">
                    Cart CT-9184 · 2 products · Marisol Herrera
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-xl font-semibold tabular-nums">$93.60</p>
                  <p className="text-[11px] text-muted-foreground">
                    first-year expected · base + override
                  </p>
                </div>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Same calculation engine as the portfolio view — one engine, two surfaces. For roles
                without commission.view this strip does not render at all.
              </p>
            </div>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel title="Assumptions" meta="On the page, because they change the number">
            <div className="space-y-3">
              <Field label="Persistence rate" value="92%" hint="Tenant default 90%" />
              <Field label="Close rate on pending" value="40%" />
              <Field label="Horizon" value="12 months" />
              <Check label="Include contingent categories" hint="Off by default" />
              <Check checked label="Include bonus accruals" />
            </div>
          </Panel>

          <Panel title="Basis">
            <Kv
              rows={[
                ["Schedule version", "CS-2026-DEN-AZ v2"],
                ["Split version", "v3 · pinned"],
                ["Run at", "25 Aug 2026 11:02"],
                ["Delta vs prior run", "+$6,200"],
              ]}
            />
            <Disclosure className="mt-4">
              Estimate only. Projection reads policies, submissions, schedules and splits and writes
              nothing except the run record kept for audit. Statement posting supersedes projection
              for closed periods, so the two never disagree for a posted month.
            </Disclosure>
          </Panel>
        </div>
      </div>
    </HfShell>
  );
}

/* ------------------------------------------------------------------- HF-26 */

export function AgencyStatementScreen() {
  return (
    <HfShell
      activeModule="MOD_COMMISSIONS"
      drawerTitle="Statement context"
      assistantContext="this statement"
      drawer={{
        Context: (
          <DrawerList
            heading="Statement"
            items={[
              "Northwind Master · period Jul 2026 · posted 5 Aug 2026.",
              "1,842 policy lines · 3 adjustments · 1 reversal.",
              "Period is locked and immutable.",
            ]}
          />
        ),
        Summary: (
          <DrawerList
            items={[
              "Gross earned $41,980 · allocated out $17,340 · net retained $24,640.",
              "Variance vs carrier-reported: $612 across 14 lines.",
            ]}
          />
        ),
        Audit: (
          <DrawerList
            items={[
              "Period posted — 5 Aug, system.",
              "Adjustment ADJ-114 — 9 Aug, finance, reason 'carrier retro rate'.",
              "Statement exported — 12 Aug, R. Osei (scope logged).",
            ]}
          />
        ),
      }}
    >
      <PageHead
        eyebrow="Commissions & Revenue · HF-26"
        title="Agency statement"
        sub="The posted statement for an entity and period: earned, adjustments, reversals, bonuses, allocations out to downline and partners, and reconciliation against carrier-reported amounts."
        actions={
          <>
            <Badge tone="neutral">Jul 2026 · posted</Badge>
            <Badge tone="warning">locked</Badge>
            <Btn variant="outline">Export</Btn>
            <Btn variant="outline">Share</Btn>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Stat label="Gross earned" value="$41,980" hint="Base + override + bonus" />
        <Stat
          label="Adjustments"
          value="− $1,120"
          deltaTone="danger"
          hint="3 adjustments, 1 reversal"
        />
        <Stat label="Allocated to downline & partners" value="$17,340" />
        <Stat label="Net retained" value="$24,640" delta="+4.1% vs Jun" deltaTone="success" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-4">
          <Panel
            title="Summary ledger"
            meta="Drill through to policy level — defensible line by line"
            actions={
              <Btn size="sm" variant="outline">
                Expand all
              </Btn>
            }
          >
            <Table
              columns={[
                "Component",
                "Basis",
                "Policies",
                "Amount",
                "Carrier reported",
                "Reconciliation",
              ]}
              rows={[
                [
                  "Base commission",
                  "PMPM $2.85 · CS-2026-DEN-AZ v2",
                  "1,842",
                  "$31,240",
                  "$31,240",
                  <Badge tone="success" dot>
                    Matched
                  </Badge>,
                ],
                [
                  "Override",
                  "$0.40 PMPM on downline production",
                  "1,104",
                  "$8,740",
                  "$8,128",
                  <Badge tone="warning" dot>
                    Variance $612
                  </Badge>,
                ],
                [
                  "Super bonus accrual",
                  "Annual · 1/12 recognised",
                  "—",
                  "$1,500",
                  "—",
                  <Badge tone="neutral">Not carrier-reported</Badge>,
                ],
                [
                  "Adjustments",
                  "3 items · retro rate",
                  "27",
                  "− $1,120",
                  "− $1,120",
                  <Badge tone="success" dot>
                    Matched
                  </Badge>,
                ],
                [
                  "Reversal",
                  "Cancelled inside 60 days",
                  "1",
                  "− $380",
                  "− $380",
                  <Badge tone="success" dot>
                    Matched
                  </Badge>,
                ],
              ]}
            />
            <p className="mt-3 text-[11px] text-muted-foreground">
              Every figure carries its basis: schedule version, split version and policy count.
            </p>
          </Panel>

          <Panel
            title="Policy-level detail"
            meta="Expanded from the override row — 14 variance lines"
          >
            <Table
              columns={["Policy", "Member months", "Expected", "Carrier", "Variance", "Status"]}
              rows={[
                [
                  "POL-44120",
                  "3",
                  "$1.20",
                  "$1.20",
                  "—",
                  <Badge tone="success" dot>
                    Matched
                  </Badge>,
                ],
                [
                  "POL-44188",
                  "4",
                  "$1.60",
                  "$0.00",
                  "$1.60",
                  <Badge tone="danger" dot>
                    Missing
                  </Badge>,
                ],
                [
                  "POL-44205",
                  "2",
                  "$0.80",
                  "$0.60",
                  "$0.20",
                  <Badge tone="warning" dot>
                    Variance
                  </Badge>,
                ],
                [
                  "POL-44311",
                  "6",
                  "$2.40",
                  "$2.40",
                  "—",
                  <Badge tone="success" dot>
                    Matched
                  </Badge>,
                ],
              ]}
            />
            <Btn className="mt-3" size="sm" variant="outline">
              Raise adjustment with reason
            </Btn>
          </Panel>

          <Panel title="Allocations out" meta="Gross earned and net retained shown together">
            <Table
              columns={["Recipient", "Role", "Basis", "Amount"]}
              rows={[
                ["Harbor Point", "Downline agency", "Split v3 · 45%", "$14,060"],
                ["D. Okafor", "Selling agent", "Agency share · 15%", "$2,056"],
                ["Bright Referral", "Referral partner", "Program RP-12", "$1,224"],
              ]}
            />
            <p className="mt-3 text-[11px] text-muted-foreground">
              One posting event produces both sides — these allocations are Harbor Point&apos;s own
              statement lines, so the two statements can never disagree.
            </p>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel title="Reconciliation">
            <div className="space-y-2.5">
              <Check
                checked
                label="Carrier statement ingested"
                hint="4 Aug · 1,828 rows normalised"
              />
              <Check label="All rows matched" hint="14 exceptions outstanding" />
              <Check checked label="Within tolerance threshold" hint="Tolerance ±$25 per line" />
            </div>
            <Btn className="mt-3" size="sm" variant="outline" full>
              Work 14 exceptions
            </Btn>
          </Panel>

          <Panel title="Period control">
            <Kv
              rows={[
                ["Period", "Jul 2026"],
                ["Posted", "5 Aug 2026"],
                ["State", "Locked"],
                ["Corrections", "Aug 2026 period"],
              ]}
            />
            <Alert tone="warning" title="Posted periods are immutable">
              Corrections appear as dated adjustments in a later period, never as a rewrite of a
              posted month. Adjustments require statement.adjust plus a reason code.
            </Alert>
          </Panel>

          <Panel title="Output">
            <div className="space-y-2">
              <Btn variant="outline" full>
                Download branded PDF
              </Btn>
              <Btn variant="outline" full>
                Export CSV
              </Btn>
              <Btn variant="outline" full>
                Share with recipient
              </Btn>
            </div>
            <Disclosure className="mt-3">
              A shared statement is watermarked with the recipient and applied scope. ABox produces
              statements and payment exports; it does not move money in Phase 1.
            </Disclosure>
          </Panel>
        </div>
      </div>
    </HfShell>
  );
}

/* ------------------------------------------------------------------- HF-27 */

export function AgentStatementScreen() {
  return (
    <HfShell
      activeModule="MOD_COMMISSIONS"
      drawerTitle="My statement"
      assistantContext="my commission statement"
      drawer={{
        Context: (
          <DrawerList
            heading="Statement"
            items={[
              "D. Okafor · period Jul 2026 · posted 5 Aug 2026.",
              "Scoped to my own production — no entity selector exists on this screen.",
              "Paid by Harbor Point.",
            ]}
          />
        ),
        "Help & FAQ": (
          <DrawerList
            items={[
              "Why is an amount pending? Each pending row names its own reason.",
              "How do I dispute a line? Open a dispute from the row; it becomes a tracked task.",
            ]}
          />
        ),
      }}
    >
      <PageHead
        eyebrow="Commissions & Revenue · HF-27"
        title="Agent statement"
        sub="What I earned this period, what changed since last month and what is still pending — written to be understood by one person about their own money."
        actions={
          <>
            <Badge tone="neutral">Jul 2026</Badge>
            <Btn variant="outline">Download PDF</Btn>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Paid this period" value="$2,056" hint="Posted 5 Aug · Harbor Point" />
        <Stat label="Pending" value="$318" hint="4 lines — reasons below" />
        <Stat label="Year to date" value="$14,902" delta="+11% vs last year" deltaTone="success" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-4">
          <Panel
            title="Why this differs from June"
            meta="Answered on the page, not left as a diff exercise"
          >
            <Table
              columns={["Change", "Detail", "Effect"]}
              rows={[
                ["New policies", "6 dental, 2 vision", "+$284"],
                ["Cancellations", "1 policy cancelled in 41 days", "− $38"],
                ["Adjustment", "Carrier retro rate applied to 3 policies", "− $22"],
                ["Own referral reward", "Program RP-12 · 2 qualifying", "+$90"],
                [
                  <span className="font-semibold">Net change</span>,
                  "—",
                  <span className="font-semibold text-success">+$314</span>,
                ],
              ]}
            />
          </Panel>

          <Panel title="My policies" meta="One table, my own lines only">
            <Table
              columns={["Policy", "Member", "Product", "Basis", "Amount", "State"]}
              rows={[
                [
                  "POL-44120",
                  "M. Herrera",
                  "Cascade Dental 1500",
                  "PMPM × 3",
                  "$1.20",
                  <Badge tone="success" dot>
                    Paid
                  </Badge>,
                ],
                [
                  "POL-44188",
                  "T. Nakamura",
                  "Cascade Dental 1500",
                  "PMPM × 4",
                  "$1.60",
                  <Badge tone="warning" dot>
                    Pending
                  </Badge>,
                ],
                [
                  "POL-44205",
                  "J. Alvarez",
                  "Vision Clear",
                  "PMPM × 2",
                  "$0.80",
                  <Badge tone="warning" dot>
                    Pending
                  </Badge>,
                ],
                [
                  "POL-44311",
                  "S. Whitfield",
                  "Cascade Dental 1500",
                  "PMPM × 6",
                  "$2.40",
                  <Badge tone="success" dot>
                    Paid
                  </Badge>,
                ],
              ]}
            />
          </Panel>

          <Panel
            title="Pending — and why"
            meta="The single largest driver of commission support tickets"
          >
            <Table
              columns={["Policy", "Amount", "Reason", "Action"]}
              rows={[
                [
                  "POL-44188",
                  "$1.60",
                  "Carrier has not yet reported this policy",
                  <Btn size="sm" variant="outline">
                    Raise dispute
                  </Btn>,
                ],
                [
                  "POL-44205",
                  "$0.80",
                  "First premium not yet received",
                  <Btn size="sm" variant="outline">
                    Raise dispute
                  </Btn>,
                ],
                [
                  "POL-44402",
                  "$2.10",
                  "Awaiting selling-agent attribution confirmation",
                  <Btn size="sm" variant="outline">
                    Raise dispute
                  </Btn>,
                ],
              ]}
            />
            <p className="mt-3 text-[11px] text-muted-foreground">
              A dispute opens a task against the statement line with its context attached, routed to
              the agency work queue — not an untracked message.
            </p>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel title="What I can see">
            <div className="space-y-2.5">
              <Check checked label="My base commission" />
              <Check checked label="My own bonus and referral reward" />
              <Check label="Agency margin" hint="Absent from the data, not masked" />
              <Check label="Upline override" hint="Absent from the data, not masked" />
              <Check label="Another agent's rate" hint="Never available on any surface" />
            </div>
            <Disclosure className="mt-4">
              This statement is complete about my own line and silent about everything else. A
              manager viewing it does so through the agency statement drill-through, which is
              audited as a sensitive read.
            </Disclosure>
          </Panel>

          <Panel title="Delivery">
            <Kv
              rows={[
                ["Channel", "In-app + emailed PDF"],
                ["Branding", "Harbor Point"],
                ["Template", "Statement · agent v2"],
                ["Notified", "5 Aug 2026 07:00"],
              ]}
            />
            <p className="mt-3 text-[11px] text-muted-foreground">
              Historical statements stay immutable and viewable even after an appointment or licence
              lapses.
            </p>
          </Panel>
        </div>
      </div>
    </HfShell>
  );
}

/* ------------------------------------------------------------------- HF-28 */

export function NotificationSchedulerScreen() {
  return (
    <HfShell
      activeModule="MOD_COMMUNICATIONS"
      drawerTitle="Program context"
      assistantContext="this communication program"
      drawer={{
        Context: (
          <DrawerList
            heading="Programs"
            items={[
              "9 active programs · 2 paused · 1 draft.",
              "Scope: Northwind Master + downline contacts only.",
              "Quiet hours 21:00–08:00 local · cap 4 messages / contact / week.",
            ]}
          />
        ),
        Summary: (
          <DrawerList
            items={[
              "Next 7 days: 1,284 scheduled sends, 212 suppressed by consent.",
              "SMS enabled for this tenant with captured consent required.",
            ]}
          />
        ),
        "Next actions": (
          <DrawerList
            items={[
              "Dry-run the abandoned-cart program",
              "Review 212 suppressions",
              "Activate draft",
            ]}
          />
        ),
      }}
    >
      <PageHead
        eyebrow="Notifications & Scheduling · HF-28"
        title="Notification scheduler"
        sub="Where a message becomes a program: event and time triggers, delays, recurrence, channels, branded templates, consent enforcement and the resulting communication timeline."
        actions={
          <>
            <Btn variant="outline">Send manual message</Btn>
            <Btn>New program</Btn>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Stat label="Active programs" value="9" hint="2 paused, 1 draft" />
        <Stat label="Scheduled next 7 days" value="1,284" hint="Across email, SMS, in-app" />
        <Stat label="Suppressed by consent" value="212" delta="14%" deltaTone="neutral" />
        <Stat label="Delivery failures 30d" value="18" hint="Auto-suppressed after 3" />
      </div>

      <Panel
        title="Programs"
        meta="What will go out this week, answerable in one glance"
        actions={
          <Btn size="sm" variant="outline">
            Filter
          </Btn>
        }
      >
        <Table
          columns={["Program", "Trigger", "Channel", "Audience", "Schedule", "State"]}
          rows={[
            [
              "Shared quote delivered",
              "Event · quote shared",
              "Email + SMS",
              "Quote recipient",
              "Immediate",
              <Badge tone="success" dot>
                Active
              </Badge>,
            ],
            [
              "Application saved — resume nudge",
              "Event · submission saved",
              "Email",
              "Applicant",
              "+24h, then +72h",
              <Badge tone="success" dot>
                Active
              </Badge>,
            ],
            [
              "Submission status changed",
              "Event · status change",
              "In-app + email",
              "Agent + applicant",
              "Immediate",
              <Badge tone="success" dot>
                Active
              </Badge>,
            ],
            [
              "Open enrollment reminder",
              "Time · 15 Oct 06:00",
              "Email",
              "Members without 2027 election",
              "Recurring annual",
              <Badge tone="warning" dot>
                Scheduled
              </Badge>,
            ],
            [
              "Statement posted",
              "Event · statement posted",
              "Email",
              "Agents, agency admins",
              "Immediate",
              <Badge tone="success" dot>
                Active
              </Badge>,
            ],
            [
              "Appointment expiring",
              "Time · 60 days before expiry",
              "In-app + email",
              "Agency admin, compliance",
              "Recurring daily check",
              <Badge tone="neutral">Paused</Badge>,
            ],
          ]}
        />
      </Panel>

      <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-4">
          <Panel
            title="Trigger builder"
            meta="Configuration that reads as prose gets reviewed properly"
          >
            <div className="flex flex-wrap items-center gap-2 rounded-[var(--radius)] border border-border bg-muted/30 px-3.5 py-3">
              <RuleToken label="when" value="Submission saved & incomplete" tone="accent" />
              <RuleToken label="wait" value="24 hours" />
              <RuleToken label="if" value="Still incomplete and consent held" />
              <RuleToken label="send" value="Resume your application v3" tone="accent" />
              <RuleToken label="via" value="Email, then SMS at +72h" />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field
                label="Audience"
                value="Applicants in my subtree"
                hint="Cannot express another agency's contacts"
              />
              <Field label="Recurrence" value="Two-step sequence, then stop" />
              <Field
                label="Quiet hours"
                value="21:00 – 08:00 local"
                hint="Tenant guardrail, shown inline"
              />
              <Field
                label="Frequency cap"
                value="4 / contact / week"
                hint="Tenant guardrail, shown inline"
              />
            </div>
          </Panel>

          <Panel title="Dry run" meta="Resolves a real recipient's merge fields before activation">
            <div className="grid gap-3 md:grid-cols-2">
              <Card className="p-3.5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Email · branded
                </p>
                <p className="mt-2 text-sm font-medium">Your Northwind application is waiting</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Hi Marisol — your Cascade Dental Preferred 1500 application is saved and takes
                  about four minutes to finish. Resume where you left off.
                </p>
                <Btn className="mt-3" size="sm">
                  Resume application
                </Btn>
              </Card>
              <Card className="p-3.5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  SMS · +72h
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Northwind: your dental application is still saved. Finish here: nwbn.co/r/8f2k.
                  Reply STOP to opt out.
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <Badge tone="warning">consent required</Badge>
                  <Badge>opt-out honoured</Badge>
                </div>
              </Card>
            </div>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel
            title="Consent & suppression"
            meta="A program never silently drops half its audience"
          >
            <Table
              columns={["Reason", "Contacts"]}
              rows={[
                ["No marketing consent", "148"],
                ["SMS consent absent", "51"],
                ["Frequency cap reached", "9"],
                ["Hard bounce / opt-out", "4"],
              ]}
            />
            <Btn className="mt-3" size="sm" variant="outline" full>
              Review suppression list
            </Btn>
          </Panel>

          <Panel title="Communication timeline" meta="Written onto the related object">
            <Timeline
              entries={[
                {
                  kind: "system",
                  title: "Resume nudge sent",
                  body: "Email · template v3 · delivered.",
                  meta: "24 Aug 09:00",
                },
                {
                  kind: "human",
                  title: "Manual message sent",
                  body: "Agent follow-up on dental application.",
                  meta: "23 Aug 16:12",
                  actor: "D. Okafor",
                },
                {
                  kind: "status",
                  title: "Task created",
                  body: "Call applicant — auto-created from second nudge with no response.",
                  meta: "26 Aug 09:00",
                },
              ]}
            />
          </Panel>
        </div>
      </div>

      <Disclosure>
        Shared-quote notifications in Module 1 are produced by programs configured here. The Module
        1 screens are unchanged — this is the configuration seam, not new Module 1 behaviour.
      </Disclosure>
    </HfShell>
  );
}

/* ------------------------------------------------------------------- HF-29 */

export function BrandingSettingsScreen() {
  return (
    <HfShell
      activeModule="MOD_ADMIN_CONFIG"
      drawerTitle="Brand context"
      assistantContext="brand and white-label settings"
      drawer={{
        Context: (
          <DrawerList
            heading="Editing"
            items={[
              "Northwind Benefits · brand token set v6 (draft).",
              "Domain northwind.abox.market · verified.",
              "Applies to marketplace, shared quote, member workspace, documents, email.",
            ]}
          />
        ),
        Guidance: (
          <DrawerList
            items={[
              "Brand is tokens, never per-screen overrides — layout stays identical across tenants.",
              "Semantic status tokens are platform-locked so status stays legible everywhere.",
            ]}
          />
        ),
        Audit: (
          <DrawerList
            items={[
              "v5 published — 2 Jul, R. Osei (token diff attached).",
              "Domain verified — 28 Jun, platform.",
            ]}
          />
        ),
      }}
    >
      <PageHead
        eyebrow="Admin & Configuration · HF-29"
        title="Branding & white labeling settings"
        sub="Turn a tenant into a branded marketplace: tokens, domain, label dictionary, document and email branding — with live preview of the real surfaces and contrast validated at save."
        actions={
          <>
            <Badge tone="warning">draft v6</Badge>
            <Btn variant="outline">Revert to v5</Btn>
            <Btn>Publish brand</Btn>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        {/* ---------------------------------------------------------- editor */}
        <div className="space-y-4">
          <Panel title="Identity">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Marketplace name" value="Northwind Benefits" />
              <Field
                label="Domain"
                value="northwind.abox.market"
                hint="Platform action · verified"
                suffix={<Badge tone="success">verified</Badge>}
              />
              <Field label="Logo" value="northwind-mark.svg" hint="Min 240×64, SVG or PNG" />
              <Field label="Favicon" value="northwind-icon.png" />
            </div>
          </Panel>

          <Panel title="Brand tokens" meta="Tokens, not per-screen overrides">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="Primary"
                value="oklch(0.42 0.11 254)"
                suffix={<span className="size-4 rounded bg-primary" aria-hidden="true" />}
              />
              <Field label="Ring / focus" value="oklch(0.55 0.11 254)" />
              <Field label="Accent surface" value="oklch(0.955 0.02 254)" />
              <Field label="Radius" value="0.625rem" />
              <Field label="Heading scale" value="1.25 · Sora" />
              <Field label="Body scale" value="1.0 · Manrope" />
            </div>
            <div className="mt-4">
              <Alert tone="danger" title="Contrast check failed for one token">
                Primary on white measures 4.1:1 and fails AA for body text. Suggested corrected
                value <span className="font-medium">oklch(0.40 0.11 254)</span> passes at 4.8:1. A
                tenant cannot publish an inaccessible marketplace.
              </Alert>
            </div>
            <div className="mt-3 space-y-2.5">
              <Check
                label="Destructive / warning / success / AI tokens"
                hint="Platform-locked — absent from the agency editor"
              />
              <Check
                checked
                label="Layout, spacing and components"
                hint="Platform-owned, not tenant-configurable in Phase 1"
              />
            </div>
          </Panel>

          <Panel
            title="Label dictionary"
            meta="Renaming is white labeling too — same screen as colour"
          >
            <Table
              columns={["Platform term", "Tenant label", "Applies to"]}
              rows={[
                ["Agency", "Firm", "Shell, objects, documents"],
                ["Agent", "Advisor", "Shell, statements, email"],
                ["Lead", "Prospect", "Object page, timeline, reports"],
                ["Marketplace", "Benefits Store", "Consumer surfaces only"],
              ]}
            />
            <p className="mt-3 text-[11px] text-muted-foreground">
              No label is hardcoded in a screen — the shell, drawer, help content and outputs all
              read this dictionary.
            </p>
          </Panel>
        </div>

        {/* --------------------------------------------------------- preview */}
        <div className="space-y-4">
          <Panel title="Consumer surface preview" meta="The marketplace, not a swatch grid">
            <div className="overflow-hidden rounded-[var(--radius)] border border-border">
              <div className="flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="grid size-7 place-items-center rounded bg-primary text-[11px] font-semibold text-primary-foreground">
                    NW
                  </span>
                  <span className="text-sm font-semibold">Northwind Benefits</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span>Plans</span>
                  <span>Help</span>
                  <Btn size="sm">Get a quote</Btn>
                </div>
              </div>
              <div className="bg-primary/[0.05] px-4 py-6">
                <p className="font-display text-lg font-semibold tracking-tight">
                  Coverage that fits your household
                </p>
                <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-muted-foreground">
                  Compare plans from local carriers in a few minutes. No account needed to see
                  prices.
                </p>
                <div className="mt-3 flex gap-2">
                  <Btn size="sm">Start</Btn>
                  <Btn size="sm" variant="outline">
                    Browse plans
                  </Btn>
                </div>
              </div>
            </div>
          </Panel>

          <div className="grid gap-4 md:grid-cols-2">
            <Panel title="Document branding" meta="The brand must survive a PDF">
              <Card className="p-3.5">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="text-xs font-semibold">Northwind Benefits</span>
                  <span className="text-[10px] text-muted-foreground">Quote packet</span>
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  Prepared for Marisol Herrera · 25 Aug 2026
                </p>
                <div className="mt-2 h-1.5 w-2/3 rounded bg-primary/70" aria-hidden="true" />
                <div className="mt-1.5 h-1.5 w-1/2 rounded bg-muted" aria-hidden="true" />
                <p className="mt-3 text-[10px] leading-relaxed text-muted-foreground">
                  Estimates only. Final eligibility and premium are determined at enrollment.
                </p>
              </Card>
            </Panel>

            <Panel title="Email branding" meta="And an email client">
              <Card className="p-3.5">
                <div className="flex items-center gap-2">
                  <span className="grid size-5 place-items-center rounded bg-primary text-[9px] font-semibold text-primary-foreground">
                    NW
                  </span>
                  <span className="text-xs font-semibold">Northwind Benefits</span>
                </div>
                <p className="mt-2 text-xs font-medium">Your quote is ready</p>
                <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                  Four plans matched your household. The link stays live for 30 days.
                </p>
                <Btn className="mt-2" size="sm">
                  View quote
                </Btn>
              </Card>
            </Panel>
          </div>

          <Panel title="Applied surfaces">
            <div className="grid gap-2.5 sm:grid-cols-2">
              <Check checked label="Consumer marketplace" />
              <Check checked label="Shared quote view" />
              <Check checked label="Member workspace" />
              <Check checked label="Generated documents" />
              <Check checked label="Email and SMS templates" />
              <Check
                label="Internal shell"
                hint="Neutral by design — internal chrome stays platform-branded"
              />
            </div>
            <Disclosure className="mt-4">
              Publishing is effective immediately for web surfaces and from the next generation for
              documents already issued. Every publish is audited with a before/after token diff and
              is revertible.
            </Disclosure>
          </Panel>
        </div>
      </div>
    </HfShell>
  );
}

/* ------------------------------------------------------------------- HF-30 */

function MatrixCell({ state }: { state: "yes" | "no" | "locked" }) {
  if (state === "locked") {
    return (
      <span
        className="inline-flex items-center gap-1 text-[11px] text-muted-foreground"
        title="Cannot be granted by your role"
      >
        <span className="size-3 rounded-sm border border-border bg-muted" aria-hidden="true" />{" "}
        locked
      </span>
    );
  }
  return (
    <span
      className={cn(
        "grid size-4 place-items-center rounded border text-[9px]",
        state === "yes"
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background",
      )}
      aria-label={state === "yes" ? "granted" : "not granted"}
    >
      {state === "yes" ? "✓" : ""}
    </span>
  );
}

export function AclConfigScreen() {
  return (
    <HfShell
      activeModule="MOD_ADMIN_CONFIG"
      drawerTitle="ACL context"
      assistantContext="access control configuration"
      drawer={{
        Context: (
          <DrawerList
            heading="Editing"
            items={[
              "Role template 'Agency manager' · WS_AGENCY.",
              "Platform guardrail template v4 · local overrides permitted.",
              "Affects 34 users across 3 entities.",
            ]}
          />
        ),
        Guidance: (
          <DrawerList
            items={[
              "Permission by absence: an unpermitted module or action is not rendered at all.",
              "Data visibility is configured separately from permission — conflating them is the classic leak.",
            ]}
          />
        ),
        Audit: (
          <DrawerList
            items={["Template v4 published — 12 Aug, platform security, 34 users affected."]}
          />
        ),
      }}
    >
      <PageHead
        eyebrow="Admin & Configuration · HF-30"
        title="ACL configuration"
        sub="Role templates, permission grants, data-visibility scope, module visibility and sensitive-field rules — with a resolution tester that proves what a specific user can actually see."
        actions={
          <>
            <Badge tone="accent">Agency manager</Badge>
            <Btn variant="outline">Duplicate template</Btn>
            <Btn>Publish template</Btn>
          </>
        }
      />

      <Alert tone="warning" title="Platform guardrails — the ceiling you are working under">
        Local overrides may narrow this template but never widen it. Cells locked by the platform
        template are not editable and say why, rather than being greyed with no explanation.
      </Alert>

      <div className="grid gap-4 lg:grid-cols-[1fr_21rem]">
        <div className="space-y-4">
          <Panel
            title="Permission matrix"
            meta="Grouped by module · read as a grid, not a checkbox list"
          >
            <Table
              columns={["Module", "View", "Create", "Edit", "Approve", "Export"]}
              rows={[
                [
                  "My Work",
                  <MatrixCell state="yes" />,
                  <MatrixCell state="yes" />,
                  <MatrixCell state="yes" />,
                  <MatrixCell state="no" />,
                  <MatrixCell state="no" />,
                ],
                [
                  "Customers & Leads",
                  <MatrixCell state="yes" />,
                  <MatrixCell state="yes" />,
                  <MatrixCell state="yes" />,
                  <MatrixCell state="no" />,
                  <MatrixCell state="yes" />,
                ],
                [
                  "Forms & Enrollment",
                  <MatrixCell state="yes" />,
                  <MatrixCell state="yes" />,
                  <MatrixCell state="yes" />,
                  <MatrixCell state="yes" />,
                  <MatrixCell state="no" />,
                ],
                [
                  "Products, Plans & Rates",
                  <MatrixCell state="yes" />,
                  <MatrixCell state="locked" />,
                  <MatrixCell state="locked" />,
                  <MatrixCell state="locked" />,
                  <MatrixCell state="no" />,
                ],
                [
                  "Commissions & Revenue",
                  <MatrixCell state="yes" />,
                  <MatrixCell state="no" />,
                  <MatrixCell state="no" />,
                  <MatrixCell state="no" />,
                  <MatrixCell state="yes" />,
                ],
                [
                  "Agency & Entity",
                  <MatrixCell state="yes" />,
                  <MatrixCell state="no" />,
                  <MatrixCell state="no" />,
                  <MatrixCell state="no" />,
                  <MatrixCell state="no" />,
                ],
                [
                  "Admin & Configuration",
                  <MatrixCell state="no" />,
                  <MatrixCell state="locked" />,
                  <MatrixCell state="locked" />,
                  <MatrixCell state="locked" />,
                  <MatrixCell state="no" />,
                ],
              ]}
            />
            <p className="mt-3 text-[11px] text-muted-foreground">
              A role can never grant a permission it does not itself hold. Removing view removes the
              module from the nav entirely.
            </p>
          </Panel>

          <div className="grid gap-4 md:grid-cols-2">
            <Panel title="Data visibility" meta="Configured separately from permission">
              <div className="space-y-3">
                <Choice label="Own records only" hint="Assigned leads, quotes and submissions" />
                <Choice label="Own entity" hint="Everything inside this agency" selected />
                <Choice label="Entity + downline" hint="Requires hierarchy visibility" />
                <Choice label="Global" hint="Platform roles only · banded and logged" />
              </div>
            </Panel>

            <Panel title="Sensitive-field rules" meta="'Absent' is a real option">
              <Table
                columns={["Field class", "Behaviour"]}
                rows={[
                  ["SSN / TIN", <Badge tone="danger">absent</Badge>],
                  ["Date of birth", <Badge tone="warning">revealable, audited</Badge>],
                  ["Income (subsidy estimate)", <Badge tone="warning">revealable, audited</Badge>],
                  ["Bank / payment token", <Badge tone="danger">absent</Badge>],
                  ["Commission rate (others)", <Badge tone="danger">absent</Badge>],
                ]}
              />
            </Panel>
          </div>

          <Panel title="Module & menu visibility">
            <div className="grid gap-2.5 sm:grid-cols-2">
              <Check checked label="Marketplace & Sales" />
              <Check checked label="Forms & Enrollment" />
              <Check
                checked
                label="Commissions & Revenue"
                hint="View only — projection and own statements"
              />
              <Check label="Admin & Configuration" hint="Absent from the nav for this template" />
              <Check checked label="Documents & Outputs" />
              <Check
                label="Feature flag: ICHRA quoting"
                hint="Flag removes the module without a release"
              />
            </div>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel title="Resolution tester" meta="The most important feature on this screen">
            <div className="space-y-3">
              <Field label="User" value="D. Okafor" />
              <Field label="Entity" value="Harbor Point" />
              <Field label="Object" value="Statement · Northwind Master · Jul 2026" />
              <Btn full>Resolve</Btn>
            </div>
            <div className="mt-4 space-y-3">
              <Alert tone="danger" title="Not visible">
                Denied by data-visibility scope &ldquo;own entity&rdquo; — the statement belongs to
                a parent entity. Rule: <span className="font-medium">GUARD-DV-04</span>.
              </Alert>
              <Alert tone="success" title="Visible: own agent statement Jul 2026">
                Granted by template &ldquo;Agency manager&rdquo; → commission.view, scoped by
                <span className="font-medium"> GUARD-DV-02</span> to own production.
              </Alert>
            </div>
          </Panel>

          <Panel title="Change control">
            <div className="space-y-2.5">
              <Check checked label="Reason recorded" />
              <Check label="Second approver" hint="Required above sensitivity threshold 3" />
              <Check checked label="Affected user count computed" hint="34 users" />
            </div>
            <Disclosure className="mt-4">
              Publishing re-resolves sessions on the next request. In-flight approvals keep the rule
              version they were raised under. Denied access attempts are written to the audit log
              and surfaced as a security report, not only as a UI message.
            </Disclosure>
          </Panel>
        </div>
      </div>
    </HfShell>
  );
}

/* ------------------------------------------------------------------- HF-31 */

export function AuditLogScreen() {
  return (
    <HfShell
      activeModule="MOD_ADMIN_CONFIG"
      drawerTitle="Audit context"
      assistantContext="the audit log"
      drawer={{
        Context: (
          <DrawerList
            heading="Filters applied"
            items={[
              "Entity: Northwind Master + downline.",
              "Window: last 30 days · all actor types.",
              "Classes: all, sensitive highlighted.",
            ]}
          />
        ),
        Summary: (
          <DrawerList
            items={[
              "12,481 entries · 34 sensitive reveals · 6 exports · 2 impersonation sessions.",
              "Retention 7 years (tenant policy, above platform minimum).",
            ]}
          />
        ),
        Audit: (
          <DrawerList items={["This view is the same store the per-screen Audit section reads."]} />
        ),
      }}
    >
      <PageHead
        eyebrow="Admin & Configuration · HF-31"
        title="Audit log"
        sub="Who did what, to which object, in which entity and workspace, with before and after — human actions, system events, AI interactions, configuration changes, sensitive reveals and exports."
        actions={
          <>
            <Btn variant="outline">Save this view</Btn>
            <Btn variant="outline">Export (audited)</Btn>
          </>
        }
      />

      <Panel title="Filters" meta="Filter-first — an audit log is a question-answering tool">
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <Field label="Actor" placeholder="Any person, system, AI or integration" />
          <Field label="Object" placeholder="Policy, submission, product, template…" />
          <Field label="Event class" value="All classes" />
          <Field label="Entity" value="Northwind Master + downline" />
          <Field label="Window" value="Last 30 days" />
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {[
            "Sensitive reveals (34)",
            "Exports (6)",
            "Impersonation (2)",
            "Config changes (58)",
            "AI interactions (412)",
          ].map((t) => (
            <Badge
              key={t}
              tone={
                t.startsWith("Sensitive") || t.startsWith("Impersonation") ? "warning" : "neutral"
              }
            >
              {t}
            </Badge>
          ))}
        </div>
      </Panel>

      <Panel
        title="Entries"
        meta="Rows expand in place to a diff — never navigate away from a list you are working"
      >
        <Table
          columns={["When", "Actor", "Action", "Object", "Entity", "Class"]}
          rows={[
            [
              "25 Aug 11:07",
              <span className="flex items-center gap-1.5">
                <Badge tone="accent">Person</Badge> A. Rivera
              </span>,
              "Revealed SSN",
              "Submission SUB-8841",
              "Northwind Master",
              <Badge tone="warning" dot>
                Sensitive read
              </Badge>,
            ],
            [
              "25 Aug 11:04",
              <span className="flex items-center gap-1.5">
                <Badge>System</Badge> Form resolver
              </span>,
              "Resolved form set CASC-DEN-IND-2026 v3",
              "Submission SUB-8841",
              "Northwind Master",
              <Badge>Event</Badge>,
            ],
            [
              "25 Aug 10:52",
              <span className="flex items-center gap-1.5">
                <Badge tone="ai">AI</Badge> Plan-O ranking
              </span>,
              "Produced recommendation with 4 grounded records",
              "Quote Q-31204",
              "Harbor Point",
              <Badge tone="ai">AI interaction</Badge>,
            ],
            [
              "24 Aug 16:31",
              <span className="flex items-center gap-1.5">
                <Badge tone="accent">Person</Badge> R. Osei
              </span>,
              "Published split arrangement v4",
              "Paper · Cascade Care",
              "Northwind Master",
              <Badge tone="warning" dot>
                Config change
              </Badge>,
            ],
            [
              "24 Aug 09:12",
              <span className="flex items-center gap-1.5">
                <Badge tone="accent">Person</Badge> Support (impersonating D. Okafor)
              </span>,
              "Viewed agent statement Jul 2026",
              "Statement ST-7742",
              "Harbor Point",
              <Badge tone="danger" dot>
                Impersonation
              </Badge>,
            ],
            [
              "22 Aug 08:40",
              <span className="flex items-center gap-1.5">
                <Badge>Integration</Badge> Carrier statement feed
              </span>,
              "Ingested 1,828 rows · 14 unmatched",
              "Statement ST-7701",
              "Northwind Master",
              <Badge>Event</Badge>,
            ],
          ]}
        />
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Expanded entry" meta="Split arrangement v4 · 24 Aug 16:31 · R. Osei">
          <Table
            columns={["Field", "Before", "After"]}
            rows={[
              ["Paper owner share", "40%", "35%"],
              ["Selling agency share", "45%", "45%"],
              ["Selling agent share", "15%", "15%"],
              ["Referral partner share", "—", "5%"],
              ["Effective from", "1 Jan 2026", "1 Sep 2026"],
            ]}
          />
          <p className="mt-3 text-[11px] text-muted-foreground">
            Field values inside a diff respect sensitive-field rules — a masked field stays masked
            here.
          </p>
        </Panel>

        <Panel title="Immutability & retention">
          <div className="space-y-2.5">
            <Check
              checked
              label="Append-only store"
              hint="No role can edit or delete an entry — the UI offers no such action"
            />
            <Check
              checked
              label="Retention 7 years"
              hint="Within platform minimum; shortening it is itself an audited change"
            />
            <Check
              checked
              label="Export writes its own audit entry"
              hint="Including the applied filters"
            />
            <Check checked label="High-risk classes can alert and create compliance tasks" />
          </div>
          <Alert tone="accent" title="One store, many views">
            The Audit section in the right drawer of every screen is a filtered view of this same
            log. There is no separate shadow log for support or security.
          </Alert>
          <Disclosure className="mt-3">
            AI interaction logging from the governance module lands here with the model surface, the
            prompt context reference and the records the answer was grounded in.
          </Disclosure>
        </Panel>
      </div>
    </HfShell>
  );
}

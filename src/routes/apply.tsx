/**
 * SCR_OFFEX_APPLICATION — Lucie WS-04 off-exchange application runtime.
 *
 * Fixed versioned application, typed consent, e-signature and pathway
 * output (PDF packet or EDI transaction). State separation is enforced
 * in the UI: readiness, signature, output generation and external
 * outcome are shown as distinct states and never collapsed.
 */
import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, FileText, Send, ShieldCheck } from "lucide-react";
import { MarketplaceShell } from "@/components/abox/marketplace-shell";
import { PageHeader } from "@/components/abox/page-header";
import { EmptyState } from "@/components/abox/empty-state";
import { StatusBadge } from "@/components/abox/status-badge";
import { useCart, PRODUCT_LABEL } from "@/lib/cart-store";
import { loadQuoteState } from "@/lib/quote-store";
import { resolvePathway, READINESS_LABEL, type ReadinessKey } from "@/lib/lucie-release";
import { SCREENS } from "@/lib/screens";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/apply")({
  head: () => ({
    meta: [
      { title: "Off-Exchange Application — ABox" },
      { name: "description", content: SCREENS.SCR_OFFEX_APPLICATION.purpose },
      { property: "og:title", content: "Off-Exchange Application — ABox" },
      { property: "og:description", content: SCREENS.SCR_OFFEX_APPLICATION.purpose },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

const STEPS = ["Applicant", "Household", "Coverage", "Consent & signature", "Submission"] as const;

interface Applicant {
  firstName: string; lastName: string; dob: string; email: string; phone: string;
  address: string; city: string; state: string; zip: string;
  householdSize: string; income: string; tobacco: string;
  consent: boolean; disclosures: boolean; signature: string;
}

const EMPTY: Applicant = {
  firstName: "", lastName: "", dob: "", email: "", phone: "",
  address: "", city: "", state: "", zip: "",
  householdSize: "", income: "", tobacco: "no",
  consent: false, disclosures: false, signature: "",
};

function Page() {
  const cart = useCart();
  const quote = typeof window === "undefined" ? null : loadQuoteState();
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Applicant>(() => ({ ...EMPTY, zip: "" }));
  const [generated, setGenerated] = useState<{ ref: string; at: string } | null>(null);

  const set = <K extends keyof Applicant>(k: K, v: Applicant[K]) => setA((p) => ({ ...p, [k]: v }));

  /** Only off-exchange, application-enabled items belong in this runtime. */
  const items = cart.items
    .map((i) => ({ item: i, pathway: resolvePathway({ productType: i.productType, carrier: i.carrier, onExchange: i.meta?.onExchange !== false }) }))
    .filter((r) => r.pathway.output !== "handoff");

  const applicable = items.filter((r) => r.pathway.collectsApplication);
  const quoteOnly = items.filter((r) => !r.pathway.collectsApplication);
  const pathway = applicable[0]?.pathway;

  const readiness: Record<ReadinessKey, boolean> = useMemo(() => ({
    applicant: !!(a.firstName && a.lastName && a.dob && a.email),
    household: !!(a.householdSize && a.address && a.city && a.state && a.zip),
    coverage: applicable.length > 0 && applicable.every((r) => !!r.item.effectiveDate),
    consent: a.consent && a.disclosures,
    signature: a.signature.trim().length >= 3,
  }), [a, applicable]);

  const ready = (Object.keys(readiness) as ReadinessKey[]).every((k) => readiness[k]);

  function generate() {
    if (!ready || !pathway) return;
    const prefix = pathway.output === "edi" ? "EDI" : "PDF";
    setGenerated({ ref: `${prefix}-${Date.now().toString(36).toUpperCase()}`, at: new Date().toISOString() });
    setStep(4);
  }

  if (items.length === 0) {
    return (
      <MarketplaceShell showAssistant={false}>
        <div className="mx-auto max-w-4xl px-4 py-10 md:px-8 md:py-14">
          <PageHeader scrId="SCR_OFFEX_APPLICATION" eyebrow="Off-exchange" title="No off-exchange coverage to apply for"
            description="Off-exchange health, dental and vision plans in your cart continue through a licensed application here." />
          <EmptyState title="Nothing to apply for" body="On-exchange plans finish through the exchange handoff instead."
            action={<Link to="/plans" className="mt-2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground">Browse plans</Link>} />
        </div>
      </MarketplaceShell>
    );
  }

  return (
    <MarketplaceShell showAssistant={false}>
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
        <PageHeader
          scrId="SCR_OFFEX_APPLICATION" eyebrow="Off-exchange application"
          title="Complete your carrier application"
          description="This is a fixed, versioned carrier application. Your answers are used to produce the carrier submission packet for the plans in your cart."
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-5">
            <ol className="flex flex-wrap gap-1.5 rounded-full bg-surface p-1 text-xs">
              {STEPS.map((label, i) => (
                <li key={label}>
                  <button
                    onClick={() => setStep(i)} aria-current={step === i ? "step" : undefined}
                    className={cn("rounded-full px-3 py-1.5",
                      step === i ? "bg-primary font-medium text-primary-foreground"
                        : i < step ? "text-sage" : "text-muted-foreground")}
                  >
                    {i + 1}. {label}
                  </button>
                </li>
              ))}
            </ol>

            <div className="rounded-2xl border border-border bg-card p-6">
              {step === 0 && (
                <Grid>
                  <Field label="Legal first name" required value={a.firstName} onChange={(v) => set("firstName", v)} />
                  <Field label="Legal last name" required value={a.lastName} onChange={(v) => set("lastName", v)} />
                  <Field label="Date of birth" type="date" required value={a.dob} onChange={(v) => set("dob", v)} />
                  <Field label="Email" type="email" required value={a.email} onChange={(v) => set("email", v)} />
                  <Field label="Mobile" type="tel" value={a.phone} onChange={(v) => set("phone", v)} />
                </Grid>
              )}

              {step === 1 && (
                <Grid>
                  <Field label="Street address" required value={a.address} onChange={(v) => set("address", v)} className="sm:col-span-2" />
                  <Field label="City" required value={a.city} onChange={(v) => set("city", v)} />
                  <Field label="State" required value={a.state} onChange={(v) => set("state", v)} />
                  <Field label="ZIP" required value={a.zip || quote?.zip || ""} onChange={(v) => set("zip", v)} />
                  <Field label="Household size" type="number" required value={a.householdSize} onChange={(v) => set("householdSize", v)} />
                  <Field label="Estimated annual income" value={a.income} onChange={(v) => set("income", v)} />
                  <label className="text-sm">
                    <span className="mb-1.5 block font-medium">Tobacco use in the last 6 months</span>
                    <select
                      value={a.tobacco} onChange={(e) => set("tobacco", e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </label>
                </Grid>
              )}

              {step === 2 && (
                <div className="space-y-3">
                  {items.map(({ item, pathway: p }) => (
                    <div key={item.id} className="rounded-xl border border-border p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-medium">{item.displayName}</p>
                          <p className="text-xs text-muted-foreground">
                            {PRODUCT_LABEL[item.productType]} · {item.carrier} · Effective {item.effectiveDate || "TBD"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="tabular-nums font-medium">${item.monthly}/mo</p>
                          <StatusBadge tone={p.collectsApplication ? "primary" : "warning"}>{p.label}</StatusBadge>
                        </div>
                      </div>
                      <p className="mt-3 text-xs text-muted-foreground">{p.summary}</p>
                    </div>
                  ))}
                  {quoteOnly.length > 0 && (
                    <p className="rounded-xl bg-surface/70 p-3 text-xs text-muted-foreground">
                      {quoteOnly.length} item(s) are quote-only with this carrier in the current release. We capture your interest and route it to a licensed agent instead of collecting an application.
                    </p>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <Check2 label="I confirm the information provided is accurate and complete." checked={a.consent} onChange={(v) => set("consent", v)} />
                  <Check2 label="I have read and accept the carrier disclosures, privacy notice and authorization to transmit my application." checked={a.disclosures} onChange={(v) => set("disclosures", v)} />
                  <Field
                    label="Type your full legal name to sign" required value={a.signature}
                    onChange={(v) => set("signature", v)} placeholder="Full legal name"
                  />
                  <p className="text-xs text-muted-foreground">
                    Your typed signature is captured with a timestamp and retained as application evidence.
                  </p>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  {!generated ? (
                    <p className="text-sm text-muted-foreground">Complete every readiness item, then generate your carrier submission from the panel on the right.</p>
                  ) : (
                    <>
                      <div className="flex items-start gap-3 rounded-xl border border-border bg-surface/60 p-4">
                        {pathway?.output === "edi"
                          ? <Send className="mt-0.5 h-5 w-5 text-primary" aria-hidden />
                          : <FileText className="mt-0.5 h-5 w-5 text-primary" aria-hidden />}
                        <div>
                          <p className="font-medium">{pathway?.terminalState}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Reference <span className="tabular-nums text-foreground">{generated.ref}</span> · generated {new Date(generated.at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <StateLadder pathwayOutput={pathway?.output ?? "pdf"} />
                      <p className="rounded-xl border border-warning/30 bg-warning/10 p-3 text-xs">
                        {pathway?.notProof} You will be notified when the carrier confirms the outcome.
                      </p>
                    </>
                  )}
                </div>
              )}

              <div className="mt-6 flex items-center justify-between gap-3">
                <button
                  onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}
                  className="inline-flex items-center gap-1 rounded-full border border-border px-4 py-2 text-sm disabled:opacity-40"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                {step < 3 && (
                  <button
                    onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
                    className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    Continue <ArrowRight className="h-4 w-4" />
                  </button>
                )}
                {step === 3 && (
                  <button
                    onClick={generate} disabled={!ready}
                    className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
                  >
                    {pathway?.output === "edi" ? "Sign & generate EDI" : "Sign & generate PDF packet"} <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <aside>
            <div className="sticky top-24 space-y-4">
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-eyebrow">Application readiness</p>
                <ul className="mt-3 space-y-2">
                  {(Object.keys(READINESS_LABEL) as ReadinessKey[]).map((k) => (
                    <li key={k} className="flex items-start gap-2 text-sm">
                      <span className={cn("mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                        readiness[k] ? "border-sage bg-sage/15 text-sage" : "border-border text-muted-foreground")}>
                        {readiness[k] && <Check className="h-3 w-3" aria-hidden />}
                      </span>
                      <span className={readiness[k] ? "" : "text-muted-foreground"}>{READINESS_LABEL[k]}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-muted-foreground">
                  Readiness is separate from enrollment. Nothing is submitted until you sign and generate.
                </p>
              </div>

              {pathway && (
                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" aria-hidden />
                    <p className="text-sm font-medium">Carrier pathway</p>
                  </div>
                  <p className="mt-2 text-sm">{pathway.label}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{pathway.summary}</p>
                </div>
              )}

              <Link to="/review" className="block text-center text-xs text-muted-foreground underline-offset-4 hover:underline">
                Back to review
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </MarketplaceShell>
  );
}

function StateLadder({ pathwayOutput }: { pathwayOutput: "none" | "handoff" | "pdf" | "edi" }) {
  const states = [
    { label: "Application readiness", done: true },
    { label: "Applicant e-signature captured", done: true },
    { label: pathwayOutput === "edi" ? "EDI transaction generated" : "Signed PDF packet generated", done: true },
    { label: pathwayOutput === "edi" ? "Carrier submission acknowledged" : "Carrier receipt confirmed", done: false },
    { label: "Coverage confirmed in force", done: false },
  ];
  return (
    <ol className="divide-y divide-border rounded-xl border border-border">
      {states.map((s) => (
        <li key={s.label} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
          <span className={s.done ? "" : "text-muted-foreground"}>{s.label}</span>
          <StatusBadge tone={s.done ? "sage" : "muted"}>{s.done ? "Complete" : "Pending carrier"}</StatusBadge>
        </li>
      ))}
    </ol>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

function Field({ label, value, onChange, type = "text", required, placeholder, className }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; required?: boolean; placeholder?: string; className?: string;
}) {
  return (
    <label className={cn("text-sm", className)}>
      <span className="mb-1.5 block font-medium">
        {label}{required && <span className="text-destructive"> *</span>}
      </span>
      <input
        type={type} value={value} required={required} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
      />
    </label>
  );
}

function Check2({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-start gap-3 rounded-xl border border-border p-3 text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 h-4 w-4" />
      <span>{label}</span>
    </label>
  );
}

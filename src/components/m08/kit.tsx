/**
 * Shared M08 presentation primitives for Increment 1.
 *
 * Everything here is built on the existing Lucie/M06 components and tokens —
 * no new visual language, no new colour scale. Status meaning is always carried
 * by text as well as tone, so nothing depends on colour alone.
 */
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

import { Id, Note, Section, Tag } from "@/components/lucie/ui";
import { Btn } from "@/components/m06/kit";
import type { M08ScreenMeta } from "@/lib/m08/registry";
import type { DimensionReading, Blocker } from "@/lib/m08/evaluate";
import type { AuthorityOutcome, Provenance, SellingContext } from "@/lib/m08/model";
import { enumLabel, formatDate, t, type Locale, type M08StringKey } from "@/lib/m08/strings";

/* ------------------------------------------------------------------ */
/* Locale                                                              */
/* ------------------------------------------------------------------ */

interface M08Ctx {
  locale: Locale;
  setLocale: (l: Locale) => void;
}

const LocaleContext = createContext<M08Ctx>({ locale: "en", setLocale: () => {} });

export function M08LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");
  const value = useMemo(() => ({ locale, setLocale }), [locale]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useM08Locale() {
  return useContext(LocaleContext);
}

/** Convenience translator bound to the active locale. */
export function useT() {
  const { locale } = useM08Locale();
  return {
    locale,
    t: (key: M08StringKey) => t(locale, key),
    e: (value: string | null | undefined) => enumLabel(locale, value),
    d: (iso: string | null | undefined) => formatDate(locale, iso),
    pick: (en: string, es: string) => (locale === "es" ? es : en),
  };
}

export function LanguageToggle() {
  const { locale, setLocale } = useM08Locale();
  return (
    <div className="flex items-center gap-2" role="group" aria-label={t(locale, "label.language")}>
      <span className="text-eyebrow">{t(locale, "label.language")}</span>
      <div className="flex gap-1">
        {(["en", "es"] as const).map((l) => (
          <Btn
            key={l}
            variant={l === locale ? "primary" : "ghost"}
            onClick={() => setLocale(l)}
            title={l === "en" ? "English" : "Español"}
          >
            <span aria-current={l === locale ? "true" : undefined}>{l === "en" ? "EN" : "ES"}</span>
          </Btn>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Traceability                                                        */
/* ------------------------------------------------------------------ */

export function TraceRail({ meta }: { meta: M08ScreenMeta }) {
  const { t: tr } = useT();
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-hairline bg-surface/50 px-4 py-3 text-xs text-muted-foreground">
      <Id>{meta.id}</Id>
      <span>
        <span className="opacity-70">{tr("label.permission")}</span>{" "}
        <code className="rounded bg-background px-1 py-0.5">{meta.permission}</code>
      </span>
      <span>
        <span className="opacity-70">{tr("label.capability")}</span> {meta.capability}
      </span>
      <span>
        <span className="opacity-70">{tr("label.flow")}</span>{" "}
        {meta.flow_defined_by_source ? meta.flows.join(", ") : <em>not defined by source package</em>}
      </span>
      <details className="basis-full">
        <summary className="cursor-pointer text-xs underline-offset-2 hover:underline">
          {tr("label.traceability")} — {meta.requirements.length} REQ · {meta.acceptance_criteria.length} AC
        </summary>
        <div className="mt-2 flex flex-wrap gap-1">
          {[...meta.requirements, ...meta.acceptance_criteria, ...meta.deltas].map((x) => (
            <Id key={x}>{x}</Id>
          ))}
        </div>
      </details>
    </div>
  );
}

export function ApprovalDependentNotice({ deltas }: { deltas: string[] }) {
  const { t: tr } = useT();
  if (!deltas.length) return null;
  return (
    <Note tone="warn">
      <strong>{tr("note.approvalDependent")}</strong>
      <span className="mt-1 flex flex-wrap gap-1">
        {deltas.map((d) => (
          <Id key={d}>{d}</Id>
        ))}
      </span>
    </Note>
  );
}

export function ReviewModeBanner() {
  const { t: tr } = useT();
  return (
    <Note tone="info">
      <strong>{tr("label.reviewMode")}</strong> {tr("note.sampleData")}
    </Note>
  );
}

/* ------------------------------------------------------------------ */
/* Status                                                              */
/* ------------------------------------------------------------------ */

const OUTCOME_TONE: Record<AuthorityOutcome, "good" | "warn" | "stop" | "neutral"> = {
  ALLOWED: "good",
  MORE_INFORMATION_NEEDED: "warn",
  NOT_ALLOWED: "stop",
  NOT_APPLICABLE: "neutral",
};

const OUTCOME_MARK: Record<AuthorityOutcome, string> = {
  ALLOWED: "✓",
  MORE_INFORMATION_NEEDED: "?",
  NOT_ALLOWED: "✕",
  NOT_APPLICABLE: "–",
};

export function OutcomeTag({ outcome }: { outcome: AuthorityOutcome }) {
  const { locale } = useM08Locale();
  return (
    <Tag tone={OUTCOME_TONE[outcome]}>
      <span aria-hidden className="mr-1 font-mono">{OUTCOME_MARK[outcome]}</span>
      {t(locale, `outcome.${outcome}` as M08StringKey)}
    </Tag>
  );
}

/** Each dimension keeps its own row — they are never merged into one badge. */
export function DimensionStrip({ dimensions }: { dimensions: DimensionReading[] }) {
  const { t: tr, e, pick } = useT();
  return (
    <div>
      <p className="mb-3 text-sm text-muted-foreground">{tr("dim.separate")}</p>
      <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {dimensions.map((d) => (
          <li key={d.key} className="rounded-xl border border-hairline bg-surface/40 p-3">
            <div className="text-eyebrow">{tr(`dim.${d.key}` as M08StringKey)}</div>
            <div className="mt-1.5">
              <Tag tone={d.tone}>{d.value.split(" · ").map((v) => e(v)).join(" · ")}</Tag>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{pick(d.detail_en, d.detail_es)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProvenanceChip({ provenance }: { provenance: Provenance | null }) {
  const { t: tr, e, d } = useT();
  if (!provenance) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }
  return (
    <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
      <Tag tone="neutral">{e(provenance.source)}</Tag>
      <span>
        {tr("label.recordedBy")}: {provenance.supplied_by}
      </span>
      <span aria-hidden>·</span>
      <span>
        {tr("label.recordedAt")}: {d(provenance.recorded_at)}
      </span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Context                                                             */
/* ------------------------------------------------------------------ */

export function ContextRibbon({
  context,
  agency,
  actingProducer,
  resolvedNpn,
  asOf,
  right,
}: {
  context: SellingContext;
  agency: string;
  actingProducer: string;
  resolvedNpn: string;
  asOf: string;
  right?: ReactNode;
}) {
  const { t: tr, e, d } = useT();
  const items: { k: string; v: string }[] = [
    { k: tr("label.agency"), v: agency },
    { k: tr("label.actingProducer"), v: actingProducer },
    { k: tr("label.resolvedNpn"), v: resolvedNpn },
    { k: tr("label.carrier"), v: context.carrier_name },
    { k: tr("label.productScope"), v: context.product_scope_key },
    { k: tr("label.state"), v: context.state_code },
    { k: tr("label.market"), v: e(context.market) },
    { k: tr("label.pathway"), v: e(context.pathway) },
    { k: tr("label.action"), v: e(context.transaction) },
    { k: tr("label.effectiveDate"), v: d(context.effective_date) },
  ];
  return (
    <div className="rounded-2xl border border-hairline bg-card p-4 shadow-card">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-eyebrow">{tr("label.context")}</p>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {tr("label.asOf")} {d(asOf)}
          </span>
          {right}
        </div>
      </div>
      <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {items.map((i) => (
          <div key={i.k} className="min-w-0">
            <dt className="text-eyebrow">{i.k}</dt>
            <dd className="mt-0.5 break-words text-sm text-foreground">{i.v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Blockers                                                            */
/* ------------------------------------------------------------------ */

const OWNER_LABEL: Record<Blocker["owner"], { en: string; es: string }> = {
  AGENT: { en: "You (the agent)", es: "Usted (el agente)" },
  AGENCY_ADMIN: { en: "Agency administrator", es: "Administrador de la agencia" },
  JET_COMPLIANCE: { en: "JET compliance", es: "Cumplimiento de JET" },
};

export function BlockerCard({ blocker, onReturn }: { blocker: Blocker; onReturn?: () => void }) {
  const { t: tr, pick, locale } = useT();
  const r = blocker.reason;
  return (
    <article className="rounded-2xl border border-hairline bg-card p-4 shadow-card">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-display text-base leading-snug">{pick(blocker.subject_en, blocker.subject_es)}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {locale === "es" ? r.description_es : r.description_en}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Id>{r.id}</Id>
          <Tag tone="warn">{r.code.replaceAll("_", " ").toLowerCase()}</Tag>
        </div>
      </header>
      <dl className="mt-3 grid gap-x-6 gap-y-3 sm:grid-cols-3">
        <div>
          <dt className="text-eyebrow">{tr("label.whoCanCorrect")}</dt>
          <dd className="mt-0.5 text-sm">{pick(OWNER_LABEL[blocker.owner].en, OWNER_LABEL[blocker.owner].es)}</dd>
        </div>
        <div>
          <dt className="text-eyebrow">{tr("label.remediation")}</dt>
          <dd className="mt-0.5 text-sm">{locale === "es" ? r.remediation_es : r.remediation_en}</dd>
        </div>
        <div>
          <dt className="text-eyebrow">{tr("label.whatHappensNext")}</dt>
          <dd className="mt-0.5 text-sm">{pick(blocker.next_en, blocker.next_es)}</dd>
        </div>
      </dl>
      <footer className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span>
          {blocker.context.state_code} · {blocker.context.carrier_name} · {blocker.context.product_scope_key}
        </span>
        {blocker.record_id ? <Id>{blocker.record_id}</Id> : null}
        {onReturn ? (
          <span className="ml-auto">
            <Btn onClick={onReturn}>{tr("action.returnToTransaction")}</Btn>
          </span>
        ) : null}
      </footer>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Dependency and states                                               */
/* ------------------------------------------------------------------ */

export function M13Dependency({ children }: { children?: ReactNode }) {
  const { t: tr } = useT();
  return (
    <Note tone="warn">
      <strong>{tr("note.m13")}</strong> {tr("note.m13Unavailable")}
      {children}
    </Note>
  );
}

export function LoadingRows({ rows = 3 }: { rows?: number }) {
  const { t: tr } = useT();
  return (
    <div className="space-y-2" aria-busy="true" aria-live="polite">
      <span className="sr-only">{tr("loading")}</span>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-10 animate-pulse rounded-xl bg-surface" />
      ))}
    </div>
  );
}

export function Denied() {
  const { t: tr } = useT();
  return (
    <Note tone="stop">
      <strong>{tr("denied.title")}</strong> {tr("denied.body")}
    </Note>
  );
}

export function EmptyRows({ message }: { message?: string }) {
  const { t: tr } = useT();
  return (
    <p className="rounded-xl border border-dashed border-hairline-strong/60 bg-surface/40 px-4 py-10 text-center text-sm text-muted-foreground">
      {message ?? tr("empty.rows")}
    </p>
  );
}

export function M08Section({
  meta,
  children,
  right,
}: {
  meta: M08ScreenMeta;
  children: ReactNode;
  right?: ReactNode;
}) {
  const { locale } = useT();
  return (
    <Section title={t(locale, meta.name_key as M08StringKey)} id={meta.id} meta={undefined}>
      <div className="grid gap-4">
        <TraceRail meta={meta} />
        {meta.flow_defined_by_source ? null : <Note tone="neutral">{t(locale, "note.flowUndefined")}</Note>}
        <ApprovalDependentNotice deltas={meta.deltas} />
        {right}
        {children}
      </div>
    </Section>
  );
}

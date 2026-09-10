/**
 * SCR-M08-001 … SCR-M08-010 — Agent-facing Selling Setup, Increment 1.
 *
 * Read-only surfaces over governed sample data. No NPN policy configuration,
 * authority simulation or enforcement is exposed here: those belong to later
 * increments of M08.
 */
import { useMemo, useState } from "react";

import { Column, Id, KV, Note, Table, Tag } from "@/components/lucie/ui";
import { Btn } from "@/components/m06/kit";
import {
  BlockerCard,
  ContextRibbon,
  Denied,
  DimensionStrip,
  EmptyRows,
  M08Section,
  M13Dependency,
  OutcomeTag,
  ProvenanceChip,
  useT,
} from "@/components/m08/kit";
import { evaluate, evaluateAll } from "@/lib/m08/evaluate";
import type {
  CarrierAppointment,
  CredentialDocumentReference,
  CredentialSubject,
  ProductAuthorityGrant,
  SellingContext,
  StateLicense,
  TrainingRecord,
} from "@/lib/m08/model";
import { m08Screen } from "@/lib/m08/registry";

export interface M08ScreenProps {
  subject: CredentialSubject;
  context: SellingContext;
  contexts: SellingContext[];
  role: "AGENT" | "AGENCY_ADMIN" | "JET_COMPLIANCE";
  returnPath: string | null;
  onReturn: () => void;
}

function meta(key: string) {
  const m = m08Screen(key);
  if (!m) throw new Error(`Unknown M08 screen ${key}`);
  return m;
}

function allowed(props: M08ScreenProps, key: string) {
  const m = meta(key);
  return m.audience.includes(props.role);
}

/* ------------------------------------------------------------------ */
/* SCR-M08-001 — Selling Setup overview                                */
/* ------------------------------------------------------------------ */

export function OverviewScreen(props: M08ScreenProps) {
  const m = meta("overview");
  const { t: tr, d, pick } = useT();
  const ev = useMemo(() => evaluate(props.subject, props.context), [props.subject, props.context]);

  if (!allowed(props, "overview")) {
    return (
      <M08Section meta={m}>
        <Denied />
      </M08Section>
    );
  }

  return (
    <M08Section meta={m}>
      <ContextRibbon
        context={props.context}
        agency={props.subject.affiliation.agency_name}
        actingProducer={`${props.subject.display_name} · NPN ${props.subject.npn.npn}`}
        resolvedNpn={`${ev.resolved_npn} · ${ev.resolved_npn_name}`}
        asOf={props.subject.as_of}
        right={<OutcomeTag outcome={ev.outcome} />}
      />
      <DimensionStrip dimensions={ev.dimensions} />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Counter label={pick("Licences recorded", "Licencias registradas")} value={props.subject.licenses.length} />
        <Counter label={pick("Appointments recorded", "Nombramientos registrados")} value={props.subject.appointments.length} />
        <Counter label={pick("Authority grants", "Concesiones de autoridad")} value={props.subject.authority.length} />
        <Counter label={pick("Open items in this context", "Elementos abiertos en este contexto")} value={ev.blockers.length} />
      </div>
      <Note tone="neutral">
        {pick(
          "A Ready to Sell reading always applies to one context. It does not mean universal selling authority.",
          "Una lectura de Listo para vender siempre aplica a un contexto. No significa autoridad de venta universal.",
        )}
      </Note>
      <div>
        <p className="text-eyebrow mb-2">{tr("label.audit")}</p>
        <dl className="grid gap-0">
          <KV k={tr("label.asOf")} v={d(props.subject.as_of)} />
          <KV k={pick("Subject record", "Registro del sujeto")} v={<Id>{props.subject.person_id}</Id>} />
          <KV
            k={pick("Affiliation effective from", "Afiliación vigente desde")}
            v={d(props.subject.affiliation.effective_from)}
          />
        </dl>
      </div>
    </M08Section>
  );
}

function Counter({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-hairline bg-surface/40 px-4 py-3">
      <div className="text-eyebrow">{label}</div>
      <div className="text-display mt-2 text-2xl tabular-nums">{value}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SCR-M08-002 — Where I can sell                                      */
/* ------------------------------------------------------------------ */

export function WhereICanSellScreen(props: M08ScreenProps) {
  const m = meta("where-i-can-sell");
  const { pick, d } = useT();
  const rows = useMemo(() => evaluateAll(props.subject, props.contexts), [props.subject, props.contexts]);

  if (!allowed(props, "where-i-can-sell")) {
    return (
      <M08Section meta={m}>
        <Denied />
      </M08Section>
    );
  }

  const columns: Column<(typeof rows)[number]>[] = [
    { head: pick("State", "Estado"), cell: (r) => r.context.state_code },
    { head: pick("Carrier", "Aseguradora"), cell: (r) => r.context.carrier_name },
    { head: pick("Product scope", "Alcance de producto"), cell: (r) => r.context.product_scope_key },
    { head: pick("Market", "Mercado"), cell: (r) => <Tag tone="neutral">{e(r.context.market)}</Tag> },
    { head: pick("Pathway", "Vía"), cell: (r) => e(r.context.pathway) },
    { head: pick("Action", "Acción"), cell: (r) => e(r.context.transaction) },
    { head: pick("Effective", "Vigencia"), cell: (r) => d(r.context.effective_date) },
    { head: pick("Outcome", "Resultado"), cell: (r) => <OutcomeTag outcome={r.outcome} /> },
  ];

  return (
    <M08Section meta={m}>
      <Note tone="neutral">
        {pick(
          "Each row is one evaluated context. Nothing here implies authority in a context that is not listed.",
          "Cada fila es un contexto evaluado. Nada aquí implica autoridad en un contexto no listado.",
        )}
      </Note>
      {rows.length ? (
        <Table rows={rows} columns={columns} keyOf={(r) => `${r.context.state_code}-${r.context.carrier_id}-${r.context.transaction}`} />
      ) : (
        <EmptyRows />
      )}
    </M08Section>
  );
}

/* ------------------------------------------------------------------ */
/* SCR-M08-003 — What is blocking me                                   */
/* ------------------------------------------------------------------ */

export function BlockersScreen(props: M08ScreenProps) {
  const m = meta("blockers");
  const { t: tr, pick } = useT();
  const ev = useMemo(() => evaluate(props.subject, props.context), [props.subject, props.context]);

  if (!allowed(props, "blockers")) {
    return (
      <M08Section meta={m}>
        <Denied />
      </M08Section>
    );
  }

  return (
    <M08Section meta={m}>
      {props.returnPath ? (
        <Note tone="info">
          <strong>{tr("note.resume")}</strong>
          <span className="mt-2 block">
            <Btn variant="primary" onClick={props.onReturn}>
              {tr("action.returnToTransaction")}
            </Btn>
          </span>
        </Note>
      ) : null}
      <ContextRibbon
        context={props.context}
        agency={props.subject.affiliation.agency_name}
        actingProducer={`${props.subject.display_name} · NPN ${props.subject.npn.npn}`}
        resolvedNpn={`${ev.resolved_npn} · ${ev.resolved_npn_name}`}
        asOf={props.subject.as_of}
        right={<OutcomeTag outcome={ev.outcome} />}
      />
      {ev.blockers.length ? (
        <div className="grid gap-3">
          {ev.blockers.map((b) => (
            <BlockerCard key={b.id} blocker={b} onReturn={props.returnPath ? props.onReturn : undefined} />
          ))}
        </div>
      ) : (
        <EmptyRows message={tr("empty.blockers")} />
      )}
      <Note tone="neutral">
        {pick(
          "Consumer-facing plan presentation is unaffected by these items. On Exchange visibility, ordering and comparison never change because of appointment or compensation.",
          "La presentación de planes al consumidor no se ve afectada por estos elementos. La visibilidad, el orden y la comparación en el mercado nunca cambian por nombramiento o compensación.",
        )}
      </Note>
    </M08Section>
  );
}

/* ------------------------------------------------------------------ */
/* SCR-M08-004 — Licences                                              */
/* ------------------------------------------------------------------ */

export function LicensesScreen(props: M08ScreenProps) {
  const m = meta("licenses");
  const { pick, d, e, t: tr } = useT();
  const [openId, setOpenId] = useState<string | null>(null);
  const rows = props.subject.licenses;
  const open = rows.find((l) => l.license_id === openId) ?? null;

  if (!allowed(props, "licenses")) {
    return (
      <M08Section meta={m}>
        <Denied />
      </M08Section>
    );
  }

  const columns: Column<StateLicense>[] = [
    { head: pick("State", "Estado"), cell: (r) => `${r.state_code}${r.resident ? pick(" (resident)", " (residente)") : ""}` },
    { head: pick("Number", "Número"), cell: (r) => r.license_number },
    { head: pick("Credential status", "Estado de credencial"), cell: (r) => <Tag tone={r.status === "ACTIVE" ? "good" : "stop"}>{e(r.status)}</Tag> },
    { head: pick("Verification status", "Estado de verificación"), cell: (r) => <Tag tone={r.verification === "VERIFIED" ? "good" : "neutral"}>{e(r.verification)}</Tag> },
    { head: pick("Lines of authority", "Líneas de autoridad"), cell: (r) => r.lines.map((l) => l.code).join(", ") || "—" },
    { head: pick("Term", "Vigencia"), cell: (r) => `${d(r.effective_from)} → ${d(r.effective_to)}` },
    { head: "", cell: (r) => <Btn onClick={() => setOpenId(r.license_id)}>{tr("label.viewDetail")}</Btn> },
  ];

  return (
    <M08Section meta={m}>
      {open ? (
        <div className="grid gap-3">
          <div>
            <Btn onClick={() => setOpenId(null)}>{tr("label.back")}</Btn>
          </div>
          <dl className="grid gap-0">
            <KV k={pick("Licence", "Licencia")} v={<Id>{open.license_id}</Id>} />
            <KV k={pick("State", "Estado")} v={open.state_code} />
            <KV k={pick("Credential status", "Estado de credencial")} v={<Tag tone={open.status === "ACTIVE" ? "good" : "stop"}>{e(open.status)}</Tag>} />
            <KV k={pick("Verification status", "Estado de verificación")} v={<Tag tone={open.verification === "VERIFIED" ? "good" : "neutral"}>{e(open.verification)}</Tag>} />
            <KV k={pick("Term", "Vigencia")} v={`${d(open.effective_from)} → ${d(open.effective_to)}`} />
            <KV
              k={pick("Lines of authority", "Líneas de autoridad")}
              v={
                open.lines.length ? (
                  <ul className="grid gap-1">
                    {open.lines.map((l) => (
                      <li key={l.line_of_authority_id} className="flex flex-wrap items-center gap-2">
                        <span>{l.name_key}</span>
                        <Tag tone={l.status === "ACTIVE" ? "good" : "stop"}>{e(l.status)}</Tag>
                        <span className="text-xs text-muted-foreground">{d(l.effective_from)} → {d(l.effective_to)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  "—"
                )
              }
            />
            <KV k={tr("label.source")} v={<ProvenanceChip provenance={open.provenance} />} />
          </dl>
          {open.verification !== "VERIFIED" ? <Note tone="neutral">{tr("note.verificationOptional")}</Note> : null}
        </div>
      ) : rows.length ? (
        <Table rows={rows} columns={columns} keyOf={(r) => r.license_id} />
      ) : (
        <EmptyRows />
      )}
    </M08Section>
  );
}

/* ------------------------------------------------------------------ */
/* SCR-M08-005 — Appointments                                          */
/* ------------------------------------------------------------------ */

export function AppointmentsScreen(props: M08ScreenProps) {
  const m = meta("appointments");
  const { pick, d, e, t: tr } = useT();
  const rows = props.subject.appointments;

  if (!allowed(props, "appointments")) {
    return (
      <M08Section meta={m}>
        <Denied />
      </M08Section>
    );
  }

  const columns: Column<CarrierAppointment>[] = [
    { head: pick("Carrier", "Aseguradora"), cell: (r) => r.carrier_name },
    { head: pick("State", "Estado"), cell: (r) => r.state_code },
    { head: pick("Product family", "Familia de producto"), cell: (r) => r.product_family_key },
    { head: pick("Timing", "Momento"), cell: (r) => <Tag tone={r.timing === "NOT_REQUIRED" ? "neutral" : "info"}>{e(r.timing)}</Tag> },
    { head: pick("Appointment status", "Estado de nombramiento"), cell: (r) => <Tag tone={r.status === "ACTIVE" ? "good" : "stop"}>{e(r.status)}</Tag> },
    { head: pick("Term", "Vigencia"), cell: (r) => `${d(r.effective_from)} → ${d(r.effective_to)}` },
    { head: tr("label.source"), cell: (r) => <ProvenanceChip provenance={r.provenance} /> },
  ];

  return (
    <M08Section meta={m}>
      <Note tone="neutral">{tr("note.agencyEntered")}</Note>
      {rows.length ? <Table rows={rows} columns={columns} keyOf={(r) => r.appointment_id} /> : <EmptyRows />}
    </M08Section>
  );
}

/* ------------------------------------------------------------------ */
/* SCR-M08-006 — Product authority (agency admin / JET compliance)     */
/* ------------------------------------------------------------------ */

export function ProductAuthorityScreen(props: M08ScreenProps) {
  const m = meta("product-authority");
  const { pick, d, e, t: tr } = useT();

  if (!allowed(props, "product-authority")) {
    return (
      <M08Section meta={m}>
        <Denied />
      </M08Section>
    );
  }

  const rows = props.subject.authority;
  const columns: Column<ProductAuthorityGrant>[] = [
    { head: pick("Carrier", "Aseguradora"), cell: (r) => r.carrier_name },
    { head: pick("Product scope", "Alcance de producto"), cell: (r) => r.product_scope_key },
    { head: pick("States", "Estados"), cell: (r) => r.states.join(", ") },
    { head: pick("Basis", "Base"), cell: (r) => <Tag tone="info">{e(r.basis)}</Tag> },
    { head: pick("Sponsor", "Patrocinador"), cell: (r) => r.sponsor_name ?? "—" },
    { head: pick("Inherited from", "Heredado de"), cell: (r) => r.inherited_from ?? "—" },
    { head: pick("Status", "Estado"), cell: (r) => <Tag tone={r.status === "ACTIVE" ? "good" : "stop"}>{e(r.status)}</Tag> },
    { head: pick("Term", "Vigencia"), cell: (r) => `${d(r.effective_from)} → ${d(r.effective_to)}` },
    { head: tr("label.source"), cell: (r) => <ProvenanceChip provenance={r.provenance} /> },
  ];

  return (
    <M08Section meta={m}>
      <Note tone="neutral">
        {pick(
          "Authority is shown as recorded. Granting, sponsorship changes and enforcement are not available in this increment.",
          "La autoridad se muestra tal como está registrada. La concesión, los cambios de patrocinio y la aplicación no están disponibles en este incremento.",
        )}
      </Note>
      {rows.length ? <Table rows={rows} columns={columns} keyOf={(r) => r.grant_id} /> : <EmptyRows />}
    </M08Section>
  );
}

/* ------------------------------------------------------------------ */
/* SCR-M08-007 — E&O coverage                                          */
/* ------------------------------------------------------------------ */

export function EOScreen(props: M08ScreenProps) {
  const m = meta("eo");
  const { pick, d, e, t: tr, locale } = useT();
  const rows = props.subject.eo;

  if (!allowed(props, "eo")) {
    return (
      <M08Section meta={m}>
        <Denied />
      </M08Section>
    );
  }

  return (
    <M08Section meta={m}>
      {rows.length ? (
        <div className="grid gap-3">
          {rows.map((r) => (
            <div key={r.eo_id} className="rounded-2xl border border-hairline bg-card p-4 shadow-card">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-display text-base">{r.carrier_name}</h3>
                <Tag tone={r.status === "ACTIVE" ? "good" : "stop"}>{e(r.status)}</Tag>
              </div>
              <dl className="mt-2 grid gap-0">
                <KV k={pick("Kind", "Tipo")} v={e(r.kind)} />
                <KV k={pick("Policy number", "Número de póliza")} v={r.policy_number} />
                <KV
                  k={pick("Limits", "Límites")}
                  v={`${new Intl.NumberFormat(locale === "es" ? "es-US" : "en-US", { style: "currency", currency: r.currency, maximumFractionDigits: 0 }).format(r.per_claim_limit)} ${pick("per claim", "por reclamo")} · ${new Intl.NumberFormat(locale === "es" ? "es-US" : "en-US", { style: "currency", currency: r.currency, maximumFractionDigits: 0 }).format(r.aggregate_limit)} ${pick("aggregate", "agregado")}`}
                />
                <KV k={pick("Term", "Vigencia")} v={`${d(r.effective_from)} → ${d(r.effective_to)}`} />
                <KV
                  k={pick("Roster membership", "Membresía en el listado")}
                  v={r.roster_member ? pick("Listed on the agency policy roster", "Incluido en el listado de la póliza de la agencia") : pick("Not listed", "No incluido")}
                />
                <KV k={tr("label.source")} v={<ProvenanceChip provenance={r.provenance} />} />
              </dl>
            </div>
          ))}
        </div>
      ) : (
        <EmptyRows />
      )}
    </M08Section>
  );
}

/* ------------------------------------------------------------------ */
/* SCR-M08-008 — Training and marketplace information                  */
/* ------------------------------------------------------------------ */

export function TrainingScreen(props: M08ScreenProps) {
  const m = meta("training");
  const { pick, d, e, t: tr } = useT();
  const rows = props.subject.training;
  const mk = props.subject.marketplace;

  if (!allowed(props, "training")) {
    return (
      <M08Section meta={m}>
        <Denied />
      </M08Section>
    );
  }

  const columns: Column<TrainingRecord>[] = [
    { head: pick("Requirement", "Requisito"), cell: (r) => r.requirement_key },
    { head: pick("Carrier", "Aseguradora"), cell: (r) => r.carrier_name ?? "—" },
    {
      head: pick("Disposition", "Disposición"),
      cell: (r) => <Tag tone={r.disposition === "REQUIRED" ? "info" : "neutral"}>{r.disposition === "REQUIRED" ? tr("label.required") : tr("label.optional")}</Tag>,
    },
    { head: pick("Status", "Estado"), cell: (r) => <Tag tone={r.status === "ACTIVE" ? "good" : r.disposition === "OPTIONAL" ? "neutral" : "warn"}>{e(r.status)}</Tag> },
    { head: pick("Completed", "Completado"), cell: (r) => d(r.completed_on) },
    { head: pick("Expires", "Vence"), cell: (r) => d(r.expires_on) },
    { head: tr("label.source"), cell: (r) => <ProvenanceChip provenance={r.provenance} /> },
  ];

  return (
    <M08Section meta={m}>
      {rows.length ? <Table rows={rows} columns={columns} keyOf={(r) => r.training_id} /> : <EmptyRows />}
      <div className="rounded-2xl border border-hairline bg-surface/40 p-4">
        <p className="text-eyebrow">{pick("Marketplace information", "Información del mercado")}</p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <Tag tone="neutral">{e(mk.status)}</Tag>
          <span className="text-sm text-muted-foreground">
            {pick("Plan year", "Año del plan")}: {mk.plan_year ?? "—"} · {pick("Recorded", "Registrado")}: {d(mk.recorded_on)}
          </span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{tr("note.marketplaceOptional")}</p>
      </div>
    </M08Section>
  );
}

/* ------------------------------------------------------------------ */
/* SCR-M08-009 — Credential documents (M13 owns storage)               */
/* ------------------------------------------------------------------ */

export function DocumentsScreen(props: M08ScreenProps) {
  const m = meta("documents");
  const { pick, d, e } = useT();
  const rows = props.subject.documents;

  if (!allowed(props, "documents")) {
    return (
      <M08Section meta={m}>
        <Denied />
      </M08Section>
    );
  }

  const columns: Column<CredentialDocumentReference>[] = [
    { head: pick("Document", "Documento"), cell: (r) => r.title_key },
    { head: pick("Linked record", "Registro vinculado"), cell: (r) => <span className="flex flex-wrap items-center gap-2">{r.linked_record_label_key}<Id>{r.linked_record_id}</Id></span> },
    { head: pick("M13 reference", "Referencia M13"), cell: (r) => <Id>{r.m13_document_id}</Id> },
    { head: pick("Uploaded", "Cargado"), cell: (r) => d(r.uploaded_on) },
    { head: pick("Availability", "Disponibilidad"), cell: (r) => <Tag tone={r.availability === "AVAILABLE" ? "good" : "warn"}>{e(r.availability)}</Tag> },
  ];

  return (
    <M08Section meta={m}>
      <M13Dependency />
      {rows.length ? <Table rows={rows} columns={columns} keyOf={(r) => r.reference_id} /> : <EmptyRows />}
    </M08Section>
  );
}

/* ------------------------------------------------------------------ */
/* SCR-M08-010 — NPN attribution summary (read only)                   */
/* ------------------------------------------------------------------ */

export function NPNScreen(props: M08ScreenProps) {
  const m = meta("npn");
  const { pick, e, t: tr } = useT();
  const rows = props.subject.npn_roles;

  if (!allowed(props, "npn")) {
    return (
      <M08Section meta={m}>
        <Denied />
      </M08Section>
    );
  }

  const columns: Column<(typeof rows)[number]>[] = [
    { head: pick("Role", "Rol"), cell: (r) => e(r.role) },
    { head: pick("NPN", "NPN"), cell: (r) => <span className="font-mono text-sm">{r.npn}</span> },
    { head: pick("Subject", "Sujeto"), cell: (r) => `${r.subject_name} · ${e(r.subject_type)}` },
    { head: pick("Applied from", "Aplicado desde"), cell: (r) => r.policy_source_key },
    { head: pick("Target type", "Tipo de destino"), cell: (r) => e(r.target_type) },
    {
      head: pick("Restriction", "Restricción"),
      cell: (r) => <Tag tone={r.locked ? "warn" : "neutral"}>{r.locked ? pick("Locked", "Bloqueado") : pick("Configurable by the agency", "Configurable por la agencia")}</Tag>,
    },
  ];

  return (
    <M08Section meta={m}>
      <Note tone="neutral">{tr("note.npnReadOnly")}</Note>
      <Note tone="warn">{tr("note.npnRoles")}</Note>
      {rows.length ? <Table rows={rows} columns={columns} keyOf={(r) => r.role} /> : <EmptyRows />}
    </M08Section>
  );
}

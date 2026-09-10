/**
 * Read-only contextual evaluation used by Increment 1.
 *
 * Only the four controlled outcomes are produced, and each status dimension is
 * reported separately — nothing is collapsed into one badge. Reason codes are
 * taken from the packet's Reason Code Register; no code is invented. Unknown
 * requirement state resolves to MORE_INFORMATION_NEEDED, never to allowed.
 */

import type {
  AuthorityOutcome,
  CredentialSubject,
  SellingContext,
} from "./model";

export interface ReasonCode {
  id: string;
  code: string;
  description_en: string;
  description_es: string;
  audience: "AGENT_AND_ADMIN" | "AGENCY_ADMIN";
  remediation_en: string;
  remediation_es: string;
}

export const REASON_CODES: Record<string, ReasonCode> = {
  "RC-M08-001": {
    id: "RC-M08-001",
    code: "LICENSE_MISSING",
    description_en: "Required state licence is not recorded for the evaluated context.",
    description_es: "La licencia estatal requerida no está registrada para el contexto evaluado.",
    audience: "AGENT_AND_ADMIN",
    remediation_en: "Add an active licence term or choose another eligible actor.",
    remediation_es: "Agregue un término de licencia activo o elija otro actor elegible.",
  },
  "RC-M08-002": {
    id: "RC-M08-002",
    code: "LICENSE_INACTIVE",
    description_en: "Licence is expired, suspended, revoked, surrendered or not effective.",
    description_es: "La licencia está vencida, suspendida, revocada, entregada o no vigente.",
    audience: "AGENT_AND_ADMIN",
    remediation_en: "Correct the term, add a valid renewal or reassign the transaction.",
    remediation_es: "Corrija el término, agregue una renovación válida o reasigne la transacción.",
  },
  "RC-M08-003": {
    id: "RC-M08-003",
    code: "LINE_OF_AUTHORITY_MISSING",
    description_en: "Required line of authority is absent or ineffective.",
    description_es: "La línea de autoridad requerida está ausente o no es efectiva.",
    audience: "AGENT_AND_ADMIN",
    remediation_en: "Add or correct the line-of-authority term.",
    remediation_es: "Agregue o corrija el término de línea de autoridad.",
  },
  "RC-M08-005": {
    id: "RC-M08-005",
    code: "APPOINTMENT_MISSING",
    description_en: "Required carrier appointment is not active.",
    description_es: "El nombramiento requerido de la aseguradora no está activo.",
    audience: "AGENT_AND_ADMIN",
    remediation_en: "Agency or JET may add an active appointment or request authority.",
    remediation_es: "La agencia o JET puede agregar un nombramiento activo o solicitar autoridad.",
  },
  "RC-M08-006": {
    id: "RC-M08-006",
    code: "PRODUCT_AUTHORITY_MISSING",
    description_en: "Required carrier contract or product authority is not active.",
    description_es: "El contrato de la aseguradora o la autoridad de producto requerida no está activa.",
    audience: "AGENT_AND_ADMIN",
    remediation_en: "Add the applicable authority grant or use a configured sponsor.",
    remediation_es: "Agregue la concesión de autoridad aplicable o use un patrocinador configurado.",
  },
  "RC-M08-007": {
    id: "RC-M08-007",
    code: "AUTHORITY_RULE_UNDEFINED",
    description_en: "No authoritative requirement rule exists for the supplied context.",
    description_es: "No existe una regla de requisito autorizada para el contexto proporcionado.",
    audience: "AGENCY_ADMIN",
    remediation_en: "Configure the requirement or route the transaction conservatively.",
    remediation_es: "Configure el requisito o enrute la transacción de forma conservadora.",
  },
  "RC-M08-011": {
    id: "RC-M08-011",
    code: "ACTING_AGENT_INELIGIBLE",
    description_en: "The acting agent fails an applicable individual requirement.",
    description_es: "El agente actuante no cumple un requisito individual aplicable.",
    audience: "AGENT_AND_ADMIN",
    remediation_en: "Resolve the individual credential or use an eligible agent.",
    remediation_es: "Resuelva la credencial individual o use un agente elegible.",
  },
  "RC-M08-012": {
    id: "RC-M08-012",
    code: "AGENCY_INELIGIBLE",
    description_en: "The agency fails an applicable entity or sponsorship requirement.",
    description_es: "La agencia no cumple un requisito de entidad o patrocinio aplicable.",
    audience: "AGENCY_ADMIN",
    remediation_en: "Resolve agency credential or authority.",
    remediation_es: "Resuelva la credencial o la autoridad de la agencia.",
  },
};

export type DimensionKey =
  | "credential"
  | "verification"
  | "appointment"
  | "authority"
  | "eo"
  | "hold"
  | "affiliation"
  | "route"
  | "contextual";

export interface DimensionReading {
  key: DimensionKey;
  /** Controlled enumeration value, shown with its own label — not a colour. */
  value: string;
  tone: "good" | "warn" | "stop" | "neutral" | "info";
  detail_en: string;
  detail_es: string;
}

export interface Blocker {
  id: string;
  reason: ReasonCode;
  /** Who can correct it — separate from who is affected. */
  owner: "AGENT" | "AGENCY_ADMIN" | "JET_COMPLIANCE";
  subject_en: string;
  subject_es: string;
  next_en: string;
  next_es: string;
  record_id: string | null;
  context: SellingContext;
}

export interface Evaluation {
  outcome: AuthorityOutcome;
  context: SellingContext;
  dimensions: DimensionReading[];
  blockers: Blocker[];
  resolved_npn: string;
  resolved_npn_name: string;
}

function activeOn(from: string, to: string | null, on: string) {
  const d = new Date(on).getTime();
  if (Number.isNaN(d)) return false;
  if (new Date(from).getTime() > d) return false;
  if (to && new Date(to).getTime() < d) return false;
  return true;
}

export function evaluate(subject: CredentialSubject, ctx: SellingContext): Evaluation {
  const on = ctx.effective_date;
  const blockers: Blocker[] = [];
  const dims: DimensionReading[] = [];

  /* Credential dimension — licence in the evaluated state. */
  const license = subject.licenses.find((l) => l.state_code === ctx.state_code);
  const licenceActive = Boolean(license && license.status === "ACTIVE" && activeOn(license.effective_from, license.effective_to, on));
  if (!license) {
    blockers.push({
      id: `BLK-${ctx.state_code}-LIC`,
      reason: REASON_CODES["RC-M08-001"],
      owner: "AGENT",
      subject_en: `No ${ctx.state_code} licence is recorded.`,
      subject_es: `No hay licencia de ${ctx.state_code} registrada.`,
      next_en: "Once an active term is recorded, this context is re-evaluated automatically.",
      next_es: "Una vez registrado un término activo, este contexto se vuelve a evaluar automáticamente.",
      record_id: null,
      context: ctx,
    });
  } else if (!licenceActive) {
    blockers.push({
      id: `BLK-${license.license_id}`,
      reason: REASON_CODES["RC-M08-002"],
      owner: "AGENT",
      subject_en: `Licence ${license.license_number} is ${license.status.toLowerCase()} on the effective date.`,
      subject_es: `La licencia ${license.license_number} está ${license.status.toLowerCase()} en la fecha de vigencia.`,
      next_en: "Record the renewal term; the evaluation reruns without restarting the transaction.",
      next_es: "Registre el término de renovación; la evaluación se repite sin reiniciar la transacción.",
      record_id: license.license_id,
      context: ctx,
    });
  } else if (!license.lines.some((l) => l.status === "ACTIVE" && l.code === "HEALTH")) {
    blockers.push({
      id: `BLK-${license.license_id}-LOA`,
      reason: REASON_CODES["RC-M08-003"],
      owner: "AGENT",
      subject_en: `Licence ${license.license_number} has no active health line of authority.`,
      subject_es: `La licencia ${license.license_number} no tiene línea de autoridad de salud activa.`,
      next_en: "Add the line-of-authority term to the existing licence record.",
      next_es: "Agregue el término de línea de autoridad a la licencia existente.",
      record_id: license.license_id,
      context: ctx,
    });
  }
  dims.push({
    key: "credential",
    value: license ? license.status : "NOT_RECORDED",
    tone: licenceActive ? "good" : license ? "stop" : "warn",
    detail_en: license ? `${ctx.state_code} licence ${license.license_number}` : `No ${ctx.state_code} licence recorded`,
    detail_es: license ? `Licencia de ${ctx.state_code} ${license.license_number}` : `Sin licencia de ${ctx.state_code} registrada`,
  });

  /* Verification — reported separately; unverified never means inactive. */
  dims.push({
    key: "verification",
    value: license ? license.verification : "NOT_VERIFIED",
    tone: license?.verification === "VERIFIED" ? "good" : license?.verification === "CONFLICT" || license?.verification === "DISPUTED" ? "warn" : "neutral",
    detail_en: license?.verification === "VERIFIED"
      ? "Optional verification was purchased and matched."
      : "Optional verification is not purchased. The credential status above is unaffected.",
    detail_es: license?.verification === "VERIFIED"
      ? "Se compró la verificación opcional y coincidió."
      : "La verificación opcional no se compró. El estado de credencial anterior no se ve afectado.",
  });

  /* Appointment — an agency-entered active appointment is active. */
  const appt = subject.appointments.find((a) => a.carrier_id === ctx.carrier_id && a.state_code === ctx.state_code);
  const apptActive = Boolean(appt && appt.status === "ACTIVE" && activeOn(appt.effective_from, appt.effective_to, on));
  const apptRequired = appt ? appt.timing === "REQUIRED_BEFORE_SALE" : true;
  if (apptRequired && !apptActive) {
    blockers.push({
      id: `BLK-${ctx.carrier_id}-APT`,
      reason: REASON_CODES["RC-M08-005"],
      owner: "AGENCY_ADMIN",
      subject_en: `${ctx.carrier_name} appointment in ${ctx.state_code} is not active on the effective date.`,
      subject_es: `El nombramiento de ${ctx.carrier_name} en ${ctx.state_code} no está activo en la fecha de vigencia.`,
      next_en: "Your agency administrator or JET records the appointment; you do not file it here.",
      next_es: "Su administrador de agencia o JET registra el nombramiento; usted no lo presenta aquí.",
      record_id: appt?.appointment_id ?? null,
      context: ctx,
    });
  }
  dims.push({
    key: "appointment",
    value: appt ? (appt.status === "ACTIVE" ? appt.timing === "JUST_IN_TIME" ? "JUST_IN_TIME" : "ACTIVE" : appt.status) : "NOT_RECORDED",
    tone: apptActive ? "good" : apptRequired ? "stop" : "info",
    detail_en: appt
      ? appt.provenance.source === "AGENCY_ATTESTED" && appt.status === "ACTIVE"
        ? "Agency-entered and active — not awaiting carrier confirmation."
        : `${appt.carrier_name} · ${appt.timing.replaceAll("_", " ").toLowerCase()}`
      : "No appointment recorded for this carrier and state.",
    detail_es: appt
      ? appt.provenance.source === "AGENCY_ATTESTED" && appt.status === "ACTIVE"
        ? "Registrado por la agencia y activo: no espera confirmación de la aseguradora."
        : `${appt.carrier_name} · ${appt.timing.replaceAll("_", " ").toLowerCase()}`
      : "Sin nombramiento registrado para esta aseguradora y estado.",
  });

  /* Product authority. */
  const grant = subject.authority.find((g) => g.carrier_id === ctx.carrier_id && g.states.includes(ctx.state_code));
  const grantActive = Boolean(grant && grant.status === "ACTIVE" && activeOn(grant.effective_from, grant.effective_to, on));
  if (!grantActive) {
    blockers.push({
      id: `BLK-${ctx.carrier_id}-AUT`,
      reason: REASON_CODES[grant ? "RC-M08-006" : "RC-M08-007"],
      owner: "AGENCY_ADMIN",
      subject_en: grant
        ? `${ctx.carrier_name} product authority for ${ctx.product_scope_key} is not active.`
        : `No requirement rule is recorded for ${ctx.carrier_name} in ${ctx.state_code}.`,
      subject_es: grant
        ? `La autoridad de producto de ${ctx.carrier_name} para ${ctx.product_scope_key} no está activa.`
        : `No hay regla de requisito registrada para ${ctx.carrier_name} en ${ctx.state_code}.`,
      next_en: "Until this is defined the context is routed conservatively rather than assumed allowed.",
      next_es: "Hasta que se defina, el contexto se enruta de forma conservadora en lugar de asumirse permitido.",
      record_id: grant?.grant_id ?? null,
      context: ctx,
    });
  }
  dims.push({
    key: "authority",
    value: grant ? grant.status : "NOT_RECORDED",
    tone: grantActive ? "good" : "warn",
    detail_en: grant ? `${grant.basis.replaceAll("_", " ").toLowerCase()}${grant.sponsor_name ? ` · ${grant.sponsor_name}` : ""}` : "No grant recorded",
    detail_es: grant ? `${grant.basis.replaceAll("_", " ").toLowerCase()}${grant.sponsor_name ? ` · ${grant.sponsor_name}` : ""}` : "Sin concesión registrada",
  });

  /* E&O and required training — one dimension, both parts named. */
  const eo = subject.eo.find((e) => e.status === "ACTIVE" && activeOn(e.effective_from, e.effective_to, on));
  const missingTraining = subject.training.filter(
    (tr) => tr.disposition === "REQUIRED" && tr.status !== "ACTIVE" && (!tr.carrier_name || tr.carrier_name === ctx.carrier_name),
  );
  if (!eo || missingTraining.length) {
    blockers.push({
      id: `BLK-${ctx.carrier_id}-EO`,
      reason: REASON_CODES["RC-M08-011"],
      owner: "AGENT",
      subject_en: !eo
        ? "No active E&O coverage applies on the effective date."
        : `${missingTraining[0]?.carrier_name ?? ""} required training is not complete.`.trim(),
      subject_es: !eo
        ? "Ninguna cobertura E&O activa aplica en la fecha de vigencia."
        : `La capacitación requerida de ${missingTraining[0]?.carrier_name ?? ""} no está completa.`.trim(),
      next_en: "Record the missing item; the transaction context is preserved and re-evaluated.",
      next_es: "Registre el elemento faltante; el contexto de la transacción se conserva y se vuelve a evaluar.",
      record_id: eo ? missingTraining[0]?.training_id ?? null : null,
      context: ctx,
    });
  }
  dims.push({
    key: "eo",
    value: eo && !missingTraining.length ? "ACTIVE" : eo ? "TRAINING_INCOMPLETE" : "NOT_RECORDED",
    tone: eo && !missingTraining.length ? "good" : "warn",
    detail_en: eo ? `${eo.carrier_name} ${eo.policy_number}${missingTraining.length ? " · required training incomplete" : ""}` : "No active coverage",
    detail_es: eo ? `${eo.carrier_name} ${eo.policy_number}${missingTraining.length ? " · capacitación requerida incompleta" : ""}` : "Sin cobertura activa",
  });

  /* Compliance holds. */
  const activeHold = subject.holds.find((h) => !h.released_on);
  if (activeHold) {
    blockers.push({
      id: `BLK-${activeHold.hold_id}`,
      reason: REASON_CODES["RC-M08-012"],
      owner: activeHold.owner === "JET" ? "JET_COMPLIANCE" : "AGENCY_ADMIN",
      subject_en: `A ${activeHold.owner.toLowerCase()} compliance hold applies to ${activeHold.scope_key}.`,
      subject_es: `Una retención de cumplimiento de ${activeHold.owner.toLowerCase()} aplica a ${activeHold.scope_key}.`,
      next_en: "The hold owner reviews and releases it; you cannot clear it yourself.",
      next_es: "El propietario de la retención la revisa y la libera; usted no puede eliminarla.",
      record_id: activeHold.hold_id,
      context: ctx,
    });
  }
  dims.push({
    key: "hold",
    value: activeHold ? "ACTIVE_HOLD" : "NO_ACTIVE_HOLD",
    tone: activeHold ? "stop" : "good",
    detail_en: activeHold ? `${activeHold.reason_key}` : `${subject.holds.length} historical hold(s), all released`,
    detail_es: activeHold ? `${activeHold.reason_key}` : `${subject.holds.length} retención(es) histórica(s), todas liberadas`,
  });

  /* M06 affiliation and operational readiness — owned by M06, shown read-only. */
  const affOk = subject.affiliation.affiliation_status === "ACTIVE" && subject.affiliation.operational_readiness === "READY";
  if (!affOk) {
    blockers.push({
      id: "BLK-AFFILIATION",
      reason: REASON_CODES["RC-M08-012"],
      owner: "AGENCY_ADMIN",
      subject_en: `Affiliation with ${subject.affiliation.agency_name} is ${subject.affiliation.affiliation_status.replaceAll("_", " ").toLowerCase()}.`,
      subject_es: `La afiliación con ${subject.affiliation.agency_name} está ${subject.affiliation.affiliation_status.replaceAll("_", " ").toLowerCase()}.`,
      next_en: "M06 owns this record; approval there re-evaluates selling authority.",
      next_es: "M06 es dueño de este registro; la aprobación allí vuelve a evaluar la autoridad de venta.",
      record_id: null,
      context: ctx,
    });
  }
  dims.push({
    key: "affiliation",
    value: `${subject.affiliation.affiliation_status} · ${subject.affiliation.operational_readiness}`,
    tone: affOk ? "good" : "warn",
    detail_en: `${subject.affiliation.agency_name} — recorded in M06`,
    detail_es: `${subject.affiliation.agency_name} — registrado en M06`,
  });

  /* Marketplace and route readiness — informational, never blocking. */
  dims.push({
    key: "route",
    value: `${ctx.pathway} · ${subject.marketplace.status}`,
    tone: "info",
    detail_en: "Marketplace information is optional and raises no alert or onboarding task.",
    detail_es: "La información del mercado es opcional y no genera alertas ni tareas de incorporación.",
  });

  /* Contextual outcome — one of exactly four values. */
  let outcome: AuthorityOutcome;
  if (ctx.transaction === "SERVICING" && !apptRequired) {
    outcome = "NOT_APPLICABLE";
  } else if (blockers.some((b) => b.reason.code === "LICENSE_MISSING" || b.reason.code === "LICENSE_INACTIVE" || b.reason.code === "APPOINTMENT_MISSING")) {
    outcome = "NOT_ALLOWED";
  } else if (blockers.length) {
    outcome = "MORE_INFORMATION_NEEDED";
  } else {
    outcome = "ALLOWED";
  }
  dims.push({
    key: "contextual",
    value: outcome,
    tone: outcome === "ALLOWED" ? "good" : outcome === "NOT_ALLOWED" ? "stop" : outcome === "NOT_APPLICABLE" ? "neutral" : "warn",
    detail_en: "Applies to this exact context only, not to selling generally.",
    detail_es: "Aplica solo a este contexto exacto, no a la venta en general.",
  });

  const attribution = subject.npn_roles.find((r) => r.role === "ATTRIBUTION") ?? subject.npn_roles[0];

  return {
    outcome,
    context: ctx,
    dimensions: dims,
    blockers,
    resolved_npn: attribution?.npn ?? subject.npn.npn,
    resolved_npn_name: attribution?.subject_name ?? subject.npn.subject_name,
  };
}

export function evaluateAll(subject: CredentialSubject, contexts: SellingContext[]) {
  return contexts.map((c) => evaluate(subject, c));
}

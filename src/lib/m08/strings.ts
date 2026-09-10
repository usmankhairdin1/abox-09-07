/**
 * M08 bilingual content. English and Spanish are authored together — Spanish is
 * not a later phase. Layouts must tolerate the longer Spanish strings below.
 */

export type Locale = "en" | "es";

type Entry = { en: string; es: string };

export const M08_STRINGS = {
  "module.name": { en: "Selling Setup", es: "Configuración de venta" },
  "module.lede": {
    en: "Your licences, appointments, product authority, E&O, training and attribution — recorded in one place, shown separately, with what blocks a specific sale.",
    es: "Sus licencias, nombramientos, autoridad de producto, E&O, capacitación y atribución: registrados en un solo lugar, mostrados por separado, con lo que bloquea una venta específica.",
  },

  "screen.001": { en: "Selling Setup overview", es: "Resumen de configuración de venta" },
  "screen.002": { en: "Where I can sell", es: "Dónde puedo vender" },
  "screen.003": { en: "What is blocking me", es: "Qué me está bloqueando" },
  "screen.004": { en: "Licences", es: "Licencias" },
  "screen.005": { en: "Appointments", es: "Nombramientos" },
  "screen.006": { en: "Product authority", es: "Autoridad de producto" },
  "screen.007": { en: "E&O coverage", es: "Cobertura E&O" },
  "screen.008": { en: "Training and marketplace information", es: "Capacitación e información del mercado" },
  "screen.009": { en: "Credential documents", es: "Documentos de credenciales" },
  "screen.010": { en: "NPN attribution summary", es: "Resumen de atribución de NPN" },

  "outcome.ALLOWED": { en: "Allowed", es: "Permitido" },
  "outcome.MORE_INFORMATION_NEEDED": { en: "More information needed", es: "Se necesita más información" },
  "outcome.NOT_ALLOWED": { en: "Not allowed", es: "No permitido" },
  "outcome.NOT_APPLICABLE": { en: "Not applicable", es: "No aplica" },

  "dim.credential": { en: "Credential status", es: "Estado de credencial" },
  "dim.verification": { en: "Verification status", es: "Estado de verificación" },
  "dim.appointment": { en: "Appointment status", es: "Estado de nombramiento" },
  "dim.authority": { en: "Product authority", es: "Autoridad de producto" },
  "dim.eo": { en: "E&O and required training", es: "E&O y capacitación requerida" },
  "dim.hold": { en: "Compliance holds", es: "Retenciones de cumplimiento" },
  "dim.affiliation": { en: "Affiliation and operational readiness", es: "Afiliación y preparación operativa" },
  "dim.route": { en: "Marketplace and route readiness", es: "Preparación de mercado y ruta" },
  "dim.contextual": { en: "Contextual authority", es: "Autoridad contextual" },
  "dim.separate": {
    en: "These dimensions are reported separately and are never combined into a single status.",
    es: "Estas dimensiones se informan por separado y nunca se combinan en un solo estado.",
  },

  "label.asOf": { en: "As of", es: "Vigente al" },
  "label.scope": { en: "Scope", es: "Alcance" },
  "label.context": { en: "Evaluated context", es: "Contexto evaluado" },
  "label.agency": { en: "Agency", es: "Agencia" },
  "label.actingProducer": { en: "Acting producer", es: "Productor actuante" },
  "label.resolvedNpn": { en: "Resolved NPN", es: "NPN resuelto" },
  "label.carrier": { en: "Carrier", es: "Aseguradora" },
  "label.productScope": { en: "Product scope", es: "Alcance de producto" },
  "label.state": { en: "State", es: "Estado" },
  "label.market": { en: "Market", es: "Mercado" },
  "label.pathway": { en: "Pathway", es: "Vía" },
  "label.action": { en: "Action", es: "Acción" },
  "label.effectiveDate": { en: "Effective date", es: "Fecha de vigencia" },
  "label.recordedBy": { en: "Recorded by", es: "Registrado por" },
  "label.source": { en: "Source", es: "Origen" },
  "label.recordedAt": { en: "Recorded at", es: "Registrado el" },
  "label.whoCanCorrect": { en: "Who can correct this", es: "Quién puede corregirlo" },
  "label.whatHappensNext": { en: "What happens next", es: "Qué sucede después" },
  "label.reasonCode": { en: "Reason code", es: "Código de motivo" },
  "label.remediation": { en: "How to resolve", es: "Cómo resolverlo" },
  "label.history": { en: "History and evidence", es: "Historial y evidencia" },
  "label.audit": { en: "Audit metadata", es: "Metadatos de auditoría" },
  "label.traceability": { en: "Traceability", es: "Trazabilidad" },
  "label.permission": { en: "Permission", es: "Permiso" },
  "label.capability": { en: "Capability", es: "Capacidad" },
  "label.flow": { en: "Flow", es: "Flujo" },
  "label.optional": { en: "Optional — never blocking", es: "Opcional: nunca bloqueante" },
  "label.required": { en: "Required", es: "Requerido" },
  "label.language": { en: "Language", es: "Idioma" },
  "label.filter": { en: "Filter", es: "Filtrar" },
  "label.search": { en: "Search", es: "Buscar" },
  "label.viewDetail": { en: "View detail", es: "Ver detalle" },
  "label.back": { en: "Back to list", es: "Volver a la lista" },
  "label.readOnly": { en: "Read only", es: "Solo lectura" },
  "label.reviewMode": { en: "Review mode — no enforcement is active", es: "Modo de revisión: no hay aplicación activa" },

  "note.flowUndefined": {
    en: "The source package defines no flow identifier for this screen. Requirement and acceptance records apply instead.",
    es: "El paquete de origen no define un identificador de flujo para esta pantalla. En su lugar aplican los registros de requisitos y aceptación.",
  },
  "note.approvalDependent": {
    en: "Approval dependent — this surface relies on proposed prior-module deltas that are not approved.",
    es: "Depende de aprobación: esta superficie depende de deltas propuestos de módulos anteriores que no están aprobados.",
  },
  "note.sampleData": {
    en: "Governed sample data. No production credential record is created, changed or enforced here.",
    es: "Datos de muestra gobernados. Aquí no se crea, cambia ni aplica ningún registro de credencial de producción.",
  },
  "note.agencyEntered": {
    en: "Agency-entered appointment. It is active now and is not awaiting carrier confirmation.",
    es: "Nombramiento registrado por la agencia. Está activo ahora y no espera confirmación de la aseguradora.",
  },
  "note.verificationOptional": {
    en: "Verification was not purchased for this record. The licence remains active; unverified is not incomplete.",
    es: "No se compró verificación para este registro. La licencia sigue activa; sin verificar no significa incompleta.",
  },
  "note.marketplaceOptional": {
    en: "Marketplace registration and training information is informational. Missing or expired values raise no alert and create no onboarding task.",
    es: "La información de registro y capacitación del mercado es informativa. Los valores faltantes o vencidos no generan alertas ni tareas de incorporación.",
  },
  "note.npnRoles": {
    en: "Selecting another NPN for attribution does not give the acting agent that person's licence or appointment.",
    es: "Seleccionar otro NPN para la atribución no otorga al agente actuante la licencia ni el nombramiento de esa persona.",
  },
  "note.npnReadOnly": {
    en: "This is a read-only explanation of applied attribution. Policy configuration and simulation are administered elsewhere.",
    es: "Esta es una explicación de solo lectura de la atribución aplicada. La configuración y simulación de políticas se administran en otro lugar.",
  },
  "note.m13": {
    en: "Documents are stored and retrieved by M13. M08 records the reference only.",
    es: "Los documentos son almacenados y recuperados por M13. M08 solo registra la referencia.",
  },
  "note.m13Unavailable": {
    en: "The document service is not available in this environment, so the file cannot be opened. The reference below is still recorded.",
    es: "El servicio de documentos no está disponible en este entorno, por lo que no se puede abrir el archivo. La referencia siguiente sigue registrada.",
  },
  "note.resume": {
    en: "You arrived from a transaction in progress. Your selected plan and context are held; resolving the item below returns you there and re-evaluates.",
    es: "Llegó desde una transacción en curso. Su plan y contexto seleccionados se conservan; resolver el elemento siguiente lo devuelve allí y vuelve a evaluar.",
  },
  "action.returnToTransaction": { en: "Return to the transaction", es: "Volver a la transacción" },
  "empty.blockers": {
    en: "Nothing is blocking this context. Other contexts may still require information.",
    es: "Nada bloquea este contexto. Otros contextos aún pueden requerir información.",
  },
  "empty.rows": { en: "No records match the current scope and filters.", es: "Ningún registro coincide con el alcance y los filtros actuales." },
  "denied.title": { en: "You do not have access to this record", es: "No tiene acceso a este registro" },
  "denied.body": {
    en: "This screen requires a permission your current role does not hold. Nothing is shown rather than showing a partial record.",
    es: "Esta pantalla requiere un permiso que su rol actual no tiene. No se muestra nada en lugar de mostrar un registro parcial.",
  },
  "loading": { en: "Loading records…", es: "Cargando registros…" },
} satisfies Record<string, Entry>;

export type M08StringKey = keyof typeof M08_STRINGS;

export function t(locale: Locale, key: M08StringKey): string {
  return M08_STRINGS[key][locale];
}

/* Enumeration labels are translated from a controlled map, never free text. */
const ENUM_LABELS: Record<string, Entry> = {
  ACTIVE: { en: "Active", es: "Activa" },
  DRAFT: { en: "Draft", es: "Borrador" },
  SUSPENDED: { en: "Suspended", es: "Suspendida" },
  EXPIRED: { en: "Expired", es: "Vencida" },
  REVOKED: { en: "Revoked", es: "Revocada" },
  SURRENDERED: { en: "Surrendered", es: "Entregada" },
  SUPERSEDED: { en: "Superseded", es: "Reemplazada" },
  WITHDRAWN: { en: "Withdrawn", es: "Retirada" },
  NOT_STARTED: { en: "Not started", es: "No iniciada" },
  NOT_VERIFIED: { en: "Not verified", es: "Sin verificar" },
  REQUESTED: { en: "Requested", es: "Solicitada" },
  QUEUED: { en: "Queued", es: "En cola" },
  RUNNING: { en: "Running", es: "En curso" },
  VERIFIED: { en: "Verified", es: "Verificada" },
  CONFLICT: { en: "Conflict", es: "Conflicto" },
  NOT_FOUND: { en: "Not found", es: "No encontrada" },
  FAILED: { en: "Failed", es: "Fallida" },
  DISPUTED: { en: "Disputed", es: "En disputa" },
  AGENT_ATTESTED: { en: "Agent attested", es: "Declarado por el agente" },
  AGENCY_ATTESTED: { en: "Agency attested", es: "Declarado por la agencia" },
  JET_ATTESTED: { en: "JET attested", es: "Declarado por JET" },
  EXTERNAL_VERIFIED: { en: "Externally verified", es: "Verificado externamente" },
  MIGRATED: { en: "Migrated", es: "Migrado" },
  REQUIRED_BEFORE_SALE: { en: "Required before sale", es: "Requerido antes de la venta" },
  JUST_IN_TIME: { en: "Just in time", es: "Justo a tiempo" },
  NOT_REQUIRED: { en: "Not required", es: "No requerido" },
  DIRECT_CARRIER: { en: "Direct carrier contract", es: "Contrato directo con la aseguradora" },
  AGENCY_SPONSORED: { en: "Agency sponsored", es: "Patrocinado por la agencia" },
  UPLINE_SPONSORED: { en: "Upline sponsored", es: "Patrocinado por la línea superior" },
  JET_SPONSORED: { en: "JET sponsored", es: "Patrocinado por JET" },
  APPOINTMENT_NOT_REQUIRED: { en: "Appointment not required", es: "Nombramiento no requerido" },
  ON_EXCHANGE: { en: "On exchange", es: "En el mercado" },
  OFF_EXCHANGE: { en: "Off exchange", es: "Fuera del mercado" },
  NEW_SALE: { en: "New sale", es: "Venta nueva" },
  RENEWAL: { en: "Renewal", es: "Renovación" },
  POLICY_CHANGE: { en: "Policy change", es: "Cambio de póliza" },
  SERVICING: { en: "Servicing", es: "Servicio" },
  APPLICATION_SUBMISSION: { en: "Application submission", es: "Envío de solicitud" },
  AGENT_REASSIGNMENT: { en: "Agent reassignment", es: "Reasignación de agente" },
  IFP: { en: "Individual and family", es: "Individual y familiar" },
  ICHRA: { en: "ICHRA", es: "ICHRA" },
  JET_EDE: { en: "JET enhanced direct enrolment", es: "Inscripción directa mejorada de JET" },
  EXTERNAL_ENROLLMENT: { en: "External enrolment", es: "Inscripción externa" },
  QUOTE_ONLY: { en: "Quote only", es: "Solo cotización" },
  APPLICATION_PDF: { en: "PDF application", es: "Solicitud en PDF" },
  APPLICATION_EDI: { en: "EDI application", es: "Solicitud EDI" },
  MANUAL_REVIEW: { en: "Manual review", es: "Revisión manual" },
  REQUIRED: { en: "Required", es: "Requerido" },
  OPTIONAL: { en: "Optional", es: "Opcional" },
  NOT_APPLICABLE: { en: "Not applicable", es: "No aplica" },
  UNKNOWN: { en: "Unknown", es: "Desconocido" },
  NOT_TRACKED: { en: "Not tracked", es: "No registrado" },
  INFORMATIONAL_ACTIVE: { en: "Informational — current", es: "Informativo: vigente" },
  INFORMATIONAL_EXPIRED: { en: "Informational — expired", es: "Informativo: vencido" },
  INFORMATIONAL_UNKNOWN: { en: "Informational — unknown", es: "Informativo: desconocido" },
  INDIVIDUAL: { en: "Individual", es: "Individual" },
  BUSINESS_ENTITY: { en: "Business entity", es: "Entidad comercial" },
  AGENCY: { en: "Agency", es: "Agencia" },
  JET: { en: "JET", es: "JET" },
  ACTING_PRODUCER: { en: "Acting producer", es: "Productor actuante" },
  ATTRIBUTION: { en: "Attribution", es: "Atribución" },
  MARKETPLACE_SUBMISSION: { en: "Marketplace submission", es: "Envío al mercado" },
  CARRIER_CREDIT: { en: "Carrier credit", es: "Crédito de la aseguradora" },
  PRODUCER_OF_RECORD: { en: "Producer of record", es: "Productor de registro" },
  DESIGNATED_PRODUCER: { en: "Designated producer", es: "Productor designado" },
  UPLINE: { en: "Upline", es: "Línea superior" },
  RELATED_ENTITY: { en: "Related entity", es: "Entidad relacionada" },
  JET_SPONSOR: { en: "JET sponsor", es: "Patrocinador JET" },
  AVAILABLE: { en: "Available", es: "Disponible" },
  DEPENDENCY_UNAVAILABLE: { en: "Dependency unavailable", es: "Dependencia no disponible" },
  PENDING: { en: "Pending", es: "Pendiente" },
  AGENCY_GROUP: { en: "Agency group policy", es: "Póliza grupal de la agencia" },
};

export function enumLabel(locale: Locale, value: string | null | undefined): string {
  if (!value) return "—";
  const found = ENUM_LABELS[value];
  if (found) return found[locale];
  return value.replaceAll("_", " ").toLowerCase();
}

export function formatDate(locale: Locale, iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(locale === "es" ? "es-US" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatMoney(locale: Locale, amount: number, currency: string): string {
  return new Intl.NumberFormat(locale === "es" ? "es-US" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

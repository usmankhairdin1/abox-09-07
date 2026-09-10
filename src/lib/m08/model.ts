/**
 * M08 — Licensing, Appointments, Credentials and Selling Authority.
 *
 * Controlled model for Increment 1 (Agent-facing Selling Setup, SCR-M08-001 …
 * SCR-M08-010). Every enumeration below is copied from the packet's
 * Enumeration Register; no value is invented, widened or renamed.
 *
 * Baseline: ABox_Lucie_M08_..._Build_Packet_v1.0.
 */

/** ENUM-M08-001 — the only four contextual outcomes that exist in M08. */
export type AuthorityOutcome =
  | "ALLOWED"
  | "MORE_INFORMATION_NEEDED"
  | "NOT_ALLOWED"
  | "NOT_APPLICABLE";

/** ENUM-M08-002 */
export type CredentialStatus =
  | "DRAFT"
  | "ACTIVE"
  | "SUSPENDED"
  | "EXPIRED"
  | "REVOKED"
  | "SURRENDERED"
  | "SUPERSEDED"
  | "WITHDRAWN";

/** ENUM-M08-003 — never overwrites an attested fact. */
export type VerificationStatus =
  | "NOT_VERIFIED"
  | "REQUESTED"
  | "QUEUED"
  | "RUNNING"
  | "VERIFIED"
  | "CONFLICT"
  | "NOT_FOUND"
  | "FAILED"
  | "DISPUTED"
  | "SUPERSEDED";

/** ENUM-M08-004 */
export type AttestationSource =
  | "AGENT_ATTESTED"
  | "AGENCY_ATTESTED"
  | "JET_ATTESTED"
  | "EXTERNAL_VERIFIED"
  | "MIGRATED";

/** ENUM-M08-006 */
export type NPNRole =
  | "ACTING_PRODUCER"
  | "ATTRIBUTION"
  | "MARKETPLACE_SUBMISSION"
  | "AGENCY"
  | "CARRIER_CREDIT"
  | "SERVICING"
  | "PRODUCER_OF_RECORD";

/** ENUM-M08-005 */
export type NPNSubjectType = "INDIVIDUAL" | "BUSINESS_ENTITY";

/** ENUM-M08-007 */
export type NPNPolicyTargetType =
  | "ACTING_PRODUCER"
  | "AGENCY"
  | "DESIGNATED_PRODUCER"
  | "UPLINE"
  | "RELATED_ENTITY"
  | "JET_SPONSOR";

/** ENUM-M08-010 — no mode requires carrier confirmation in Lucie. */
export type AppointmentTiming =
  | "REQUIRED_BEFORE_SALE"
  | "JUST_IN_TIME"
  | "NOT_REQUIRED";

/** ENUM-M08-011 */
export type AuthorityBasis =
  | "DIRECT_CARRIER"
  | "AGENCY_SPONSORED"
  | "UPLINE_SPONSORED"
  | "JET_SPONSORED"
  | "JUST_IN_TIME"
  | "APPOINTMENT_NOT_REQUIRED";

/** ENUM-M08-012 — each action receives its own decision. */
export type TransactionType =
  | "NEW_SALE"
  | "RENEWAL"
  | "POLICY_CHANGE"
  | "SERVICING"
  | "APPLICATION_SUBMISSION"
  | "AGENT_REASSIGNMENT";

/** ENUM-M08-013 */
export type MarketType = "ON_EXCHANGE" | "OFF_EXCHANGE";

/** ENUM-M08-015 */
export type Pathway =
  | "IFP"
  | "ICHRA"
  | "JET_EDE"
  | "EXTERNAL_ENROLLMENT"
  | "QUOTE_ONLY"
  | "APPLICATION_PDF"
  | "APPLICATION_EDI"
  | "MANUAL_REVIEW";

/** ENUM-M08-016 */
export type HoldOwnerType = "AGENCY" | "JET";

/** ENUM-M08-017 — UNKNOWN never defaults to passed. */
export type RequirementDisposition =
  | "REQUIRED"
  | "OPTIONAL"
  | "NOT_APPLICABLE"
  | "UNKNOWN";

/** ENUM-M08-022 — optional and non-blocking in M08. */
export type MarketplaceInfoStatus =
  | "NOT_TRACKED"
  | "INFORMATIONAL_ACTIVE"
  | "INFORMATIONAL_EXPIRED"
  | "INFORMATIONAL_UNKNOWN";

/* ------------------------------------------------------------------ */
/* Records                                                             */
/* ------------------------------------------------------------------ */

export interface Provenance {
  source: AttestationSource;
  supplied_by: string;
  recorded_at: string;
}

export interface LineOfAuthority {
  line_of_authority_id: string;
  code: string;
  name_key: string;
  status: CredentialStatus;
  effective_from: string;
  effective_to: string | null;
}

/** OBJ — StateLicense + LicenseTerm + LineOfAuthorityTerm, flattened for display. */
export interface StateLicense {
  license_id: string;
  state_code: string;
  license_number: string;
  resident: boolean;
  status: CredentialStatus;
  effective_from: string;
  effective_to: string | null;
  lines: LineOfAuthority[];
  provenance: Provenance;
  verification: VerificationStatus;
  verification_note_key?: string;
  verified_at?: string | null;
}

export interface CarrierAppointment {
  appointment_id: string;
  carrier_id: string;
  carrier_name: string;
  state_code: string;
  product_family_key: string;
  timing: AppointmentTiming;
  status: CredentialStatus;
  effective_from: string;
  effective_to: string | null;
  writing_number: string | null;
  provenance: Provenance;
  verification: VerificationStatus;
}

export interface ProductAuthorityGrant {
  grant_id: string;
  carrier_id: string;
  carrier_name: string;
  product_scope_key: string;
  states: string[];
  basis: AuthorityBasis;
  sponsor_name: string | null;
  inherited_from: string | null;
  status: CredentialStatus;
  effective_from: string;
  effective_to: string | null;
  provenance: Provenance;
}

export interface EOCoverage {
  eo_id: string;
  kind: "INDIVIDUAL" | "AGENCY_GROUP";
  carrier_name: string;
  policy_number: string;
  per_claim_limit: number;
  aggregate_limit: number;
  currency: string;
  status: CredentialStatus;
  effective_from: string;
  effective_to: string | null;
  roster_member: boolean;
  provenance: Provenance;
}

export interface TrainingRecord {
  training_id: string;
  carrier_name: string | null;
  requirement_key: string;
  disposition: RequirementDisposition;
  status: CredentialStatus | "NOT_STARTED";
  completed_on: string | null;
  expires_on: string | null;
  provenance: Provenance | null;
}

export interface MarketplaceInformation {
  marketplace_info_id: string;
  status: MarketplaceInfoStatus;
  plan_year: string | null;
  recorded_on: string | null;
  provenance: Provenance | null;
}

/** M13 owns the binary; M08 stores the reference only (EXCL-M08-012). */
export interface CredentialDocumentReference {
  reference_id: string;
  m13_document_id: string;
  title_key: string;
  linked_record_id: string;
  linked_record_label_key: string;
  uploaded_on: string;
  availability: "AVAILABLE" | "DEPENDENCY_UNAVAILABLE" | "PENDING";
}

export interface ComplianceHold {
  hold_id: string;
  owner: HoldOwnerType;
  reason_key: string;
  scope_key: string;
  placed_on: string;
  released_on: string | null;
}

export interface NPNRecord {
  npn: string;
  subject_type: NPNSubjectType;
  subject_name: string;
  status: CredentialStatus;
}

export interface NPNRoleResolution {
  role: NPNRole;
  npn: string;
  subject_name: string;
  subject_type: NPNSubjectType;
  policy_source_key: string;
  target_type: NPNPolicyTargetType;
  locked: boolean;
}

export interface AffiliationContext {
  agency_name: string;
  agency_npn: string;
  affiliation_status: string;
  operational_readiness: string;
  captivity: string;
  effective_from: string;
}

export interface SellingContext {
  state_code: string;
  carrier_id: string;
  carrier_name: string;
  product_scope_key: string;
  market: MarketType;
  pathway: Pathway;
  transaction: TransactionType;
  effective_date: string;
}

export interface CredentialSubject {
  person_id: string;
  display_name: string;
  npn: NPNRecord;
  affiliation: AffiliationContext;
  licenses: StateLicense[];
  appointments: CarrierAppointment[];
  authority: ProductAuthorityGrant[];
  eo: EOCoverage[];
  training: TrainingRecord[];
  marketplace: MarketplaceInformation;
  documents: CredentialDocumentReference[];
  holds: ComplianceHold[];
  npn_roles: NPNRoleResolution[];
  as_of: string;
}

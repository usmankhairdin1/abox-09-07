-- V003__organization_profile_and_identifiers.sql
BEGIN;

CREATE TABLE lucie_m05.organization_contact (
  contact_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES lucie_m05.tenant(tenant_id),
  organization_id uuid NOT NULL REFERENCES lucie_m05.organization(organization_id),
  contact_role text NOT NULL CHECK (contact_role IN ('PRIMARY_BUSINESS','OPERATIONS','SUPPORT','COMPLIANCE')),
  name text NOT NULL,
  job_title text,
  email text NOT NULL,
  telephone text NOT NULL,
  preferred_language text NOT NULL DEFAULT 'EN' CHECK (preferred_language IN ('EN','ES')),
  user_id uuid,
  effective_from timestamptz NOT NULL DEFAULT now(),
  effective_to timestamptz,
  version integer NOT NULL DEFAULT 1 CHECK (version >= 1),
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (effective_to IS NULL OR effective_to > effective_from)
);

CREATE UNIQUE INDEX uq_m05_active_contact_role
ON lucie_m05.organization_contact (organization_id, contact_role)
WHERE effective_to IS NULL;

CREATE TABLE lucie_m05.organization_address (
  address_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES lucie_m05.tenant(tenant_id),
  organization_id uuid NOT NULL REFERENCES lucie_m05.organization(organization_id),
  location_type text NOT NULL CHECK (location_type IN ('HEADQUARTERS','OFFICE','MAILING')),
  line_1 text NOT NULL,
  line_2 text,
  city text NOT NULL,
  state_code char(2) NOT NULL,
  postal_code text NOT NULL,
  country_code char(2) NOT NULL DEFAULT 'US' CHECK (country_code = 'US'),
  validated_status text NOT NULL DEFAULT 'UNVERIFIED' CHECK (validated_status IN ('UNVERIFIED','PENDING_VERIFICATION','VERIFIED','REJECTED')),
  effective_from timestamptz NOT NULL DEFAULT now(),
  effective_to timestamptz,
  version integer NOT NULL DEFAULT 1 CHECK (version >= 1),
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (effective_to IS NULL OR effective_to > effective_from)
);

CREATE UNIQUE INDEX uq_m05_active_headquarters
ON lucie_m05.organization_address (organization_id)
WHERE location_type = 'HEADQUARTERS' AND effective_to IS NULL;

CREATE UNIQUE INDEX uq_m05_active_mailing
ON lucie_m05.organization_address (organization_id)
WHERE location_type = 'MAILING' AND effective_to IS NULL;

CREATE TABLE lucie_m05.office_location (
  office_location_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES lucie_m05.tenant(tenant_id),
  organization_id uuid NOT NULL REFERENCES lucie_m05.organization(organization_id),
  name text NOT NULL,
  address_id uuid NOT NULL REFERENCES lucie_m05.organization_address(address_id),
  telephone text,
  support_email text,
  time_zone text NOT NULL,
  status text NOT NULL CHECK (status IN ('DRAFT','ACTIVE','SUSPENDED','ENDED')),
  version integer NOT NULL DEFAULT 1 CHECK (version >= 1),
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE lucie_m05.organization_external_identifier (
  identifier_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES lucie_m05.tenant(tenant_id),
  organization_id uuid NOT NULL REFERENCES lucie_m05.organization(organization_id),
  identifier_type text NOT NULL CHECK (identifier_type IN ('EIN','AGENCY_NPN','NAIC_CARRIER_CODE','JET_CUSTOMER_CODE','VENDOR_REFERENCE','PARTNER_REFERENCE','EXTERNAL_ORGANIZATION_CODE')),
  encrypted_value bytea NOT NULL,
  value_hash text NOT NULL,
  masked_value text NOT NULL,
  source text NOT NULL,
  verification_status text NOT NULL CHECK (verification_status IN ('UNVERIFIED','PENDING_VERIFICATION','VERIFIED','REJECTED')),
  verified_at timestamptz,
  verified_by uuid,
  evidence_document_id uuid,
  effective_from timestamptz NOT NULL DEFAULT now(),
  effective_to timestamptz,
  version integer NOT NULL DEFAULT 1 CHECK (version >= 1),
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (effective_to IS NULL OR effective_to > effective_from)
);

CREATE UNIQUE INDEX uq_m05_effective_identifier
ON lucie_m05.organization_external_identifier (tenant_id, identifier_type, value_hash)
WHERE effective_to IS NULL AND verification_status <> 'REJECTED';

CREATE TABLE lucie_m05.organization_setting (
  setting_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES lucie_m05.tenant(tenant_id),
  organization_id uuid NOT NULL REFERENCES lucie_m05.organization(organization_id),
  setting_key text NOT NULL,
  value_json jsonb NOT NULL,
  source text NOT NULL CHECK (source IN ('ROOT_DEFAULT','DOWNLINE','ROOT_OVERRIDE','JET_OVERRIDE')),
  overridden_by_scope text,
  effective_from timestamptz NOT NULL DEFAULT now(),
  effective_to timestamptz,
  version integer NOT NULL DEFAULT 1 CHECK (version >= 1),
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (effective_to IS NULL OR effective_to > effective_from)
);

CREATE UNIQUE INDEX uq_m05_active_setting
ON lucie_m05.organization_setting (organization_id, setting_key)
WHERE effective_to IS NULL;

CREATE TABLE lucie_m05.business_hours (
  business_hours_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES lucie_m05.tenant(tenant_id),
  organization_id uuid NOT NULL REFERENCES lucie_m05.organization(organization_id),
  office_location_id uuid REFERENCES lucie_m05.office_location(office_location_id),
  time_zone text NOT NULL,
  weekly_schedule_json jsonb NOT NULL,
  effective_from timestamptz NOT NULL DEFAULT now(),
  effective_to timestamptz,
  version integer NOT NULL DEFAULT 1 CHECK (version >= 1),
  CHECK (effective_to IS NULL OR effective_to > effective_from)
);

CREATE TABLE lucie_m05.organization_note (
  note_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES lucie_m05.tenant(tenant_id),
  organization_id uuid NOT NULL REFERENCES lucie_m05.organization(organization_id),
  visibility text NOT NULL CHECK (visibility IN ('AGENCY_VISIBLE','JET_ONLY')),
  body text NOT NULL CHECK (length(body) BETWEEN 1 AND 8000),
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  supersedes_note_id uuid REFERENCES lucie_m05.organization_note(note_id)
);

CREATE TABLE lucie_m05.organization_document_reference (
  reference_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES lucie_m05.tenant(tenant_id),
  organization_id uuid NOT NULL REFERENCES lucie_m05.organization(organization_id),
  document_id uuid NOT NULL,
  purpose text NOT NULL,
  status text NOT NULL,
  effective_from timestamptz NOT NULL DEFAULT now(),
  effective_to timestamptz,
  version integer NOT NULL DEFAULT 1 CHECK (version >= 1),
  CHECK (effective_to IS NULL OR effective_to > effective_from)
);

COMMIT;
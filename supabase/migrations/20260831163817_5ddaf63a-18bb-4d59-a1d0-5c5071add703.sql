-- V002__tenant_organization_and_relationship.sql
BEGIN;

CREATE TABLE lucie_m05.tenant (
  tenant_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_code text NOT NULL UNIQUE CHECK (reference_code ~ '^[A-Z0-9_]{3,50}$'),
  display_name text NOT NULL CHECK (length(trim(display_name)) BETWEEN 1 AND 200),
  owning_organization_id uuid,
  lifecycle_status text NOT NULL CHECK (lifecycle_status IN ('DRAFT','ACTIVE','SUSPENDED','ENDED')),
  boundary_classification text NOT NULL,
  privacy_classification_reference text,
  commercial_activation_reference text,
  default_marketplace_id uuid,
  effective_from timestamptz NOT NULL DEFAULT now(),
  effective_to timestamptz,
  version integer NOT NULL DEFAULT 1 CHECK (version >= 1),
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  jet_only_notes text,
  CHECK (effective_to IS NULL OR effective_to > effective_from)
);

CREATE TABLE lucie_m05.organization (
  organization_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES lucie_m05.tenant(tenant_id) ON DELETE RESTRICT,
  reference_code text NOT NULL CHECK (reference_code ~ '^[A-Z0-9_]{3,50}$'),
  organization_type text NOT NULL CHECK (organization_type IN ('JET_PLATFORM','AGENCY','EMPLOYER','CARRIER','VENDOR','PARTNER')),
  legal_name text NOT NULL CHECK (length(trim(legal_name)) BETWEEN 1 AND 250),
  display_name text NOT NULL CHECK (length(trim(display_name)) BETWEEN 1 AND 200),
  dba_name text,
  lifecycle_status text NOT NULL CHECK (lifecycle_status IN ('DRAFT','ACTIVE','SUSPENDED','ENDED')),
  primary_business_email text,
  primary_business_telephone text,
  website text,
  time_zone text NOT NULL DEFAULT 'America/New_York',
  default_language text NOT NULL DEFAULT 'EN' CHECK (default_language IN ('EN','ES')),
  effective_from timestamptz NOT NULL DEFAULT now(),
  effective_to timestamptz,
  version integer NOT NULL DEFAULT 1 CHECK (version >= 1),
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, reference_code),
  CHECK (effective_to IS NULL OR effective_to > effective_from)
);

ALTER TABLE lucie_m05.tenant
ADD CONSTRAINT fk_tenant_owner
FOREIGN KEY (owning_organization_id)
REFERENCES lucie_m05.organization(organization_id)
DEFERRABLE INITIALLY DEFERRED;

CREATE TABLE lucie_m05.organization_relationship (
  relationship_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES lucie_m05.tenant(tenant_id) ON DELETE RESTRICT,
  parent_organization_id uuid NOT NULL REFERENCES lucie_m05.organization(organization_id) ON DELETE RESTRICT,
  child_organization_id uuid NOT NULL REFERENCES lucie_m05.organization(organization_id) ON DELETE RESTRICT,
  relationship_type text NOT NULL DEFAULT 'PARENT_OF' CHECK (relationship_type = 'PARENT_OF'),
  status text NOT NULL CHECK (status IN ('PENDING','ACTIVE','ENDED')),
  effective_from timestamptz NOT NULL,
  effective_to timestamptz,
  activation_at timestamptz,
  ended_at timestamptz,
  end_reason_code text,
  version integer NOT NULL DEFAULT 1 CHECK (version >= 1),
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (parent_organization_id <> child_organization_id),
  CHECK (effective_to IS NULL OR effective_to > effective_from)
);

CREATE UNIQUE INDEX uq_m05_one_active_parent
ON lucie_m05.organization_relationship (child_organization_id)
WHERE status = 'ACTIVE';

CREATE UNIQUE INDEX uq_m05_relationship_effective
ON lucie_m05.organization_relationship (
  parent_organization_id,
  child_organization_id,
  relationship_type,
  effective_from
);

CREATE OR REPLACE FUNCTION lucie_m05.validate_relationship()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  parent_tenant uuid;
  child_tenant uuid;
  parent_type text;
  child_type text;
  child_is_downline boolean;
  creates_cycle boolean;
BEGIN
  SELECT tenant_id, organization_type
    INTO parent_tenant, parent_type
  FROM lucie_m05.organization
  WHERE organization_id = NEW.parent_organization_id;

  SELECT tenant_id, organization_type
    INTO child_tenant, child_type
  FROM lucie_m05.organization
  WHERE organization_id = NEW.child_organization_id;

  IF parent_tenant IS NULL OR child_tenant IS NULL THEN
    RAISE EXCEPTION 'M05_RELATIONSHIP_ORGANIZATION_NOT_FOUND';
  END IF;
  IF parent_tenant <> child_tenant OR NEW.tenant_id <> parent_tenant THEN
    RAISE EXCEPTION 'M05_RELATIONSHIP_CROSS_TENANT';
  END IF;
  IF parent_type <> 'AGENCY' OR child_type <> 'AGENCY' THEN
    RAISE EXCEPTION 'M05_RELATIONSHIP_AGENCY_ONLY';
  END IF;

  IF NEW.status = 'ACTIVE' THEN
    SELECT EXISTS (
      SELECT 1
      FROM lucie_m05.organization_relationship existing
      WHERE existing.child_organization_id = NEW.parent_organization_id
        AND existing.status = 'ACTIVE'
        AND existing.relationship_id <> NEW.relationship_id
    ) INTO child_is_downline;
    IF child_is_downline THEN
      RAISE EXCEPTION 'M05_RELATIONSHIP_DEPTH';
    END IF;

    WITH RECURSIVE ancestors AS (
      SELECT parent_organization_id, child_organization_id
      FROM lucie_m05.organization_relationship
      WHERE child_organization_id = NEW.parent_organization_id
        AND status = 'ACTIVE'
      UNION ALL
      SELECT r.parent_organization_id, r.child_organization_id
      FROM lucie_m05.organization_relationship r
      JOIN ancestors a ON r.child_organization_id = a.parent_organization_id
      WHERE r.status = 'ACTIVE'
    )
    SELECT EXISTS (
      SELECT 1 FROM ancestors WHERE parent_organization_id = NEW.child_organization_id
    ) INTO creates_cycle;
    IF creates_cycle THEN
      RAISE EXCEPTION 'M05_RELATIONSHIP_CYCLE';
    END IF;
  END IF;
  RETURN NEW;
END
$$;

CREATE TRIGGER trg_validate_relationship
BEFORE INSERT OR UPDATE ON lucie_m05.organization_relationship
FOR EACH ROW EXECUTE FUNCTION lucie_m05.validate_relationship();

CREATE OR REPLACE FUNCTION lucie_m05.validate_tenant_owner()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE owner_tenant uuid;
BEGIN
  IF NEW.owning_organization_id IS NULL THEN
    RETURN NEW;
  END IF;
  SELECT tenant_id INTO owner_tenant
  FROM lucie_m05.organization
  WHERE organization_id = NEW.owning_organization_id;
  IF owner_tenant IS DISTINCT FROM NEW.tenant_id THEN
    RAISE EXCEPTION 'M05_ROOT_OWNER_MISMATCH';
  END IF;
  RETURN NEW;
END
$$;

CREATE TRIGGER trg_validate_tenant_owner
BEFORE INSERT OR UPDATE OF owning_organization_id ON lucie_m05.tenant
FOR EACH ROW EXECUTE FUNCTION lucie_m05.validate_tenant_owner();

COMMIT;
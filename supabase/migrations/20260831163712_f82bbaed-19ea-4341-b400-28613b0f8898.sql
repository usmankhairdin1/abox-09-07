-- V001__extensions_context_and_control.sql
BEGIN;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE SCHEMA IF NOT EXISTS lucie_m05;

CREATE OR REPLACE FUNCTION lucie_m05.current_tenant_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF(current_setting('abox.tenant_id', true), '')::uuid
$$;

CREATE OR REPLACE FUNCTION lucie_m05.current_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF(current_setting('abox.user_id', true), '')::uuid
$$;

CREATE OR REPLACE FUNCTION lucie_m05.is_jet_admin()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(NULLIF(current_setting('abox.is_jet_admin', true), '')::boolean, false)
$$;

CREATE TABLE lucie_m05.idempotency_record (
  idempotency_record_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  idempotency_key text NOT NULL,
  operation_id text NOT NULL,
  request_hash text NOT NULL,
  response_status integer,
  response_body jsonb,
  state text NOT NULL CHECK (state IN ('IN_PROGRESS','COMPLETED','FAILED')),
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  UNIQUE (tenant_id, idempotency_key, operation_id)
);

CREATE TABLE lucie_m05.event_outbox (
  outbox_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL UNIQUE,
  tenant_id uuid NOT NULL,
  aggregate_type text NOT NULL,
  aggregate_id uuid NOT NULL,
  aggregate_version integer NOT NULL CHECK (aggregate_version >= 1),
  event_type text NOT NULL,
  event_version text NOT NULL DEFAULT '1.0',
  payload jsonb NOT NULL,
  correlation_id uuid NOT NULL,
  causation_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz,
  publish_attempt_count integer NOT NULL DEFAULT 0 CHECK (publish_attempt_count >= 0),
  last_error_code text
);

CREATE INDEX idx_m05_outbox_unpublished
ON lucie_m05.event_outbox (created_at)
WHERE published_at IS NULL;

CREATE TABLE lucie_m05.schema_version_evidence (
  schema_version text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now(),
  applied_by text NOT NULL,
  artifact_sha256 text NOT NULL,
  evidence jsonb NOT NULL DEFAULT '{}'::jsonb
);

COMMIT;
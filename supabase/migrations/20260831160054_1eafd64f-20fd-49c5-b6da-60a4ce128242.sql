-- ABox Lucie M00 Platform Foundation - PostgreSQL migration V001 v1.1
-- Extensions, schema and request-context functions. Execute with a migration owner; application roles must not own schema objects.
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE SCHEMA IF NOT EXISTS m00;

CREATE OR REPLACE FUNCTION m00.current_user_id() RETURNS uuid LANGUAGE sql STABLE AS $$
  SELECT NULLIF(current_setting('app.user_id', true), '')::uuid
$$;
CREATE OR REPLACE FUNCTION m00.current_tenant_id() RETURNS uuid LANGUAGE sql STABLE AS $$
  SELECT NULLIF(current_setting('app.tenant_id', true), '')::uuid
$$;
CREATE OR REPLACE FUNCTION m00.is_platform_admin() RETURNS boolean LANGUAGE sql STABLE AS $$
  SELECT COALESCE(NULLIF(current_setting('app.is_platform_admin', true), '')::boolean, false)
$$;
CREATE OR REPLACE FUNCTION m00.touch_version() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.version := OLD.version + 1;
  NEW.updated_at := clock_timestamp();
  NEW.updated_by := m00.current_user_id();
  RETURN NEW;
END $$;
CREATE OR REPLACE FUNCTION m00.prevent_mutation() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'immutable evidence record: %.%', TG_TABLE_SCHEMA, TG_TABLE_NAME USING ERRCODE='55000';
END $$;
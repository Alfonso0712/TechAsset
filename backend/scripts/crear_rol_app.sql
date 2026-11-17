-- =============================================================================
-- TechAsset · Script de creación de rol de aplicación con privilegios mínimos
-- Ejecutar conectado con un rol administrador (ej. postgres) sobre techasset_db
-- =============================================================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_catalog.pg_roles WHERE rolname = 'techasset_app') THEN
        CREATE ROLE techasset_app WITH
            LOGIN
            NOSUPERUSER
            NOCREATEDB
            NOCREATEROLE
            NOINHERIT
            NOREPLICATION;
    END IF;
END
$$;

GRANT CONNECT ON DATABASE techasset_db TO techasset_app;
GRANT USAGE ON SCHEMA public TO techasset_app;
REVOKE CREATE ON SCHEMA public FROM techasset_app;

GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO techasset_app;
REVOKE DELETE, TRUNCATE, REFERENCES, TRIGGER ON ALL TABLES IN SCHEMA public FROM techasset_app;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO techasset_app;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT SELECT, INSERT, UPDATE ON TABLES TO techasset_app;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT USAGE, SELECT ON SEQUENCES TO techasset_app;

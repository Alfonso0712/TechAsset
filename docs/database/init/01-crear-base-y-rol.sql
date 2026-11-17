-- =============================================================================
-- TechAsset · Script de creación de base de datos y rol de aplicación
-- Ejecutar conectado como superusuario (postgres):
-- psql -U postgres -v app_password='<CONTRASENA>' -f docs/database/init/01-crear-base-y-rol.sql
-- =============================================================================

-- 1. Crear base de datos techasset_db si no existe
SELECT 'CREATE DATABASE techasset_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'techasset_db')\gexec

\connect techasset_db

-- 2. Crear rol de aplicación techasset_app si no existe y actualizar contraseña
SELECT 'CREATE ROLE techasset_app WITH LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOREPLICATION PASSWORD ' || quote_literal(:'app_password')
WHERE NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'techasset_app')\gexec

ALTER ROLE techasset_app WITH PASSWORD :'app_password';

-- 3. Otorgar permisos de conexión y uso de esquema
GRANT CONNECT ON DATABASE techasset_db TO techasset_app;
GRANT USAGE ON SCHEMA public TO techasset_app;
REVOKE CREATE ON SCHEMA public FROM techasset_app;

-- 4. Otorgar SELECT, INSERT, UPDATE sobre tablas (sin DELETE físico según RN-06)
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO techasset_app;
REVOKE DELETE, TRUNCATE, REFERENCES, TRIGGER ON ALL TABLES IN SCHEMA public FROM techasset_app;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO techasset_app;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT SELECT, INSERT, UPDATE ON TABLES TO techasset_app;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT USAGE, SELECT ON SEQUENCES TO techasset_app;

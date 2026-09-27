-- FixiFy Database Initialization Script
-- Runs automatically on first PostgreSQL container start

-- Enable PostGIS extension for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types (Alembic will create tables, this handles extensions)
-- The actual tables are created by Alembic migrations.

-- Seed a default superadmin user (password: Admin123!)
-- hashed with bcrypt, 10 rounds
INSERT INTO users (id, email, hashed_password, full_name, role, is_active, is_verified, created_at, updated_at)
VALUES (
  uuid_generate_v4(),
  'admin@fixify.az',
  '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', -- password: secret
  'FixiFy Superadmin',
  'superadmin',
  true,
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

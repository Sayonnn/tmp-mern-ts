#!/bin/bash

# -----------------------------
# PostgreSQL Database Setup Script (Optimized, spm_clients + spm_admins separate)
# -----------------------------

# Change these variables to match your environment
DB_NAME="db_speedmate"
DB_USER="speedmate"
DB_PASSWORD="speedmate19!"
DB_CONTAINER="db_speedmate"
DB_HOST="postgres"
DB_PORT="5432"

# Export password so psql can use it
export PGPASSWORD=$DB_PASSWORD

echo "Dropping old spm_ tables (if any) and creating optimized tables in database '$DB_NAME'..."

docker exec -i $DB_CONTAINER psql -U $DB_USER -d $DB_NAME <<EOSQL

-- -----------------------------
-- Drop existing tables (order matters due to FKs)
-- -----------------------------
DROP TABLE IF EXISTS spm_login_history CASCADE;
DROP TABLE IF EXISTS spm_refresh_tokens CASCADE;
DROP TABLE IF EXISTS spm_admins CASCADE;
DROP TABLE IF EXISTS spm_clients CASCADE;

-- -----------------------------
-- Clients Table
-- -----------------------------
CREATE TABLE IF NOT EXISTS spm_clients (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'client', -- only 'client'
    provider VARCHAR(50) NOT NULL DEFAULT 'local',  -- 'local', 'google', 'sso', 'github'
    provider_id VARCHAR(255),                        -- social login id
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for fast lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_spm_clients_email ON spm_clients(email);
CREATE UNIQUE INDEX IF NOT EXISTS idx_spm_clients_provider_id ON spm_clients(provider, provider_id);
CREATE INDEX IF NOT EXISTS idx_spm_clients_role ON spm_clients(role);

-- -----------------------------
-- Admins Table (completely separate from clients)
-- -----------------------------
CREATE TABLE IF NOT EXISTS spm_admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'admin', -- only 'admin'
    super_admin BOOLEAN DEFAULT FALSE,
    permissions JSONB DEFAULT '{}',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index for super admins
CREATE INDEX IF NOT EXISTS idx_spm_admins_super ON spm_admins(super_admin);

-- -----------------------------
-- Refresh Tokens Table (linked only to clients)
-- -----------------------------
CREATE TABLE IF NOT EXISTS spm_refresh_tokens (
    id SERIAL PRIMARY KEY,
    client_id INT NOT NULL REFERENCES spm_clients(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL,
    token_type VARCHAR(20) NOT NULL DEFAULT 'standard',
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast token lookup
CREATE UNIQUE INDEX IF NOT EXISTS idx_spm_refresh_token ON spm_refresh_tokens(token);
CREATE INDEX IF NOT EXISTS idx_spm_refresh_token_client ON spm_refresh_tokens(client_id);
CREATE INDEX IF NOT EXISTS idx_spm_refresh_token_type ON spm_refresh_tokens(token_type);

-- -----------------------------
-- Login History Table (linked only to clients)
-- -----------------------------
CREATE TABLE IF NOT EXISTS spm_login_history (
    id SERIAL PRIMARY KEY,
    client_id INT NOT NULL REFERENCES spm_clients(id) ON DELETE CASCADE,
    login_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(50),
    user_agent TEXT
);

-- Index to speed up recent login queries
CREATE INDEX IF NOT EXISTS idx_spm_login_history_client ON spm_login_history(client_id);
CREATE INDEX IF NOT EXISTS idx_spm_login_history_date ON spm_login_history(login_at DESC);

-- -----------------------------
-- Insert default admin with permissions array [4,3,2] as JSONB
-- -----------------------------
INSERT INTO spm_admins (username, email, password, super_admin, permissions, role)
VALUES (
    'speedmate',
    'admin@speedmate.com',
    'a2UvvzUwfaMxvgj3i.9VjeOnocpGmK/Ht7cyN04P7wRdfa7LlT6f2S',  -- Replace with hash from Node.js output
    true,
    '[4,3,2]'::jsonb,
    'admin'
);

-- -----------------------------
-- Insert default client
-- -----------------------------
INSERT INTO spm_clients (username, email, password, role, provider, is_verified)
VALUES (
    'client',
    'client@speedmate.com',
    'a2UvvzUwfaMxvgj3i.9VjeOnocpGmK/Ht7cyN04P7wRdfa7LlT6f2S',  -- Replace with hash from Node.js output
    'client',
    'local',
    true
);

EOSQL

echo "✅ All old spm_ tables dropped and new optimized tables (spm_clients + spm_admins separate) created successfully!"

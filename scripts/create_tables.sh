#!/bin/bash

# -----------------------------
# PostgreSQL Database Setup Script (Optimized, ${DB_ABBR}_clients + ${DB_ABBR}_admins separate)
# -----------------------------

# Change these variables to match your environment
APP_NAME="speedmate"  
DB_ABBR="spm"
DB_NAME="db_${APP_NAME}"
DB_USER="${APP_NAME}"
DB_PASSWORD="${APP_NAME}19!"
DB_CONTAINER="db_${APP_NAME}"
DB_HOST="postgres"
DB_PORT="5432"

# Export password so psql can use it
export PGPASSWORD=$DB_PASSWORD

echo "Dropping old ${DB_ABBR}_ tables (if any) and creating optimized tables in database '$DB_NAME'..."

docker exec -i $DB_CONTAINER psql -U $DB_USER -d $DB_NAME <<EOSQL

-- -----------------------------
-- Drop existing tables (order matters due to FKs)
-- -----------------------------
DROP TABLE IF EXISTS ${DB_ABBR}_login_history CASCADE;
DROP TABLE IF EXISTS ${DB_ABBR}_refresh_tokens CASCADE;
DROP TABLE IF EXISTS ${DB_ABBR}_admins CASCADE;
DROP TABLE IF EXISTS ${DB_ABBR}_clients CASCADE;

-- -----------------------------
-- Clients Table
-- -----------------------------
CREATE TABLE IF NOT EXISTS ${DB_ABBR}_clients (
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
CREATE UNIQUE INDEX IF NOT EXISTS idx_${DB_ABBR}_clients_email ON ${DB_ABBR}_clients(email);
CREATE UNIQUE INDEX IF NOT EXISTS idx_${DB_ABBR}_clients_provider_id ON ${DB_ABBR}_clients(provider, provider_id);
CREATE INDEX IF NOT EXISTS idx_${DB_ABBR}_clients_role ON ${DB_ABBR}_clients(role);

-- -----------------------------
-- Admins Table (completely separate from clients)
-- -----------------------------
CREATE TABLE IF NOT EXISTS ${DB_ABBR}_admins (
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
CREATE INDEX IF NOT EXISTS idx_${DB_ABBR}_admins_super ON ${DB_ABBR}_admins(super_admin);

-- -----------------------------
-- Refresh Tokens Table (linked only to clients)
-- -----------------------------
CREATE TABLE IF NOT EXISTS ${DB_ABBR}_refresh_tokens (
    id SERIAL PRIMARY KEY,
    client_id INT NOT NULL REFERENCES ${DB_ABBR}_clients(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL,
    token_type VARCHAR(20) NOT NULL DEFAULT 'standard',
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast token lookup
CREATE UNIQUE INDEX IF NOT EXISTS idx_${DB_ABBR}_refresh_token ON ${DB_ABBR}_refresh_tokens(token);
CREATE INDEX IF NOT EXISTS idx_${DB_ABBR}_refresh_token_client ON ${DB_ABBR}_refresh_tokens(client_id);
CREATE INDEX IF NOT EXISTS idx_${DB_ABBR}_refresh_token_type ON ${DB_ABBR}_refresh_tokens(token_type);

-- -----------------------------
-- Login History Table (linked only to clients)
-- -----------------------------
CREATE TABLE IF NOT EXISTS ${DB_ABBR}_login_history (
    id SERIAL PRIMARY KEY,
    client_id INT NOT NULL REFERENCES ${DB_ABBR}_clients(id) ON DELETE CASCADE,
    login_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(50),
    user_agent TEXT
);

-- Index to speed up recent login queries
CREATE INDEX IF NOT EXISTS idx_${DB_ABBR}_login_history_client ON ${DB_ABBR}_login_history(client_id);
CREATE INDEX IF NOT EXISTS idx_${DB_ABBR}_login_history_date ON ${DB_ABBR}_login_history(login_at DESC);

-- -----------------------------
-- Insert default admin with permissions array [4,3,2] as JSONB
-- -----------------------------
INSERT INTO ${DB_ABBR}_admins (username, email, password, super_admin, permissions, role)
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
INSERT INTO ${DB_ABBR}_clients (username, email, password, role, provider, is_verified)
VALUES (
    'client',
    'client@speedmate.com',
    'a2UvvzUwfaMxvgj3i.9VjeOnocpGmK/Ht7cyN04P7wRdfa7LlT6f2S',  -- Replace with hash from Node.js output
    'client',
    'local',
    true
);

EOSQL

echo "✅ All old ${DB_ABBR}_ tables dropped and new optimized tables (${DB_ABBR}_clients + ${DB_ABBR}_admins separate) created successfully!"

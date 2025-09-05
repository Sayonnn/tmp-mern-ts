#!/bin/bash

# -----------------------------
# PostgreSQL Database Setup Script (Optimized, uge_clients + uge_admins separate)
# -----------------------------

# Change these variables to match your environment
DB_NAME="db_upguard"
DB_USER="upguard"
DB_PASSWORD="upguard19!"
DB_CONTAINER="db_upguard"
DB_HOST="postgres"
DB_PORT="5432"

# Export password so psql can use it
export PGPASSWORD=$DB_PASSWORD

echo "Dropping old uge_ tables (if any) and creating optimized tables in database '$DB_NAME'..."

docker exec -i $DB_CONTAINER psql -U $DB_USER -d $DB_NAME <<EOSQL

-- -----------------------------
-- Drop existing tables (order matters due to FKs)
-- -----------------------------
DROP TABLE IF EXISTS uge_login_history CASCADE;
DROP TABLE IF EXISTS uge_refresh_tokens CASCADE;
DROP TABLE IF EXISTS uge_admins CASCADE;
DROP TABLE IF EXISTS uge_clients CASCADE;

-- -----------------------------
-- Clients Table
-- -----------------------------
CREATE TABLE IF NOT EXISTS uge_clients (
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
CREATE UNIQUE INDEX IF NOT EXISTS idx_uge_clients_email ON uge_clients(email);
CREATE UNIQUE INDEX IF NOT EXISTS idx_uge_clients_provider_id ON uge_clients(provider, provider_id);
CREATE INDEX IF NOT EXISTS idx_uge_clients_role ON uge_clients(role);

-- -----------------------------
-- Admins Table (completely separate from clients)
-- -----------------------------
CREATE TABLE IF NOT EXISTS uge_admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    super_admin BOOLEAN DEFAULT FALSE,
    permissions JSONB DEFAULT '{}',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index for super admins
CREATE INDEX IF NOT EXISTS idx_uge_admins_super ON uge_admins(super_admin);

-- -----------------------------
-- Refresh Tokens Table (linked only to clients)
-- -----------------------------
CREATE TABLE IF NOT EXISTS uge_refresh_tokens (
    id SERIAL PRIMARY KEY,
    client_id INT NOT NULL REFERENCES uge_clients(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL,
    token_type VARCHAR(20) NOT NULL DEFAULT 'standard',
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast token lookup
CREATE UNIQUE INDEX IF NOT EXISTS idx_uge_refresh_token ON uge_refresh_tokens(token);
CREATE INDEX IF NOT EXISTS idx_uge_refresh_token_client ON uge_refresh_tokens(client_id);
CREATE INDEX IF NOT EXISTS idx_uge_refresh_token_type ON uge_refresh_tokens(token_type);

-- -----------------------------
-- Login History Table (linked only to clients)
-- -----------------------------
CREATE TABLE IF NOT EXISTS uge_login_history (
    id SERIAL PRIMARY KEY,
    client_id INT NOT NULL REFERENCES uge_clients(id) ON DELETE CASCADE,
    login_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(50),
    user_agent TEXT
);

-- Index to speed up recent login queries
CREATE INDEX IF NOT EXISTS idx_uge_login_history_client ON uge_login_history(client_id);
CREATE INDEX IF NOT EXISTS idx_uge_login_history_date ON uge_login_history(login_at DESC);

INSERT INTO uge_admins (username, email, password, super_admin, permissions) VALUES ('admin', 'admin@admin.com', 'admin', true, '{}');
INSERT INTO uge_clients (username, email, password) VALUES ('Client', 'client@client.com', 'client');

EOSQL

echo "✅ All old uge_ tables dropped and new optimized tables (uge_clients + uge_admins separate) created successfully!"

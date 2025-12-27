-- ============================================================================
-- GearGuard Database Schema
-- ============================================================================
-- Instructions:
-- 1. Create a new database named 'gearguard_db' in your PostgreSQL instance
-- 2. Open the Query Tool for that database
-- 3. Copy and paste this entire file and execute it (F5 in pgAdmin)
-- ============================================================================

-- ============================================================================
-- Phase 1: Cleanup & Setup
-- ============================================================================
-- This section ensures you start fresh and defines the specific "Types" (Enums)
-- required by the GearGuard spec.

-- 1. Clean up old tables if they exist (to avoid errors on re-running)
DROP TABLE IF EXISTS maintenance_requests;
DROP TABLE IF EXISTS team_members;
DROP TABLE IF EXISTS equipment;
DROP TABLE IF EXISTS maintenance_teams;
DROP TABLE IF EXISTS users;

-- 2. Clean up old types
DROP TYPE IF EXISTS user_role;
DROP TYPE IF EXISTS equipment_status;
DROP TYPE IF EXISTS request_type;
DROP TYPE IF EXISTS request_stage;
DROP TYPE IF EXISTS request_priority;

-- 3. Create ENUM Types (Static Choices)
CREATE TYPE user_role AS ENUM ('Manager', 'Technician');
CREATE TYPE equipment_status AS ENUM ('Active', 'Maintenance', 'Scrapped');
CREATE TYPE request_type AS ENUM ('Corrective', 'Preventive');
CREATE TYPE request_stage AS ENUM ('New', 'In Progress', 'Repaired', 'Scrap');
CREATE TYPE request_priority AS ENUM ('Low', 'Normal', 'High', 'Critical');

-- ============================================================================
-- Phase 2: The Core Tables (Rows & Columns)
-- ============================================================================
-- This builds the architecture. Pay attention to the REFERENCES lines—that is
-- what connects everything.

-- TABLE 1: USERS (Authentication & Profile)
-- Handles Login/Signup
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,      -- Username for Login
    password_hash VARCHAR(255) NOT NULL,     -- Store Hashed Password here
    full_name VARCHAR(100) NOT NULL,
    role user_role NOT NULL DEFAULT 'Technician',
    avatar_url TEXT,                         -- Optional avatar URL
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLE 2: MAINTENANCE TEAMS
CREATE TABLE maintenance_teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE        -- e.g., "Mechanics", "IT Support"
);

-- TABLE 3: TEAM MEMBERS (Junction Table)
-- Connects Users to Teams (Many-to-Many)
CREATE TABLE team_members (
    team_id INTEGER REFERENCES maintenance_teams(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (team_id, user_id)
);

-- TABLE 4: EQUIPMENT (Assets)
CREATE TABLE equipment (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    serial_number VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50),
    department VARCHAR(100),
    location VARCHAR(100),
    model VARCHAR(100),
    status equipment_status DEFAULT 'Active',
    
    -- THE CONNECTION LOGIC (Foreign Keys)
    assigned_team_id INTEGER REFERENCES maintenance_teams(id) ON DELETE SET NULL,
    assigned_technician_id INTEGER REFERENCES users(id) ON DELETE SET NULL,

    -- META DATA
    purchase_date DATE,
    warranty_end DATE,
    last_maintenance DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLE 5: MAINTENANCE REQUESTS (The Work)
CREATE TABLE maintenance_requests (
    id SERIAL PRIMARY KEY,
    subject VARCHAR(200) NOT NULL,
    description TEXT,
    req_type request_type NOT NULL,
    stage request_stage DEFAULT 'New',
    priority request_priority DEFAULT 'Normal',
    
    -- THE "SPIDERWEB" CONNECTIONS
    equipment_id INTEGER REFERENCES equipment(id) ON DELETE CASCADE,
    team_id INTEGER REFERENCES maintenance_teams(id) ON DELETE SET NULL,
    technician_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL,

    -- SCHEDULING & METRICS
    scheduled_date TIMESTAMP,
    due_date TIMESTAMP,
    close_date TIMESTAMP,
    duration_hours FLOAT DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- Phase 3: Sample Data (To Test Connections)
-- ============================================================================
-- Run this part to populate the database so you can test the "Login" and
-- "Kanban" views immediately.

-- 1. Insert Users (Password is 'password123' purely for example)
-- NOTE: In production, you should use proper password hashing (bcrypt, etc.)
INSERT INTO users (email, password_hash, full_name, role) VALUES 
('manager@gearguard.com', 'hashed_secret_123', 'Alice Manager', 'Manager'),
('tech1@gearguard.com', 'hashed_secret_123', 'Bob Fixit', 'Technician'),
('tech2@gearguard.com', 'hashed_secret_123', 'Charlie Spark', 'Technician');

-- 2. Insert Teams
INSERT INTO maintenance_teams (name) VALUES 
('Heavy Mechanics'), 
('IT Support');

-- 3. Assign Techs to Teams
-- Bob connects to Mechanics, Charlie connects to IT
INSERT INTO team_members (team_id, user_id) VALUES 
(1, 2), -- Mechanics -> Bob
(2, 3); -- IT -> Charlie

-- 4. Insert Equipment
INSERT INTO equipment (name, serial_number, category, department, location, model, purchase_date, warranty_end, last_maintenance, assigned_team_id, assigned_technician_id) VALUES 
('Generator X500', 'GEN-2024-001', 'Heavy Machinery', 'Production', 'Warehouse A', 'Generator Model X500', '2024-01-15', '2027-01-15', '2024-11-20', 1, 2),
('Dell Server Rack', 'SRV-2024-999', 'Computers', 'IT', 'Server Room', 'Dell PowerEdge R740', '2024-06-10', '2027-06-10', '2024-12-01', 2, 3);

-- 5. Insert a Maintenance Request
-- A request for the Generator, assigned to the Mechanics team
INSERT INTO maintenance_requests (subject, description, req_type, stage, priority, equipment_id, team_id, technician_id, created_by_id, scheduled_date, due_date) VALUES 
('Oil Leak Detected', 'Generator showing signs of oil leakage near the base', 'Corrective', 'New', 'High', 1, 1, 2, 1, NOW(), NOW() + INTERVAL '7 days');

-- ============================================================================
-- How this connects everything:
-- ============================================================================
-- Login: You verify the user against the users table using email and password_hash.
-- 
-- Auto-Fill Logic: When you select "Generator X500" (equipment_id: 1) in your app,
-- the database knows immediately that it belongs to "Heavy Mechanics" (team_id: 1)
-- because of the Foreign Key in the equipment table.
--
-- Kanban Board: You run SELECT * FROM maintenance_requests to populate your columns.
-- ============================================================================


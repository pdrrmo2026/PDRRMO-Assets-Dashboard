-- ============================================================
-- PDRRMO Assets Inventory Dashboard - Database Migration
-- Supabase Project: lfqsqqvyxxfrwyoyvcrj
-- ============================================================
-- IDEMPOTENT: Ligtas na i-run kahit may existing objects na.
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMS (gumagamit ng DO block dahil walang IF NOT EXISTS para sa TYPE)
-- ============================================================

DO $$ BEGIN
  CREATE TYPE condition_type AS ENUM (
    'Good', 'Fair', 'Poor', 'Needs Repair', 'Under Repair'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE personnel_status AS ENUM (
    'Active', 'On Leave', 'Deployed'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE gender_type AS ENUM (
    'Male', 'Female', 'Other'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================
-- TABLE: equipment
-- ============================================================

CREATE TABLE IF NOT EXISTS equipment (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  type          TEXT NOT NULL,
  quantity      INTEGER NOT NULL DEFAULT 1,
  condition     condition_type NOT NULL DEFAULT 'Good',
  location      TEXT NOT NULL,
  lat           DOUBLE PRECISION NOT NULL DEFAULT 14.6042,
  lng           DOUBLE PRECISION NOT NULL DEFAULT 121.1681,
  agency        TEXT NOT NULL,
  date_added    DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: vehicles
-- ============================================================

CREATE TABLE IF NOT EXISTS vehicles (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plate_number  TEXT NOT NULL UNIQUE,
  type          TEXT NOT NULL,
  brand         TEXT NOT NULL,
  model         TEXT NOT NULL,
  capacity      TEXT NOT NULL,
  condition     condition_type NOT NULL DEFAULT 'Good',
  location      TEXT NOT NULL,
  lat           DOUBLE PRECISION NOT NULL DEFAULT 14.6042,
  lng           DOUBLE PRECISION NOT NULL DEFAULT 121.1681,
  agency        TEXT NOT NULL,
  date_added    DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: personnel
-- ============================================================

CREATE TABLE IF NOT EXISTS personnel (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  position      TEXT NOT NULL,
  agency        TEXT NOT NULL,
  contact       TEXT NOT NULL,
  trainings     TEXT[] NOT NULL DEFAULT '{}',
  status        personnel_status NOT NULL DEFAULT 'Active',
  hadr_team     TEXT NOT NULL DEFAULT '',
  date_added    DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: acdv (Accredited Community Disaster Volunteers)
-- ============================================================

CREATE TABLE IF NOT EXISTS acdv (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_name   TEXT NOT NULL,
  office_address      TEXT NOT NULL,
  registered_lgu      TEXT NOT NULL,
  date_added          DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: acdv_personnel
-- ============================================================

CREATE TABLE IF NOT EXISTS acdv_personnel (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  acdv_id     UUID NOT NULL REFERENCES acdv(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  age         INTEGER NOT NULL CHECK (age > 0 AND age < 120),
  gender      gender_type NOT NULL,
  address     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- AUTO-UPDATE: updated_at trigger function
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables (drop first to avoid duplicate trigger error)
DROP TRIGGER IF EXISTS set_updated_at_equipment ON equipment;
CREATE TRIGGER set_updated_at_equipment
  BEFORE UPDATE ON equipment
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_vehicles ON vehicles;
CREATE TRIGGER set_updated_at_vehicles
  BEFORE UPDATE ON vehicles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_personnel ON personnel;
CREATE TRIGGER set_updated_at_personnel
  BEFORE UPDATE ON personnel
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at_acdv ON acdv;
CREATE TRIGGER set_updated_at_acdv
  BEFORE UPDATE ON acdv
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE equipment      ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE personnel      ENABLE ROW LEVEL SECURITY;
ALTER TABLE acdv           ENABLE ROW LEVEL SECURITY;
ALTER TABLE acdv_personnel ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first (safe to re-run)
DROP POLICY IF EXISTS "Allow public read on equipment"       ON equipment;
DROP POLICY IF EXISTS "Allow public insert on equipment"     ON equipment;
DROP POLICY IF EXISTS "Allow public update on equipment"     ON equipment;
DROP POLICY IF EXISTS "Allow public delete on equipment"     ON equipment;

DROP POLICY IF EXISTS "Allow public read on vehicles"        ON vehicles;
DROP POLICY IF EXISTS "Allow public insert on vehicles"      ON vehicles;
DROP POLICY IF EXISTS "Allow public update on vehicles"      ON vehicles;
DROP POLICY IF EXISTS "Allow public delete on vehicles"      ON vehicles;

DROP POLICY IF EXISTS "Allow public read on personnel"       ON personnel;
DROP POLICY IF EXISTS "Allow public insert on personnel"     ON personnel;
DROP POLICY IF EXISTS "Allow public update on personnel"     ON personnel;
DROP POLICY IF EXISTS "Allow public delete on personnel"     ON personnel;

DROP POLICY IF EXISTS "Allow public read on acdv"            ON acdv;
DROP POLICY IF EXISTS "Allow public insert on acdv"          ON acdv;
DROP POLICY IF EXISTS "Allow public update on acdv"          ON acdv;
DROP POLICY IF EXISTS "Allow public delete on acdv"          ON acdv;

DROP POLICY IF EXISTS "Allow public read on acdv_personnel"  ON acdv_personnel;
DROP POLICY IF EXISTS "Allow public insert on acdv_personnel" ON acdv_personnel;
DROP POLICY IF EXISTS "Allow public update on acdv_personnel" ON acdv_personnel;
DROP POLICY IF EXISTS "Allow public delete on acdv_personnel" ON acdv_personnel;

-- Create RLS policies
CREATE POLICY "Allow public read on equipment"        ON equipment       FOR SELECT USING (true);
CREATE POLICY "Allow public insert on equipment"      ON equipment       FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on equipment"      ON equipment       FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on equipment"      ON equipment       FOR DELETE USING (true);

CREATE POLICY "Allow public read on vehicles"         ON vehicles        FOR SELECT USING (true);
CREATE POLICY "Allow public insert on vehicles"       ON vehicles        FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on vehicles"       ON vehicles        FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on vehicles"       ON vehicles        FOR DELETE USING (true);

CREATE POLICY "Allow public read on personnel"        ON personnel       FOR SELECT USING (true);
CREATE POLICY "Allow public insert on personnel"      ON personnel       FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on personnel"      ON personnel       FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on personnel"      ON personnel       FOR DELETE USING (true);

CREATE POLICY "Allow public read on acdv"             ON acdv            FOR SELECT USING (true);
CREATE POLICY "Allow public insert on acdv"           ON acdv            FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on acdv"           ON acdv            FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on acdv"           ON acdv            FOR DELETE USING (true);

CREATE POLICY "Allow public read on acdv_personnel"   ON acdv_personnel  FOR SELECT USING (true);
CREATE POLICY "Allow public insert on acdv_personnel" ON acdv_personnel  FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on acdv_personnel" ON acdv_personnel  FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on acdv_personnel" ON acdv_personnel  FOR DELETE USING (true);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_equipment_agency      ON equipment(agency);
CREATE INDEX IF NOT EXISTS idx_vehicles_agency       ON vehicles(agency);
CREATE INDEX IF NOT EXISTS idx_personnel_agency      ON personnel(agency);
CREATE INDEX IF NOT EXISTS idx_acdv_registered_lgu  ON acdv(registered_lgu);
CREATE INDEX IF NOT EXISTS idx_acdv_personnel_acdv  ON acdv_personnel(acdv_id);

-- ============================================================
-- Done! ✅
-- ============================================================

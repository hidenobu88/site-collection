-- ============================================================
-- スミカ不動産 データベーススキーマ
--   createdb sumika_estate
--   psql -d sumika_estate -f db/schema.sql
--   psql -d sumika_estate -f db/seed.sql
-- ============================================================

DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS buildings;

-- 建物
CREATE TABLE buildings (
  id           TEXT PRIMARY KEY,
  name         TEXT    NOT NULL,
  type         TEXT    NOT NULL CHECK (type IN ('apartment', 'mansion', 'tower')),
  address      TEXT    NOT NULL,
  access       JSONB   NOT NULL,  -- [{line, station, walk, note?}]
  built_year   INTEGER NOT NULL,
  structure    TEXT    NOT NULL,
  total_floors INTEGER NOT NULL,
  total_units  INTEGER NOT NULL,
  note         TEXT
);

-- 部屋
CREATE TABLE rooms (
  id             TEXT PRIMARY KEY,
  building_id    TEXT    NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
  room_no        TEXT    NOT NULL,
  floor          INTEGER NOT NULL,
  layout         TEXT    NOT NULL,
  area           NUMERIC(6,1) NOT NULL,
  direction      TEXT    NOT NULL,
  rent           INTEGER NOT NULL,           -- 円
  management_fee INTEGER NOT NULL,           -- 円
  deposit        NUMERIC(4,1) NOT NULL,      -- 賃料の何ヶ月分
  key_money      NUMERIC(4,1) NOT NULL,      -- 賃料の何ヶ月分
  parking        TEXT    NOT NULL DEFAULT '',
  pet            BOOLEAN NOT NULL DEFAULT FALSE,
  tags           JSONB   NOT NULL DEFAULT '[]',
  description    TEXT    NOT NULL,
  images         JSONB   NOT NULL DEFAULT '[]'
);

CREATE INDEX idx_rooms_building ON rooms (building_id);
CREATE INDEX idx_rooms_rent     ON rooms (rent);
CREATE INDEX idx_rooms_pet      ON rooms (pet);

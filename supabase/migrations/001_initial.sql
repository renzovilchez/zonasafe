-- Extensión geoespacial
CREATE EXTENSION IF NOT EXISTS postgis;

-- Tabla de zonas de seguridad
CREATE TABLE zones (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  level       SMALLINT NOT NULL CHECK (level IN (1, 2, 3)),
  -- 1 = verde (seguro)  2 = amarillo (precaución)  3 = rojo (peligroso)
  geometry    GEOMETRY(POLYGON, 4326) NOT NULL,
  description TEXT,
  source      TEXT,   -- "Serenazgo El Porvenir" / "Entrevista comerciantes"
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Tabla de destinos (mercados, fábricas)
CREATE TABLE destinations (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  category    TEXT NOT NULL CHECK (category IN ('market','factory','gallery')),
  lat         DOUBLE PRECISION NOT NULL,
  lng         DOUBLE PRECISION NOT NULL,
  address     TEXT,
  description TEXT,
  open_hours  TEXT
);

-- Índices espaciales para queries rápidas
CREATE INDEX zones_geometry_idx ON zones USING GIST (geometry);

-- Row Level Security: solo lectura pública
ALTER TABLE zones        ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read zones"        ON zones        FOR SELECT USING (true);
CREATE POLICY "public read destinations" ON destinations FOR SELECT USING (true);
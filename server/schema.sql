CREATE TABLE IF NOT EXISTS sites (
    id TEXT PRIMARY KEY,
    id_no INTEGER,
    name TEXT NOT NULL,
    category TEXT,
    region TEXT,
    country TEXT,
    shortDescription TEXT,
    longDescription TEXT,
    dateInscribed INTEGER,
    danger INTEGER,
    latitude REAL,
    longitude REAL,
    image TEXT
);

CREATE INDEX IF NOT EXISTS idx_sites_region
ON sites(region);

CREATE INDEX IF NOT EXISTS idx_sites_country
ON sites(country);

CREATE INDEX IF NOT EXISTS idx_sites_category
ON sites(category);
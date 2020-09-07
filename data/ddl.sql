CREATE TABLE IF NOT EXISTS agency_domain_whitelist (
  id INTEGER PRIMARY KEY,
  domain TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS agency (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  domain TEXT NOT NULL,
  address TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS broker (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  agency_id INTEGER,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  hash_password TEXT NOT NULL,
  address TEXT NOT NULL,
  FOREIGN KEY (agencyId) REFERENCES agency (id)
);

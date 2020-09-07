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

CREATE TABLE IF NOT EXISTS broker_auth (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  password_salt TEXT,
  password_hash_algorithm TEXT
);

CREATE UNIQUE INDEX broker_auth_email_index ON broker_auth(email);

CREATE TABLE IF NOT EXISTS broker (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  broker_auth_id INTEGER NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  agency_id INTEGER,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  address TEXT NOT NULL,
  FOREIGN KEY (agency_id) REFERENCES agency (id)
  FOREIGN KEY (broker_auth_id) REFERENCES broker_auth (id)
);

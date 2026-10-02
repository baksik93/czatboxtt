BEGIN;

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  email_verified INTEGER NOT NULL DEFAULT 0,
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL,
  avatar_data TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  created_at BIGINT NOT NULL,
  expires_at BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS action_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  purpose TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at BIGINT NOT NULL,
  created_at BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS login_attempts (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  success INTEGER NOT NULL DEFAULT 0,
  attempted_at BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS sync_data (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  settings_json TEXT NOT NULL DEFAULT '{}',
  filters_json TEXT NOT NULL DEFAULT '[]',
  creators_json TEXT NOT NULL DEFAULT '[]',
  archive_json TEXT NOT NULL DEFAULT '[]',
  settings_updated_at BIGINT NOT NULL DEFAULT 0,
  filters_updated_at BIGINT NOT NULL DEFAULT 0,
  creators_updated_at BIGINT NOT NULL DEFAULT 0,
  archive_updated_at BIGINT NOT NULL DEFAULT 0,
  revision INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS registration_events (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL DEFAULT '',
  outcome TEXT NOT NULL,
  code TEXT NOT NULL DEFAULT '',
  user_id TEXT,
  created_at BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS account_activity (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  last_seen BIGINT NOT NULL,
  last_source TEXT NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS sessions_user_idx ON sessions(user_id);
CREATE INDEX IF NOT EXISTS sessions_expiry_idx ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS action_tokens_user_idx ON action_tokens(user_id, purpose);
CREATE INDEX IF NOT EXISTS login_attempts_email_time_idx ON login_attempts(email, attempted_at);

COMMIT;

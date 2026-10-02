PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE d1_migrations(
		id         INTEGER PRIMARY KEY AUTOINCREMENT,
		name       TEXT UNIQUE,
		applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE TABLE users (id TEXT PRIMARY KEY,name TEXT NOT NULL,email TEXT NOT NULL UNIQUE,password_hash TEXT NOT NULL,password_salt TEXT NOT NULL,email_verified INTEGER NOT NULL DEFAULT 0,created_at INTEGER NOT NULL,updated_at INTEGER NOT NULL, avatar_data TEXT NOT NULL DEFAULT '');
CREATE TABLE sessions (id TEXT PRIMARY KEY,user_id TEXT NOT NULL,token_hash TEXT NOT NULL UNIQUE,created_at INTEGER NOT NULL,expires_at INTEGER NOT NULL,FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE);
CREATE TABLE action_tokens (id TEXT PRIMARY KEY,user_id TEXT NOT NULL,purpose TEXT NOT NULL,token_hash TEXT NOT NULL UNIQUE,expires_at INTEGER NOT NULL,created_at INTEGER NOT NULL,FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE);
CREATE TABLE login_attempts (id TEXT PRIMARY KEY,email TEXT NOT NULL,success INTEGER NOT NULL DEFAULT 0,attempted_at INTEGER NOT NULL);
CREATE TABLE sync_data (user_id TEXT PRIMARY KEY,settings_json TEXT NOT NULL DEFAULT '{}',filters_json TEXT NOT NULL DEFAULT '[]',creators_json TEXT NOT NULL DEFAULT '[]',archive_json TEXT NOT NULL DEFAULT '[]',settings_updated_at INTEGER NOT NULL DEFAULT 0,filters_updated_at INTEGER NOT NULL DEFAULT 0,creators_updated_at INTEGER NOT NULL DEFAULT 0,archive_updated_at INTEGER NOT NULL DEFAULT 0,revision INTEGER NOT NULL DEFAULT 0,FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE);
CREATE TABLE registration_events (id TEXT PRIMARY KEY, email TEXT NOT NULL DEFAULT '', outcome TEXT NOT NULL, code TEXT NOT NULL DEFAULT '', user_id TEXT, created_at INTEGER NOT NULL);
CREATE TABLE account_activity (user_id TEXT PRIMARY KEY, last_seen INTEGER NOT NULL, last_source TEXT NOT NULL DEFAULT '', FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE);
DELETE FROM sqlite_sequence;
CREATE INDEX sessions_user_idx ON sessions(user_id);
CREATE INDEX sessions_expiry_idx ON sessions(expires_at);
CREATE INDEX action_tokens_user_idx ON action_tokens(user_id,purpose);
CREATE INDEX login_attempts_email_time_idx ON login_attempts(email,attempted_at);

CREATE TABLE api_tokens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  token_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  scopes TEXT,  -- JSON array of scopes (reserved for future use)
  expires_at TEXT,  -- ISO 8601 datetime
  last_used_at TEXT,  -- ISO 8601 datetime
  is_active INTEGER DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)
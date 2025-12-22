CREATE TABLE contact_us (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       name TEXT NOT NULL,
       email TEXT NOT NULL,
       subject TEXT,
       message TEXT NOT NULL,
       status TEXT NOT NULL DEFAULT 'new',
       ip_address TEXT,
       user_agent TEXT,
       created_at TEXT NOT NULL,
       updated_at TEXT NOT NULL,
       read_at TEXT,
       replied_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_contact_us_email ON contact_us(email);
CREATE INDEX IF NOT EXISTS idx_contact_us_status ON contact_us(status);
CREATE INDEX IF NOT EXISTS idx_contact_us_created_at ON contact_us(created_at DESC);

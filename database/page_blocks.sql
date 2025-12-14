CREATE TABLE page_blocks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page_id INTEGER NOT NULL,

    
    block_type TEXT NOT NULL,  
    block_order INTEGER NOT NULL DEFAULT 0,

    
    title TEXT,
    subtitle TEXT,
    content TEXT,  
    config TEXT,   

    
    background_color TEXT,
    background_image TEXT,
    text_color TEXT,

    
    is_visible INTEGER DEFAULT 1,

    
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),

    FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
  )
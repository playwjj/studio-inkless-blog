CREATE TABLE pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    author_id INTEGER,

    status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'published', 'archived')),
    published_at TEXT,

    content TEXT,  
    blocks TEXT,   
    template TEXT DEFAULT 'default',  

    meta_title TEXT,
    meta_description TEXT,
    meta_keywords TEXT,
    og_image TEXT,
    og_title TEXT,
    og_description TEXT,
    canonical_url TEXT,

    cover_image TEXT,
    theme TEXT DEFAULT 'light',  
    layout TEXT DEFAULT 'default',  
    custom_css TEXT,  
    custom_js TEXT,   


    show_header INTEGER DEFAULT 1, 
    show_footer INTEGER DEFAULT 1,  
    show_breadcrumb INTEGER DEFAULT 0,
    enable_comments INTEGER DEFAULT 0,
    enable_sharing INTEGER DEFAULT 1,


    is_password_protected INTEGER DEFAULT 0,
    password_hash TEXT,  


    settings TEXT, 
    cta_config TEXT,  


    view_count INTEGER DEFAULT 0,
    conversion_count INTEGER DEFAULT 0,


    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )
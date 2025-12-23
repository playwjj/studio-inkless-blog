CREATE TABLE articles (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    cover_image_url TEXT,
    published_at TIMESTAMP NOT NULL,
    read_time INTEGER DEFAULT 0,

    author_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    status TEXT DEFAULT 'published',
    "content" TEXT,
    is_featured INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0
)
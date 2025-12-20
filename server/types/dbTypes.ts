// Database row types
export interface DbArticle {
  id: string  // UUID stored as text
  title: string
  slug: string
  excerpt?: string
  content: string
  cover_image_url?: string
  author_id: number
  category_id: number
  tag_names?: string // Comma-separated tag names (e.g., "Nuxt,Vue,Web Development")
  status: 'draft' | 'published' | 'archived'
  published_at: string  // NOT NULL in database
  read_time: number
  is_featured: number  // 0 or 1 (SQLite boolean)
  view_count: number  // Number of views
  created_at: string
  updated_at: string
}

export interface DbAuthor {
  id: number
  name: string
  avatar_url: string
  bio?: string
  created_at: string
  updated_at: string
}

export interface DbCategory {
  id: number
  name: string
  slug: string
  created_at: string
  updated_at: string
  count?: number
}

export interface DbTag {
  id: number
  name: string
  slug: string
  description?: string
  usage_count: number
  created_at: string
  updated_at: string
}

export interface DbArticleTag {
  article_id: number
  tag_id: number
}

export interface DbSite {
  id: number
  name: string
  title: string
  description: string
  logo_url?: string
  favicon_url?: string
  keywords?: string
  copyright_text?: string
  og_site_name: string
  og_title: string
  og_description: string
  og_image: string
  og_url: string
  twitter_title: string
  twitter_description: string
  twitter_image: string
  gtm_code?: string
}

export interface DbPage {
  id: number
  title: string
  slug: string
  description?: string
  author_id?: number
  status: 'draft' | 'published' | 'archived'
  published_at?: string
  type: 'page' | 'url'
  show_to_header_menu: number
  show_to_footer_menu: number
  sort: number
  target?: string
  content?: string
  blocks?: string  // JSON
  template: string
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
  og_image?: string
  og_title?: string
  og_description?: string
  canonical_url?: string
  cover_image?: string  // Note: database field is cover_image, not cover_image_url
  theme: string
  layout: string
  custom_css?: string
  custom_js?: string
  show_header: number
  show_footer: number
  show_breadcrumb: number
  enable_comments: number
  enable_sharing: number
  is_password_protected: number
  password_hash?: string
  settings?: string  // JSON
  cta_config?: string  // JSON
  view_count: number
  conversion_count: number
  created_at: string
  updated_at: string
}

export interface DbPageBlock {
  id: number
  page_id: number
  block_type: string
  block_order: number
  title?: string
  subtitle?: string
  content?: string
  config?: string  // JSON
  background_color?: string
  background_image?: string
  text_color?: string
  is_visible: number
  created_at: string
  updated_at: string
}

export interface DbUser {
  id: number
  username: string
  email: string
  password_hash: string
  full_name?: string
  avatar_url?: string
  role: 'admin' | 'editor' | 'viewer'
  is_active: number
  last_login_at?: string
  created_at: string
  updated_at: string
  bio: string
}

export interface DbApiToken {
  id: number
  user_id: number
  token_hash: string
  name: string
  description?: string
  scopes?: string  // JSON array of scopes
  expires_at?: string
  last_used_at?: string
  is_active: number
  created_at: string
  updated_at: string
}

export interface DbFile {
  id: number
  file_name: string
  file_key: string
  file_size: number
  mime_type: string
  url: string
  width?: number
  height?: number
  uploaded_by: number
  created_at: string
}

export interface DbNewsletter {
  id: number
  email: string
  status: 'active' | 'unsubscribed'
  source: string
  ip_address?: string | null
  user_agent?: string | null
  subscribed_at: string
  unsubscribed_at?: string | null
  created_at: string
  updated_at: string
}

// Database row types
export interface DbArticle {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image_url: string
  author_id: number
  category_id: number
  tag_names?: string // Comma-separated tag names (e.g., "Nuxt,Vue,Web Development")
  published_at: string
  read_time: number
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

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: {
    name: string
    avatar: string
  }
  coverImage: string
  publishedAt: string
  category: string
  tags: string[]
  readTime: number
}

export interface BlogListItem {
  id: string
  title: string
  slug: string
  excerpt: string
  author: {
    name: string
    avatar: string
  }
  coverImage: string
  publishedAt: string
  category: string
  tags: string[]
  readTime: number
}

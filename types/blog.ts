export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: {
    id?: number
    name: string
    avatar: string
    bio?: string
  }
  coverImage: string
  publishedAt: string
  category: {
    name: string
    slug: string
  }
  tags: {
    name: string
    slug: string
  }[]
  readTime: number
  viewCount: number
}

export type BlogListItem = Omit<BlogPost, 'content'>

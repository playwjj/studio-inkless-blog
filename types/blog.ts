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
  viewCount: number
}

export type BlogListItem = Omit<BlogPost, 'content'>

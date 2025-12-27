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

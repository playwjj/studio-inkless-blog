import type { BlogPost } from '~/types/blog'

export interface Category {
  name: string
  slug: string
}

export const categories: Category[] = [
  { name: 'Tutorial', slug: 'tutorial' },
  { name: 'CSS', slug: 'css' },
  { name: 'Backend', slug: 'backend' },
  { name: 'Programming', slug: 'programming' },
  { name: 'DevOps', slug: 'devops' },
  { name: 'Performance', slug: 'performance' }
]

export const mockPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Getting Started with Nuxt 3',
    slug: 'getting-started-with-nuxt-3',
    excerpt: 'Learn how to build modern web applications with Nuxt 3, Vue 3, and the Composition API.',
    content: `
# Getting Started with Nuxt 3

Nuxt 3 is a powerful framework built on top of Vue 3, offering a robust foundation for building modern web applications.

## Key Features

- **Auto-imports**: Components, composables, and utilities are automatically imported.
- **File-based routing**: Create routes simply by adding files to the pages directory.
- **Server-side rendering**: Built-in SSR support for better SEO and performance.
- **TypeScript support**: First-class TypeScript integration out of the box.

## Installation

\`\`\`bash
npx nuxi init my-app
cd my-app
npm install
npm run dev
\`\`\`

Start building amazing applications today!
    `,
    author: {
      name: 'Sarah Chen',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    coverImage: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=1200',
    publishedAt: '2024-12-01T10:00:00Z',
    category: 'Tutorial',
    tags: ['Nuxt', 'Vue', 'Web Development'],
    readTime: 5
  },
  {
    id: '2',
    title: 'Mastering Tailwind CSS',
    slug: 'mastering-tailwind-css',
    excerpt: 'Discover the power of utility-first CSS and how Tailwind CSS can speed up your development workflow.',
    content: `
# Mastering Tailwind CSS

Tailwind CSS is a utility-first CSS framework that provides low-level utility classes to build custom designs.

## Why Tailwind?

- **Rapid development**: Build interfaces quickly with pre-built utility classes.
- **Consistency**: Maintain design consistency across your application.
- **Customization**: Easily customize colors, spacing, and more.
- **Responsive design**: Built-in responsive modifiers for all utilities.

## Example

\`\`\`html
<div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
  <div class="p-8">
    <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Article</div>
    <p class="mt-2 text-gray-500">Getting started with Tailwind CSS...</p>
  </div>
</div>
\`\`\`

Happy styling!
    `,
    author: {
      name: 'Michael Rodriguez',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    coverImage: 'https://images.pexels.com/photos/6804069/pexels-photo-6804069.jpeg?auto=compress&cs=tinysrgb&w=1200',
    publishedAt: '2024-11-28T14:30:00Z',
    category: 'CSS',
    tags: ['Tailwind', 'CSS', 'Design'],
    readTime: 7
  },
  {
    id: '3',
    title: 'Building RESTful APIs',
    slug: 'building-restful-apis',
    excerpt: 'A comprehensive guide to designing and implementing RESTful APIs that are scalable and maintainable.',
    content: `
# Building RESTful APIs

REST (Representational State Transfer) is an architectural style for designing networked applications.

## Core Principles

1. **Stateless**: Each request contains all necessary information.
2. **Client-Server**: Separation of concerns between client and server.
3. **Cacheable**: Responses must define themselves as cacheable or not.
4. **Uniform Interface**: Consistent interface between components.

## HTTP Methods

- **GET**: Retrieve resources
- **POST**: Create new resources
- **PUT**: Update existing resources
- **DELETE**: Remove resources

## Best Practices

- Use meaningful resource names
- Implement proper error handling
- Version your API
- Document your endpoints

Start building robust APIs today!
    `,
    author: {
      name: 'Emily Wang',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    coverImage: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1200',
    publishedAt: '2024-11-25T09:15:00Z',
    category: 'Backend',
    tags: ['API', 'REST', 'Backend'],
    readTime: 8
  },
  {
    id: '4',
    title: 'TypeScript Best Practices',
    slug: 'typescript-best-practices',
    excerpt: 'Learn the best practices for writing clean, type-safe TypeScript code that scales.',
    content: `
# TypeScript Best Practices

TypeScript adds static typing to JavaScript, making your code more reliable and maintainable.

## Key Benefits

- **Type Safety**: Catch errors at compile time
- **Better IDE Support**: Enhanced autocomplete and refactoring
- **Documentation**: Types serve as inline documentation
- **Scalability**: Easier to maintain large codebases

## Tips

1. Enable strict mode in tsconfig.json
2. Use interface for object shapes
3. Leverage utility types (Partial, Pick, Omit)
4. Avoid using 'any' type

\`\`\`typescript
interface User {
  id: string
  name: string
  email: string
}

function getUser(id: string): Promise<User> {
  // Implementation
}
\`\`\`

Write better code with TypeScript!
    `,
    author: {
      name: 'David Kim',
      avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    coverImage: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1200',
    publishedAt: '2024-11-20T11:00:00Z',
    category: 'Programming',
    tags: ['TypeScript', 'JavaScript', 'Best Practices'],
    readTime: 6
  },
  {
    id: '5',
    title: 'Deploying to Cloudflare Pages',
    slug: 'deploying-to-cloudflare-pages',
    excerpt: 'Step-by-step guide to deploying your Nuxt application to Cloudflare Pages for global performance.',
    content: `
# Deploying to Cloudflare Pages

Cloudflare Pages is a JAMstack platform for deploying static sites and full-stack applications.

## Why Cloudflare Pages?

- **Global CDN**: Your site is served from 200+ locations worldwide
- **Automatic HTTPS**: SSL certificates are provisioned automatically
- **Git Integration**: Deploy on every push to your repository
- **Free Tier**: Generous free tier for personal projects

## Deployment Steps

1. Connect your Git repository
2. Configure build settings
3. Set environment variables
4. Deploy!

\`\`\`bash
# Build command
npm run generate

# Output directory
.output/public
\`\`\`

## Performance

Cloudflare's global network ensures your users get the fastest possible experience, no matter where they are.

Deploy with confidence!
    `,
    author: {
      name: 'Lisa Anderson',
      avatar: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    coverImage: 'https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=1200',
    publishedAt: '2024-11-15T16:45:00Z',
    category: 'DevOps',
    tags: ['Cloudflare', 'Deployment', 'Performance'],
    readTime: 5
  },
  {
    id: '6',
    title: 'Modern Web Performance',
    slug: 'modern-web-performance',
    excerpt: 'Optimize your web application for speed and efficiency with these proven performance techniques.',
    content: `
# Modern Web Performance

Performance is crucial for user experience and SEO. Let's explore key optimization techniques.

## Core Web Vitals

- **LCP (Largest Contentful Paint)**: Measures loading performance
- **FID (First Input Delay)**: Measures interactivity
- **CLS (Cumulative Layout Shift)**: Measures visual stability

## Optimization Techniques

### Image Optimization
- Use modern formats (WebP, AVIF)
- Implement lazy loading
- Serve responsive images

### Code Splitting
- Split bundles by route
- Lazy load components
- Use dynamic imports

### Caching Strategies
- Leverage browser caching
- Implement service workers
- Use CDN effectively

## Measuring Performance

Use tools like:
- Lighthouse
- WebPageTest
- Chrome DevTools

Performance is not a one-time task, it's an ongoing commitment!
    `,
    author: {
      name: 'Alex Thompson',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    coverImage: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=1200',
    publishedAt: '2024-11-10T13:20:00Z',
    category: 'Performance',
    tags: ['Performance', 'Optimization', 'Web Vitals'],
    readTime: 9
  }
]

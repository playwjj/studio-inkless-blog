# Studio Inkless Blog

A modern, feature-rich blog built with Nuxt 3, Tailwind CSS, and deployed on Cloudflare Pages.

## ✨ Features

### Core Features
- **Server-side Rendering**: Built with Nuxt 3 for optimal SEO and performance
- **RESTful API**: Clean API architecture with pagination support
- **Responsive Design**: Beautiful UI with Tailwind CSS
- **Progressive Loading**: Page transition indicators for smooth navigation

### Content Discovery
- **Advanced Search**: Real-time search across titles, excerpts, and tags
- **Pagination**: Smooth pagination with page number navigation
- **Category & Tag Filtering**: Easy content discovery with filters
- **Back to Top**: Floating button for better navigation on long pages

### SEO & Performance
- **Complete SEO Meta Tags**: Open Graph and Twitter Card support
- **Image Optimization**: Automatic optimization with Nuxt Image
- **Lazy Loading**: Images load progressively for better performance
- **Fast & Global**: Deployed on Cloudflare Pages CDN

## 🛠 Tech Stack

- [Nuxt 3](https://nuxt.com/) - Vue.js framework with SSR
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe development
- [Nuxt Image](https://image.nuxt.com/) - Image optimization
- [Cloudflare Pages](https://pages.cloudflare.com/) - Global deployment

## 🚀 Getting Started

### Prerequisites

- Node.js 20 or later
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Visit `http://localhost:3000` to see your blog in action!

## 📁 Project Structure

```
.
├── components/          # Vue components
│   ├── Header.vue
│   ├── Footer.vue
│   ├── BlogCard.vue
│   ├── Pagination.vue
│   └── BackToTop.vue
├── composables/        # Reusable composition functions
│   └── useFormatDate.ts
├── layouts/            # Layout components
│   └── default.vue
├── pages/              # Pages (auto-routed)
│   ├── index.vue       # Home page
│   ├── about.vue       # About page
│   └── blog/
│       ├── index.vue   # Blog list with search & pagination
│       └── [slug].vue  # Blog post detail
├── server/             # Server-side code
│   ├── api/           # API routes
│   │   ├── posts/
│   │   │   ├── index.get.ts
│   │   │   └── [id].get.ts
│   │   ├── categories.get.ts
│   │   └── tags.get.ts
│   └── utils/
│       └── mockData.ts
├── types/              # TypeScript types
│   └── blog.ts
├── nuxt.config.ts      # Nuxt configuration
└── tailwind.config.ts  # Tailwind configuration
```

## 🔌 API Endpoints

### Posts
- `GET /api/posts` - Get all posts (supports pagination, category, and tag filters)
- `GET /api/posts/:id` - Get post by ID or slug

### Categories & Tags
- `GET /api/categories` - Get all categories with post counts
- `GET /api/tags` - Get all tags with post counts

### Query Parameters

**GET /api/posts**
- `page` - Page number (default: 1)
- `limit` - Posts per page (default: 10)
- `category` - Filter by category
- `tag` - Filter by tag

**Example:**
```
/api/posts?page=1&limit=10&category=Tutorial
```

## 🎨 Customization

### Adding New Posts

Edit `server/utils/mockData.ts` to add new blog posts:

```typescript
{
  id: 'unique-id',
  title: 'Your Post Title',
  slug: 'your-post-slug',
  excerpt: 'Brief description...',
  content: 'Full markdown content...',
  author: {
    name: 'Author Name',
    avatar: 'https://...'
  },
  coverImage: 'https://...',
  publishedAt: '2024-12-01T10:00:00Z',
  category: 'Tutorial',
  tags: ['Nuxt', 'Vue'],
  readTime: 5
}
```

### Styling

Modify `tailwind.config.ts` to customize:
- Colors (primary palette)
- Fonts
- Spacing
- Other design tokens

### Configuration

Update `nuxt.config.ts` for:
- SEO defaults
- Image optimization settings
- Build configurations

## 🌐 Deployment to Cloudflare Pages

### Build Configuration

- **Build command**: `npm run build`
- **Build output directory**: `.output/public`
- **Node version**: 20

### Deployment Steps

1. **Push to Git**: Push your code to GitHub, GitLab, or Bitbucket

2. **Connect to Cloudflare**:
   - Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Go to **Pages** → **Create a project**
   - Connect your Git repository

3. **Configure Build**:
   - Framework preset: **Nuxt.js**
   - Build command: `npm run build`
   - Build output directory: `.output/public`

4. **Deploy**: Click **Save and Deploy**

Your site will be live on Cloudflare's global CDN!

## 🎯 Key Features Explained

### Search Functionality
Real-time search that filters posts by:
- Title
- Excerpt
- Tags

### Pagination
- Automatic pagination based on post count
- Smooth scrolling to top on page change
- Page numbers with ellipsis for large sets

### Image Optimization
Uses `@nuxt/image` for:
- Automatic image optimization
- Lazy loading
- Responsive images

### SEO Optimization
Every page includes:
- Open Graph tags (Facebook, LinkedIn)
- Twitter Card tags
- Article-specific metadata
- Structured data ready

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

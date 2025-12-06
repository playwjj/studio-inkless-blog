# Studio Inkless Blog

A modern blog built with Nuxt 3, Tailwind CSS, and deployed on Cloudflare Pages.

## Features

- **Server-side Rendering**: Built with Nuxt 3 for optimal SEO and performance
- **RESTful API**: Clean API architecture with mock data
- **Responsive Design**: Beautiful UI with Tailwind CSS
- **Category & Tag Filtering**: Easy content discovery
- **Fast & Global**: Deployed on Cloudflare Pages CDN

## Tech Stack

- [Nuxt 3](https://nuxt.com/) - Vue.js framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Cloudflare Pages](https://pages.cloudflare.com/) - Deployment platform

## Getting Started

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

## Deployment to Cloudflare Pages

### Build Configuration

- **Build command**: `npm run build`
- **Build output directory**: `.output/public`
- **Node version**: 20

### Deployment Steps

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)

3. Go to **Pages** and click **Create a project**

4. Connect your Git repository

5. Configure the build settings:
   - Framework preset: **Nuxt.js**
   - Build command: `npm run build`
   - Build output directory: `.output/public`

6. Click **Save and Deploy**

Your site will be deployed to Cloudflare's global network!

## Project Structure

```
.
├── components/          # Vue components
│   ├── Header.vue
│   ├── Footer.vue
│   └── BlogCard.vue
├── layouts/            # Layout components
│   └── default.vue
├── pages/              # Pages (auto-routed)
│   ├── index.vue       # Home page
│   ├── about.vue       # About page
│   └── blog/
│       ├── index.vue   # Blog list
│       └── [slug].vue  # Blog post detail
├── server/             # Server-side code
│   ├── api/           # API routes
│   │   ├── posts/
│   │   ├── categories.get.ts
│   │   └── tags.get.ts
│   └── utils/
│       └── mockData.ts
├── types/              # TypeScript types
│   └── blog.ts
├── nuxt.config.ts      # Nuxt configuration
└── tailwind.config.ts  # Tailwind configuration
```

## API Endpoints

- `GET /api/posts` - Get all posts (supports pagination, category, and tag filters)
- `GET /api/posts/:id` - Get post by ID or slug
- `GET /api/categories` - Get all categories with post counts
- `GET /api/tags` - Get all tags with post counts

### Query Parameters

**GET /api/posts**
- `page` - Page number (default: 1)
- `limit` - Posts per page (default: 10)
- `category` - Filter by category
- `tag` - Filter by tag

Example:
```
/api/posts?page=1&limit=10&category=Tutorial
```

## Customization

### Adding New Posts

Edit `server/utils/mockData.ts` to add new blog posts to the mock data.

### Styling

Modify `tailwind.config.ts` to customize colors, fonts, and other design tokens.

### Configuration

Update `nuxt.config.ts` for Nuxt-specific settings.

## License

MIT

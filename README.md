# Studio Inkless Blog

<div align="center">

**A modern, feature-rich blog platform built with Nuxt 3, Tailwind CSS, and Cloudflare**

[Live Demo](https://blog.404401.xyz) • [Features](#-features) • [Getting Started](#-getting-started) • [Documentation](#-documentation--resources)

[![Nuxt 3](https://img.shields.io/badge/Nuxt-3.13.0-00DC82?logo=nuxt.js)](https://nuxt.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-6.12.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-F38020?logo=cloudflare)](https://pages.cloudflare.com/)

</div>

---

## 🌐 Live Preview

**Visit the live site:** [https://blog.404401.xyz](https://blog.404401.xyz)

Experience all features in action including the admin dashboard, content management system, and responsive design.

---

## 📑 Table of Contents

- [Live Preview](#-live-preview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
- [Database Setup (D1 SQL Studio)](#-database-setup-with-d1-sql-studio)
- [File Management (Cloudflare R2)](#-file-management-with-cloudflare-r2)
- [Project Structure](#project-structure)
- [API Endpoints](#-api-endpoints)
- [Features Deep Dive](#-features-deep-dive)
- [Deployment to Cloudflare Pages](#-deployment-to-cloudflare-pages)
- [Performance Optimization](#-performance-optimization)
- [Security](#-security-features)
- [Documentation & Resources](#-documentation--resources)
- [Contributing](#-contributing)
- [License](#-license)

---

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

### Admin & Content Management
- **Authentication System**: Secure login and session management
- **File Management**: Upload and manage files with Cloudflare R2 (S3 API)
- **Database Integration**: Full CRUD operations with D1 SQL Studio
- **User Management**: Support for multiple users and roles
- **Content Blocks**: 10+ reusable content blocks for page building

## 🛠 Tech Stack

### Core Framework
- **[Nuxt 3](https://nuxt.com/)** - Vue.js framework with server-side rendering (SSR)
- **[Vue 3](https://vuejs.org/)** - Progressive JavaScript framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development

### UI & Styling
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Nuxt Image](https://image.nuxt.com/)** - Automatic image optimization
- **[TipTap](https://tiptap.dev/)** - Rich text editor for content management

### Backend & Infrastructure
- **[Cloudflare Pages](https://pages.cloudflare.com/)** - Global CDN deployment
- **[Cloudflare R2](https://www.cloudflare.com/products/r2/)** - S3-compatible object storage
- **[D1 SQL Studio](https://github.com/playwjj/d1-sql-studio)** - Database management with REST API
- **[H3](https://h3.unjs.io/)** - Web framework for server routes

## 🚀 Getting Started

> 💡 **Tip**: Check out the [live demo](https://blog.404401.xyz) to see all features in action before setting up your own instance!

### Prerequisites

- Node.js 20 or later
- npm or yarn
- Cloudflare account (for R2 storage and deployment)

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

### Environment Configuration

Create a `.env.local` file in the project root with the following variables:

```env
# Database Configuration (D1 SQL Studio)
DB_API_KEY=your_db_api_key
DB_API_URL=https://your-d1-sql-studio.example.com

# File Storage Configuration (Cloudflare R2)
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=your_r2_bucket_name
R2_PUBLIC_URL=https://your-public-r2-url.com

# Session Configuration
SESSION_SECRET=your-secret-key-min-32-chars-required
```

For detailed setup instructions, see the sections below.

## 🗄️ Database Setup with D1 SQL Studio

This project requires D1 SQL Studio. The application relies on the REST API exposed by D1 SQL Studio for all data reads and writes (posts, pages, categories, tags, site config). You must run or deploy D1 SQL Studio and provide its API URL and API key to the site via environment variables.

Quick steps:

1. Install or deploy D1 SQL Studio. See the project on GitHub: https://github.com/playwjj/d1-sql-studio
2. Follow the D1 SQL Studio README to start it locally or deploy to your hosting environment. After startup you will have a REST API endpoint and an API key/secret.
3. Set environment variables for this project:

```env
DB_API_KEY=your_db_api_key
DB_API_URL=https://your-d1-sql-studio.example.com
```

4. Restart your application so Nuxt picks up the runtime config.

Deployment note — Cloudflare Pages / other platforms:
- If you deploy to Cloudflare Pages, add `DB_API_KEY` and `DB_API_URL` in your Pages project settings (Settings → Environment variables) and scope them to the correct environment (Preview/Production). See: https://developers.cloudflare.com/pages/platform/environment-variables/

## 📁 File Management with Cloudflare R2

This project includes a complete file management system using **Cloudflare R2**, an S3-compatible object storage service. All file uploads, downloads, and deletions are handled through the R2 API.

### R2 Configuration

To use the file upload feature, you need to configure Cloudflare R2 credentials via environment variables:

```env
# Cloudflare R2 Configuration
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=your_r2_bucket_name
R2_PUBLIC_URL=https://your-public-r2-url.com
```

#### Getting R2 Credentials

1. **Account ID**: Get this from your Cloudflare dashboard
   - Go to Cloudflare Dashboard → R2 → Account details
   - Copy your Account ID

2. **Access Key & Secret**:
   - In Cloudflare Dashboard → R2 → API tokens
   - Click "Create API token"
   - Generate a token with permissions for reading and writing to R2
   - Save the Access Key ID and Secret Access Key

3. **Bucket Name**:
   - Create a bucket in R2 (e.g., `studio-inkless-files`)
   - Use this name in the configuration

4. **Public URL**:
   - If you want public file access, create a custom domain or use R2's default URL
   - Example: `https://files.example.com` or `https://your-bucket.your-domain.com`
   - Configure in Cloudflare R2 settings

### File Upload API

**Endpoint**: `POST /api/admin/files/upload`

Upload one or multiple files to R2 storage:

```bash
curl -X POST http://localhost:3000/api/admin/files/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/image.jpg" \
  -F "file=@/path/to/document.pdf"
```

**Response**:
```json
{
  "success": true,
  "files": [
    {
      "id": "file-uuid",
      "file_name": "image.jpg",
      "file_key": "uploads/2024/12/uuid.jpg",
      "file_size": 102400,
      "mime_type": "image/jpeg",
      "public_url": "https://files.example.com/uploads/2024/12/uuid.jpg",
      "created_at": "2024-12-14T10:30:00Z",
      "user_id": "user-uuid"
    }
  ]
}
```

### File Retrieval API

**Endpoint**: `GET /api/admin/files`

List all uploaded files with pagination and filtering:

**Query Parameters**:
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 20)
- `search` - Search by file name
- `mime_type` - Filter by MIME type (e.g., `image/jpeg`, `application/pdf`)

**Example**:
```
GET /api/admin/files?page=1&limit=20&search=avatar&mime_type=image%2Fjpeg
```

**Response**:
```json
{
  "success": true,
  "files": [
    {
      "id": "file-uuid",
      "file_name": "avatar.jpg",
      "file_key": "uploads/2024/12/uuid.jpg",
      "file_size": 51200,
      "mime_type": "image/jpeg",
      "public_url": "https://files.example.com/uploads/2024/12/uuid.jpg",
      "created_at": "2024-12-14T10:00:00Z",
      "user_id": "user-uuid"
    }
  ],
  "total": 1,
  "totalSize": 51200,
  "page": 1,
  "limit": 20
}
```

### File Deletion API

**Endpoint**: `DELETE /api/admin/files/[id]`

Delete a file from R2 storage:

```bash
curl -X DELETE http://localhost:3000/api/admin/files/file-uuid \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response**:
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

### File Storage Structure

Files are automatically organized in R2 by upload date:

```
uploads/
├── 2024/
│   ├── 12/
│   │   ├── uuid-1.jpg
│   │   ├── uuid-2.pdf
│   │   └── uuid-3.png
│   └── 11/
│       ├── uuid-4.jpg
│       └── uuid-5.doc
```

### Supported File Types

The system validates files based on:
- **MIME types**: Images (JPEG, PNG, WebP), Documents (PDF, DOC, DOCX), Videos (MP4, WebM)
- **File size limits**: Configurable per file type
- **Extensions**: Validated against allowed extensions

### Deployment with R2

When deploying to Cloudflare Pages:

1. **Add R2 credentials** to your Pages project environment variables:
   - Go to Pages → Your project → Settings → Environment variables
   - Add each R2 environment variable for both Preview and Production environments

2. **S3 API Compatibility**:
   - R2 uses S3 API, so the configuration is fully compatible
   - No special Cloudflare Workers code needed
   - File uploads work seamlessly on Pages runtime

3. **Public Access**:
   - Configure a custom domain or R2's default public URL
   - Files are served directly from R2 or your custom domain
   - CDN caching can be enabled for optimal performance

## Project Structure

```
studio-inkless-blog/
├── components/                    # Vue components
│   ├── Header.vue                # Header component
│   ├── Footer.vue                # Footer component
│   ├── BlogCard.vue              # Blog post card
│   ├── Pagination.vue            # Pagination component
│   ├── BackToTop.vue             # Back to top button
│   ├── admin/                    # Admin UI components
│   │   ├── ConfirmDialog.vue
│   │   ├── EditorFileDialog.vue
│   │   ├── EditorImageDialog.vue
│   │   ├── FilePicker.vue
│   │   ├── ImageUploader.vue
│   │   ├── PageBlocksEditor.vue
│   │   ├── StatCard.vue
│   │   └── Toast.vue
│   └── blocks/                   # Page content blocks
│       ├── BlockHero.vue
│       ├── BlockFeatures.vue
│       ├── BlockCta.vue
│       ├── BlockText.vue
│       ├── BlockGallery.vue
│       ├── BlockTestimonials.vue
│       ├── BlockFaq.vue
│       ├── BlockStats.vue
│       ├── BlockVideo.vue
│       └── BlockCustom.vue
├── composables/                  # Reusable composition functions
│   ├── useAuth.ts               # Authentication composable
│   ├── useFormatDate.ts         # Date formatting
│   ├── useFormValidation.ts     # Form validation
│   ├── useNotification.ts       # Toast notifications
│   └── useSiteConfig.ts         # Site configuration
├── layouts/                      # Layout templates
│   ├── default.vue              # Default layout
│   └── admin.vue                # Admin layout
├── pages/                        # Application pages
│   ├── index.vue                # Home page
│   ├── about.vue                # About page
│   ├── setup.vue                # Setup wizard
│   ├── [slug].vue               # Dynamic page route
│   ├── blog/                    # Blog routes
│   │   ├── index.vue            # Blog list
│   │   ├── [slug].vue           # Blog post detail
│   │   ├── categories/
│   │   │   └── index.vue
│   │   ├── category/
│   │   │   └── [name].vue
│   │   ├── tags/
│   │   │   └── index.vue
│   │   └── tag/
│   │       └── [name].vue
│   └── admin/                   # Admin dashboard
│       ├── index.vue            # Admin dashboard
│       ├── login.vue            # Admin login
│       ├── profile.vue          # User profile
│       ├── users.vue            # User management
│       ├── tokens.vue           # API token management
│       ├── authors.vue          # Authors management
│       ├── categories.vue       # Categories management
│       ├── tags.vue             # Tags management
│       ├── files.vue            # Files management
│       ├── site.vue             # Site settings
│       ├── pages/               # Page management
│       │   ├── index.vue
│       │   ├── new.vue
│       │   └── [id]/
│       │       └── edit.vue
│       └── posts/               # Post management
│           ├── index.vue
│           ├── new.vue
│           └── [id]/
│               └── edit.vue
├── server/                      # Backend server code
│   ├── api/                    # API routes
│   │   ├── posts/              # Post endpoints
│   │   │   ├── index.get.ts
│   │   │   └── [id].get.ts
│   │   ├── pages/              # Page endpoints
│   │   │   ├── index.get.ts
│   │   │   └── [slug].get.ts
│   │   ├── categories.get.ts   # Category endpoints
│   │   ├── tags.get.ts         # Tag endpoints
│   │   ├── site.get.ts         # Site config endpoint
│   │   ├── auth/               # Authentication
│   │   │   ├── login.post.ts
│   │   │   ├── logout.post.ts
│   │   │   ├── me.get.ts
│   │   │   ├── user.get.ts
│   │   │   ├── profile.put.ts
│   │   │   ├── password.put.ts
│   │   │   └── account.delete.ts
│   │   └── admin/              # Admin endpoints
│   │       ├── files/
│   │       │   ├── upload.post.ts
│   │       │   ├── index.get.ts
│   │       │   └── [id].delete.ts
│   │       ├── posts/
│   │       ├── pages/
│   │       ├── users/
│   │       ├── authors/
│   │       ├── categories/
│   │       ├── tags/
│   │       └── dashboard/
│   │           └── stats.get.ts
│   ├── middleware/             # Server middleware
│   │   ├── apiAuth.ts         # API authentication
│   │   └── db-check.ts        # Database connection check
│   ├── utils/                 # Utility functions
│   │   ├── r2.ts             # Cloudflare R2 functions
│   │   ├── dbApi.ts          # D1 SQL Studio API
│   │   ├── auth.ts           # Authentication utilities
│   │   └── apiToken.ts       # API token utilities
│   └── types/
│       └── dbTypes.ts        # Database TypeScript types
├── types/                      # Shared TypeScript types
│   └── blog.ts               # Blog-related types
├── public/                     # Static assets
│   ├── robots.txt
│   └── site.webmanifest
├── .env.local                  # Local environment variables (git-ignored)
├── .env.example                # Environment variables template
├── nuxt.config.ts             # Nuxt configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## 🔌 API Endpoints

### Public APIs

#### Posts
- `GET /api/posts` - Get all posts (supports pagination, category, and tag filters)
- `GET /api/posts/:id` - Get post by ID or slug

#### Pages
- `GET /api/pages` - List all published pages with pagination
- `GET /api/pages/:slug` - Get single page by slug

#### Content
- `GET /api/categories` - Get all categories with post counts
- `GET /api/tags` - Get all tags with post counts
- `GET /api/site` - Get site configuration

### Admin APIs (Authentication Required)

#### Authentication
- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/logout` - Logout current session
- `GET /api/auth/me` - Get current user info
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Change password
- `DELETE /api/auth/account` - Delete account

#### File Management
- `POST /api/admin/files/upload` - Upload files to R2
- `GET /api/admin/files` - List files with pagination and filtering
- `DELETE /api/admin/files/:id` - Delete file

#### Content Management
- `GET /api/admin/posts` - List all posts (with draft support)
- `POST /api/admin/posts` - Create new post
- `PUT /api/admin/posts/:id` - Update post
- `DELETE /api/admin/posts/:id` - Delete post

- `GET /api/admin/pages` - List all pages
- `POST /api/admin/pages` - Create new page
- `PUT /api/admin/pages/:id` - Update page
- `DELETE /api/admin/pages/:id` - Delete page

- `GET /api/admin/categories` - List all categories
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/:id` - Update category
- `DELETE /api/admin/categories/:id` - Delete category

- `GET /api/admin/tags` - List all tags
- `POST /api/admin/tags` - Create tag
- `PUT /api/admin/tags/:id` - Update tag
- `DELETE /api/admin/tags/:id` - Delete tag

#### User Management
- `GET /api/admin/users` - List all users
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

#### Dashboard
- `GET /api/admin/dashboard/stats` - Get dashboard statistics

### Query Parameters

**GET /api/posts**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number for pagination |
| `limit` | number | 10 | Posts per page |
| `category` | string | - | Filter by category name |
| `tag` | string | - | Filter by tag name |
| `search` | string | - | Search in title and excerpt |

**GET /api/admin/files**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Files per page |
| `search` | string | - | Search by file name |
| `mime_type` | string | - | Filter by MIME type |

**Example Requests:**
```bash
# Get posts with pagination and category filter
GET /api/posts?page=1&limit=10&category=Tutorial

# Search files by name and type
GET /api/admin/files?page=1&limit=20&search=avatar&mime_type=image/jpeg
```

## 🎨 Features Deep Dive

### Authentication & Authorization

The blog includes a complete authentication system with:
- **Secure Login**: Username/password authentication with session management
- **JWT Tokens**: API tokens for programmatic access
- **User Roles**: Support for different user roles and permissions
- **Protected Routes**: Admin pages require authentication
- **Session Timeout**: Automatic session expiration for security

### Content Management System

#### Blog Posts
- Full CRUD operations for posts
- Draft and published status support
- Rich text editor with Markdown support
- Featured posts functionality
- Author and category assignment
- Auto-generated read time estimation

#### Custom Pages

#### Two Content Modes

1. **HTML Content Mode**: Use the `content` field for simple pages with raw HTML
2. **Block-Based Mode**: Build pages using reusable content blocks for complex layouts

#### Available Block Types

The system includes 10 pre-built block types:

- **BlockHero** - Hero section with title, subtitle, and CTA buttons
- **BlockFeatures** - Feature showcase grid
- **BlockCta** - Call-to-action section
- **BlockText** - Simple text/content block
- **BlockGallery** - Image gallery
- **BlockTestimonials** - Customer testimonials
- **BlockFaq** - FAQ accordion
- **BlockStats** - Statistics/metrics display
- **BlockVideo** - Video embed
- **BlockCustom** - Custom HTML block

#### Page Customization Options

**Layout & Theme:**
- `layout`: `'wide'`, `'narrow'`, or `'default'` - Controls content width
- `theme`: `'light'` or `'dark'` - Page color scheme
- `template`: Page template name (e.g., 'minimal', 'standard')

**Display Settings:**
- `show_header` - Show/hide header
- `show_footer` - Show/hide footer
- `show_breadcrumb` - Show/hide breadcrumb navigation
- `cover_image_url` - Hero cover image URL

**Advanced Features:**
- `custom_css` - Inject custom CSS styles
- `custom_js` - Add custom JavaScript
- `enable_comments` - Enable comment section
- `enable_sharing` - Show social sharing buttons
- `is_password_protected` - Protect page with password

**SEO Optimization:**
- `meta_title`, `meta_description`, `meta_keywords` - Standard SEO tags
- `og_title`, `og_description`, `og_image` - Open Graph tags
- `canonical_url` - Canonical URL

#### API Endpoints for Pages

**GET /api/pages**
- List all pages with pagination
- Query parameters:
  - `page` - Page number (default: 1)
  - `limit` - Results per page (default: 100)
  - `status` - Filter by status: `'draft'`, `'published'`, or `'archived'`

**GET /api/pages/[slug]**
- Get single page by slug or ID
- Add `?preview=true` to view draft pages

**GET /api/pages/[id]/blocks**
- Fetch all blocks for a specific page
- Returns blocks sorted by display order

#### Creating Custom Pages

Pages are stored in the database and managed through the D1 SQL Studio REST API. Each page requires:

```typescript
{
  title: 'Page Title',
  slug: 'page-url-slug',
  status: 'published', // 'draft', 'published', or 'archived'
  template: 'standard',
  theme: 'light',
  layout: 'default',
  // ... additional fields
}
```

Pages are automatically accessible at `/{slug}` (e.g., `/about`, `/contact`).

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
- **Build output directory**: `dist`
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
   - Build output directory: `dist`

4. **Set Environment Variables**:
   - Go to Pages → Your project → Settings → Environment variables
   - Add all required variables for Preview and Production:
     - `DB_API_KEY`, `DB_API_URL`
     - `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`
     - `SESSION_SECRET`

5. **Deploy**: Click **Save and Deploy**

Your site will be live on Cloudflare's global CDN!

### Environment Variables Checklist

Before deploying, ensure you have configured all required variables:

```
Database:
- [ ] DB_API_KEY
- [ ] DB_API_URL

File Storage (R2):
- [ ] R2_ACCOUNT_ID
- [ ] R2_ACCESS_KEY_ID
- [ ] R2_SECRET_ACCESS_KEY
- [ ] R2_BUCKET_NAME
- [ ] R2_PUBLIC_URL

Session:
- [ ] SESSION_SECRET (minimum 32 characters)
```

## 🚀 Performance Optimization

### Server-Side Rendering (SSR)
- All pages are server-side rendered for optimal SEO and initial load performance
- Automatic code splitting for faster page transitions

### Image Optimization
- Automatic image optimization through Nuxt Image
- Lazy loading for images below the fold
- Responsive image serving
- WebP format support for modern browsers

### Content Delivery
- Global CDN distribution via Cloudflare Pages
- Edge caching for static assets
- Real-time invalidation on updates

### Database Performance
- Efficient pagination to avoid loading large datasets
- Indexed queries for fast filtering and search
- Connection pooling through D1 SQL Studio REST API

## 🔒 Security Features

- **Input Validation**: All form inputs are validated on both client and server
- **SQL Injection Prevention**: Parameterized queries through D1 SQL Studio API
- **CSRF Protection**: Built-in CSRF token handling
- **XSS Prevention**: Automatic HTML escaping in templates
- **Secure Headers**: Content-Security-Policy and other security headers configured
- **Rate Limiting**: API endpoints protected with rate limiting
- **File Upload Security**: 
  - File type validation (MIME type checking)
  - File size limits
  - Unique filename generation
  - Isolated storage in R2

## 📚 Documentation & Resources

### Official Documentation
- [Nuxt 3 Documentation](https://nuxt.com/docs)
- [Vue 3 Guide](https://vuejs.org/guide/introduction.html)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)

### Project References
- [D1 SQL Studio GitHub](https://github.com/playwjj/d1-sql-studio)
- [Nuxt Image Module](https://image.nuxt.com/)
- [Tailwind UI](https://tailwindui.com/)

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure:
- Code follows the existing style and conventions
- TypeScript types are properly defined
- New features include appropriate documentation
- Tests are added for new functionality where applicable

## 🐛 Reporting Issues

Found a bug? Please open an issue on GitHub with:
- Clear description of the problem
- Steps to reproduce the issue
- Expected vs actual behavior
- Your environment (OS, Node version, etc.)

## ⭐ Show Your Support

If you find this project helpful, please consider:
- ⭐ **Starring the repository** - Show your appreciation
- 🔗 **Sharing it with others** - Help spread the word
- 🤝 **Contributing improvements** - Make it better together
- 🐛 **Reporting bugs** - Help us fix issues
- 💡 **Suggesting features** - Share your ideas

**Live site**: [https://blog.404401.xyz](https://blog.404401.xyz)

## 📄 License

MIT

This means you can use this project for personal and commercial purposes, modify it, distribute it, and use it privately, as long as you include a copy of the license.

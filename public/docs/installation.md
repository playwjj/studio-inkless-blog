# Installation Guide

A modern, feature-rich blog platform built with Nuxt 3, Tailwind CSS, and Cloudflare.

**Live Demo**: [https://404401.xyz](https://404401.xyz)

---

## System Requirements

- **Node.js**: 20 or later
- **Package Manager**: npm or yarn
- **Cloudflare Account**: Required for R2 storage and deployment
- **D1 SQL Studio**: Required for database management

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/studio-inkless-blog.git
cd studio-inkless-blog
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

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

### 4. Database Setup with D1 SQL Studio

This project requires **D1 SQL Studio** for database management. The application uses the REST API exposed by D1 SQL Studio for all data operations.

**Setup Steps**:

1. Install or deploy D1 SQL Studio from: [https://github.com/playwjj/d1-sql-studio](https://github.com/playwjj/d1-sql-studio)

2. Follow the D1 SQL Studio README to start it locally or deploy to your hosting environment

3. After startup, you'll receive a REST API endpoint and an API key

4. Set the environment variables:
   ```env
   DB_API_KEY=your_db_api_key
   DB_API_URL=https://your-d1-sql-studio.example.com
   ```

5. Restart your application so Nuxt picks up the runtime config

**Note**: When deploying to Cloudflare Pages, add `DB_API_KEY` and `DB_API_URL` in your Pages project settings (Settings → Environment variables).

### 5. File Storage Setup with Cloudflare R2

The project uses **Cloudflare R2** for file storage (S3-compatible).

**Getting R2 Credentials**:

1. **Account ID**:
   - Go to Cloudflare Dashboard → R2 → Account details
   - Copy your Account ID

2. **Access Key & Secret**:
   - In Cloudflare Dashboard → R2 → API tokens
   - Click "Create API token"
   - Generate a token with read/write permissions
   - Save the Access Key ID and Secret Access Key

3. **Bucket Name**:
   - Create a bucket in R2 (e.g., `studio-inkless-files`)
   - Use this name in the configuration

4. **Public URL**:
   - Create a custom domain or use R2's default URL
   - Example: `https://files.example.com`
   - Configure in Cloudflare R2 settings

### 6. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your blog in action!

### 7. Build for Production

```bash
npm run build

# Preview production build
npm run preview
```

## Deployment to Cloudflare Pages

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
   Go to Pages → Your project → Settings → Environment variables and add:

   **Database**:
   - `DB_API_KEY`
   - `DB_API_URL`

   **File Storage (R2)**:
   - `R2_ACCOUNT_ID`
   - `R2_ACCESS_KEY_ID`
   - `R2_SECRET_ACCESS_KEY`
   - `R2_BUCKET_NAME`
   - `R2_PUBLIC_URL`

   **Session**:
   - `SESSION_SECRET` (minimum 32 characters)

5. **Deploy**: Click **Save and Deploy**

Your site will be live on Cloudflare's global CDN!

## Admin Dashboard

### Access Admin Panel

Visit `/admin/login` and use your configured admin credentials to log in.

### Main Features

- **Post Management**: Create, edit, and publish blog posts with rich text editor
- **Page Management**: Build custom pages using 10+ content blocks
- **Category & Tag Management**: Organize your content
- **File Management**: Upload and manage files in R2 storage
- **User Management**: Support for multiple users and roles
- **Site Configuration**: Modify site name, description, logo, etc.
- **Menu Management**: Configure navigation menus

## Troubleshooting

### Port Already in Use

Modify the port configuration in `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  devServer: {
    port: 3001 // Change to another port
  }
})
```

### Database Connection Failed

1. Verify D1 SQL Studio is running and accessible
2. Check if `DB_API_KEY` and `DB_API_URL` are correct
3. Ensure your D1 SQL Studio instance is deployed and accessible from your environment

### File Upload Failed

1. Verify all R2 environment variables are set correctly
2. Check R2 bucket permissions and API token permissions
3. Ensure `R2_PUBLIC_URL` is configured for public file access

### Build Failed

1. Ensure Node.js version >= 20
2. Clear cache and rebuild:

```bash
rm -rf .nuxt .output node_modules
npm install
npm run build
```

### Admin Login Failed

1. Check D1 SQL Studio database has user records
2. Verify session configuration (`SESSION_SECRET` is set)
3. Clear browser cache and cookies

## Advanced Configuration

### Custom Theme Colors

Modify AI theme colors in `tailwind.config.ts`:

```javascript
theme: {
  extend: {
    colors: {
      'ai-purple': '#8B5CF6',
      'ai-cyan': '#06B6D4',
      'ai-pink': '#EC4899',
    }
  }
}
```

### Page Customization

Build custom pages with content blocks:
- BlockHero - Hero sections
- BlockFeatures - Feature grids
- BlockCta - Call-to-action sections
- BlockGallery - Image galleries
- BlockTestimonials - Customer testimonials
- BlockFaq - FAQ accordions
- And more...

### SEO Configuration

Update SEO defaults in `nuxt.config.ts` or use `useHead()` in specific pages.

## Getting Help

- **GitHub Issues**: [Report Issues]
- **API Documentation**: [View API Docs](/docs?tab=api)
- **Live Demo**: [https://404401.xyz](https://404401.xyz)

## Project Resources

- [Nuxt 3 Documentation](https://nuxt.com/docs)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [D1 SQL Studio GitHub](https://github.com/playwjj/d1-sql-studio)

---

Last Updated: 2025-12-23

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss', '@nuxt/image'],

  // Nuxt Image configuration
  image: {
    // Disable ipx as we use external image sources
    provider: 'none',
    quality: 80,
  },

  // Cloudflare Pages configuration (only for production)
  ...(process.env.NODE_ENV === 'production' ? {
    nitro: {
      preset: 'cloudflare-pages',
      serveStatic: true,
      // Configure compatibility flags for Cloudflare Workers
      compatibilityDate: '2024-11-01',
      // Enable Node.js built-in modules compatibility
      node: true,
      // Cloudflare-specific configuration
      cloudflare: {
        pages: {
          routes: {
            exclude: ['/favicon.ico']
          }
        }
      }
    }
  } : {}),

  // App configuration
  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      },
      title: 'Studio Inkless Blog',
      titleTemplate: '%s - Studio Inkless Blog',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A modern blog about web development, design, and technology. Learn Nuxt 3, Vue, Tailwind CSS, and more.' },
        { name: 'format-detection', content: 'telephone=no' },

        // Open Graph
        { property: 'og:site_name', content: 'Studio Inkless Blog' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'en_US' },

        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@studioinkless' },

        // Theme color
        { name: 'theme-color', content: '#0284c7' },
        { name: 'msapplication-TileColor', content: '#0284c7' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/favicon.svg' },
        { rel: 'manifest', href: '/site.webmanifest' }
      ]
    }
  },

  typescript: {
    strict: true
  },

  runtimeConfig: {
    dbApiKey: process.env.DB_API_KEY,
    dbApiUrl: process.env.DB_API_URL || 'https://db.404401.xyz',
    sessionSecret: process.env.SESSION_SECRET || 'change-this-secret-in-production-min-32-chars-required',
    // Cloudflare R2 Configuration
    r2AccountId: process.env.R2_ACCOUNT_ID,
    r2AccessKeyId: process.env.R2_ACCESS_KEY_ID,
    r2SecretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    r2BucketName: process.env.R2_BUCKET_NAME,
    r2PublicUrl: process.env.R2_PUBLIC_URL,
    // Setup disabling for security
    setupDisabled: process.env.SETUP_DISABLED === 'true' || false
  }
})

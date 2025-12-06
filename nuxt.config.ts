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

  // Cloudflare Pages configuration
  nitro: {
    preset: 'cloudflare-pages',
    serveStatic: true
  },

  // App configuration
  app: {
    head: {
      title: 'Studio Inkless Blog',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A modern blog built with Nuxt 3 and Tailwind CSS' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  typescript: {
    strict: true
  }
})

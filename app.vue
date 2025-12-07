<script setup lang="ts">
const { fetchSiteConfig, siteConfig, getKeywords } = useSiteConfig()

// Fetch site configuration on app mount
await fetchSiteConfig()

// Set favicon and other head elements
useHead({
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: () => siteConfig.value?.favicon_url || '/favicon.svg'
    }
  ],
  meta: [
    {
      name: 'keywords',
      content: () => getKeywords().join(', ')
    }
  ]
})

// Set default meta tags
useSeoMeta({
  title: () => siteConfig.value?.og_title || 'Studio Inkless Blog',
  description: () => siteConfig.value?.description || '',
  ogSiteName: () => siteConfig.value?.og_site_name || '',
  ogTitle: () => siteConfig.value?.og_title || '',
  ogDescription: () => siteConfig.value?.og_description || '',
  ogImage: () => siteConfig.value?.og_image || '',
  ogUrl: () => siteConfig.value?.og_url || '',
  twitterCard: 'summary_large_image',
  twitterTitle: () => siteConfig.value?.twitter_title || '',
  twitterDescription: () => siteConfig.value?.twitter_description || '',
  twitterImage: () => siteConfig.value?.twitter_image || ''
})
</script>

<template>
  <div>
    <NuxtLoadingIndicator color="#0284c7" :height="3" :duration="2000" :throttle="200" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

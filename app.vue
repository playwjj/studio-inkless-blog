<script setup lang="ts">
const { fetchSiteConfig, siteConfig, getKeywords } = useSiteConfig()
const { trackPageView } = useGTM()
const route = useRoute()

// Fetch site configuration on app mount
await fetchSiteConfig()

// Check if GTM should be loaded (not on admin pages)
const shouldLoadGTM = computed(() => {
  return siteConfig.value?.gtm_code && !route.path.startsWith('/admin')
})

// GTM code from site config
const gtmCode = computed(() => siteConfig.value?.gtm_code || '')

// Inject GTM scripts via useHead (works with SSR)
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
  ],
  script: [
    // GTM script in head
    {
      key: 'gtm-script',
      children: () => {
        if (!shouldLoadGTM.value) return ''
        return `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmCode.value}');`
      }
    }
  ],
  noscript: [
    // GTM noscript iframe
    {
      key: 'gtm-noscript',
      children: () => {
        if (!shouldLoadGTM.value) return ''
        return `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmCode.value}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`
      }
    }
  ]
})

// Track page views on route change (exclude admin pages)
watch(() => route.path, (newPath) => {
  if (!newPath.startsWith('/admin') && siteConfig.value?.gtm_code) {
    trackPageView(newPath)
  }
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

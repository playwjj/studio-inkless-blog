import type { DbSite } from '~/server/types/dbTypes'

export const useSiteConfig = () => {
  const siteConfig = useState<DbSite | null>('siteConfig', () => null)

  const fetchSiteConfig = async () => {
    if (siteConfig.value) {
      return siteConfig.value
    }

    try {
      const data = await $fetch<DbSite>('/api/site')
      siteConfig.value = data
      return data
    } catch (error) {
      console.error('Failed to fetch site config:', error)
      return null
    }
  }

  const getTitle = (pageTitle?: string) => {
    if (!siteConfig.value) return pageTitle || 'Loading...'

    if (pageTitle) {
      // Replace ${title} placeholder with actual page title
      return siteConfig.value.title.replace('${title}', pageTitle)
    }

    // Use og_title as fallback when no page title is provided
    return siteConfig.value.og_title
  }

  const getCopyright = () => {
    if (!siteConfig.value?.copyright_text) return ''

    // Replace ${year} placeholder with current year
    const currentYear = new Date().getFullYear()
    return siteConfig.value.copyright_text.replace('${year}', currentYear.toString())
  }

  const getKeywords = () => {
    if (!siteConfig.value?.keywords) return []

    // Split keywords by comma and trim whitespace
    return siteConfig.value.keywords.split(',').map(k => k.trim()).filter(Boolean)
  }

  return {
    siteConfig,
    fetchSiteConfig,
    getTitle,
    getCopyright,
    getKeywords
  }
}

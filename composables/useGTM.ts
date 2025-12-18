/**
 * Google Tag Manager composable for Nuxt 3
 * Works with SSR - GTM script is injected via useHead in app.vue
 */
export const useGTM = () => {
  /**
   * Push event to GTM dataLayer
   * @param event - Event name
   * @param data - Event data
   */
  const pushEvent = (event: string, data?: Record<string, any>) => {
    if (typeof window === 'undefined') return

    // Initialize dataLayer if not exists
    window.dataLayer = window.dataLayer || []

    window.dataLayer.push({
      event,
      ...data
    })
  }

  /**
   * Track page view
   * @param url - Page URL
   * @param title - Page title
   */
  const trackPageView = (url: string, title?: string) => {
    if (typeof window === 'undefined') return

    pushEvent('pageview', {
      page_path: url,
      page_title: title || (typeof document !== 'undefined' ? document.title : '')
    })
  }

  /**
   * Track custom event
   * @param eventName - Custom event name
   * @param eventParams - Event parameters
   */
  const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
    pushEvent(eventName, eventParams)
  }

  return {
    pushEvent,
    trackPageView,
    trackEvent
  }
}

// TypeScript declarations for window
declare global {
  interface Window {
    dataLayer: any[]
    google_tag_manager?: any
  }
}

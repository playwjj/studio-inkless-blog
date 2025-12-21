/**
 * Composable for handling image fallback
 * Provides default placeholder images when cover image is missing
 */

export const useImageFallback = () => {
  /**
   * Get image URL with fallback to placeholder
   * @param imageUrl - Original image URL
   * @param width - Image width for placeholder
   * @param height - Image height for placeholder
   * @param text - Optional text to display on placeholder
   * @returns Image URL or placeholder URL
   */
  const getImageWithFallback = (
    imageUrl: string | null | undefined,
    width: number = 1200,
    height: number = 630,
    text: string = 'No Image'
  ): string => {
    // If image URL exists and is not empty, return it
    if (imageUrl && imageUrl.trim()) {
      return imageUrl
    }

    // Generate placeholder URL using placehold.co
    // Alternative services: via.placeholder.com, placeholder.com, etc.
    const encodedText = encodeURIComponent(text)
    return `https://placehold.co/${width}x${height}/e2e8f0/64748b?text=${encodedText}`
  }

  /**
   * Get blog cover image with fallback
   * Optimized for blog post cards (16:9 aspect ratio)
   */
  const getBlogCoverImage = (
    imageUrl: string | null | undefined,
    title: string = 'Blog Post'
  ): string => {
    return getImageWithFallback(imageUrl, 1200, 675, title)
  }

  /**
   * Get avatar image with fallback
   * Optimized for avatars (1:1 aspect ratio)
   */
  const getAvatarImage = (
    imageUrl: string | null | undefined,
    name: string = 'User'
  ): string => {
    if (imageUrl && imageUrl.trim()) {
      return imageUrl
    }

    // Generate initials from name
    const initials = name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)

    return `https://placehold.co/200x200/3b82f6/ffffff?text=${initials}`
  }

  /**
   * Create a data URL for inline SVG placeholder
   * Useful for immediate rendering without external requests
   */
  const createInlinePlaceholder = (
    width: number = 1200,
    height: number = 630,
    text: string = 'No Image'
  ): string => {
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#e2e8f0"/>
        <text
          x="50%"
          y="50%"
          dominant-baseline="middle"
          text-anchor="middle"
          font-family="system-ui, -apple-system, sans-serif"
          font-size="32"
          fill="#64748b"
        >${text}</text>
      </svg>
    `.trim()

    return `data:image/svg+xml;base64,${btoa(svg)}`
  }

  return {
    getImageWithFallback,
    getBlogCoverImage,
    getAvatarImage,
    createInlinePlaceholder
  }
}

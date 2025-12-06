export const useFormatDate = () => {
  const formatDate = (dateString: string, format: 'short' | 'long' = 'short') => {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: format,
      day: 'numeric'
    }
    return date.toLocaleDateString('en-US', options)
  }

  return {
    formatDate
  }
}

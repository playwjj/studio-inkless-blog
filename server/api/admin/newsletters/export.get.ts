import { requireAuth } from '~/server/utils/auth'
import { fetchAllFromDb } from '~/server/utils/dbApi'
import type { DbNewsletter } from '~/server/types/dbTypes'

export default defineEventHandler(async (event) => {
  try {
    // Require authentication
    await requireAuth(event)

    // Fetch all newsletters
    const newsletters = await fetchAllFromDb<DbNewsletter>('newsletters')

    // Sort by subscribed_at descending
    newsletters.sort((a, b) => {
      return new Date(b.subscribed_at).getTime() - new Date(a.subscribed_at).getTime()
    })

    // Generate CSV content
    const csvHeader = 'Email,Status,Source,Subscribed At,IP Address,User Agent'
    const csvRows = newsletters.map(newsletter => {
      // Escape fields that might contain commas
      const escapeCSV = (field: string | null | undefined) => {
        if (!field) return ''
        // If field contains comma, quote, or newline, wrap in quotes and escape quotes
        if (field.includes(',') || field.includes('"') || field.includes('\n')) {
          return `"${field.replace(/"/g, '""')}"`
        }
        return field
      }

      return [
        escapeCSV(newsletter.email),
        escapeCSV(newsletter.status),
        escapeCSV(newsletter.source),
        escapeCSV(newsletter.subscribed_at),
        escapeCSV(newsletter.ip_address),
        escapeCSV(newsletter.user_agent)
      ].join(',')
    })

    const csv = [csvHeader, ...csvRows].join('\n')

    // Set headers for file download
    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `newsletters-${timestamp}.csv`

    setResponseHeaders(event, {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-cache'
    })

    return csv
  } catch (error: any) {
    console.error('Failed to export newsletters:', error)

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to export newsletters'
    })
  }
})

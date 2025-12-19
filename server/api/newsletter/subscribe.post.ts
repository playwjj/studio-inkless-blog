import { fetchByField, createRow, updateRow } from '~/server/utils/dbApi'
import type { DbNewsletter } from '~/server/types/dbTypes'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email } = body

    // Validate email
    if (!email || typeof email !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email is required'
      })
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid email address'
      })
    }

    const normalizedEmail = email.trim().toLowerCase()

    // Check if email already exists
    const existing = await fetchByField<DbNewsletter>('newsletters', 'email', normalizedEmail)

    if (existing) {
      if (existing.status === 'active') {
        // Already subscribed
        throw createError({
          statusCode: 409,
          statusMessage: 'This email is already subscribed'
        })
      } else {
        // Previously unsubscribed, reactivate
        await updateRow('newsletters', existing.id, {
          status: 'active',
          subscribed_at: new Date().toISOString(),
          unsubscribed_at: null,
          updated_at: new Date().toISOString()
        })

        return {
          success: true,
          message: 'Welcome back! You have been resubscribed.'
        }
      }
    }

    // Get client information (optional)
    const ipAddress = getRequestIP(event) || null
    const userAgent = getRequestHeader(event, 'user-agent') || null

    // Create new subscription
    const now = new Date().toISOString()
    await createRow<DbNewsletter>('newsletters', {
      email: normalizedEmail,
      status: 'active',
      source: 'homepage',
      ip_address: ipAddress,
      user_agent: userAgent,
      subscribed_at: now,
      unsubscribed_at: null,
      created_at: now,
      updated_at: now
    })

    return {
      success: true,
      message: 'Thank you for subscribing!'
    }
  } catch (error: any) {
    // If it's already a createError, re-throw it
    if (error.statusCode) {
      throw error
    }

    // Log unexpected errors
    console.error('Newsletter subscription error:', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to process subscription'
    })
  }
})

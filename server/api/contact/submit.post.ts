import { createRow } from '~/server/utils/dbApi'
import type { DbContactUs } from '~/server/types/dbTypes'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { name, email, subject, message, honeypot, timestamp } = body

    // Anti-bot validation 1: Honeypot field must be empty
    if (honeypot && honeypot.trim() !== '') {
      console.warn('Bot detected: honeypot field filled')
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid submission'
      })
    }

    // Anti-bot validation 2: Check submission time (must be at least 3 seconds)
    if (timestamp) {
      const timeTaken = Date.now() - Number(timestamp)
      if (timeTaken < 3000) {
        console.warn('Bot detected: form submitted too quickly', timeTaken, 'ms')
        throw createError({
          statusCode: 400,
          statusMessage: 'Form submitted too quickly'
        })
      }

      // Also reject if timestamp is too old (e.g., more than 1 hour)
      if (timeTaken > 3600000) {
        console.warn('Suspicious: form submission timeout exceeded')
        throw createError({
          statusCode: 400,
          statusMessage: 'Form session expired'
        })
      }
    }

    // Validate required fields
    if (!name || typeof name !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name is required'
      })
    }

    if (!email || typeof email !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email is required'
      })
    }

    if (!message || typeof message !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Message is required'
      })
    }

    // Validate name length
    if (name.trim().length < 2 || name.trim().length > 100) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name must be between 2 and 100 characters'
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

    // Validate message length
    if (message.trim().length < 10 || message.trim().length > 5000) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Message must be between 10 and 5000 characters'
      })
    }

    // Anti-bot validation 3: Check for suspicious patterns
    const suspiciousPatterns = [
      /https?:\/\//gi,  // Multiple URLs in message
      /<script/gi,      // Script tags
      /\[url=/gi,       // BBCode links
      /viagra|cialis|casino|poker|lottery/gi  // Common spam keywords
    ]

    let urlCount = 0
    for (const pattern of suspiciousPatterns) {
      const matches = message.match(pattern)
      if (matches) {
        if (pattern.source.includes('https')) {
          urlCount = matches.length
          // Allow up to 2 URLs
          if (urlCount > 2) {
            console.warn('Bot detected: too many URLs in message')
            throw createError({
              statusCode: 400,
              statusMessage: 'Message contains too many links'
            })
          }
        } else {
          console.warn('Bot detected: suspicious content pattern')
          throw createError({
            statusCode: 400,
            statusMessage: 'Message contains invalid content'
          })
        }
      }
    }

    // Validate subject length if provided
    if (subject && (typeof subject !== 'string' || subject.trim().length > 200)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Subject must be less than 200 characters'
      })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const normalizedName = name.trim()
    const normalizedSubject = subject ? subject.trim() : null
    const normalizedMessage = message.trim()

    // Get client information (optional)
    const ipAddress = getRequestIP(event) || null
    const userAgent = getRequestHeader(event, 'user-agent') || null

    // Create new contact submission
    const now = new Date().toISOString()
    await createRow<DbContactUs>('contact_us', {
      name: normalizedName,
      email: normalizedEmail,
      subject: normalizedSubject,
      message: normalizedMessage,
      status: 'new',
      ip_address: ipAddress,
      user_agent: userAgent,
      created_at: now,
      updated_at: now,
      read_at: null,
      replied_at: null
    })

    return {
      success: true,
      message: 'Thank you for contacting us! We will get back to you soon.'
    }
  } catch (error: any) {
    // If it's already a createError, re-throw it
    if (error.statusCode) {
      throw error
    }

    // Log unexpected errors
    console.error('Contact form submission error:', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to process your message'
    })
  }
})

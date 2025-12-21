import type { DbUser } from '~/server/types/dbTypes'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, password } = body

  if (!username || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Username and password are required'
    })
  }

  // Get client IP
  const clientIp = getClientIp(event)

  // Check IP rate limiting
  const ipCheck = checkIpRateLimit(clientIp)
  if (!ipCheck.allowed) {
    console.warn(`[Security] IP ${clientIp} is rate limited. Locked until ${new Date(ipCheck.lockedUntil!).toISOString()}`)
    throw createError({
      statusCode: 429,
      statusMessage: `Too many login attempts. Please try again in ${formatWaitTime(ipCheck.waitTime!)}`
    })
  }

  // Check account lockout
  const accountCheck = checkAccountLockout(username)
  if (accountCheck.locked) {
    console.warn(`[Security] Account "${username}" is locked. Locked until ${new Date(accountCheck.lockedUntil!).toISOString()}`)
    throw createError({
      statusCode: 423,
      statusMessage: `Account temporarily locked due to multiple failed attempts. Please try again in ${formatWaitTime(accountCheck.waitTime!)}`
    })
  }

  try {
    // Fetch user by username
    const user = await fetchByField<DbUser>('users', 'username', username)

    if (!user) {
      // Record failed attempt
      recordFailedAttempt(clientIp, username)

      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials'
      })
    }

    // Check if user is active
    if (!user.is_active) {
      // Record failed attempt
      recordFailedAttempt(clientIp, username)

      throw createError({
        statusCode: 403,
        statusMessage: 'Account is disabled'
      })
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password_hash)

    if (!isPasswordValid) {
      // Record failed attempt
      recordFailedAttempt(clientIp, username)

      // Get remaining attempts
      const remaining = accountCheck.remainingAttempts! - 1
      const message = remaining > 0
        ? `Invalid credentials. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining before account lockout.`
        : 'Invalid credentials. Account will be locked after this attempt.'

      throw createError({
        statusCode: 401,
        statusMessage: message
      })
    }

    // Successful login - reset rate limiting
    resetAttempts(clientIp, username)

    // Update last login time
    await updateRow('users', user.id, {
      last_login_at: new Date().toISOString()
    })

    // Create session
    const userSession = createUserSession(user)
    await setUserSession(event, userSession)

    console.log(`[Security] Successful login for user "${username}" from IP ${clientIp}`)

    return {
      success: true,
      user: userSession
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Login error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})

/**
 * Rate limiting and brute force protection for login attempts
 *
 * Features:
 * - IP-based rate limiting
 * - Account-based lockout
 * - Automatic cleanup of old records
 *
 * Note: Uses in-memory storage. For production with multiple instances,
 * consider using Redis or a distributed cache.
 */

interface LoginAttempt {
  count: number
  firstAttempt: number
  lastAttempt: number
  lockedUntil?: number
}

// In-memory storage for login attempts
const ipAttempts = new Map<string, LoginAttempt>()
const accountAttempts = new Map<string, LoginAttempt>()

// Configuration
const CONFIG = {
  // IP rate limiting
  IP_MAX_ATTEMPTS: 10,        // Max attempts per IP
  IP_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  IP_LOCKOUT_MS: 30 * 60 * 1000, // 30 minutes lockout

  // Account lockout
  ACCOUNT_MAX_ATTEMPTS: 5,    // Max failed attempts per account
  ACCOUNT_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  ACCOUNT_LOCKOUT_MS: 15 * 60 * 1000, // 15 minutes lockout

  // Cleanup
  CLEANUP_INTERVAL_MS: 60 * 60 * 1000, // Cleanup every hour
}

/**
 * Clean up old records to prevent memory leaks
 */
function cleanupOldRecords() {
  const now = Date.now()

  // Cleanup IP attempts
  for (const [ip, attempt] of ipAttempts.entries()) {
    if (now - attempt.lastAttempt > CONFIG.IP_WINDOW_MS) {
      ipAttempts.delete(ip)
    }
  }

  // Cleanup account attempts
  for (const [username, attempt] of accountAttempts.entries()) {
    if (now - attempt.lastAttempt > CONFIG.ACCOUNT_WINDOW_MS) {
      accountAttempts.delete(username)
    }
  }
}

// Start periodic cleanup
setInterval(cleanupOldRecords, CONFIG.CLEANUP_INTERVAL_MS)

/**
 * Check if an IP is rate limited
 */
export function checkIpRateLimit(ip: string): {
  allowed: boolean
  remainingAttempts?: number
  lockedUntil?: number
  waitTime?: number
} {
  const now = Date.now()
  const attempt = ipAttempts.get(ip)

  if (!attempt) {
    return { allowed: true, remainingAttempts: CONFIG.IP_MAX_ATTEMPTS }
  }

  // Check if locked
  if (attempt.lockedUntil && now < attempt.lockedUntil) {
    const waitTime = Math.ceil((attempt.lockedUntil - now) / 1000)
    return {
      allowed: false,
      lockedUntil: attempt.lockedUntil,
      waitTime
    }
  }

  // Check if window has expired
  if (now - attempt.firstAttempt > CONFIG.IP_WINDOW_MS) {
    // Reset the window
    ipAttempts.delete(ip)
    return { allowed: true, remainingAttempts: CONFIG.IP_MAX_ATTEMPTS }
  }

  // Check if exceeded max attempts
  if (attempt.count >= CONFIG.IP_MAX_ATTEMPTS) {
    // Lock the IP
    attempt.lockedUntil = now + CONFIG.IP_LOCKOUT_MS
    const waitTime = Math.ceil(CONFIG.IP_LOCKOUT_MS / 1000)
    return {
      allowed: false,
      lockedUntil: attempt.lockedUntil,
      waitTime
    }
  }

  return {
    allowed: true,
    remainingAttempts: CONFIG.IP_MAX_ATTEMPTS - attempt.count
  }
}

/**
 * Check if an account is locked
 */
export function checkAccountLockout(username: string): {
  locked: boolean
  remainingAttempts?: number
  lockedUntil?: number
  waitTime?: number
} {
  const now = Date.now()
  const attempt = accountAttempts.get(username)

  if (!attempt) {
    return { locked: false, remainingAttempts: CONFIG.ACCOUNT_MAX_ATTEMPTS }
  }

  // Check if locked
  if (attempt.lockedUntil && now < attempt.lockedUntil) {
    const waitTime = Math.ceil((attempt.lockedUntil - now) / 1000)
    return {
      locked: true,
      lockedUntil: attempt.lockedUntil,
      waitTime
    }
  }

  // Check if window has expired
  if (now - attempt.firstAttempt > CONFIG.ACCOUNT_WINDOW_MS) {
    // Reset the window
    accountAttempts.delete(username)
    return { locked: false, remainingAttempts: CONFIG.ACCOUNT_MAX_ATTEMPTS }
  }

  // Check if exceeded max attempts
  if (attempt.count >= CONFIG.ACCOUNT_MAX_ATTEMPTS) {
    // Lock the account
    attempt.lockedUntil = now + CONFIG.ACCOUNT_LOCKOUT_MS
    const waitTime = Math.ceil(CONFIG.ACCOUNT_LOCKOUT_MS / 1000)
    return {
      locked: true,
      lockedUntil: attempt.lockedUntil,
      waitTime
    }
  }

  return {
    locked: false,
    remainingAttempts: CONFIG.ACCOUNT_MAX_ATTEMPTS - attempt.count
  }
}

/**
 * Record a failed login attempt
 */
export function recordFailedAttempt(ip: string, username: string) {
  const now = Date.now()

  // Record IP attempt
  const ipAttempt = ipAttempts.get(ip)
  if (ipAttempt) {
    ipAttempt.count++
    ipAttempt.lastAttempt = now
  } else {
    ipAttempts.set(ip, {
      count: 1,
      firstAttempt: now,
      lastAttempt: now
    })
  }

  // Record account attempt
  const accountAttempt = accountAttempts.get(username)
  if (accountAttempt) {
    accountAttempt.count++
    accountAttempt.lastAttempt = now
  } else {
    accountAttempts.set(username, {
      count: 1,
      firstAttempt: now,
      lastAttempt: now
    })
  }

  // Log suspicious activity (5+ failed attempts)
  if (ipAttempt && ipAttempt.count >= 5) {
    console.warn(`[Security] Suspicious login activity from IP ${ip}: ${ipAttempt.count} attempts`)
  }
  if (accountAttempt && accountAttempt.count >= 3) {
    console.warn(`[Security] Multiple failed login attempts for user "${username}": ${accountAttempt.count} attempts`)
  }
}

/**
 * Reset attempts after successful login
 */
export function resetAttempts(ip: string, username: string) {
  ipAttempts.delete(ip)
  accountAttempts.delete(username)
}

/**
 * Get client IP address from event
 */
export function getClientIp(event: any): string {
  // Try various headers in order of preference
  const headers = event.node.req.headers

  const ip =
    headers['cf-connecting-ip'] ||  // Cloudflare
    headers['x-real-ip'] ||         // Nginx proxy
    headers['x-forwarded-for']?.split(',')[0] || // Standard proxy
    event.node.req.socket?.remoteAddress || // Direct connection
    'unknown'

  return ip.toString().trim()
}

/**
 * Format time remaining in human-readable format
 */
export function formatWaitTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? 's' : ''}`
  }
  const minutes = Math.ceil(seconds / 60)
  return `${minutes} minute${minutes !== 1 ? 's' : ''}`
}

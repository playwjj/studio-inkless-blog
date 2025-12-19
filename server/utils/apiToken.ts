import type { DbApiToken } from '~/server/types/dbTypes'

/**
 * Generate a random API token
 * Format: sk_live_<32 random hex characters>
 * Uses Web Crypto API for Cloudflare Workers compatibility
 */
export function generateApiToken(): string {
  // Use Web Crypto API (compatible with both Node.js and Cloudflare Workers)
  const randomBytes = new Uint8Array(32)
  crypto.getRandomValues(randomBytes)

  // Convert to hex string
  const token = Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')

  return `sk_live_${token}`
}

/**
 * Hash an API token for storage
 * Uses Web Crypto API for Cloudflare Workers compatibility
 */
export async function hashApiToken(token: string): Promise<string> {
  // Use Web Crypto API (compatible with both Node.js and Cloudflare Workers)
  const encoder = new TextEncoder()
  const data = encoder.encode(token)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)

  // Convert to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

  return hashHex
}

/**
 * Verify an API token against a hash
 */
export async function verifyApiToken(token: string, hash: string): Promise<boolean> {
  const tokenHash = await hashApiToken(token)
  return tokenHash === hash
}

/**
 * Find a token by its hash value
 */
export async function findTokenByHash(tokenHash: string): Promise<DbApiToken | null> {
  try {
    // Use fetchByField to query by token_hash directly
    const token = await fetchByField<DbApiToken>('api_tokens', 'token_hash', tokenHash)

    // Verify token is active
    if (token && token.is_active === 1) {
      return token
    }

    return null
  } catch (error) {
    console.error('Failed to find token by hash:', error)
    return null
  }
}

/**
 * Validate if a token is still valid (not expired, is active)
 */
export function isTokenValid(token: DbApiToken): boolean {
  if (token.is_active !== 1) {
    return false
  }

  if (token.expires_at) {
    const expiresAt = new Date(token.expires_at)
    const now = new Date()
    if (now > expiresAt) {
      return false
    }
  }

  return true
}

/**
 * Update token last used timestamp
 */
export async function updateTokenLastUsed(tokenId: number): Promise<void> {
  try {
    await updateRow('api_tokens', tokenId, {
      last_used_at: new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to update token last used:', error)
  }
}

import crypto from 'crypto'
import type { DbApiToken } from '~/server/types/dbTypes'

/**
 * Generate a random API token
 * Format: sk_live_<32 random hex characters>
 */
export function generateApiToken(): string {
  const randomBytes = crypto.randomBytes(32)
  const token = randomBytes.toString('hex')
  return `sk_live_${token}`
}

/**
 * Hash an API token for storage
 */
export function hashApiToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}

/**
 * Verify an API token against a hash
 */
export function verifyApiToken(token: string, hash: string): boolean {
  const tokenHash = hashApiToken(token)
  return tokenHash === hash
}

/**
 * Find a token by its hash value
 */
export async function findTokenByHash(tokenHash: string): Promise<DbApiToken | null> {
  try {
    const response = await fetchFromDb<DbApiToken>('api_tokens', {
      limit: 1
    })

    if (!response.data || response.data.length === 0) {
      return null
    }

    // Find token with matching hash
    const token = response.data.find(t => t.token_hash === tokenHash && t.is_active === 1)
    return token || null
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

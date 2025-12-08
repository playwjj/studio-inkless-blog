import bcrypt from 'bcryptjs'
import type { H3Event } from 'h3'
import type { DbUser } from '~/server/types/dbTypes'

const SALT_ROUNDS = 10

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}

export function createUserSession(user: DbUser) {
  // Return user without password hash
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    full_name: user.full_name,
    avatar_url: user.avatar_url,
    role: user.role
  }
}

export async function getUserFromSession(event: H3Event) {
  const session = await useSession(event, {
    password: useRuntimeConfig().sessionSecret || 'change-this-secret-in-production'
  })

  return session.data.user || null
}

export async function requireAuth(event: H3Event) {
  // Check if authenticated via API token first
  if (event.context.apiUser) {
    return event.context.apiUser
  }

  // Otherwise check session
  const user = await getUserFromSession(event)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  return user
}

export function isApiRequest(event: H3Event): boolean {
  return event.context.isApiRequest === true
}

export function requireScope(event: H3Event, requiredScope: string) {
  if (!event.context.isApiRequest) {
    // Not an API request, skip scope check
    return true
  }

  const scopes = event.context.apiToken?.scopes || []

  if (!scopes.includes(requiredScope) && !scopes.includes('*')) {
    throw createError({
      statusCode: 403,
      statusMessage: `Missing required scope: ${requiredScope}`
    })
  }

  return true
}

export async function setUserSession(event: H3Event, user: any) {
  const session = await useSession(event, {
    password: useRuntimeConfig().sessionSecret || 'change-this-secret-in-production'
  })

  await session.update({
    user
  })
}

export async function clearUserSession(event: H3Event) {
  const session = await useSession(event, {
    password: useRuntimeConfig().sessionSecret || 'change-this-secret-in-production'
  })

  await session.clear()
}

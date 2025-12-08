import type { DbApiToken } from '~/server/types/dbTypes'

export default defineEventHandler(async (event) => {
  try {
    // Get current user from session
    const currentUser = await requireAuth(event)

    const body = await readBody(event)
    const { name, description, scopes, expires_in_days } = body

    // Validate required fields
    if (!name) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Token name is required'
      })
    }

    // Generate token
    const token = generateApiToken()
    const tokenHash = hashApiToken(token)

    // Calculate expiration date if provided
    let expiresAt: string | null = null
    if (expires_in_days && expires_in_days > 0) {
      const expiryDate = new Date()
      expiryDate.setDate(expiryDate.getDate() + expires_in_days)
      expiresAt = expiryDate.toISOString()
    }

    // Create token in database
    const newToken = await createRow<DbApiToken>('api_tokens', {
      user_id: currentUser.id,
      token_hash: tokenHash,
      name: name.trim(),
      description: description?.trim() || null,
      scopes: scopes ? JSON.stringify(scopes) : null,
      expires_at: expiresAt,
      is_active: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })

    // Return the plain token (this is the ONLY time it will be shown)
    return {
      success: true,
      token: token,  // Plain token for user to save
      token_info: {
        id: newToken.id,
        name: newToken.name,
        description: newToken.description,
        scopes: newToken.scopes ? JSON.parse(newToken.scopes) : [],
        expires_at: newToken.expires_at,
        created_at: newToken.created_at
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Create token error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})

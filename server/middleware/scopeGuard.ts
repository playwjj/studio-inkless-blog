/**
 * Scope guard for API-token access to the admin API.
 *
 * Token scopes were stored from the start (api_tokens.scopes) and
 * requireScope existed in server/utils/auth.ts, but nothing enforced
 * them centrally. This middleware maps /api/admin/<group>/** to the
 * group scope of the same name (see server/utils/tokenScopes.ts) so
 * the check lives in one place instead of every handler.
 *
 * Rules:
 * - Only API-token requests are scope-limited. Session logins are
 *   unaffected (apiAuth leaves event.context.isApiRequest unset).
 * - A token with an empty scope list keeps the legacy behaviour —
 *   role-only access — so tokens created before scopes existed are
 *   not locked out.
 * - A token with a non-empty scope list must carry the group scope
 *   or the '*' wildcard, otherwise the request is rejected with 403.
 * - The role ceiling is not repeated here: roleGuard runs first
 *   (middleware files run in alphabetical order: apiAuth, roleGuard,
 *   scopeGuard), so an editor's token cannot reach admin groups even
 *   if an admin scope is listed on it.
 * - Setup endpoints are excluded; they guard themselves.
 */
import { TOKEN_SCOPE_SET } from '../utils/tokenScopes'

export default defineEventHandler(async (event) => {
  const path = event.path
  if (!path.startsWith('/api/admin/')) {
    return
  }

  if (path.startsWith('/api/admin/setup/')) {
    return
  }

  const context = event.context as any

  // Session-authenticated requests carry no token scopes.
  if (!context.isApiRequest) {
    return
  }

  const scopes: string[] = context.apiToken?.scopes || []

  // Legacy tokens: empty scope list means role-only access.
  if (scopes.length === 0) {
    return
  }

  const group = path.split('/')[3]
  if (!group || !TOKEN_SCOPE_SET.has(group)) {
    return
  }

  // Throws 403 unless the token carries this group scope or '*'.
  requireScope(event, group)
})

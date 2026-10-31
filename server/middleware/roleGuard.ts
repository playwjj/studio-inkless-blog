/**
 * Role guard for the admin API.
 *
 * Role policy (three roles in the user model):
 * - admin: full site management
 * - editor: article work only — writing/editing articles and the
 *   content that goes with them (authors, categories, tags, media,
 *   AI generation, dashboard)
 * - viewer: read-only; no access to the admin API at all
 *
 * Most /api/admin/** handlers only call requireAuth, which accepts
 * any signed-in account, so the role split is enforced here in one
 * place instead of editing every handler. Site-management groups
 * (users, site settings, newsletters, pages, contact messages) are
 * admin-only.
 *
 * This middleware runs after apiAuth (alphabetical order), so token
 * requests already carry event.context.apiUser with the token
 * owner's role. Unauthenticated requests fall through and get the
 * handler's usual 401.
 */

// Path segment after /api/admin/ that only an admin may use.
const ADMIN_ONLY_GROUPS = new Set([
  'users',
  'site',
  'newsletters',
  'pages',
  'contact'
])

export default defineEventHandler(async (event) => {
  const path = event.path
  if (!path.startsWith('/api/admin/')) {
    return
  }

  // Setup endpoints guard themselves: they refuse once any user
  // exists, and SETUP_DISABLED can turn them off entirely.
  if (path.startsWith('/api/admin/setup/')) {
    return
  }

  let role: string | undefined = (event.context as any).apiUser?.role

  if (!role) {
    try {
      const user: any = await getUserFromSession(event)
      role = user?.role
    } catch {
      // No readable session: fall through to the handler's 401.
      return
    }
  }

  if (!role) {
    return
  }

  if (role === 'viewer') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Viewer accounts cannot access the admin API'
    })
  }

  const group = path.split('/')[3]
  if (role !== 'admin' && ADMIN_ONLY_GROUPS.has(group)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Admin access required'
    })
  }
})

/**
 * Role guard for the admin API.
 *
 * The user model has three roles (admin / editor / viewer), but most
 * /api/admin/** handlers only call requireAuth, which accepts any
 * signed-in account. A viewer is a read-only account: it must not be
 * able to create, edit, delete or export anything through the admin
 * API. This middleware closes that gap in one place instead of
 * editing every handler.
 *
 * It runs after apiAuth (alphabetical middleware order), so token
 * requests already carry event.context.apiUser. Unauthenticated
 * requests fall through and get the handler's usual 401.
 */
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

  if (role === 'viewer') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Viewer accounts cannot access the admin API'
    })
  }
})

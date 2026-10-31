/**
 * API token scope vocabulary.
 *
 * One scope per admin API group; the scope name is the path segment
 * after /api/admin/ (see server/api/admin/*). The groups mirror the
 * role split enforced by roleGuard: editor scopes cover article work,
 * admin scopes cover site management. '*' is the full-access wildcard
 * (already understood by requireScope in server/utils/auth.ts).
 *
 * Setup endpoints are deliberately not scoped: they guard themselves.
 *
 * The admin tokens page keeps a copy of these lists for its create
 * form (pages/admin/tokens.vue); keep the two in sync.
 */
export const EDITOR_TOKEN_SCOPES = [
  'posts',
  'authors',
  'categories',
  'tags',
  'files',
  'ai',
  'dashboard'
] as const

export const ADMIN_TOKEN_SCOPES = [
  'users',
  'site',
  'pages',
  'newsletters',
  'contact'
] as const

export const ALL_TOKEN_SCOPES: readonly string[] = [
  ...EDITOR_TOKEN_SCOPES,
  ...ADMIN_TOKEN_SCOPES
]

export const TOKEN_SCOPE_SET: ReadonlySet<string> = new Set(ALL_TOKEN_SCOPES)

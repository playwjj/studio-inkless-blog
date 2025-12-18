interface DbApiResponse<T> {
  success: boolean
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
  }
}

interface DbApiParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  search?: string
}

export async function fetchFromDb<T>(
  table: string,
  params: DbApiParams = {}
): Promise<DbApiResponse<T>> {
  const config = useRuntimeConfig()
  const apiUrl = config.dbApiUrl
  const apiKey = config.dbApiKey

  if (!apiUrl || !apiKey) {
    throw new Error('DB API configuration is missing')
  }

  const queryParams = new URLSearchParams()
  if (params.page) queryParams.set('page', params.page.toString())
  if (params.limit) queryParams.set('limit', params.limit.toString())
  if (params.sortBy) queryParams.set('sortBy', params.sortBy)
  if (params.sortOrder) queryParams.set('sortOrder', params.sortOrder)
  if (params.search) queryParams.set('search', params.search)

  const url = `${apiUrl}/api/tables/${table}/rows?${queryParams.toString()}`

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`DB API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Failed to fetch from ${table}:`, error)
    throw error
  }
}

export async function fetchOneFromDb<T>(
  table: string,
  id?: number | string,
  where?: Record<string, any>
): Promise<T | null> {
  const config = useRuntimeConfig()
  const apiUrl = config.dbApiUrl
  const apiKey = config.dbApiKey

  if (!apiUrl || !apiKey) {
    throw new Error('DB API configuration is missing')
  }

  // If id is provided, fetch by id
  if (id !== undefined) {
    const url = `${apiUrl}/api/tables/${table}/rows/${id}`

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        if (response.status === 404) {
          return null
        }
        throw new Error(`DB API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return data.data || data
    } catch (error) {
      console.error(`Failed to fetch ${table}/${id}:`, error)
      throw error
    }
  }

  // If where clause is provided, fetch by field
  if (where) {
    const [field, value] = Object.entries(where)[0]
    return fetchByField<T>(table, field, value)
  }

  throw new Error('Either id or where clause must be provided')
}

export async function fetchByField<T>(
  table: string,
  field: string,
  value: string | number
): Promise<T | null> {
  const config = useRuntimeConfig()
  const apiUrl = config.dbApiUrl
  const apiKey = config.dbApiKey

  if (!apiUrl || !apiKey) {
    throw new Error('DB API configuration is missing')
  }

  const url = `${apiUrl}/api/tables/${table}/rows?field=${encodeURIComponent(field)}&value=${encodeURIComponent(value)}`

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`DB API error: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()
    // Handle both array and single object responses
    if (Array.isArray(result.data)) {
      return result.data.length > 0 ? result.data[0] : null
    } else if (result.data) {
      return result.data
    }
    return null
  } catch (error) {
    console.error(`Failed to fetch ${table} by ${field}=${value}:`, error)
    throw error
  }
}

export async function createRow<T>(
  table: string,
  data: Record<string, any>
): Promise<T> {
  const config = useRuntimeConfig()
  const apiUrl = config.dbApiUrl
  const apiKey = config.dbApiKey

  if (!apiUrl || !apiKey) {
    throw new Error('DB API configuration is missing')
  }

  const url = `${apiUrl}/api/tables/${table}/rows`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      throw new Error(`DB API error: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()
    return result.data || result
  } catch (error) {
    console.error(`Failed to create row in ${table}:`, error)
    throw error
  }
}

export async function updateRow<T>(
  table: string,
  id: number | string,
  data: Record<string, any>
): Promise<T> {
  const config = useRuntimeConfig()
  const apiUrl = config.dbApiUrl
  const apiKey = config.dbApiKey

  if (!apiUrl || !apiKey) {
    throw new Error('DB API configuration is missing')
  }

  const url = `${apiUrl}/api/tables/${table}/rows/${id}`

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      throw new Error(`DB API error: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()
    return result.data || result
  } catch (error) {
    console.error(`Failed to update row in ${table}:`, error)
    throw error
  }
}

export async function deleteRow(
  table: string,
  id: number | string
): Promise<boolean> {
  const config = useRuntimeConfig()
  const apiUrl = config.dbApiUrl
  const apiKey = config.dbApiKey

  if (!apiUrl || !apiKey) {
    throw new Error('DB API configuration is missing')
  }

  const url = `${apiUrl}/api/tables/${table}/rows/${id}`

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    })

    if (!response.ok) {
      throw new Error(`DB API error: ${response.status} ${response.statusText}`)
    }

    return true
  } catch (error) {
    console.error(`Failed to delete row in ${table}:`, error)
    throw error
  }
}

export async function fetchAllFromDb<T>(
  table: string,
  where?: Record<string, any>
): Promise<T[]> {
  const config = useRuntimeConfig()
  const apiUrl = config.dbApiUrl
  const apiKey = config.dbApiKey

  if (!apiUrl || !apiKey) {
    throw new Error('DB API configuration is missing')
  }

  // Build query parameters
  const params = new URLSearchParams()
  params.set('limit', '1000')

  // Add where conditions if provided
  if (where) {
    Object.entries(where).forEach(([key, value]) => {
      params.set(key, String(value))
    })
  }

  const url = `${apiUrl}/api/tables/${table}/rows?${params.toString()}`

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      // If 404, return empty array instead of throwing
      if (response.status === 404) {
        return []
      }
      throw new Error(`DB API error: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()
    // Handle both array response and paginated response
    if (Array.isArray(result)) {
      return result
    }
    return result.data || []
  } catch (error) {
    console.error(`Failed to fetch all from ${table}:`, error)
    throw error
  }
}

export async function insertRow(
  table: string,
  data: Record<string, any>
): Promise<{ lastID: number }> {
  const config = useRuntimeConfig()
  const apiUrl = config.dbApiUrl
  const apiKey = config.dbApiKey

  if (!apiUrl || !apiKey) {
    throw new Error('DB API configuration is missing')
  }

  const url = `${apiUrl}/api/tables/${table}/rows`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      throw new Error(`DB API error: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()
    return { lastID: result.data?.id || result.id }
  } catch (error) {
    console.error(`Failed to insert row in ${table}:`, error)
    throw error
  }
}

export async function deleteRows(
  table: string,
  where: Record<string, any>
): Promise<boolean> {
  const config = useRuntimeConfig()
  const apiUrl = config.dbApiUrl
  const apiKey = config.dbApiKey

  if (!apiUrl || !apiKey) {
    throw new Error('DB API configuration is missing')
  }

  // First fetch all rows matching the where clause
  const rows = await fetchAllFromDb<{ id: number }>(table, where)

  // Delete each row
  for (const row of rows) {
    await deleteRow(table, row.id)
  }

  return true
}

export async function executeQuery<T = any>(
  sql: string,
  params: any[] = []
): Promise<T[]> {
  const config = useRuntimeConfig()
  const apiUrl = config.dbApiUrl
  const apiKey = config.dbApiKey

  if (!apiUrl || !apiKey) {
    throw new Error('DB API configuration is missing')
  }

  const url = `${apiUrl}/api/query`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sql, params })
    })

    if (!response.ok) {
      throw new Error(`DB API error: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()

    // Handle different response formats
    // For query API: { success: true, data: { results: [...] } }
    if (result.data && result.data.results && Array.isArray(result.data.results)) {
      return result.data.results
    }
    // Direct array
    if (Array.isArray(result)) {
      return result
    }
    // { data: [...] }
    if (result.data && Array.isArray(result.data)) {
      return result.data
    }
    // { results: [...] }
    if (result.results && Array.isArray(result.results)) {
      return result.results
    }
    // Single object
    if (result.data) {
      return [result.data]
    }
    return []
  } catch (error) {
    console.error('Failed to execute query:', error)
    throw error
  }
}

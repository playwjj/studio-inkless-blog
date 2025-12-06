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
  id: number | string
): Promise<T | null> {
  const config = useRuntimeConfig()
  const apiUrl = config.dbApiUrl
  const apiKey = config.dbApiKey

  if (!apiUrl || !apiKey) {
    throw new Error('DB API configuration is missing')
  }

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

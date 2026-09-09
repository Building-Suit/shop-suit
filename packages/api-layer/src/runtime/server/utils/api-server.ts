import { useRuntimeConfig } from '#imports'
import type { Tables } from '../types/database'

export interface ApiServerOptions {
  endpoint?: 'rest' | 'auth' | 'functions'
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT'
  params?: Record<string, string | number | boolean>
  body?: unknown
  headers?: Record<string, string>
  useServiceKey?: boolean
}

export interface ApiServerResponse<T> {
  data: T | null
  error: unknown
}

/**
 * Centralized Supabase REST API fetch wrapper
 *
 * @example
 * // Database query (typed response)
 * const { data } = await useApiServer<Tables<'plans'>[]>('plans', {
 *   params: { select: 'id,name', is_active: 'eq.true' }
 * });
 *
 * @example
 * // Auth endpoint
 * const { data } = await useApiServer('/signup', {
 *   endpoint: 'auth',
 *   method: 'POST',
 *   body: { email, password }
 * });
 */
export const useApiServer = async <T = unknown>(
  path: string,
  options: ApiServerOptions = {},
): Promise<ApiServerResponse<T>> => {
  const config = useRuntimeConfig()

  const supabaseUrl = config.public.supabaseUrl as string
  const supabaseAnonKey = config.public.supabaseKey as string
  const supabaseServiceKey = config.supabaseServiceKey as string

  const {
    endpoint = 'rest',
    method = 'GET',
    params,
    body,
    headers = {},
    useServiceKey = false,
  } = options

  // Build full URL
  const baseUrls = {
    rest: `${supabaseUrl}/rest/v1`,
    auth: `${supabaseUrl}/auth/v1`,
    functions: `${supabaseUrl}/functions/v1`,
  }

  // Strip leading slash and ensure path starts clean
  const cleanPath = path.replace(/^\/+/, '')
  const fullUrl = `${baseUrls[endpoint]}/${cleanPath}`

  const apiKey = useServiceKey ? supabaseServiceKey : supabaseAnonKey

  const defaultHeaders = {
    'apikey': apiKey,
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...headers,
  }

  try {
    const response = await $fetch<T>(fullUrl, {
      method,
      headers: defaultHeaders,
      params,
      body: body as Record<string, unknown>,
    })

    return { data: response, error: null }
  }
  catch (error: unknown) {
    console.error('Supabase fetch error:', error)
    return { data: null, error }
  }
}

/**
 * Typed database table helpers
 */
export const table = {
  /**
   * Select from table with type safety
   * @example const { data } = await table.select('portals', { key: portalKey })
   */
  async select(
    tableName: string,
    where: Record<string, string>,
    options?: { single?: boolean, select?: string },
  ) {
    const params: Record<string, string> = {
      select: options?.select || '*',
    }

    Object.entries(where).forEach(([key, value]) => {
      params[key] = `eq.${value}`
    })

    if (options?.single) {
      params.limit = '1'
      const { data, error } = await useApiServer<Tables<never>[]>(tableName, { params })
      return { data: data?.[0] ?? null, error }
    }

    return useApiServer<Tables<never>[]>(tableName, { params })
  },

  /**
   * Insert into table
   */
  async insert(tableName: string, data: unknown) {
    return useApiServer<unknown>(tableName, {
      method: 'POST',
      body: data,
      headers: { Prefer: 'return=representation' },
    })
  },

  /**
   * Update table
   */
  async update(
    tableName: string,
    where: Record<string, string>,
    data: unknown,
  ) {
    const params: Record<string, string> = {}
    Object.entries(where).forEach(([key, value]) => {
      params[key] = `eq.${value}`
    })

    return useApiServer<unknown>(tableName, {
      method: 'PATCH',
      params,
      body: data,
      headers: { Prefer: 'return=representation' },
    })
  },

}

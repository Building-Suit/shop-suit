/**
 * Supabase REST API utilities for server-side operations
 *
 * Documentation:
 * - PostgREST API: https://postgrest.org/en/stable/api.html
 * - Supabase Auth: https://supabase.com/docs/reference/javascript/auth-api
 *
 * PostgREST Query Examples:
 * - Filters: ?id=eq.123, ?age=gt.18, ?name=like.*John*
 * - Pagination: ?limit=10&offset=20
 * - Ordering: ?order=created_at.desc
 * - Select: ?select=id,name,email
 */

import { useRuntimeConfig } from "#app";

interface SupabaseFetchOptions {
  endpoint?: "rest" | "auth" | "functions";
  method?: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
  params?: Record<string, string | number | boolean>;
  body?: any;
  headers?: Record<string, string>;
  useServiceKey?: boolean;
}

/**
 * Centralized Supabase REST API fetch wrapper
 *
 * @example
 * // Database query (default to 'rest')
 * const { data } = await useSupabaseFetch('plans', {
 *   params: { select: 'id,name', is_active: 'eq.true' }
 * });
 *
 * @example
 * // Auth endpoint
 * const { data } = await useSupabaseFetch('/signup', {
 *   endpoint: 'auth',
 *   method: 'POST',
 *   body: { email, password }
 * });
 */
export const useApiServer = async <T = any>(
  path: string,
  options: SupabaseFetchOptions = {},
) => {
  const config = useRuntimeConfig();

  const supabaseUrl = config.public.supabaseUrl as string;
  const supabaseAnonKey = config.public.supabaseKey as string;
  const supabaseServiceKey = config.supabaseServiceKey as string;

  const {
    endpoint = "rest",
    method = "GET",
    params,
    body,
    headers = {},
    useServiceKey = false,
  } = options;

  // Build full URL
  const baseUrls = {
    rest: `${supabaseUrl}/rest/v1`,
    auth: `${supabaseUrl}/auth/v1`,
    functions: `${supabaseUrl}/functions/v1`,
  };

  // Strip leading slash and ensure path starts clean
  const cleanPath = path.replace(/^\/+/, "");
  const fullUrl = `${baseUrls[endpoint]}/${cleanPath}`;

  const apiKey = useServiceKey ? supabaseServiceKey : supabaseAnonKey;

  const defaultHeaders = {
    apiKey,
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    Accept: "application/json",
    ...headers,
  };

  try {
    const response = await $fetch<T>(fullUrl, {
      method,
      headers: defaultHeaders,
      params,
      body,
    });

    return { data: response as T, error: null };
  } catch (error) {
    console.error("Supabase fetch error:", error);
    return { data: null, error };
  }
};

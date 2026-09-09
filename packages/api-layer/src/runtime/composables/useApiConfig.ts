import { useRuntimeConfig } from '#app'

export interface ApiLayerConfig {
  /** Portal Key for multi-tenancy (e.g. `shop-crm`, `building-suit`) */
  portalKey: string

  /** Base URL for API calls (default to `/api`) */
  apiBaseUrl?: string

  /** Billing routes configuration */
  billing?: {
    plans?: string
    checkout?: string
    subscription?: string
    webhooks?: string
  }

  /** Auth routes configuration */
  authRoutes?: {
    signup?: string
    login?: string
    session?: string
    logout?: string
    resetPassword?: string
    oauthGoogle?: string
  }
}

export const useApiConfig = (): ApiLayerConfig => {
  const config = useRuntimeConfig()
  return config.public.apiLayer as ApiLayerConfig
}

import { useApiConfig } from '../composables/useApiConfig'
import { useApiClient } from '../composables/useRefApi'
import type { ApiQueryOptions } from '../contracts/types'

// Match database schema exactly
export interface SubscriptionPlan {
  id: string
  name: string
  slug: string
  price_amount: number
  currency: string
  billing_interval: 'monthly' | 'yearly'
  trial_days: number
  features: Record<string, boolean> // JSONB feature flags
  sort_order: number
  is_coming_soon: boolean
}

// Backend wraps in { success, plans }
export interface PlansResponse {
  success: boolean
  plans: SubscriptionPlan[]
}

// 1. Keys
export const billingKeys = {
  all: ['billing'] as const,
  plans: () => [...billingKeys.all, 'plans'] as const,
}

// 2. Query Options Factory
export const usePlansQuery = (): ApiQueryOptions<SubscriptionPlan[]> => {
  const api = useApiClient()
  const config = useApiConfig()
  const plansRoute = config.billing?.plans ?? '/billing/plans'

  return {
    key: [...billingKeys.plans(), config.portalKey],
    query: async () => {
      // Fetch wrapped response and extract plans array
      const response = await api<PlansResponse>(plansRoute, {
        query: { portal: config.portalKey },
      })
      return response.plans
    },
    staleTime: 60 * 60 * 1000, // 1 hour
  }
}

import { useApiConfig } from "../composables/useApiConfig";
import { useApiClient } from "../composables/useRefApi";
import type { ApiQueryOptions } from "../contracts/types";

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: "month" | "year";
  features: string[];
}

// 1. Keys
export const billingKeys = {
  all: ["billing"] as const,
  plans: () => [...billingKeys.all, "plans"] as const,
};

// 2. Query Ooptions Factory
export const usePlansQuery = (): ApiQueryOptions<SubscriptionPlan[]> => {
  const api = useApiClient();
  const config = useApiConfig();

  return {
    key: [...billingKeys.plans(), config.portalKey],
    query: () =>
      api<SubscriptionPlan[]>(config.billing?.plans!, {
        query: { portal: config.portalKey },
      }),
    staleTime: 60 * 60 * 1000, // 1 hour
  };
};

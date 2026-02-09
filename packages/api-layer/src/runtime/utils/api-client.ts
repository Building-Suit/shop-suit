import { useApiConfig } from "../composables/useApiConfig";
import type { FetchOptions } from "ofetch";
import { createError } from "h3";

export const createApiClient = () => {
  const config = useApiConfig();
  const apiBaseUrl = config.apiBaseUrl || "/api";

  const defaults: FetchOptions = {
    baseURL: apiBaseUrl, // Enforce BFF pattern: All calls go to /api

    // .1 Request Interceptor
    async onRequest({ options }) {
      // Add any global headers here (e.g. Correlation IDs)
      options.headers = new Headers(options.headers);
    },

    // 2. Response Error Interceptor (Global Error Handling)
    async onResponseError({ response }) {
      // Handle 401 Unauthorized globally
      if (response.status === 401) {
        // Redirect to login if on client
        if (import.meta.client) {
          window.location.href = "/auth/login";
        }
      }

      // Throw a standardized error object that Nuxt can render
      throw createError({
        statusCode: response.status,
        statusMessage: response.statusText,
        data: response._data,
      });
    },
  };

  return $fetch.create(defaults);
};

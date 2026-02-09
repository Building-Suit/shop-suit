import { useNuxtApp } from "#app";
import type {
  ApiAdapter,
  ApiQueryOptions,
  ApiQueryResult,
  ApiMutationOptions,
  ApiMutationResult,
} from "./types";

// Injection Token for the active adapter
export const API_ADAPTER_KEY = Symbol("api-adapter");

/**
 * The only function your apps are allowed to use for queries
 */
export function useQueryContract<TData, TError = unknown>(
  options: ApiQueryOptions<TData, TError>,
): ApiQueryResult<TData, TError> {
  const nuxt = useNuxtApp();
  const adapter = nuxt.$apiAdapter as ApiAdapter;

  if (!adapter) {
    throw new Error("Critical: No API Adapter registered. Check your plugins.");
  }

  return adapter.query(options);
}

/**
 * The only function your apps are allowed to use for mutations
 */
export function useMutationContract<TData, TVariables, TError = unknown>(
  options: ApiMutationOptions<TData, TVariables, TError>,
): ApiMutationResult<TData, TVariables, TError> {
  const nuxt = useNuxtApp();
  const adapter = nuxt.$apiAdapter as ApiAdapter;

  if (!adapter) {
    throw new Error("Critical: No API Adapter registered. Check your plugins.");
  }

  return adapter.mutation(options);
}

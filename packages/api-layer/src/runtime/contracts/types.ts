import type { Ref } from 'vue'

// --- Query Types ---
export interface ApiQueryOptions<TData> {
  key: string[] // Explicit keys are mandatory
  query: () => Promise<TData>
  staleTime?: number
  enabled?: Ref<boolean> | boolean
}

export interface ApiQueryResult<TData> {
  data: Ref<TData | undefined>
  status: Ref<'idle' | 'pending' | 'success' | 'error'>
  error: Ref<unknown>
  isLoading: Ref<boolean>
  refresh: () => Promise<void>
}

export type QueryAdapter = <TData>(
  options: ApiQueryOptions<TData>,
) => ApiQueryResult<TData>

// --- Mutation Types ---
export interface ApiMutationOptions<TData, TVariables, TError = unknown> {
  mutation: (variables: TVariables) => Promise<TData>
  onSuccess?: (data: TData, variables: TVariables) => void
  onError?: (error: TError, variables: TVariables) => void
  invalidateKeys?: string[][] // Optional list of keys to invalidate
}

export interface ApiMutationResult<TData, TVariables, TError = unknown> {
  mutate: (variables: TVariables) => void
  mutateAsync: (variables: TVariables) => Promise<TData>
  data: Ref<TData | undefined>
  error: Ref<TError | null>
  status: Ref<'idle' | 'pending' | 'success' | 'error'>
  isLoading: Ref<boolean>
}

export type MutationAdapter = <TData, TVariables>(
  options: ApiMutationOptions<TData, TVariables, unknown>,
) => ApiMutationResult<TData, TVariables, unknown>

// --- Unified Adapter Interface ---
export interface ApiAdapter {
  query: QueryAdapter
  mutation: MutationAdapter
}

export interface ContractContext {
  signal?: AbortSignal
  headers?: Record<string, string>
  server?: boolean
}

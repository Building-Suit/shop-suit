import { useQuery, useMutation, useQueryCache } from '@pinia/colada'
import type {
  ApiAdapter,
  ApiQueryOptions,
  ApiMutationOptions,
  ApiQueryResult,
  ApiMutationResult,
} from './types'

export const createColadaAdapter = (): ApiAdapter => {
  const queryCache = useQueryCache()

  return {
    query: <TData>(options: ApiQueryOptions<TData>) => {
      const queryReturn = useQuery({
        key: options.key,
        query: options.query,
        staleTime: options.staleTime,
        // enabled: options.enabled,
        // During SSR, swallow query errors into `error` state instead of
        // letting the onServerPrefetch rejection crash the whole page render
        // (full-screen Nuxt error page). The UI renders its error branch.
        ssrCatchError: true,
      })

      return {
        data: queryReturn.data,
        status: queryReturn.status,
        error: queryReturn.error,
        isLoading: queryReturn.isPending,
        refresh: async () => {
          await queryReturn.refetch()
        },
      } as unknown as ApiQueryResult<TData>
    },

    mutation: <TData, TVariables>(
      options: ApiMutationOptions<TData, TVariables>,
    ) => {
      const mutationReturn = useMutation({
        mutation: options.mutation,
        onSuccess: (data, variables) => {
          if (options.onSuccess) options.onSuccess(data, variables)

          if (options.invalidateKeys) {
            for (const key of options.invalidateKeys) {
              queryCache.invalidateQueries({ key })
            }
          }
        },
        onError: options.onError,
      })

      return {
        mutate: mutationReturn.mutate,
        mutateAsync: mutationReturn.mutateAsync,
        data: mutationReturn.data,
        error: mutationReturn.error,
        status: mutationReturn.status,
        isLoading: mutationReturn.isLoading,
      } as unknown as ApiMutationResult<TData, TVariables>
    },
  }
}

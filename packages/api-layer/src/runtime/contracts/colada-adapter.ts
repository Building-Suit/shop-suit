import { useQuery, useMutation, useQueryCache } from "@pinia/colada";
import type {
  ApiAdapter,
  ApiQueryOptions,
  ApiMutationOptions,
  ApiQueryResult,
  ApiMutationResult,
} from "./types";

export const createColadaAdapter = (): ApiAdapter => {
  const queryCache = useQueryCache();

  return {
    query: <TData, TError>(options: ApiQueryOptions<TData, TError>) => {
      const queryReturn = useQuery({
        key: options.key,
        query: options.query,
        staleTime: options.staleTime,
        // enabled: options.enabled,
      });

      return {
        data: queryReturn.data,
        status: queryReturn.status,
        error: queryReturn.error,
        isLoading: queryReturn.isPending,
        refresh: async () => {
          await queryReturn.refetch();
        },
      } as unknown as ApiQueryResult<TData, TError>;
    },

    mutation: <TData, TVariables, TError>(
      options: ApiMutationOptions<TData, TVariables, TError>,
    ) => {
      const mutationReturn = useMutation({
        mutation: options.mutation,
        onSuccess: (data, variables) => {
          if (options.onSuccess) options.onSuccess(data, variables);

          if (options.invalidateKeys) {
            for (const key of options.invalidateKeys) {
              queryCache.invalidateQueries({ key });
            }
          }
        },
        onError: options.onError,
      });

      return {
        mutate: mutationReturn.mutate,
        mutateAsync: mutationReturn.mutateAsync,
        data: mutationReturn.data,
        error: mutationReturn.error,
        status: mutationReturn.status,
        isLoading: mutationReturn.isLoading,
      } as unknown as ApiMutationResult<TData, TVariables, TError>;
    },
  };
};

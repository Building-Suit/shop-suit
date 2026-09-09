import { useApiConfig } from '../composables/useApiConfig'
import { useApiClient } from '../composables/useRefApi'
import type { ApiMutationOptions, ApiQueryOptions } from '../contracts/types'
import type {
  GoogleOAuthPayload,
  LoginPayload,
  ResetPasswordPayload,
  Session,
  SignupPayload,
} from '../types/auth'

// 1. Query Keys
export const authKeys = {
  all: ['auth'] as const,
  session: (portalKey: string) =>
    [...authKeys.all, 'session', portalKey] as const,
}

// 2. Queries
export const useSessionQuery = (): ApiQueryOptions<Session> => {
  const api = useApiClient()
  const config = useApiConfig()
  const sessionRoute = config.authRoutes?.session ?? '/auth/session'

  return {
    key: [...authKeys.session(config.portalKey)],
    query: () =>
      api<Session>(sessionRoute, {
        query: { portal: config.portalKey },
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  }
}

// 3. Mutations — contract-shaped so pages can use useMutationContract(...)
// with mutate/mutateAsync, status and invalidation support.
export const useLoginMutation = (): ApiMutationOptions<
  unknown,
  LoginPayload,
  unknown
> => {
  const api = useApiClient()
  const config = useApiConfig()
  const loginRoute = config.authRoutes?.login ?? '/auth/login'

  return {
    mutation: (data: LoginPayload) =>
      api(loginRoute, {
        method: 'POST',
        body: data,
      }),
  }
}

export const useSignupMutation = (): ApiMutationOptions<
  unknown,
  SignupPayload,
  unknown
> => {
  const api = useApiClient()
  const config = useApiConfig()
  const signupRoute = config.authRoutes?.signup ?? '/auth/signup'

  return {
    mutation: (data: SignupPayload) =>
      api(signupRoute, {
        method: 'POST',
        body: data,
      }),
  }
}

export const useGoogleOAuthMutation = (): ApiMutationOptions<
  unknown,
  GoogleOAuthPayload,
  unknown
> => {
  const api = useApiClient()
  const config = useApiConfig()
  const oauthRoute = config.authRoutes?.oauthGoogle ?? '/auth/oauth/google'

  return {
    mutation: (data: GoogleOAuthPayload) =>
      api(oauthRoute, {
        method: 'POST',
        body: data,
      }),
  }
}

export const useLogoutMutation = (): ApiMutationOptions<
  unknown,
  void,
  unknown
> => {
  const api = useApiClient()
  const config = useApiConfig()
  const logoutRoute = config.authRoutes?.logout ?? '/auth/logout'

  return {
    mutation: () => api(logoutRoute, { method: 'POST' }),
  }
}

export const useResetPasswordMutation = (): ApiMutationOptions<
  unknown,
  ResetPasswordPayload,
  unknown
> => {
  const api = useApiClient()
  const config = useApiConfig()
  const resetRoute = config.authRoutes?.resetPassword ?? '/auth/reset-password'

  return {
    mutation: (data: ResetPasswordPayload) =>
      api(resetRoute, {
        method: 'POST',
        body: data,
      }),
  }
}

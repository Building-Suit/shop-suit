import { useApiConfig } from "../composables/useApiConfig";
import { useApiClient } from "../composables/useRefApi";
import type { ApiQueryOptions } from "../contracts/types";
import type {
  GoogleOAuthPayload,
  LoginPayload,
  ResetPasswordPayload,
  Session,
  SignupPayload,
} from "../types/auth";

// 1. Query Keys
export const authKeys = {
  all: ["auth"] as const,
  session: (portalKey: string) =>
    [...authKeys.all, "session", portalKey] as const,
};

// 2. Quiries
export const useSessionQuery = (
  portalKey: string,
): ApiQueryOptions<Session> => {
  const api = useApiClient();
  const config = useApiConfig();

  return {
    key: [...authKeys.session(config.portalKey)],
    query: () =>
      api<Session>(config.authRoutes?.session!, {
        query: { portal: config.portalKey },
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  };
};

// 3. Mutations
export const useLoginMutation = () => {
  const api = useApiClient();
  const config = useApiConfig();

  return {
    mutationFn: (data: LoginPayload) =>
      api(config.authRoutes?.login!, {
        method: "POST",
        body: data,
      }),
  };
};

export const useSignupMutation = () => {
  const api = useApiClient();
  const config = useApiConfig();

  return {
    mutationFn: (data: SignupPayload) =>
      api(config.authRoutes?.signup!, {
        method: "POST",
        body: data,
      }),
  };
};

export const useGoogleOAuthMutation = () => {
  const api = useApiClient();
  const config = useApiConfig();

  return {
    mutationFn: (data: GoogleOAuthPayload) =>
      api(config.authRoutes?.oauthGoogle!, {
        method: "POST",
        body: data,
      }),
  };
};

export const useLogoutMutation = () => {
  const api = useApiClient();
  const config = useApiConfig();

  return {
    mutationFn: () => api(config.authRoutes?.logout!, { method: "POST" }),
  };
};

export const useResetPasswordMutation = () => {
  const api = useApiClient();
  const config = useApiConfig();

  return {
    mutationFn: (data: ResetPasswordPayload) =>
      api(config.authRoutes?.resetPassword!, {
        method: "POST",
        body: data,
      }),
  };
};

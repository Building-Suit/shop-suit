export default defineEventHandler(async event => {
  const config = useRuntimeConfig();
  const { redirectTo } = await readBody(event);

  const callbackUrl = redirectTo || `${config.public.appUrl}/auth/callback`;

  // Supabase OAth uses query params, not POST body
  const params = new URLSearchParams({
    provider: 'google',
    redirect_to: callbackUrl,
  });

  // The authorize endpoint lives on Supabase (public runtime config), not on our
  // BFF base URL (apiBaseUrl is "/api" — the previous value produced /api/auth/v1/...).
  const url = `${config.public.supabaseUrl}/auth/v1/authorize?${params}`;

  return { url };
});

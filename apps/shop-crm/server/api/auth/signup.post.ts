import { useApiServer } from '../../../../../packages/api-layer/dist/runtime/server/utils/api-server';

export default defineEventHandler(async event => {
  const config = useRuntimeConfig();
  const portalKey = config.public.portalKey as string;

  // 1. Read request body
  const { email, password, displayName } = await readBody(event);

  // 2. Get portal by key
  const { data: portal, error: portalError } = await useApiServer<{
    id: string;
  }>('/portals', {
    params: { select: 'id', key: `eq.${portalKey}` },
    headers: {
      Accept: 'application/vnd.pgrst.object+json',
    },
  });

  if (portalError || !portal) {
    throw createError({ statusCode: 404, statusMessage: 'Portal not found' });
  }

  const portalId = portal.id;

  // 3. Create Supbase auth user
  const { data: authUser, error: authError } = await useApiServer<{
    user: { id: string; email?: string };
  }>('/signup', {
    endpoint: 'auth',
    method: 'POST',
    body: {
      email,
      password,
      data: { display_name: displayName },
    },
  });

  if (authError || !authUser) {
    const message
      = typeof authError === 'object' && authError !== null && 'message' in authError
        ? String((authError as { message?: string }).message)
        : 'Signup failed';
    throw createError({
      statusCode: 400,
      message,
    });
  }

  // 4. Create profile (if not handled by DB trigger)
  // Server-side write with the service key: profiles RLS intentionally has no
  // client insert policy, and the service key never leaves the server.
  await useApiServer('/profiles', {
    method: 'POST',
    body: {
      user_id: authUser.user.id,
      portal_id: portalId,
      display_name: displayName,
      email_snapshot: email,
    },
    useServiceKey: true,
    headers: {
      Prefer: 'return=representation',
    },
  });

  return {
    success: true,
    user: authUser.user,
  };
});

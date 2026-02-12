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
  const { data: authUser, error: authError } = await useApiServer('/signup', {
    endpoint: 'auth',
    method: 'POST',
    body: {
      email,
      password,
      data: { display_name: displayName },
    },
  });

  if (authError) {
    throw createError({
      statusCode: 400,
      message: authError.message || 'Signup failed',
    });
  }

  // 4. Create profile (if not handled by DB trigger)
  await useApiServer('/profiles', {
    method: 'POST',
    body: {
      user_id: authUser.user.id,
      portal_id: portalId,
      display_name: displayName,
      email_snapshot: email,
    },
    headers: {
      Prefer: 'return=representation',
    },
  });

  return {
    success: true,
    user: authUser.user,
  };
});

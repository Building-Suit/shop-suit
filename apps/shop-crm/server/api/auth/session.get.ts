import { useApiServer } from '../../../../../packages/api-layer/dist/runtime/server/utils/api-server';

export default defineEventHandler(async event => {
  // Read access token from cookie or Authorization header
  const accessToken =
    getCookie(event, 'sb-access-token') ||
    getHeader(event, 'Authorization')?.replace('Bearer ', '');

  if (!accessToken) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }

  // Get user from Supabase auth
  const { data: user, error } = await useApiServer<{ id: string; email?: string }>('/user', {
    endpoint: 'auth',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (error || !user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }

  // Get profile from database (with the user's JWT so RLS authorizes the read)
  const { data: profiles } = await useApiServer('/profiles', {
    params: {
      select: 'id,portal_id,display_name,email_snapshot',
      user_id: `eq.${user.id}`,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.pgrst.object+json',
    },
  });

  return {
    success: true,
    profile: profiles || null,
  };
});

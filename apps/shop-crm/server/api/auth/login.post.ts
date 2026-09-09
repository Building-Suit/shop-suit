import { useApiServer } from '../../../../../packages/api-layer/dist/runtime/server/utils/api-server';

interface GoTrueSessionResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: { id: string; email?: string };
}

export default defineEventHandler(async event => {
  const { email, password } = await readBody(event);

  const { data, error } = await useApiServer<GoTrueSessionResponse>(
    '/token?grant_type=password',
    {
      endpoint: 'auth',
      method: 'POST',
      body: { email, password },
    },
  );

  if (error || !data) {
    throw createError({
      statusCode: 401,
      message: `Invalid credentials`,
    });
  }

  // set session cookie
  setCookie(event, 'sb-access-token', data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: data.expires_in,
    path: '/',
  });

  setCookie(event, 'sb-refresh-token', data.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  });

  return {
    success: true,
    session: {
      access_token: data.access_token,
      expires_in: data.expires_in,
      user: data.user,
    },
  };
});

import { useApiServer } from '../../../../../packages/api-layer/dist/runtime/server/utils/api-server';

export default defineEventHandler(async event => {
  const accessToken = getCookie(event, 'sb-access-token');

  if (accessToken) {
    await useApiServer('/logout', {
      endpoint: 'auth',
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }

  // Clear cookies
  deleteCookie(event, 'sb-access-token');
  deleteCookie(event, 'sb-refresh-token');

  return { success: true };
});

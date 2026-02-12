import { useApiServer } from '../../../../../packages/api-layer/dist/runtime/server/utils/api-server';

export default defineEventHandler(async event => {
  const { email } = await readBody(event);

  const { error } = await useApiServer('/recover', {
    endpoint: 'auth',
    method: 'POST',
    body: { email },
  });

  if (error) {
    throw createError({
      statusCode: 400,
      message: 'Failed to send reset password email',
    });
  }

  return { success: true };
});

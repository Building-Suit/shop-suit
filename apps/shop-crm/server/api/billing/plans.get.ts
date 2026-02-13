import { Tables } from '../../../../../packages/api-layer/dist/runtime/server/types/database';

export default defineEventHandler(async event => {
  const portal = await getCurrentPortal();

  console.log('portal', portal);

  const { data: plans = [], error } = await useApiServer<Tables<'plans'>[]>(
    'plans',
    {
      params: {
        select:
          'id, name, slug, price_amount, currency, billing_interval, trial_days, features, sort_order, is_coming_soon',
        portal_id: `eq.${portal.id}`,
        is_active: 'eq.true',
        is_public: 'eq.true',
        order: 'sort_order.asc',
      },
    },
  );

  if (error) {
    throw createError({ statusCode: 500, message: 'Failed to fetch plans' });
  }

  return { success: true, plans };
});

import type { Tables } from '../../../../../packages/api-layer/dist/runtime/server/types/database';

export default defineEventHandler(async event => {
  // Validates that the request targets an active portal (kept as a guard).
  await getCurrentPortal();

  // Plans are global in the database contract (UNIQUE(key), no portal_id;
  // `setup_shop_for_new_user` also resolves plans by key alone), so no portal
  // filter is applied here.
  const { data, error } = await useApiServer<Tables<'plans'>[]>(
    'plans',
    {
      params: {
        select:
          'id,name,key,price_amount,currency,billing_interval,trial_days,features,sort_order,is_coming_soon',
        is_active: 'eq.true',
        is_public: 'eq.true',
        order: 'sort_order.asc',
      },
    },
  );

  if (error) {
    throw createError({ statusCode: 500, message: 'Failed to fetch plans' });
  }

  // The database identifies plans by `key`; the application contract exposes it
  // as `slug` (used by the pricing UI and the api-layer Plan type).
  const plans = (data ?? []).map(row => ({ ...row, slug: row.key }));

  return { success: true, plans };
});

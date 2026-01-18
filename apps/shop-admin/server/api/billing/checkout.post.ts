// server/api/billing/checkout.post.ts
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export default defineEventHandler(async event => {
  const body = await readBody<{ planKey: string; shopId: string }>(event);

  const config = useRuntimeConfig();
  const stripe = new Stripe(config.stripeSecretKey, {
    apiVersion: '2024-06-20',
  });

  const supabase = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceKey // service role (server only)
  );

  // 1) fetch plan
  const { data: plan, error: planErr } = await supabase
    .from('plans')
    .select('*')
    .eq('key', body.planKey)
    .single();

  if (planErr || !plan)
    throw createError({ statusCode: 400, statusMessage: 'Invalid plan' });

  if (!plan.stripe_price_id) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Plan missing stripe_price_id',
    });
  }

  // 2) get shop + owner email
  const { data: shop, error: shopErr } = await supabase
    .from('shops')
    .select('id, name, owner_id')
    .eq('id', body.shopId)
    .single();

  if (shopErr || !shop)
    throw createError({ statusCode: 400, statusMessage: 'Invalid shop' });

  // 3) get current subscription row
  const { data: sub } = await supabase
    .from('shop_subscriptions')
    .select('*')
    .eq('shop_id', shop.id)
    .eq('is_current', true)
    .single();

  if (!sub)
    throw createError({
      statusCode: 400,
      statusMessage: 'No current subscription row',
    });

  // 4) create or reuse stripe customer
  let customerId = sub.stripe_customer_id as string | null;

  if (!customerId) {
    // fetch owner email from auth.users
    const { data: userRes, error: userErr } =
      await supabase.auth.admin.getUserById(shop.owner_id);
    if (userErr || !userRes?.user?.email) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Cannot fetch owner email',
      });
    }

    const customer = await stripe.customers.create({
      email: userRes.user.email,
      name: shop.name,
      metadata: { shop_id: shop.id },
    });

    customerId = customer.id;

    await supabase
      .from('shop_subscriptions')
      .update({
        stripe_customer_id: customerId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', sub.id);
  }

  // 5) create checkout session
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: plan.stripe_price_id, quantity: 1 }],

    subscription_data: {
      trial_period_days: plan.trial_days > 0 ? plan.trial_days : undefined,
      metadata: {
        shop_id: shop.id,
        plan_id: plan.id,
      },
    },

    success_url: `${config.appUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.appUrl}/billing/cancel`,

    metadata: {
      shop_id: shop.id,
      plan_id: plan.id,
    },
  });

  return { url: session.url };
});

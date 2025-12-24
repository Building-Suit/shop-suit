// server/api/billing/verify.post.ts
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

export default defineEventHandler(async event => {
  const { sessionId } = await readBody<{ sessionId: string }>(event);

  const config = useRuntimeConfig();
  const stripe = new Stripe(config.stripeSecretKey, {
    apiVersion: '2024-06-20',
  });

  const supabase = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceKey
  );

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['subscription'],
  });

  const shopId = session.metadata?.shop_id;
  if (!shopId)
    throw createError({ statusCode: 400, statusMessage: 'Missing shop_id' });

  const subscription = session.subscription as Stripe.Subscription | null;
  if (!subscription)
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing subscription',
    });

  const stripeStatus = subscription.status;
  const currentPeriodStart = new Date(subscription.current_period_start * 1000);
  const currentPeriodEnd = new Date(subscription.current_period_end * 1000);
  const trialEndsAt = subscription.trial_end
    ? new Date(subscription.trial_end * 1000)
    : null;

  // Update current subscription row
  const { error } = await supabase
    .from('shop_subscriptions')
    .update({
      status: stripeStatus,
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: subscription.id,
      stripe_price_id: subscription.items.data[0]?.price?.id ?? null,
      current_period_start: currentPeriodStart,
      current_period_end: currentPeriodEnd,
      trial_ends_at: trialEndsAt,
      updated_at: new Date().toISOString(),
    })
    .eq('shop_id', shopId)
    .eq('is_current', true);

  if (error) {
    console.error(error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update subscription row',
    });
  }

  return { success: true, status: stripeStatus };
});

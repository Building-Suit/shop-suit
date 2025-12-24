import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export default defineEventHandler(async event => {
  const config = useRuntimeConfig();
  const stripe = new Stripe(config.stripeSecretKey, {
    apiVersion: '2024-06-20',
  });

  const rawBody = await readRawBody(event);
  const sig = getHeader(event, 'stripe-signature');
  if (!rawBody || !sig)
    throw createError({ statusCode: 400, statusMessage: 'Missing signature' });

  let stripeEvent: Stripe.Event;
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      config.stripeWebhookSecret
    );
  } catch (err: any) {
    throw createError({
      statusCode: 400,
      statusMessage: `Webhook Error: ${err.message}`,
    });
  }

  const supabase = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceKey
  );

  // helper: update by stripe_subscription_id
  const updateSub = async (stripeSubId: string, patch: any) => {
    await supabase
      .from('shop_subscriptions')
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq('stripe_subscription_id', stripeSubId)
      .eq('is_current', true);
  };

  if (
    stripeEvent.type === 'customer.subscription.updated' ||
    stripeEvent.type === 'customer.subscription.created'
  ) {
    const sub = stripeEvent.data.object as Stripe.Subscription;

    await updateSub(sub.id, {
      status: sub.status,
      current_period_start: new Date(sub.current_period_start * 1000),
      current_period_end: new Date(sub.current_period_end * 1000),
      trial_ends_at: sub.trial_end ? new Date(sub.trial_end * 1000) : null,
      stripe_price_id: sub.items.data[0]?.price?.id ?? null,
    });
  }

  if (stripeEvent.type === 'customer.subscription.deleted') {
    const sub = stripeEvent.data.object as Stripe.Subscription;
    await updateSub(sub.id, { status: 'canceled' });
  }

  return { received: true };
});

import Stripe from 'stripe';

export default defineEventHandler(async event => {
  const { customerId } = await readBody<{ customerId: string }>(event);

  const config = useRuntimeConfig();
  const stripe = new Stripe(config.stripeSecretKey, {
    apiVersion: '2024-06-20',
  });

  const portal = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${config.appUrl}/billing`,
  });

  return { url: portal.url };
});

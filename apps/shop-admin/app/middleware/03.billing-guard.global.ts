export default defineNuxtRouteMiddleware(async to => {
  // allow auth & billing pages
  if (to.path.startsWith('/') || to.path.startsWith('/billing')) return;

  const auth = useAuthStore();
  const { authUser } = storeToRefs(auth);

  // not logged in -> login
  if (!authUser.value) return navigateTo('/');

  const shopId = authUser.value?.shopId;
  if (!shopId) return navigateTo('/billing'); // or /shops

  // fetch subscription status from db (client-side select allowed)
  const { data: sub, error } = await supabase()
    .from('shop_subscriptions')
    .select('status, trial_ends_at, current_period_end')
    .eq('shop_id', shopId)
    .eq('is_current', true)
    .single();

  if (error || !sub) return navigateTo('/billing');

  const now = Date.now();
  const trialEnds = sub.trial_ends_at
    ? new Date(sub.trial_ends_at).getTime()
    : null;

  // ✅ trialing allowed until trial end
  if (sub.status === 'trialing') {
    if (trialEnds && trialEnds < now) return navigateTo('/billing');
    return;
  }

  // ✅ active allowed
  if (sub.status === 'active') return;

  // anything else -> paywall
  return navigateTo('/billing');
});

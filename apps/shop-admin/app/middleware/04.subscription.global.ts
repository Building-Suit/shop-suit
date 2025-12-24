export default defineNuxtRouteMiddleware(async to => {
  // allow public pages
  if (to.path.startsWith('/billing') || to.path === '/') {
    return;
  }

  const { authUser } = storeToRefs(useAuthStore());

  if (!authUser.value?.shopId) return;

  const { data, error } = await supabase().rpc('shop_access_state', {
    p_shop_id: authUser.value?.shopId,
  });

  if (error) {
    console.error(error);
    return navigateTo('/billing');
  }

  if (!data.allowed) {
    return navigateTo('/billing?reason=' + data.reason);
  }
});

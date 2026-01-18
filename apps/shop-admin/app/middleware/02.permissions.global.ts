export default defineNuxtRouteMiddleware(async to => {
  const { isOwner } = storeToRefs(useAuthStore());

  // pages that require admin/owner only
  const adminOnly = ['/employees'];

  if (adminOnly.includes(to.path) && !isOwner.value) {
    return navigateTo('/dashboard');
  }
});

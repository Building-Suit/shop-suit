export default defineNuxtRouteMiddleware(async to => {
  const publicPaths = ['/', '/billing/success', '/billing/cancel'];

  if (publicPaths.includes(to.path)) return;

  const moduleStore = useModuleStore();

  const auth = useAuthStore();
  const { authUser } = storeToRefs(auth);

  if (!to.path.startsWith('/auth') && authUser.value) {
    Promise.all([
      auth.getUser(),
      moduleStore.getModules(authUser.value?.shopId),
    ]);
  }

  if (!authUser.value && !to.path.startsWith('/auth')) {
    return navigateTo('/');
  }

  if (authUser.value && to.path === '/') {
    return navigateTo('/dashboard');
  }
});

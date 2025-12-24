export const useModuleMiddleware = (moduleName: 'inventory') => {
  if (!useModuleStore().has(moduleName)) {
    return navigateTo('/dashboard');
  }
};

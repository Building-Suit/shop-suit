export const useModuleStore = defineStore('moduleStore', () => {
  const modules = ref<{
    loading: boolean;
    data: ShopModule[];
  }>({ loading: false, data: [] });

  const has = (key: string) => {
    return modules.value.data.some(
      m => m.module_key === key && m.enabled && !m.ends_at
    );
  };

  const getModules = async (shopId: string) => {
    if (!shopId) return;
    modules.value.loading = true;

    // const { data, error } = await supabase().rpc('get_shop_modules', {
    //   p_shop_id: shopId,
    // });

    // const { data, error } = await supabase()
    //   .from('modules')
    //   .select('*, shop_modules!inner(*)')
    //   .eq('shop_modules.shop_id', shopId);

    const { data, error } = await supabase()
      .from('shop_modules')
      .select('*')
      .eq('shop_id', shopId);

    modules.value.loading = false;

    if (error) {
      console.error('Failed to load modules', error);
      modules.value.data = [];
      return;
    }

    modules.value.data = data || [];
  };

  return { modules, has, getModules };
});

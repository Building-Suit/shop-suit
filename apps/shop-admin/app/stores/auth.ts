export const useAuthStore = defineStore('auth', () => {
  const authUser = useCookie<null | {
    id: string;
    user_id: string;
    email: string;
    role: string;
    shopId: string;
    shopName: string;
    shopNumber?: string | null;
    metadata: { [key: string]: string };
  }>('authUser');

  const setUser = (
    u: {
      id: string;
      user_id: string;
      email: string;
      role: string;
      shopId: string;
      shopName: string;
      shopNumber?: string | null;
      metadata: { [key: string]: string };
    } | null
  ) => {
    authUser.value = u;
  };

  const isLoggedIn = computed(() => !!authUser.value);
  const isOwner = computed(() => authUser.value?.role === 'owner');

  const error = ref<string | null>(null);

  const setup = ref<any>({ data: null });

  const signup = async ({
    plan_key,
    shop_name,
    email,
    password,
  }: {
    email: string;
    password: string;
    shop_name: string;
    plan_key: string;
  }) => {
    const {
      data: { user },
      error: signupError,
    } = await supabase().auth.signUp({
      email,
      password,
      options: { data: { plan_key, shop_name } },
    });

    if (signupError || !user) {
      return (error.value = signupError?.message || 'Failed to sign up.');
    }

    const { data: setupData, error: setupErr } = await supabase().rpc(
      'setup_shop_for_new_user',
      { p_user_id: user.id, p_shop_name: shop_name, p_plan_key: plan_key }
    );

    if (setupErr) {
      console.error('Setup error', setupErr);
      error.value = 'Failed to create shop. Please contact support.';
      return;
    }

    setup.value.data = setupData;
  };

  const verify = async ({ email, token }: { email: string; token: string }) => {
    const { data, error: verifyErr } = await supabase().auth.verifyOtp({
      email,
      token,
      type: 'email',
    });

    if (verifyErr) return (error.value = verifyErr.message);

    return data;
  };

  const getUser = async () => {
    const {
      data: { user },
      error: err,
    } = await supabase().auth.getUser();

    if (err) return await logout();

    const { data } = await shop_member(user.id);

    setUser({
      id: data.id,
      user_id: user.id!,
      email: user.email!,
      role: data.role,
      shopId: data.shop_id,
      shopName: data.shops.name,
      shopNumber: data.shops.number,
      metadata: user.user_metadata,
    });
  };

  const login = async (email: string, password: string) => {
    const {
      data: { user },
      error: err,
    } = await supabase().auth.signInWithPassword({
      email,
      password,
    });

    if (err) return (error.value = err.message);

    const { data: shopMember } = await shop_member(user.id);

    await useModuleStore().getModules(shopMember.shop_id);

    setUser({
      id: shopMember.id,
      user_id: user.id!,
      email: user.email!,
      role: shopMember.role,
      shopId: shopMember.shop_id,
      shopName: shopMember.shops.name,
      shopNumber: shopMember.shops.number,
      metadata: user.user_metadata,
    });

    await navigateTo('/dashboard');
  };

  const logout = async () => {
    await supabase().auth.signOut();
    setUser(null);
    await navigateTo('/');
  };

  async function shop_member(userId: string) {
    const { data } = await supabase()
      .from('shop_members')
      .select(
        ` 
          id,
          shop_id:shop_id,
          role,
          shops (
            id,
            name,
            type
          )
        `
      )
      .eq('user_id', userId)
      .single();

    return { data };
  }

  return {
    authUser,
    setUser,
    isLoggedIn,
    isOwner,
    error,
    setup,
    signup,
    verify,
    getUser,
    login,
    logout,
  };
});

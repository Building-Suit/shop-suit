export const useSubscriptionStore = defineStore('subscriptionStore', () => {
  const { t } = useI18n();

  /* Plans */
  const plans = ref<{ loading: boolean; data: any[]; error: any }>({
    loading: false,
    data: [],
    error: null,
  });

  const getPlans = async () => {
    plans.value.error = null;
    plans.value.loading = true;

    const { data, error } = await supabase()
      .from('plans')
      .select('id, key, name, description, price_monthly, currency, trial_days, soon')
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching plans', error);
      plans.value.error = error;
      plans.value.loading = false;
      return;
    }

    plans.value.loading = false;
    plans.value.data = data;
  };

  return {
    /* Plans */
    plans,
    getPlans,
  };
});

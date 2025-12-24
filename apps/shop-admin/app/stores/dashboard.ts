type Metrics = {
  total_cogs: number;
  total_profit: number;
  total_revenue: number;
  total_units_sold: number;

  total_expenses: number;
  total_manual_income: number;
  net_profit: number;

  daily_sales: Array<{
    day: string;
    cogs: number;
    profit: number;
    revenue: number;
    // units_sold: number;
  }>;
  profit_by_product: Array<{
    cogs: number;
    profit: number;
    revenue: number;
    product_id: string;
    product_name: string;
  }>;
};

export const useDashboardStore = defineStore('dashboard', () => {
  const { authUser } = storeToRefs(useAuthStore());

  const dashboard = ref<{
    loading: boolean;
    data: Metrics;
  }>({
    loading: false,
    data: {} as Metrics,
  });

  const getMetrics = async () => {
    dashboard.value.loading = true;
    const { data } = await supabase().rpc('dashboard_metrics', {
      p_shop: authUser.value?.shopId,
    });
    dashboard.value.data = data;
    dashboard.value.loading = false;
  };

  return { dashboard, getMetrics };
});

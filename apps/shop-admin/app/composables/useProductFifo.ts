export const useFIFO = () => {
  const loading = ref(false);
  const cogs = ref<number | null>(null);
  const profit = ref<number | null>(null);
  const revenue = ref<number | null>(null);
  const error = ref<string | null>(null);

  const loadFIFO = async (productId: string) => {
    loading.value = true;
    error.value = null;

    try {
      // 1) FIFO_COGS
      const { data: cogsData, error: cogsErr } = await supabase().rpc(
        'fifo_cogs',
        { product: productId }
      );
      if (cogsErr) throw cogsErr;
      cogs.value = Number(cogsData || 0);

      // 2) FIFO_PROFIT
      const { data: profitData, error: profitErr } = await supabase().rpc(
        'fifo_profit',
        { product: productId }
      );
      if (profitErr) throw profitErr;
      profit.value = Number(profitData || 0);

      // 3) Revenue ✅
      const { data: items, error: revenueErr } = await supabase()
        .from('invoice_items')
        .select(
          'line_total, discount, invoices!inner(invoice_source, extra_discount)'
        )
        .eq('invoices.invoice_source', 'client')
        .eq('product_id', productId);

      if (revenueErr) throw revenueErr;

      revenue.value = items?.reduce(
        (sum: number, row: any) =>
          sum +
          Number(row.line_total || 0) -
          Number(row.discount + row.invoices?.extra_discount || 0),
        0
      );
    } catch (e: any) {
      error.value = e.message || 'Failed to load FIFO data';
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    cogs,
    profit,
    revenue,
    loadFIFO,
  };
};

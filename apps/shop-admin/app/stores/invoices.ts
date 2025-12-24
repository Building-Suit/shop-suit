export const useInvoiceStore = defineStore('invoiceStore', () => {
  const { authUser } = storeToRefs(useAuthStore());

  /* Handling Invoices */
  const invoices = reactive<{
    loading: boolean;
    data: any[];
    pagination: { count: any; page: number; rows: number };
    error?: any;
  }>({
    loading: false,
    data: [],
    pagination: { count: 0, page: 0, rows: 10 },
  });

  const fetchInvoices = async ({
    withoutDeleted = false,
    search = {},
  } = {}) => {
    if (!authUser.value?.shopId) return;
    invoices.loading = true;

    const { page, rows } = invoices.pagination;

    let query = supabase()
      .from('invoices')
      .select('*, shop_members ( full_name )', { count: 'exact' })
      .eq('shop_id', authUser.value.shopId)
      .order('created_at', { ascending: false })
      .range(page * rows, page * rows + rows - 1);

    if (withoutDeleted) query = query.is('deleted_at', null);

    // Add search filter
    Object.entries(search).forEach(([key, value]) => {
      query = query.ilike(key, `%${value}%`);
    });

    const { data, error, count } = await query;

    invoices.loading = false;

    if (error) {
      console.error('Error fetching invoices', error);
      invoices.error = error;
      return;
    }

    invoices.data = data || [];
    invoices.pagination.count = count || 0;
  };

  const submitting = ref(false);

  const addInvoice = async (payload: any) => {
    submitting.value = true;
    const { error } = await supabase().from('invoices').insert(payload);

    if (error) {
      console.error('Error soft deleting Invoice', error);
      return;
    }
    submitting.value = false;
    fetchInvoices();
  };

  const editInvoice = async (invoice_id: string, payload: any) => {
    submitting.value = true;

    const { error } = await supabase()
      .from('invoices')
      .update(payload)
      .eq('id', invoice_id);

    if (error) {
      console.error('Error soft deleting Invoice', error);
      return;
    }

    submitting.value = false;
    fetchInvoices();
  };

  const deleteRestoreInvoice = async (
    type: 'delete' | 'restore',
    invoice: { id: string }
  ) => {
    const { error } = await supabase()
      .from('invoices')
      .update({
        deleted_at: type === 'restore' ? null : new Date().toISOString(),
      })
      .eq('id', invoice.id);

    if (error) {
      console.error('Error soft deleting Invoice', error);
      return;
    }

    invoices.data = invoices.data.map(s =>
      s.id === invoice.id
        ? {
            ...s,
            deleted_at: type === 'restore' ? null : new Date().toISOString(),
          }
        : s
    );
  };

  return {
    /* Handling Shop Members */
    invoices,
    fetchInvoices,

    submitting,
    addInvoice,
    editInvoice,
    deleteRestoreInvoice,
  };
});

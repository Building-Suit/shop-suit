export const useStore = (
  tableName: string,
  options?: {
    select?: string;
    where?: any;
  }
) => {
  return defineStore(`store-${tableName}-${JSON.stringify(options)}`, () => {
    const { authUser } = storeToRefs(useAuthStore());

    /* Handling Tables */
    const viewType = ref<'active' | 'deleted' | 'all'>('active');

    const records = reactive<{
      loading: boolean;
      data: any[];
      pagination: { count: any; page: number; rows: number };
      order?: { column: string; ascending: boolean };
      error?: any;
    }>({
      loading: false,
      data: [],
      pagination: { count: 0, page: 0, rows: 10 },
    });

    const fetchRecords = async ({ search = {} } = {}) => {
      if (!authUser.value?.shopId) return;
      records.loading = true;

      const { page, rows } = records.pagination;

      let query = supabase()
        .from(tableName)
        .select(options?.select || '*', { count: 'exact' })
        .eq('shop_id', authUser.value.shopId)
        .range(page * rows, page * rows + rows - 1);

      if (options?.where && Object.keys(options.where).length > 0) {
        Object.entries(options.where).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      if (records.order?.column) {
        query = query.order(records.order?.column, {
          ascending: records.order?.ascending,
        });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      if (viewType.value === 'active') query = query.is('deleted_at', null);
      if (viewType.value === 'deleted')
        query = query.is('deleted_at', 'not_null');

      // Add search filter
      Object.entries(search).forEach(([key, value]) => {
        query = query.ilike(key, `%${value}%`);
      });

      const { data, error, count } = await query;

      records.loading = false;

      if (error) {
        console.error('Error fetching records', error);
        records.error = error;
        return;
      }

      records.data = data || [];
      records.pagination.count = count || 0;
    };

    const submitting = ref(false);

    const addRecord = async (payload: any): Promise<any> => {
      submitting.value = true;
      const { data, error } = await supabase()
        .from(tableName)
        .insert(payload)
        .select()
        .single();

      if (error) {
        console.error('Error soft deleting Record', error);
        return { error };
      }
      submitting.value = false;
      fetchRecords();

      return { data };
    };

    const editRecord = async (record_id: string, payload: any) => {
      submitting.value = true;

      const { error } = await supabase()
        .from(tableName)
        .update(payload)
        .eq('id', record_id);

      if (error) {
        console.error('Error soft deleting Record', error);
        return;
      }

      submitting.value = false;
      fetchRecords();
    };

    const deleteRestoreRecord = async (
      type: 'delete' | 'restore',
      record: { id: string }
    ) => {
      const { error } = await supabase()
        .from(tableName)
        .update({
          deleted_at: type === 'restore' ? null : new Date().toISOString(),
        })
        .eq('id', record.id);

      if (error) {
        console.error('Error soft deleting Record', error);
        return;
      }

      if (viewType.value === 'all') {
        records.data = records.data.map(s =>
          s.id === record.id
            ? {
                ...s,
                deleted_at:
                  type === 'restore' ? null : new Date().toISOString(),
              }
            : s
        );
      } else {
        fetchRecords();
      }
    };

    const error = ref();
    const customAPI = async (fn: () => any) => {
      try {
        submitting.value = true;
        await fn();
        fetchRecords();
      } catch (e) {
        error.value = e;
        throw e;
      } finally {
        submitting.value = false;
      }
    };

    return {
      /* Handling Shop Members */
      viewType,
      records,
      fetchRecords,

      submitting,

      addRecord,
      editRecord,

      deleteRestoreRecord,

      error,
      customAPI,
    };
  })();
};

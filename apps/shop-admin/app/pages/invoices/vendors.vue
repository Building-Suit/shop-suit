<script setup lang="ts">
definePageMeta({
  middleware: (to, from) => useModuleMiddleware('inventory'),
});

const select = '*, shop_members(full_name), invoice_items(sum:quantity)';

const invoice_source = 'vendor';
const where = { invoice_source };

const invoiceStore = useStore('invoices', { select, where });

const t = (key: string) => computed(() => $t(`${key}`));

const columns: Column[] = [
  { field: 'id', header: t('id'), sortable: true, class: 'w-24' },
  {
    field: 'created_at',
    header: t('date'),
    type: 'date',
    sortable: true,
    class: 'w-1/6',
  },
  { field: 'customer_name', header: t('vendorName'), sortable: true },
  {
    field: 'invoice_items.0.sum',
    header: t('quantity'),
    sortable: true,
    class: 'w-24',
  },
  { field: 'total', header: t('total'), sortable: true, class: 'w-36' },
  { field: 'shop_members.full_name', header: t('createdBy'), sortable: true },
];

const fields = ref<Field[]>([]);

const createVisible = ref(false);
const viewVisible = ref(false);
const invoiceId = ref<number>();

const afterCreate = async (_invoiceId: number) => {
  createVisible.value = false;
  invoiceStore.fetchRecords();
  invoiceId.value = _invoiceId;
  viewVisible.value = true;
};
</script>

<template>
  <Page
    module="invoices"
    :select
    :where
    :columns
    :fields
    with-add-button
    with-view-button
    with-delete-button
    @add="() => (createVisible = true)"
    @view="record => [(invoiceId = record.id), (viewVisible = true)]"
  />

  <Drawer
    v-model:visible="createVisible"
    :header="$t('createInvoice')"
    :position="$i18n.localeProperties.value.dir === 'rtl' ? 'left' : 'right'"
    class="!w-full lg:!w-2/3"
  >
    <InvoiceCreate
      :invoice-source="invoice_source"
      @submitted="invoiceId => afterCreate(invoiceId)"
    />
  </Drawer>

  <Drawer
    v-model:visible="viewVisible"
    :header="$t('invoiceDetails')"
    :position="$i18n.localeProperties.value.dir === 'rtl' ? 'left' : 'right'"
    class="!w-full lg:!w-2/3"
  >
    <InvoiceView :invoice-source="invoice_source" :invoice-id />
  </Drawer>
</template>

<script setup lang="ts">
const t = (key: string) => computed(() => $t(`${key}`));

const columns: Column[] = [
  { field: 'name', header: t('name'), sortable: true },
  {
    field: 'vendor_price',
    header: t('vendor_price'),
    sortable: true,
    type: 'price',
  },
  { field: 'price', header: t('price'), sortable: true, type: 'price' },
  { field: 'discount', header: t('discount'), sortable: true, type: 'price' },
  { field: 'stock', header: t('quantity'), sortable: true },
];

// Form validation setup
const fields = ref<Field[]>([
  { key: 'name', label: t('name'), type: 'text', value: null },
  // {
  //   key: 'vendor_price',
  //   label: t('vendor_price'),
  //   type: 'number',
  //   value: null,
  // },
  { key: 'price', label: t('price'), type: 'number', value: null },
  { key: 'discount', label: t('discount'), type: 'number', value: null },
]);

const { cogs, profit, revenue, loading, error, loadFIFO } = useFIFO();
</script>

<template>
  <Page
    module="products"
    :columns
    :fields
    :edit-validation-exceptions="['discount']"
    with-edit-button
    with-delete-button
  />
</template>

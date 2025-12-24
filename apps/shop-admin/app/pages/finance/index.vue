<script setup lang="ts">
const t = (key: string) => computed(() => $t(`${key}`));

const columns: Column[] = [
  { field: 'created_at', header: t('date'), sortable: true, type: 'date' },
  { field: 'kind', header: t('kind'), sortable: true },
  { field: 'category', header: t('category'), sortable: true },
  { field: 'amount', header: t('amount'), sortable: true, type: 'price' },
  {
    field: 'shop_members.full_name',
    header: t('createdBy'),
    sortable: true,
    type: 'price',
  },
  { field: 'note', header: t('note'), sortable: true },
];

// Form validation setup
const fields = ref<Field[]>([
  {
    key: 'kind',
    label: t('kind'),
    type: 'select',
    options: [
      { label: t('expense'), value: 'expense' },
      { label: t('income'), value: 'income' },
    ],
    attrs: { optionLabel: 'label', optionValue: 'value' },
    value: null,
  },
  { key: 'amount', label: t('amount'), type: 'number', value: null },
  {
    key: 'category',
    label: t('category'),
    type: 'select',
    options: [
      { label: t('general'), value: 'general' },
      { label: t('electricity'), value: 'electricity' },
      { label: t('salary'), value: 'salary' },
      { label: t('rent'), value: 'rent' },
      { label: t('internet'), value: 'internet' },
    ],
    attrs: { optionLabel: 'label', optionValue: 'value' },
    value: null,
  },
  { key: 'note', label: t('note'), type: 'text', value: null },
]);
</script>

<template>
  <Page
    module="store_entries"
    select="*, shop_members!store_entries_employee_id_fkey ( full_name )"
    :columns
    :fields
    :add-validation-exceptions="['note']"
    :edit-validation-exceptions="['note']"
    with-add-button
    with-edit-button
    with-delete-button
  />
</template>

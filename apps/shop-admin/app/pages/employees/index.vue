<script setup lang="ts">
const t = (key: string) => computed(() => $t(`${key}`));

const columns: Column[] = [
  { field: 'full_name', header: t('name'), sortable: true },
  { field: 'email', header: t('email'), sortable: true },
  { field: 'role', header: t('role'), sortable: true },
];

const fields = ref<Field[]>([
  { key: 'id', label: t('id'), type: 'text', value: null, hide: true },
  {
    key: 'user_id',
    label: t('user_id'),
    type: 'text',
    value: null,
    hide: true,
  },
  { key: 'full_name', label: t('name'), type: 'text', value: null },
  { key: 'email', label: t('email'), type: 'email', value: null },
  { key: 'password', label: t('password'), type: 'password', value: null },
  {
    key: 'role',
    label: t('role'),
    type: 'text',
    value: 'employee',
    hide: true,
  },
]);
</script>

<template>
  <Page
    module="shop_members"
    select="id, user_id, role, full_name, email, deleted_at"
    :columns
    :fields
    :add-validation-exceptions="['user_id', 'id']"
    :edit-validation-exceptions="['password', 'user_id', 'id']"
    custom-add-api="/api/employees/add"
    custom-edit-api="/api/employees/edit"
    with-add-button
    with-edit-button
    with-delete-button
  />
</template>

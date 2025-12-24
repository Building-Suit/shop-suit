<script lang="ts" setup>
const {
  /* Action Column Control */
  withViewButton,
  withEditButton,
  withDeleteButton,
  deletedKey = 'deleted_at',

  /* Pagination Control */
  rows = 10,
  rowsPerPageOptions = [10, 20, 50],
} = defineProps<{
  /* Table Control */
  tableStyle?: string;
  columns: Column[];

  /* Loading State */
  loading?: boolean;

  /* Action Column Control */
  withViewButton?: boolean;
  withEditButton?: boolean;
  withDeleteButton?: boolean;
  deletedKey?: string;

  /* Pagination Control */
  pagination?: boolean;
  totalRecords?: number;
  rows?: number;
  rowsPerPageOptions?: number[];
}>();

const model = defineModel<any[]>({ default: [], required: true });

const emit = defineEmits<{
  (e: 'remove' | 'restore' | 'edit' | 'view', data: any): void;
  (e: 'page', page: { page: number; rows: number }): void;
  (e: 'sort', sort: { column: string; ascending: boolean }): void;
}>();

const actionColumn = computed(
  () => withViewButton || withEditButton || withDeleteButton
);

const sort = (column: string, ascending: boolean) => {
  emit('sort', { column, ascending });
};
</script>

<template>
  <Card class="h-fit">
    <template #content>
      <div class="flex flex-col gap-4">
        <DataTable
          :value="model"
          :loading="loading"
          :tableStyle="[tableStyle || 'min-width: 50rem']"
          removable-sort
          @sort="val => sort(val.sortField as string, val.sortOrder === 1)"
        >
          <Column
            v-for="column in columns"
            :key="column.field"
            :field="column.field"
            :header="column.header"
            :sortable="column.sortable"
            :style="[column.style || (!column.class && 'width: 25%')]"
            :class="[column.class]"
          >
            <template #body="prop">
              <slot :name="column.field" v-bind="prop">
                <span v-if="column.field === 'id'" v-text="prop.index + 1" />
                <span
                  v-else-if="column.value"
                  v-text="
                    useGetField(column.value(prop.data), undefined, column.type)
                  "
                />
                <span
                  v-else
                  v-text="useGetField(prop.data, column.field, column.type)"
                />
              </slot>
            </template>
          </Column>

          <slot name="default" />

          <Column v-if="actionColumn" class="w-24 !text-end">
            <template #body="{ data }">
              <div class="flex items-center justify-end gap-2">
                <template v-if="!useGetField(data, deletedKey)">
                  <!-- View Button -->
                  <Button
                    v-if="withViewButton"
                    icon="pi pi-eye"
                    severity="warn"
                    rounded
                    size="small"
                    @click="() => emit('view', data)"
                  />

                  <!-- Edit Button -->
                  <Button
                    v-if="withEditButton"
                    icon="pi pi-pen-to-square"
                    severity="info"
                    rounded
                    size="small"
                    @click="() => emit('edit', data)"
                  />

                  <!-- Delete Button -->
                  <Button
                    v-if="withDeleteButton"
                    icon="pi pi-trash"
                    severity="danger"
                    rounded
                    size="small"
                    @click="() => emit('remove', data)"
                  />
                </template>

                <!-- Restore Button -->
                <Button
                  v-if="withDeleteButton && useGetField(data, deletedKey)"
                  icon="pi pi-refresh"
                  severity="success"
                  rounded
                  size="small"
                  @click="() => emit('restore', data)"
                />
              </div>
            </template>
          </Column>


          <template #empty>
            <div class="flex items-center justify-center">
              <span>{{ $t('noData') }}</span>
            </div>
          </template>

        </DataTable>

        <Paginator
          v-if="pagination"
          :total-records
          :rows
          :rowsPerPageOptions
          @page="page => emit('page', page)"
        />
      </div>
    </template>
  </Card>
</template>

<style scoped></style>

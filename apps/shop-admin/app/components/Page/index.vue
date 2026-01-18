<script setup lang="ts">
const instance = getCurrentInstance();
const emitUsed = (emit: string) => !!instance?.vnode.props?.[emit];

const { module, select, where, columns, fields, customAddApi, customEditApi } =
  defineProps<{
    module: string;
    select?: string;
    where?: Record<string, string>;
    columns: Column[];
    fields: Field[];

    addValidationExceptions?: string[];
    customAddApi?: string;

    editValidationExceptions?: string[];
    customEditApi?: string;

    withAddButton?: boolean;
    withViewButton?: boolean;
    withEditButton?: boolean;
    withDeleteButton?: boolean;
  }>();

const emit = defineEmits<{
  (e: 'add'): void;
  (e: 'view' | 'edit' | 'remove', record: any): void;
  (e: 'sort', sort: { column: string; ascending: boolean }): void;
}>();

const { authUser, isOwner } = storeToRefs(useAuthStore());

const store = useStore(module, { select, where });
const { error, viewType, records, submitting } = storeToRefs(store);
store.fetchRecords();

/* Adding Record */
const isAdding = ref(false);
const createFields = ref(JSON.parse(JSON.stringify(fields)));
const addRecord = async (confirmed?: boolean) => {
  try {
    if (emitUsed('onAdd')) return emit('add');

    if (!confirmed) {
      error.value = null;
      createFields.value = createFields.value.map((f: any) => ({
        ...f,
        value: null,
      }));

      isAdding.value = true;
      return;
    }

    const payload = {
      shop_id: authUser.value?.shopId,
      ...fields.reduce(
        (acc: any, field) => ({
          ...acc,
          [field.key]: getField(field.key)?.value,
        }),
        {}
      ),
    };

    if (customAddApi) {
      await store.customAPI(() =>
        $fetch(customAddApi, { method: 'POST', body: payload })
      );
    } else {
      await store.addRecord(payload);
    }

    createFields.value = createFields.value.map((f: any) => ({
      ...f,
      value: null,
    }));
    isAdding.value = false;
  } catch (e) {
    console.error(e, error.value);
    throw e;
  }
};

/* View Record */
const isViewing = ref(false);
const recordId = ref(null);

const viewRecord = async (record: any) => {
  if (emitUsed('onView')) return emit('view', record);

  recordId.value = record.id;
  isViewing.value = true;
};

/* Editing Record */
const isEditing = ref(false);
const record = ref<any>(null);
const editFields = ref(JSON.parse(JSON.stringify(fields)));

const editRecord = async (_record?: any, confirmed?: boolean) => {
  try {
    if (emitUsed('onEdit')) return emit('edit', record);

    if (!confirmed) {
      error.value = null;
      isEditing.value = true;
      record.value = _record;
      editFields.value = editFields.value.map((f: any) => ({
        ...f,
        // value: _record[f.key],
        value: useGetField(_record, f.key),
      }));

      return;
    }

    const payload = {
      ...fields.reduce(
        (acc: any, field) => ({
          ...acc,
          [field.key]: getField(field.key, editFields.value)?.value,
        }),
        {}
      ),
    };

    if (customEditApi) {
      await store.customAPI(() =>
        $fetch(customEditApi, { method: 'POST', body: payload })
      );
    } else {
      await store.editRecord(record.value.id, payload);
    }

    editFields.value = editFields.value.map((f: any) => ({
      ...f,
      value: null,
    }));
    isEditing.value = false;
  } catch (e) {
    console.error(e, error.value);
    throw e;
  }
};

const deletingId = ref<number | null>(null);
const deleteRestoreRecord = async (type: 'delete' | 'restore', record: any) => {
  if (emitUsed('onRemove')) return emit('remove', record);

  if (!confirm(`${type.toUpperCase()} this Server?`)) return;
  deletingId.value = record.id;
  await store.deleteRestoreRecord(type, record);
  deletingId.value = null;
};

function getField(key: string, _fields = createFields.value) {
  return _fields.find((f: any) => f.key === key);
}

const onPagination = (page: { page: number; rows: number }) => {
  records.value.pagination.page = page.page;
  records.value.pagination.rows = page.rows;
  store.fetchRecords();
};

const sortRecords = (sort: { column: string; ascending: boolean }) => {
  records.value.order = sort;
  store.fetchRecords();
};

const t = (key: string) => computed(() => $t(`${key}`));

const viewTypes = ref([
  { label: t('active'), value: 'active' },
  { label: t('deleted'), value: 'deleted' },
  { label: t('all'), value: 'all' },
]);

const changeTableView = () => {
  records.value.pagination.page = 0;
  store.fetchRecords();
};
</script>

<template>
  <Container class="flex flex-col gap-4">
    <Card class="h-fit w-full">
      <template #content>
        <div class="flex items-center justify-between">
          <SelectButton
            v-model="viewType"
            :options="viewTypes"
            option-label="label"
            option-value="value"
            data-key="value"
            @change="() => changeTableView()"
          />

          <Button
            v-if="withAddButton"
            :label="$t('addRecord')"
            size="small"
            @click="() => addRecord()"
          />
        </div>
      </template>
    </Card>

    <AppTable
      v-model="records.data"
      :columns
      :loading="records.loading"
      pagination
      :total-records="records.pagination.count"
      :rows="records.pagination.rows"
      :with-view-button
      :with-edit-button
      :with-delete-button="withDeleteButton && isOwner"
      @page="page => onPagination(page)"
      @view="record => viewRecord(record)"
      @edit="record => editRecord(record)"
      @remove="record => deleteRestoreRecord('delete', record)"
      @restore="record => deleteRestoreRecord('restore', record)"
      @sort="sort => sortRecords(sort)"
    />

    <Dialog
      v-model:visible="isAdding"
      modal
      :header="$t('addRecord')"
      :style="{ width: '25rem' }"
    >
      <Message v-if="error" severity="error" v-text="error?.statusMessage" />

      <AppForm
        v-model="createFields"
        :submitting
        :submit-label="$t('add')"
        :validation-exceptions="addValidationExceptions"
        @submit="() => addRecord(true)"
      />
    </Dialog>

    <Dialog
      v-model:visible="isEditing"
      modal
      :header="$t('editRecord')"
      :style="{ width: '25rem' }"
    >
      <Message v-if="error" severity="error" v-text="error?.statusMessage" />

      <AppForm
        v-model="editFields"
        :submitting
        :submit-label="$t('save')"
        :validation-exceptions="editValidationExceptions"
        @submit="() => editRecord(null, true)"
      />
    </Dialog>
  </Container>
</template>

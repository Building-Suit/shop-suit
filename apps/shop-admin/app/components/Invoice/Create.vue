<script lang="ts" setup>
const { invoiceSource = 'client' } = defineProps<{
  invoiceSource?: 'client' | 'vendor';
}>();

const emit = defineEmits<{
  (e: 'submitted', invoiceId: number): void;
}>();

const { authUser } = storeToRefs(useAuthStore());

const invoiceStore = useStore('invoices');

const serviceStore = useStore('services');
const { records: services } = storeToRefs(serviceStore);

const productStore = useStore('products');
const { records: products } = storeToRefs(productStore);

const records = computed(() => [
  ...(invoiceSource === 'client' ? services.value.data : []),
  ...products.value.data,
]);

Promise.all([
  productStore.fetchRecords(),
  ...(invoiceSource === 'client' ? [serviceStore.fetchRecords()] : []),
]);

const items = ref<any>([
  {
    search: '',
    item_type: invoiceSource === 'vendor' ? 'product' : 'manual',
    service_id: null,
    description: '',
    quantity: 1,
    unit_price: 0,
    discount: 0,
    suggestions: null,
  },
]);

const addRow = () => {
  items.value.push({
    search: '',
    item_type: invoiceSource === 'vendor' ? 'product' : 'manual',
    service_id: null,
    description: '',
    quantity: 1,
    unit_price: 0,
    discount: 0,
    suggestions: null,
  });
};

const removeItem = (index: number) => items.value.splice(index, 1);

const searchItem = (index: number) => {
  const term = items.value[index]?.search?.toLowerCase();

  if (!term) {
    items.value[index]!.suggestions = null;
    return;
  }

  const serviceMatches = records.value
    .filter(s => s.name.toLowerCase().includes(term))
    .map(s => ({ ...s, type: 'stock' in s ? 'product' : 'service' }));

  // @ts-ignore
  items.value[index]!.suggestions = [...serviceMatches];
};

const selectItem = (index: number, suggestion: any) => {
  if (typeof suggestion === 'string') return;

  // items.value[index]!.suggestions = [];

  items.value[index]!.item_type =
    invoiceSource === 'vendor' || 'stock' in suggestion ? 'product' : 'service';

  if (invoiceSource === 'vendor' || 'stock' in suggestion) {
    items.value[index]!.service_id = null;
    items.value[index]!.product_id = suggestion.id;
  } else {
    items.value[index]!.product_id = null;
    items.value[index]!.service_id = suggestion.id;
  }

  items.value[index]!.description = suggestion.name;

  if (invoiceSource === 'vendor') {
    items.value[index]!.unit_price = suggestion.vendor_price;
    items.value[index]!.discount = 0;
  } else {
    items.value[index]!.unit_price = suggestion.price;
    items.value[index]!.discount = suggestion.discount;
  }

  items.value[index]!.search = suggestion.name;
};

const total = computed(() =>
  items.value.reduce((sum, r) => sum + r.quantity * r.unit_price, 0)
);

const discount = computed(() =>
  items.value.reduce((sum, r) => sum + r.discount * r.quantity, 0)
);

const extraDiscount = ref<number>(0);

const t = (key: string) => computed(() => $t(`${key}`));

const fields = ref([
  {
    key: 'customer_name',
    label: t(invoiceSource === 'vendor' ? 'vendorName' : 'customerName'),
    type: 'text',
    value: null,
  },
]);

const submitting = ref(false);
const onFormSubmit = async () => {
  submitting.value = true;

  const { data: invoice, error } = await invoiceStore.addRecord({
    shop_id: authUser.value?.shopId,
    customer_name: getField('customer_name').value,
    total: total.value,
    ...(invoiceSource === 'vendor'
      ? { discount: 0, extra_discount: 0 }
      : { discount: discount.value, extra_discount: extraDiscount.value }),
    created_by: authUser.value?.id,
    invoice_source: invoiceSource,
  });

  if (error) {
    console.error(error);
    return;
  }

  const lineItems = items.value.map((row: any) => ({
    invoice_id: invoice.id,
    item_type: row.item_type,
    ...(row.service_id ? { service_id: row.service_id } : {}),
    ...(row.product_id ? { product_id: row.product_id } : {}),
    description: row.search || row.description,
    quantity: row.quantity,
    unit_price: row.unit_price,
    ...(invoiceSource === 'vendor'
      ? { discount: 0 }
      : { discount: row.discount * row.quantity }),
    line_total: row.unit_price * row.quantity,
  }));

  await supabase().from('invoice_items').insert(lineItems);

  fields.value = fields.value.map(f => ({ ...f, value: null }));
  submitting.value = false;

  emit('submitted', invoice.id);
};

function getField(key: string) {
  return fields.value.find(f => f.key === key) || { value: '', label: '' };
}
</script>

<template>
  <AppForm
    v-model="fields"
    :submitting
    submit-label="Save Invoice"
    :fluid="false"
    @submit="onFormSubmit"
  >
    <Card>
      <template #content>
        <div v-focustrap class="flex flex-col gap-6">
          <DataTable :value="items">
            <Column :header="$t('serviceOrProduct')" style="width: 35%">
              <template #body="{ data, index }">
                <FloatLabel variant="on">
                  <Select
                    v-model="data.search"
                    editable
                    :options="data.suggestions || records"
                    option-label="name"
                    :name="`item-${index}`"
                    size="small"
                    :loading="services.loading"
                    fluid
                    
                    @hide="() => selectItem(index, data.search)"
                  />
                  <!-- @update:model-value="$event => searchItem(index)" -->

                  <label :for="`item-${index}`">{{ $t('serviceOrProduct') }}</label>
                </FloatLabel>
              </template>
            </Column>

            <Column :header="$t('price')" class="w-36">
              <template #body="{ data, index }">
                <FloatLabel variant="on">
                  <InputNumber
                    v-model="data.unit_price"
                    @input="$event => (data.unit_price = $event.value)"
                    :id="`price-${index}`"
                    autocomplete="off"
                    :name="`price-${index}`"
                    size="small"
                    autofocus
                    fluid
                  />
                  <label :for="`price-${index}`">{{ $t('price') }}</label>
                </FloatLabel>
              </template>
            </Column>

            <Column
              v-if="invoiceSource === 'client'"
              :header="$t('discount')"
              class="w-36"
            >
              <template #body="{ data, index }">
                <FloatLabel variant="on">
                  <InputNumber
                    v-model="data.discount"
                    @input="$event => (data.discount = $event.value)"
                    :id="`discount-${index}`"
                    autocomplete="off"
                    :name="`discount-${index}`"
                    size="small"
                    fluid
                  />
                  <label :for="`discount-${index}`">{{ $t('discount') }}</label>
                </FloatLabel>
              </template>
            </Column>

            <Column :header="$t('quantity')" class="w-36">
              <template #body="{ data, index }">
                <FloatLabel variant="on">
                  <InputNumber
                    v-model="data.quantity"
                    @input="$event => (data.quantity = $event.value)"
                    :id="`quantity-${index}`"
                    autocomplete="off"
                    :name="`quantity-${index}`"
                    :min="1"
                    size="small"
                    show-buttons
                    fluid
                  />
                  <label :for="`quantity-${index}`">{{ $t('quantity') }}</label>
                </FloatLabel>
              </template>
            </Column>

            <Column :header="$t('total')" class="w-36">
              <template #body="{ data, index }">
                {{ useFormatPrice(data.quantity * data.unit_price) }}
              </template>
            </Column>

            <Column :header="$t('totalAfterDiscount')" class="w-36">
              <template #body="{ data, index }">
                {{
                  useFormatPrice(
                    data.quantity * (data.unit_price - data.discount)
                  )
                }}
              </template>
            </Column>

            <Column class="w-10">
              <template #body="{ data, index }">
                <Button
                  v-if="index"
                  icon="pi pi-trash"
                  severity="danger"
                  variant="text"
                  size="small"
                  rounded
                  @click="removeItem(index)"
                />
              </template>
            </Column>
          </DataTable>

          <Button
            type="button"
            link
            severity="info"
            class="w-fit"
            @click="addRow"
          >
            + {{ $t('addItem') }}
          </Button>
        </div>
      </template>
    </Card>

    <!-- total -->
    <div class="text-start text-lg font-bold">
      {{ $t('total') }}: {{ useFormatPrice(total) }}
    </div>

    <!-- extra discount -->
    <div v-if="invoiceSource === 'client'" class="text-start text-lg font-bold">
      {{ $t('extraDiscount') }}:
      <InputNumber
        v-model="extraDiscount"
        @input="$event => (extraDiscount = Number($event.value))"
        :max="total - discount"
        autocomplete="off"
        name="invouce-discount"
        size="small"
      />
    </div>

    <!-- total after discount -->
    <div v-if="invoiceSource === 'client'" class="text-start text-lg font-bold">
      {{ $t('totalAfterDiscount') }}:
      {{ useFormatPrice(total - (discount + extraDiscount)) }}
    </div>
  </AppForm>
</template>

<style scoped></style>

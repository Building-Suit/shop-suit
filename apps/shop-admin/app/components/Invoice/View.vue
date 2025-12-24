<script lang="ts" setup>
const { invoiceSource, invoiceId } = defineProps<{
  invoiceSource?: 'client' | 'vendor';
  invoiceId: number | undefined;
}>();

const { authUser } = storeToRefs(useAuthStore());

const loading = ref(false);
const invoice = ref<any | null>(null);
const items = ref<any[]>([]);

const fetchInvoice = async () => {
  loading.value = true;

  const { data, error } = await supabase()
    .from('invoices')
    .select('*, shop_members ( full_name )')
    .eq('id', invoiceId)
    .single();

  if (error) {
    console.error(error);
    return;
  }

  invoice.value = data;

  const { data: invoiceItems, error: itemsError } = await supabase()
    .from('invoice_items')
    .select('*')
    .eq('invoice_id', invoiceId);

  if (itemsError) {
    console.error(itemsError);
    return;
  }

  items.value = invoiceItems || [];

  loading.value = false;
};

fetchInvoice();
</script>

<template>
  <div class="flex justify-between mb-4 no-print">
    <Button
      v-print="'#printer'"
      class="ms-auto font-semibold"
      size="small"
      v-text="$t('print')"
    />
  </div>

  <div
    id="printer"
    class="flex flex-col gap-6 p-1 "
    :dir="$i18n.localeProperties.value.dir"
  >
    <!-- Header Section -->
    <div class="w-fit print-header">
      <table class="border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
        <tbody>
          <tr>
            <td class="w-40 px-4 py-2 font-semibold text-gray-900 dark:text-gray-100">
              <span v-text="`${$t('customerName')}:`" />
            </td>
            <td class="px-4 py-2 text-gray-800 dark:text-gray-200">
              <span v-text="invoice?.customer_name" />
            </td>
          </tr>
          <tr>
            <td class="px-4 py-2 font-semibold text-gray-900 dark:text-gray-100">
              <span v-text="`${$t('date')}:`" />
            </td>
            <td class="px-4 py-2 text-gray-800 dark:text-gray-200">
              <span v-text="new Date(invoice?.created_at).toLocaleString()" />
            </td>
          </tr>
          <tr>
            <td class="px-4 py-2 font-semibold text-gray-900 dark:text-gray-100">
              <span v-text="`${$t('agentName')}:`" />
            </td>
            <td class="px-4 py-2 text-gray-800 dark:text-gray-200">
              <span v-text="invoice?.shop_members?.full_name" />
            </td>
          </tr>
          <tr>
            <td class="px-4 py-2 font-semibold text-gray-900 dark:text-gray-100">
              <span v-text="`${$t('shop')}:`" />
            </td>
            <td class="px-4 py-2 text-gray-800 dark:text-gray-200">
              <span v-text="authUser?.shopName" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Items Table -->
    <table class="w-full border-collapse border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden print-table">
      <thead>
        <tr class="bg-gray-100 dark:bg-gray-800">
          <th class="w-[4%] border border-gray-300 dark:border-gray-600 text-start p-2 font-semibold text-gray-900 dark:text-gray-100 print-header-cell">
            <span v-text="$t('id')" />
          </th>
          <th class="border border-gray-300 dark:border-gray-600 text-start p-2 font-semibold text-gray-900 dark:text-gray-100 print-header-cell">
            <span v-text="$t('description')" />
          </th>
          <th class="w-[15%] border border-gray-300 dark:border-gray-600 text-start p-2 font-semibold text-gray-900 dark:text-gray-100 print-header-cell">
            <span v-text="$t('price')" />
          </th>
          <th class="w-[15%] border border-gray-300 dark:border-gray-600 text-start p-2 font-semibold text-gray-900 dark:text-gray-100 print-header-cell">
            <span v-text="$t('discount')" />
          </th>
          <th class="w-[6%] border border-gray-300 dark:border-gray-600 text-start p-2 font-semibold text-gray-900 dark:text-gray-100 print-header-cell">
            <span v-text="$t('quantity')" />
          </th>
          <th class="w-[15%] border border-gray-300 dark:border-gray-600 text-start p-2 font-semibold text-gray-900 dark:text-gray-100 print-header-cell">
            <span v-text="$t('total')" />
          </th>
          <th class="w-[15%] border border-gray-300 dark:border-gray-600 text-start p-2 font-semibold text-gray-900 dark:text-gray-100 print-header-cell">
            <span v-text="$t('totalAfterDiscount')" />
          </th>
        </tr>
      </thead>

      <tbody>
        <tr 
          v-for="(item, idx) in items" 
          :key="item.id"
          class="print-row hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <td class="border border-gray-300 dark:border-gray-600 p-2 font-semibold text-gray-900 dark:text-gray-100 text-center print-cell">
            <span v-text="`${idx + 1}`" />
          </td>
          <td class="border border-gray-300 dark:border-gray-600 p-2 text-gray-800 dark:text-gray-200 print-cell print-description">
            <span v-text="item.description" />
          </td>
          <td class="border border-gray-300 dark:border-gray-600 p-2 text-gray-800 dark:text-gray-200 text-end print-cell">
            <span v-text="useFormatPrice(item.unit_price)" />
          </td>
          <td class="border border-gray-300 dark:border-gray-600 p-2 text-gray-800 dark:text-gray-200 text-end print-cell">
            <span v-text="useFormatPrice(item.discount)" />
          </td>
          <td class="border border-gray-300 dark:border-gray-600 p-2 text-gray-800 dark:text-gray-200 text-center print-cell">
            <span v-text="item.quantity" />
          </td>
          <td class="border border-gray-300 dark:border-gray-600 p-2 text-gray-800 dark:text-gray-200 text-end print-cell">
            <span v-text="useFormatPrice(item.line_total)" />
          </td>
          <td class="border border-gray-300 dark:border-gray-600 p-2 text-gray-800 dark:text-gray-200 text-end print-cell">
            <span v-text="useFormatPrice(item.line_total - item.discount)" />
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Totals Section -->
    <table class="w-full print-totals">
      <tbody>
        <tr>
          <td />
          <td class="w-[21%] border border-gray-300 dark:border-gray-600 text-end p-2 font-semibold text-gray-900 dark:text-gray-100 print-total-label">
            <span v-text="$t('total')" />
          </td>
          <td class="w-[15%] border border-gray-300 dark:border-gray-600 text-end p-2 text-gray-800 dark:text-gray-200 print-total-value">
            {{
              useFormatPrice(
                invoice?.total - items.reduce((sum, r) => sum + r.discount, 0)
              )
            }}
          </td>
        </tr>
        <tr>
          <td />
          <td class="border border-gray-300 dark:border-gray-600 text-end p-2 font-semibold text-gray-900 dark:text-gray-100 print-total-label">
            <span v-text="$t('extraDiscount')" />
          </td>
          <td class="border border-gray-300 dark:border-gray-600 text-end p-2 text-gray-800 dark:text-gray-200 print-total-value">
            {{ useFormatPrice(invoice?.extra_discount || 0) }}
          </td>
        </tr>
        <tr>
          <td />
          <td class="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-end p-2 font-bold text-gray-900 dark:text-gray-100 print-total-label-grand">
            <span v-text="$t('totalAfterDiscount')" />
          </td>
          <td class="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-end p-2 font-bold text-gray-900 dark:text-gray-100 print-total-value-grand">
            {{
              useFormatPrice(
                invoice?.total - (invoice?.discount + invoice?.extra_discount)
              )
            }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
/* Print-specific styles */
@media print {
  @page {
    size: A4;
    margin: 10mm;
  }

  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }

  body {
    background: white !important;
  }

  .no-print {
    display: none !important;
  }

  #printer {
    width: 100%;
    max-width: 100%;
    padding: 0 !important;
    gap: 8mm !important;
    font-size: 10pt !important;
    line-height: 1.4 !important;
    background: white !important;
    color: black !important;
  }

  /* Override dark mode for print */
  #printer,
  #printer * {
    background: white !important;
    color: black !important;
    border-color: #000 !important;
  }

  /* Header section */
  .print-header {
    page-break-inside: avoid;
    margin-bottom: 5mm;
  }

  .print-header table {
    border: 1pt solid #000 !important;
    background: #f5f5f5 !important;
  }

  .print-header td {
    padding: 2mm 3mm !important;
    font-size: 10pt !important;
  }

  /* Items table */
  .print-table {
    width: 100% !important;
    border-collapse: collapse !important;
    page-break-inside: auto !important;
    border: 1pt solid #000 !important;
    font-size: 9pt !important;
  }

  .print-table thead {
    display: table-header-group !important;
  }

  .print-header-cell {
    border: 1pt solid #000 !important;
    padding: 2mm !important;
    font-weight: 700 !important;
    background: #e5e5e5 !important;
    font-size: 9pt !important;
  }

  .print-row {
    page-break-inside: avoid !important;
    page-break-after: auto !important;
  }

  .print-cell {
    border: 1pt solid #000 !important;
    padding: 2mm !important;
    font-size: 9pt !important;
  }

  .print-description {
    word-wrap: break-word !important;
    word-break: break-word !important;
    hyphens: auto !important;
  }

  /* Prevent orphaned rows at page breaks */
  .print-row:nth-last-child(-n+3) {
    page-break-before: auto;
  }

  /* Keep at least 3 rows together */
  .print-row:has(~ .print-row:nth-child(-n+2)) {
    page-break-after: avoid;
  }

  /* Totals section */
  .print-totals {
    page-break-inside: avoid !important;
    margin-top: 5mm !important;
    font-size: 10pt !important;
  }

  .print-totals td {
    padding: 2mm !important;
  }

  .print-total-label,
  .print-total-value {
    border: 1pt solid #000 !important;
    font-size: 10pt !important;
  }

  .print-total-label-grand,
  .print-total-value-grand {
    font-weight: 700 !important;
    background: #e5e5e5 !important;
    font-size: 11pt !important;
  }

  /* Number alignment */
  [class*="text-end"] {
    font-variant-numeric: tabular-nums !important;
  }

  /* Ensure table borders are solid */
  table,
  th,
  td {
    border-style: solid !important;
  }
}

/* High DPI print adjustments */
@media print and (min-resolution: 150dpi) {
  #printer {
    font-size: 9pt !important;
  }

  .print-table {
    font-size: 8pt !important;
  }

  .print-header-cell {
    font-size: 8pt !important;
  }

  .print-cell {
    font-size: 10pt !important;
  }
}
</style>
<script lang="ts" setup>
const { plan } = defineProps<{ plan: any }>();

const emit = defineEmits<{
  (e: 'success'): void;
}>();

const auth = useAuthStore();
const { error } = storeToRefs(auth);

const t = (key: string) => computed(() => $t(`${key}`));

const fields = ref<Field[]>([
  { key: 'shop_name', label: t('shopName'), type: 'text', value: '' },
  { key: 'email', label: t('email'), type: 'email', value: '' },
  { key: 'password', label: t('password'), type: 'password', value: '' },
]);

const submitting = ref(false);
const handleSignup = async () => {
  error.value = null;
  submitting.value = true;

  try {
    await auth.signup({
      plan_key: plan?.key,
      shop_name: getField('shop_name')?.value,
      email: getField('email')?.value,
      password: getField('password')?.value,
    });

    if (error.value) return;

    emit('success');
  } finally {
    submitting.value = false;
  }
};

const getField = (key: string) => fields.value.find(f => f.key === key);

defineExpose({ fields });
</script>

<template>
  <div class="flex flex-col">
    <p v-if="error" class="text-sm text-red-500" v-text="error" />

    <AppForm
      v-model="fields"
      :submitting
      :submit-label="$t('signUp')"
      field-size="large"
      class="!gap-4 me-6"
      @submit="() => handleSignup()"
    />
  </div>
</template>

<style scoped></style>

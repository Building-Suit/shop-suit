<script setup lang="ts">
const auth = useAuthStore();
const { error } = storeToRefs(auth);

onMounted(() => (error.value = null));

const t = (key: string) => computed(() => $t(`${key}`));

const fields = ref([
  { key: 'email', label: t('email'), type: 'email', value: '' },
  {
    key: 'password',
    label: t('password'),
    type: 'password',
    value: '',
    attrs: { feedback: false },
  },
]);

const submitting = ref(false);

const login = async () => {
  error.value = null;
  submitting.value = true;
  await auth.login(getField('email')!.value, getField('password')!.value);
  submitting.value = false;
};

const getField = (key: string) => fields.value.find(f => f.key === key);
</script>

<template>
  <div :class="['relative grow', 'flex items-center justify-center']">
    <Card class="w-full mx-3 max-w-xl md:px-8 md:scale-110 rounded-3xl">
      <template #content>
        <Message v-if="error" severity="error">{{ error }}</Message>

        <AppForm
          v-model="fields"
          :submitting
          :submit-label="$t('login')"
          field-size="large"
          class="!gap-6"
          @submit="() => login()"
        />
      </template>
    </Card>
  </div>
</template>

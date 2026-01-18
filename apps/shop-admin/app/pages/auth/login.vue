<script setup lang="ts">
definePageMeta({ layout: 'public' });

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
  submitting.value = true;
  await useAuthStore().login(
    getField('email')!.value,
    getField('password')!.value
  );
  submitting.value = false;
};

const getField = (key: string) => fields.value.find(f => f.key === key);
</script>

<template>
  <div :class="['relative grow', 'flex items-center justify-center']">
    <Card class="w-full mx-3 max-w-xl md:px-8 md:scale-110 rounded-3xl">
      <template #title>
        <div class="flex items-center justify-center py-6">
          <h1 class="text-2xl font-semibold" v-text="$t('login')" />
        </div>
      </template>

      <template #content>
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

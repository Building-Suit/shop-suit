<script lang="ts" setup>
const { validationExceptions = [], fluid = true } = defineProps<{
  submitLabel?: string;
  submitting?: boolean;
  validationExceptions?: string[];
  fieldSize?: 'small' | 'large';
  fluid?: boolean;
}>();

const emit = defineEmits<{
  (e: 'submit'): void;
}>();

// Form validation setup
const fields = defineModel<Field[]>({ default: [] });

const initialValues = computed(() =>
  fields.value.reduce((acc, field) => {
    return { ...acc, [field.key]: field.value };
  }, {} as Record<string, any>)
);

const resolver = ({ values }: any) => {
  const errors: any = {};

  Object.entries(values)
    .filter(([key, value]) => fields.value.find(f => f.key === key))
    .forEach(([key, value]) => {
      if (validationExceptions.includes(key)) return;
      const field = getField(key);
      if (!value) errors[key] = [{ message: `${field?.label} is required.` }];
    });

  return { values, errors };
};

const onFormSubmit = ({ valid }: { valid: boolean }): any => {
  if (valid) emit('submit');
};

function getField(key: string) {
  return fields.value.find(f => f.key === key) || { value: '', label: '' };
}
</script>

<template>
  <Form
    v-slot="$form"
    :initialValues
    :resolver
    class="flex flex-col gap-4 my-4"
    @submit="onFormSubmit"
  >
    <div
      v-for="field in fields"
      :key="field.key"
      :class="['flex flex-col gap-1 flex-1', field.hide && 'hidden']"
    >
      <FloatLabel variant="on">
        <Select
          v-if="field.type === 'select'"
          v-model="field.value"
          :options="field.options"
          :name="field.key"
          :size="fieldSize"
          :fluid
          v-bind="field.attrs"
        />

        <InputNumber
          v-else-if="field.type === 'number'"
          v-model="field.value"
          :id="field.key"
          autocomplete="off"
          :name="field.key"
          :size="fieldSize"
          :fluid
          v-bind="field.attrs"
        />

        <Password
          v-else-if="field.type === 'password'"
          v-model="field.value"
          :id="field.key"
          autocomplete="off"
          :name="field.key"
          toggleMask
          :size="fieldSize"
          :fluid
          v-bind="field.attrs"
        />

        <InputText
          v-else
          v-model="field.value"
          :id="field.key"
          autocomplete="off"
          :name="field.key"
          :type="field.type"
          :size="fieldSize"
          :fluid
          v-bind="field.attrs"
        />

        <label :for="field.key">{{ field.label }}</label>
      </FloatLabel>

      <Message
        v-if="field.helperText"
        size="small"
        severity="secondary"
        variant="simple"
        v-text="field.helperText"
      />

      <Message
        v-if="$form[field.key]?.invalid"
        severity="error"
        size="small"
        variant="simple"
        v-text="$form[field.key]?.error?.message"
      />
    </div>

    <slot />

    <Button
      type="submit"
      :label="submitLabel || 'Submit'"
      :loading="submitting"
      :fluid
    />
  </Form>
</template>

<style scoped></style>

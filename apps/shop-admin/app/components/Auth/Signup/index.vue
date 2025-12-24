<script lang="ts" setup>
import { AuthSignupForm, AuthSignupVerify } from '#components';

const { plan } = defineProps<{ plan: any }>();

const stepComponent = useTemplateRef<any>('stepComponent');
const authFormFields = computed(
  () => stepComponent.value?.find((f: any) => 'fields' in f)?.fields
);

const step = ref(1);
const steps = computed(() => [
  {
    key: 1,
    label: $t('signUp'),
    component: AuthSignupForm,
    attrs: { plan },
    success: (): unknown => (step.value = 2),
  },
  {
    key: 2,
    label: $t('verify'),
    component: AuthSignupVerify,
    attrs: {
      plan,
      email: getField('email')?.value || '',
      password: getField('password')?.value || '',
    },
    success: () => {},
  },
]);

const getField = (key: string) =>
  authFormFields.value?.find((f: any) => f.key === key);
</script>

<template>
  <div class="flex flex-col">
    <div v-if="plan" class="mb-4 text-sm text-slate-600 dark:text-slate-300">
      {{ $t('yourSelectedPlan') }}: <strong>{{ $t(plan.key) }}</strong>
      <span
        v-if="plan.trial_days > 0"
        class="mx-1 inline-block bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 text-xs px-3 py-1 rounded-full"
      >
        {{ plan.trial_days }} - {{ $t('dayFreeTrial') }}
      </span>
    </div>

    <Stepper :value="step" linear>
      <StepItem v-for="s in steps" :key="s.key" :value="s.key">
        <Step> {{ s.label }} </Step>
        <StepPanel v-slot="{ activateCallback }">
          <component
            ref="stepComponent"
            :is="s.component || 'div'"
            v-bind="s.attrs"
            @success="s.success"
          />
        </StepPanel>
      </StepItem>
    </Stepper>
  </div>
</template>

<style scoped></style>

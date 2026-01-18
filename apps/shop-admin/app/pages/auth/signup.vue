<script setup lang="ts">
definePageMeta({ layout: false });

const planKey = computed(() => history.state?.plan);

const subStore = useSubscriptionStore();
const { plans } = storeToRefs(subStore);
!plans.value?.data?.length && subStore.getPlans();

const errorMsg = ref<string | null>(null);

const plan = computed(() => {
  errorMsg.value = null;

  const plan = plans.value?.data?.find(p => p.key === planKey.value);

  if (!plan && !plans.value.loading) {
    errorMsg.value = 'Invalid or inactive plan.';
  }

  return plan;
});

const t = (key: string) => computed(() => $t(`${key}`));

const fields = ref([
  { key: 'shop_name', label: t('shopName'), type: 'text', value: '' },
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
const handleSignup = async () => {
  errorMsg.value = null;

  submitting.value = true;

  try {
    if (!plan.value) {
      errorMsg.value = 'Plan not loaded.';
      return;
    }

    // 1) create auth user
    const client = supabase();
    const { data: signUpRes, error: signUpErr } = await client.auth.signUp({
      email: getField('email')?.value,
      password: getField('password')?.value,
    });

    if (signUpErr || !signUpRes.user) {
      errorMsg.value = signUpErr?.message || 'Failed to sign up.';
      return;
    }

    const user = signUpRes.user;

    // 2) call RPC to create shop + subscription etc.
    const { data: setupData, error: setupErr } = await client.rpc(
      'setup_shop_for_new_user',
      {
        p_user_id: user.id,
        p_shop_name: getField('shop_name')?.value,
        p_plan_key: plan.value.key,
      }
    );

    if (setupErr) {
      console.error('Setup error', setupErr);
      errorMsg.value = 'Failed to create shop. Please contact support.';
      return;
    }

    if (plan.value.trial_days === 0) {
      // no trial, go pay now
      const res = await $fetch('/api/billing/checkout', {
        method: 'POST',
        body: {
          planKey: plan.value.key,
          shopId: setupData.shop_id,
        },
      });

      if (res?.url) {
        window.location.href = res.url;
        return;
      }
    }

    // else just go to app with trial
    // 3) redirect to dashboard (or onboarding)
    await navigateTo('/dashboard');
  } finally {
    submitting.value = false;
  }
};

const getField = (key: string) => fields.value.find(f => f.key === key);
</script>

<template>
  <div
    :class="[
      'relative min-h-screen',
      'flex items-center justify-center',
      'bg-gray-100 dark:bg-zinc-950',
    ]"
  >
    <div class="flex items-center gap-4 absolute top-4 end-4">
      <AppLanguageSwitcher />
      <AppColorModeSwitcher />
    </div>

    <Card class="w-full mx-3 max-w-xl md:px-8 md:scale-110 rounded-3xl">
      <template #title>
        <div class="flex flex-col items-center justify-center py-6 gap-2">
          <h1 class="text-2xl font-semibold" v-text="$t('createYourAccount')" />

          <p v-if="plans.loading" class="text-sm text-slate-500">
            Loading plan...
          </p>
          <p v-else-if="!plan" class="text-sm text-red-500">{{ errorMsg }}</p>

          <div
            v-if="plan"
            class="mb-4 text-sm text-slate-600 dark:text-slate-300"
          >
            You selected plan: <strong>{{ plan.name }}</strong>
            <span v-if="plan.trial_days > 0">
              — includes {{ plan.trial_days }}-day free trial
            </span>
          </div>
        </div>
      </template>

      <template #content>
        <p v-if="errorMsg" class="text-sm text-red-500">
          {{ errorMsg }}
        </p>

        <AppForm
          v-model="fields"
          :submitting
          :submit-label="$t('signUp')"
          field-size="large"
          class="!gap-6"
          @submit="() => handleSignup()"
        />
      </template>
    </Card>
  </div>
</template>

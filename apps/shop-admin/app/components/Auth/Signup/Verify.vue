<script lang="ts" setup>
const { plan, email, password } = defineProps<{
  plan: any;
  email: string;
  password: string;
}>();

const auth = useAuthStore();
const { setup } = storeToRefs(auth);

const OTPLength = ref(6);
const OTP = ref();

const reSendOTP = () => console.log('Resend OTP clicked');

const initialValues = ref({ passcode: '' });

const resolver = ({ values }: any) => {
  const errors: any = {};
  if (!values.OTP || values.OTP.length < OTPLength.value) {
    errors.OTP = [{ message: 'Please enter the 6-digit code.' }];
  }
  return { values, errors };
};

watch(
  OTP,
  otp => otp && otp.length === OTPLength.value && onFormSubmit({ valid: true })
);

const submitting = ref(false);
const onFormSubmit = async ({ valid }: { valid: boolean }) => {
  try {
    submitting.value = true;
    if (valid) {
      await auth.verify({ email, token: OTP.value });

      if (plan.trial_days === 0) {
        // no trial, go pay now
        const res = await $fetch('/api/billing/checkout', {
          method: 'POST',
          body: { planKey: plan.key, shopId: setup.value?.data?.shop_id },
        });

        if (res?.url) {
          window.location.href = res.url;
          return;
        }
      } else {
        // else just go to app with trial
        await useAuthStore().login(email, password);
      }
    }
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <div class="card flex justify-start">
    <Form
      v-slot="$form"
      :resolver
      :initialValues="initialValues"
      @submit="onFormSubmit"
      class="flex flex-col items-start gap-0.5"
    >
      <p
        class="text-surface-500 dark:text-surface-400 block text-sm"
        v-text="$t('pleaseEnterVerificationCode')"
      />

      <div class="flex items-center gap-4">
        <InputOtp
          v-model="OTP"
          name="OTP"
          :length="OTPLength"
          style="gap: 0"
          integerOnly
        >
          <template #default="{ attrs, events, index }">
            <input
              type="text"
              v-bind="attrs"
              v-on="events"
              :class="[
                'size-10 border border-slate-200 dark:border-gray-800',
                'bg-transparent text-center outline-none',
                [1, OTPLength / 2 + 1].includes(index) && 'rounded-s-lg',
                [OTPLength / 2, OTPLength].includes(index) && 'rounded-e-lg',
                $form.OTP?.invalid && '!border-red-500',
              ]"
            />
            <div v-if="index === OTPLength / 2" class="px-4">
              <i class="pi pi-minus" />
            </div>
          </template>
        </InputOtp>
      </div>

      <Message
        v-if="$form.OTP?.invalid"
        severity="error"
        size="small"
        variant="simple"
        v-text="$form.OTP.error?.message"
      />

      <div class="flex justify-between mt-2 self-stretch">
        <Button
          size="small"
          label="Resend Code"
          link
          class="p-0"
          @click="() => reSendOTP()"
        />

        <Button
          type="submit"
          size="small"
          label="Submit Code"
          :loading="submitting"
        />
      </div>
    </Form>
  </div>
</template>

<style scoped>
.custom-otp-input {
  width: 48px;
  height: 48px;
  font-size: 24px;
  appearance: none;
  text-align: center;
  transition: all 0.2s;
  border-radius: 0;
  border: 1px solid var(--p-inputtext-border-color);
  background: transparent;
  outline-offset: -2px;
  outline-color: transparent;
  border-right: 0 none;
  transition: outline-color 0.3s;
  color: var(--p-inputtext-color);
}

.custom-otp-input:focus {
  outline: 2px solid var(--p-focus-ring-color);
}

.custom-otp-input:first-child,
.custom-otp-input:nth-child(5) {
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
}

.custom-otp-input:nth-child(3),
.custom-otp-input:last-child {
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  border-right-width: 1px;
  border-right-style: solid;
  border-color: var(--p-inputtext-border-color);
}
</style>

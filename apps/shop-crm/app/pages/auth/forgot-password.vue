<script setup lang="ts">
definePageMeta({
  layout: 'auth',
});

const email = ref('');
const errorMessage = ref('');
const pending = ref(false);
const sent = ref(false);

const { mutateAsync: resetPassword } = useMutationContract(
  useResetPasswordMutation(),
);

async function onSubmit() {
  if (pending.value) return;
  errorMessage.value = '';
  pending.value = true;
  try {
    await resetPassword({ email: email.value });
    sent.value = true;
  } catch (error: any) {
    const data = error?.data ?? error;
    errorMessage.value =
      data?.message || 'تعذّر إرسال بريد إعادة التعيين. حاول مرة أخرى.';
  } finally {
    pending.value = false;
  }
}
</script>

<template>
  <div class="w-full max-w-md flex flex-col gap-8">
    <div class="flex flex-col gap-2 text-center">
      <h1 class="text-headline-lg text-foreground">
        {{ $t('auth.forgotTitle') }}
      </h1>
      <p class="text-body-md text-muted-foreground">
        {{ $t('auth.forgotSubtitle') }}
      </p>
    </div>

    <div v-if="sent" class="status-success rounded-lg p-4 text-body-md" role="status">
      {{ $t('auth.resetSent') }}
    </div>

    <form v-else class="flex flex-col gap-5" novalidate @submit.prevent="onSubmit">
      <div v-if="errorMessage" class="status-error rounded-lg p-3 text-body-sm" role="alert">
        {{ errorMessage }}
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-label-lg text-foreground" for="reset-email">
          {{ $t('auth.email') }}
        </label>
        <input
          id="reset-email"
          v-model="email"
          type="email"
          name="email"
          autocomplete="email"
          required
          class="h-12 rounded-lg border border-input bg-surface px-4 text-body-md text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none"
          :placeholder="$t('auth.emailPlaceholder')"
        />
      </div>

      <Button type="submit" class="w-full" :disabled="pending">
        <Icon v-if="pending" name="svg-spinners:180-ring" class="size-5" />
        {{ $t('auth.resetAction') }}
      </Button>
    </form>

    <p class="text-center text-body-md text-muted-foreground">
      <NuxtLink
        to="/auth/login"
        class="font-semibold text-primary underline-offset-4 hover:underline"
      >
        {{ $t('auth.backToLogin') }}
      </NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { NuxtLink } from '#components';

definePageMeta({
  layout: 'auth',
});

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const pending = ref(false);

const { mutateAsync: login } = useMutationContract(useLoginMutation());

async function onSubmit() {
  if (pending.value) return; // double-submit protection
  errorMessage.value = '';
  pending.value = true;
  try {
    await login({ email: email.value, password: password.value });
    await navigateTo('/');
  } catch (error: any) {
    const data = error?.data ?? error;
    errorMessage.value =
      data?.message || 'تعذّر تسجيل الدخول. تحقق من بياناتك وحاول مرة أخرى.';
  } finally {
    pending.value = false;
  }
}
</script>

<template>
  <div class="w-full max-w-md flex flex-col gap-8">
    <div class="flex flex-col gap-2 text-center">
      <h1 class="text-headline-lg text-foreground">
        {{ $t('auth.loginTitle') }}
      </h1>
      <p class="text-body-md text-muted-foreground">
        {{ $t('auth.loginSubtitle') }}
      </p>
    </div>

    <form class="flex flex-col gap-5" novalidate @submit.prevent="onSubmit">
      <div v-if="errorMessage" class="status-error rounded-lg p-3 text-body-sm" role="alert">
        {{ errorMessage }}
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-label-lg text-foreground" for="login-email">
          {{ $t('auth.email') }}
        </label>
        <input
          id="login-email"
          v-model="email"
          type="email"
          name="email"
          autocomplete="email"
          required
          class="h-12 rounded-lg border border-input bg-surface px-4 text-body-md text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none"
          :placeholder="$t('auth.emailPlaceholder')"
        />
      </div>

      <div class="flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <label class="text-label-lg text-foreground" for="login-password">
            {{ $t('auth.password') }}
          </label>
          <NuxtLink
            to="/auth/forgot-password"
            class="text-label-md text-muted-foreground underline-offset-4 hover:underline"
          >
            {{ $t('auth.forgotPassword') }}
          </NuxtLink>
        </div>
        <input
          id="login-password"
          v-model="password"
          type="password"
          name="password"
          autocomplete="current-password"
          required
          class="h-12 rounded-lg border border-input bg-surface px-4 text-body-md text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none"
          :placeholder="$t('auth.passwordPlaceholder')"
        />
      </div>

      <Button type="submit" class="w-full" :disabled="pending">
        <Icon v-if="pending" name="svg-spinners:180-ring" class="size-5" />
        {{ $t('auth.loginAction') }}
      </Button>
    </form>

    <p class="text-center text-body-md text-muted-foreground">
      {{ $t('auth.noAccount') }}
      <NuxtLink
        to="/auth/signup"
        class="font-semibold text-primary underline-offset-4 hover:underline"
      >
        {{ $t('auth.signupAction') }}
      </NuxtLink>
    </p>
  </div>
</template>

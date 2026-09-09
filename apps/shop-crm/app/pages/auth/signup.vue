<script setup lang="ts">
definePageMeta({
  layout: 'auth',
});

const displayName = ref('');
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const pending = ref(false);

const { mutateAsync: signup } = useMutationContract(useSignupMutation());

async function onSubmit() {
  if (pending.value) return; // double-submit protection
  errorMessage.value = '';
  pending.value = true;
  try {
    await signup({
      email: email.value,
      password: password.value,
      displayName: displayName.value,
    });
    await navigateTo('/');
  } catch (error: any) {
    const data = error?.data ?? error;
    errorMessage.value = data?.message || 'تعذّر إنشاء الحساب. حاول مرة أخرى.';
  } finally {
    pending.value = false;
  }
}
</script>

<template>
  <div class="w-full max-w-md flex flex-col gap-8">
    <div class="flex flex-col gap-2 text-center">
      <h1 class="text-headline-lg text-foreground">
        {{ $t('auth.signupTitle') }}
      </h1>
      <p class="text-body-md text-muted-foreground">
        {{ $t('auth.signupSubtitle') }}
      </p>
    </div>

    <form class="flex flex-col gap-5" novalidate @submit.prevent="onSubmit">
      <div v-if="errorMessage" class="status-error rounded-lg p-3 text-body-sm" role="alert">
        {{ errorMessage }}
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-label-lg text-foreground" for="signup-name">
          {{ $t('auth.displayName') }}
        </label>
        <input
          id="signup-name"
          v-model="displayName"
          type="text"
          name="name"
          autocomplete="name"
          required
          class="h-12 rounded-lg border border-input bg-surface px-4 text-body-md text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none"
          :placeholder="$t('auth.displayNamePlaceholder')"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-label-lg text-foreground" for="signup-email">
          {{ $t('auth.email') }}
        </label>
        <input
          id="signup-email"
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
        <label class="text-label-lg text-foreground" for="signup-password">
          {{ $t('auth.password') }}
        </label>
        <input
          id="signup-password"
          v-model="password"
          type="password"
          name="new-password"
          autocomplete="new-password"
          required
          minlength="6"
          class="h-12 rounded-lg border border-input bg-surface px-4 text-body-md text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none"
          :placeholder="$t('auth.passwordPlaceholder')"
        />
        <p class="text-label-md text-muted-foreground">
          {{ $t('auth.passwordHint') }}
        </p>
      </div>

      <Button type="submit" class="w-full" :disabled="pending">
        <Icon v-if="pending" name="svg-spinners:180-ring" class="size-5" />
        {{ $t('auth.signupAction') }}
      </Button>
    </form>

    <p class="text-center text-body-md text-muted-foreground">
      {{ $t('auth.haveAccount') }}
      <NuxtLink
        to="/auth/login"
        class="font-semibold text-primary underline-offset-4 hover:underline"
      >
        {{ $t('auth.loginAction') }}
      </NuxtLink>
    </p>
  </div>
</template>

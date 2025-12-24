<script setup lang="ts">
definePageMeta({ layout: false });

const route = useRoute();
const sessionId = route.query.session_id as string | undefined;

const loading = ref(true);
const ok = ref(false);

onMounted(async () => {
  if (!sessionId) {
    loading.value = false;
    return;
  }

  try {
    await $fetch('/api/billing/verify', {
      method: 'POST',
      body: { sessionId },
    });
    ok.value = true;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="p-10 text-center">
    <div v-if="loading">Verifying…</div>

    <template v-else>
      <h1 v-if="ok" class="text-3xl font-bold text-green-600">
        Payment Successful 🎉
      </h1>
      <h1 v-else class="text-3xl font-bold text-red-600">
        Payment verification failed
      </h1>

      <NuxtLink v-if="ok" to="/dashboard" class="text-blue-600 underline"
        >Go to Dashboard</NuxtLink
      >
      <NuxtLink v-else to="/billing" class="text-blue-600 underline"
        >Back to Billing</NuxtLink
      >
    </template>
  </div>
</template>

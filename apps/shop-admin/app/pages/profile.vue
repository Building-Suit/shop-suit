<script setup lang="ts">
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const msg = ref('');

const changePassword = () => {
  if (newPassword.value !== confirmPassword.value) {
    return alert('Passwords do not match');
  }

  msg.value = 'Password changed successfully (UI only)';
};
</script>

<template>
  <Container>
    <h1 class="text-2xl font-bold mb-6">{{ $t('profile') }}</h1>

    <UCard class="p-6 space-y-4">
      <UFormGroup label="Current Password">
        <UInput type="password" v-model="currentPassword" />
      </UFormGroup>

      <UFormGroup label="New Password">
        <UInput type="password" v-model="newPassword" />
      </UFormGroup>

      <UFormGroup label="Confirm New Password">
        <UInput type="password" v-model="confirmPassword" />
      </UFormGroup>

      <UButton @click="changePassword"> Change Password </UButton>

      <p v-if="msg" class="text-green-600 text-sm mt-4">{{ msg }}</p>
    </UCard>
  </Container>
</template>

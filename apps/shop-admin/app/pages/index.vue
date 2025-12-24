<script setup lang="ts">
definePageMeta({ layout: 'public' });


const isSigupOpen = ref(false);
const plan = ref<any>(null);
const goToSignup = (_plan: any) => {
  plan.value = _plan;
  isSigupOpen.value = true;
};

const isLoginOpen = ref(false);
const goToLogin = () => (isLoginOpen.value = true);

</script>

<template>
  <div class="landing">
    <!-- ======================== -->
    <!-- HERO SECTION             -->
    <!-- ======================== -->
    <MainHero @login="() => goToLogin()" />

    <!-- ======================== -->
    <!-- PROBLEM → SOLUTION       -->
    <!-- ======================== -->
    <MainProblemSolution />

    <!-- ======================== -->
    <!-- FEATURE GRID             -->
    <!-- ======================== -->
    <MainFeatures />

    <!-- ======================== -->
    <!-- INVENTORY HIGHLIGHT      -->
    <!-- ======================== -->
    <MainInventory />

    <!-- ======================== -->
    <!-- TESTIMONIALS             -->
    <!-- ======================== -->
    <MainTestimonials />

    <!-- ======================== -->
    <!-- PRICING SECTION          -->
    <!-- ======================== -->
    <MainPricing @plan="(plan) => goToSignup(plan)" />

    <!-- ======================== -->
    <!-- FAQ SECTION              -->
    <!-- ======================== -->
    <MainFAQ />

    <!-- ======================== -->
    <!-- FINAL CTA               -->
    <!-- ======================== -->
    <MainFinalCTA />

    <Dialog
      v-model:visible="isSigupOpen"
      modal
      :header="$t('createYourAccount')"
      :style="{ width: '35rem' }"
    >
      <AuthSignup :plan />
    </Dialog>

    <Dialog
      v-model:visible="isLoginOpen"
      modal
      :header="$t('login')"
      :style="{ width: '35rem' }"
    >
      <AuthLogin />
    </Dialog>
  </div>
</template>

<style scoped>
.landing {
  overflow-x: hidden;
}
</style>

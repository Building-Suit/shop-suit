<script setup lang="ts">
definePageMeta({ layout: false, middleware: [] }); // billing page should be accessible even if not paid

// const shopStore = useShopStore();
// const { shop } = storeToRefs(shopStore);

const auth = useAuthStore();
const { authUser } = storeToRefs(auth);

const loading = ref(true);
const errorMsg = ref<string | null>(null);

type Plan = {
  key: string;
  name: string;
  description?: string | null;
  trial_days?: number | null;
  price: number;
  currency: string;
  features?: any; // jsonb
  is_active?: boolean;
};

type CurrentSub = {
  status: string | null;
  trial_ends_at: string | null;
  current_period_end: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
};

const plans = ref<Plan[]>([]);
const currentSub = ref<CurrentSub | null>(null);

const statusLabel = computed(() => {
  const s = currentSub.value?.status;
  if (!s) return 'No subscription';
  return s;
});

const statusColor = computed(() => {
  const s = currentSub.value?.status;
  if (s === 'active') return 'text-green-600';
  if (s === 'trialing') return 'text-blue-600';
  if (s === 'pending_payment' || s === 'incomplete') return 'text-amber-600';
  if (s === 'past_due' || s === 'unpaid') return 'text-red-600';
  if (s === 'canceled') return 'text-gray-600';
  return 'text-gray-700';
});

const trialEndsText = computed(() => {
  const t = currentSub.value?.trial_ends_at;
  if (!t) return null;
  const d = new Date(t);
  return d.toLocaleString();
});

const periodEndsText = computed(() => {
  const t = currentSub.value?.current_period_end;
  if (!t) return null;
  const d = new Date(t);
  return d.toLocaleString();
});

const needsPayment = computed(() => {
  const s = currentSub.value?.status;
  if (!s) return true;
  return [
    'pending_payment',
    'incomplete',
    'past_due',
    'unpaid',
    'canceled',
  ].includes(s);
});

const canUseApp = computed(() => {
  const s = currentSub.value?.status;
  if (s === 'active') return true;
  if (s === 'trialing') {
    const trialEnds = currentSub.value?.trial_ends_at
      ? new Date(currentSub.value.trial_ends_at).getTime()
      : null;
    if (!trialEnds) return true; // if Stripe says trialing, assume ok
    return trialEnds > Date.now();
  }
  return false;
});

async function loadBillingData() {
  loading.value = true;
  errorMsg.value = null;

  try {
    // if (!shop.value?.id) {
    //   // if you have a method to load default shop
    //   if (typeof shopStore.loadDefaultShop === 'function') {
    //     await shopStore.loadDefaultShop();
    //   }
    // }

    if (!authUser.value?.shopId) {
      errorMsg.value = 'No shop selected.';
      return;
    }

    // 1) fetch plans
    const { data: planRows, error: planErr } = await supabase()
      .from('plans')
      .select(
        'key, name, description, trial_days, price_monthly, currency, is_active'
      )
      .eq('is_active', true)
      .order('price_monthly', { ascending: true });

    if (planErr) throw planErr;
    plans.value = (planRows || []) as any;

    // 2) fetch current subscription
    const { data: subRow, error: subErr } = await supabase()
      .from('shop_subscriptions')
      .select(
        'status, trial_ends_at, current_period_end, stripe_customer_id, stripe_subscription_id'
      )
      .eq('shop_id', authUser.value?.shopId)
      .eq('is_current', true)
      .single();

    // if no row found, keep null
    if (!subErr) currentSub.value = subRow as any;
  } catch (e: any) {
    console.error(e);
    errorMsg.value = e?.message || 'Failed to load billing data.';
  } finally {
    loading.value = false;
  }
}

const checkoutLoadingKey = ref<string | null>(null);

async function startCheckout(planKey: string) {
  if (!authUser.value?.shopId) return;

  checkoutLoadingKey.value = planKey;

  try {
    const res = await $fetch<{ url: string }>('/api/billing/checkout', {
      method: 'POST',
      body: { planKey, shopId: authUser.value?.shopId },
    });

    if (!res?.url) throw new Error('Stripe checkout URL missing');
    window.location.href = res.url;
  } catch (e: any) {
    console.error(e);
    errorMsg.value = e?.data?.statusMessage || e?.message || 'Checkout failed.';
  } finally {
    checkoutLoadingKey.value = null;
  }
}

// Optional: Stripe customer portal
const portalLoading = ref(false);

async function openCustomerPortal() {
  if (!currentSub.value?.stripe_customer_id) {
    errorMsg.value = 'No Stripe customer found for this shop yet.';
    return;
  }
  portalLoading.value = true;
  try {
    const res = await $fetch<{ url: string }>('/api/billing/portal', {
      method: 'POST',
      body: { customerId: currentSub.value.stripe_customer_id },
    });

    if (!res?.url) throw new Error('Portal URL missing');
    window.location.href = res.url;
  } catch (e: any) {
    console.error(e);
    errorMsg.value =
      e?.data?.statusMessage || e?.message || 'Failed to open portal.';
  } finally {
    portalLoading.value = false;
  }
}

onMounted(loadBillingData);
</script>

<template>
  <div class="max-w-6xl mx-auto p-6">
    <!-- Header -->
    <div
      class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
    >
      <div>
        <h1 class="text-2xl font-semibold">Billing</h1>
        <p class="text-sm text-gray-500">
          Choose a plan, manage your subscription, and unlock modules.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <NuxtLink
          v-if="canUseApp"
          to="/dashboard"
          class="px-4 py-2 rounded bg-gray-900 text-white hover:bg-gray-800"
        >
          Go to dashboard
        </NuxtLink>

        <button
          v-if="currentSub?.stripe_customer_id"
          class="px-4 py-2 rounded border bg-white hover:bg-gray-50 disabled:opacity-50"
          :disabled="portalLoading"
          @click="openCustomerPortal"
        >
          {{ portalLoading ? 'Opening…' : 'Manage subscription' }}
        </button>
      </div>
    </div>

    <!-- Loading / Errors -->
    <div v-if="loading" class="py-16 text-center text-gray-500">Loading…</div>

    <div v-else>
      <div
        v-if="errorMsg"
        class="mb-4 p-3 rounded border border-red-200 bg-red-50 text-red-700"
      >
        {{ errorMsg }}
      </div>

      <!-- Current Status Card -->
      <div class="mb-6 rounded-lg border bg-white p-5">
        <div
          class="flex flex-col md:flex-row md:items-center md:justify-between gap-3"
        >
          <div>
            <div class="text-sm text-gray-500">Current subscription status</div>
            <div class="text-lg font-semibold" :class="statusColor">
              {{ statusLabel }}
            </div>

            <div
              v-if="currentSub?.status === 'trialing' && trialEndsText"
              class="text-sm text-gray-600 mt-1"
            >
              Trial ends at:
              <span class="font-medium">{{ trialEndsText }}</span>
            </div>

            <div v-if="periodEndsText" class="text-sm text-gray-600 mt-1">
              Current period ends at:
              <span class="font-medium">{{ periodEndsText }}</span>
            </div>
          </div>

          <div class="text-sm">
            <div
              v-if="needsPayment"
              class="text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2"
            >
              Payment required to unlock modules.
            </div>
            <div
              v-else
              class="text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2"
            >
              Your shop is active.
            </div>
          </div>
        </div>
      </div>

      <!-- Plans -->

      <!-- <section id="pricing" class="py-20 px-4">
        <div class="max-w-5xl mx-auto text-center mb-10">
          <h2 class="text-3xl font-bold">{{ $t('pricing') }}</h2>
          <p class="text-slate-600 dark:text-slate-300 mt-1">
            {{ $t('chooseThePlanThatFits') }}
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <div
            v-for="plan in plans"
            :key="plan.id"
            class="flex flex-col rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-slate-800 shadow-lg p-6"
            :class="plan.key === 'pro' ? 'ring-2 ring-blue-500' : ''"
          >
            <h3 class="text-xl font-bold">{{ $t(plan.key) }}</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {{ $t(`${plan.key}Description`) }}
            </p>

            <div class="flex items-end justify-between gap-1 mt-4">
              <p class="text-3xl font-extrabold">
                {{ plan.price_monthly }}
              </p>

              <span
                v-if="plan.trial_days > 0"
                class="inline-block bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 text-xs px-3 py-1 rounded-full"
              >
                {{ plan.trial_days }} - {{ $t('dayFreeTrial') }}
              </span>
            </div>

            <ul
              class="mt-6 text-sm space-y-1 text-slate-600 dark:text-slate-300"
            >
              <li>✓ {{ $t('coreFeatures') }}</li>

              <li>
                {{ ['basic'].includes(plan.key) ? '✕' : '✓' }}
                {{ $t('inventoryFeature01') }}
              </li>
              <li>
                {{ ['basic'].includes(plan.key) ? '✕' : '✓' }}
                {{ $t('inventoryFeature02') }}
              </li>
              <li>
                {{ ['basic'].includes(plan.key) ? '✕' : '✓' }}
                {{ $t('inventoryFeature03') }}
              </li>
              <li>
                {{ ['basic'].includes(plan.key) ? '✕' : '✓' }}
                {{ $t('inventoryFeature04') }}
              </li>
            </ul>

            <button
              class="mt-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700"
              @click="() => goToSignup(plan.key)"
            >
              {{ $t('choose') }} {{ $t(plan.key) }}
            </button>
          </div>
        </div>
      </section> -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="p in plans"
          :key="p.key"
          class="rounded-xl border bg-white p-5 flex flex-col"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <h3 class="text-lg font-semibold">{{ p.name }}</h3>
              <p class="text-sm text-gray-500 mt-1">
                {{ p.description || 'Plan description' }}
              </p>
            </div>

            <div class="text-right">
              <div class="text-xl font-bold">
                {{ p.price }}
                <span class="text-sm font-medium text-gray-500">{{
                  p.currency.toUpperCase()
                }}</span>
              </div>
              <div class="text-xs text-gray-500">per month</div>
            </div>
          </div>

          <div
            v-if="p.trial_days && p.trial_days > 0"
            class="mt-3 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded px-3 py-2"
          >
            Includes <strong>{{ p.trial_days }}</strong> day free trial (card
            may be required).
          </div>

          <ul v-if="p.features" class="mt-4 space-y-2 text-sm text-gray-700">
            <li
              v-for="(feat, idx) in Array.isArray(p.features) ? p.features : []"
              :key="idx"
              class="flex items-start gap-2"
            >
              <span
                class="mt-[2px] inline-block w-2 h-2 rounded-full bg-gray-900"
              ></span>
              <span>{{ feat }}</span>
            </li>
          </ul>

          <div class="mt-auto pt-5">
            <button
              class="w-full px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50"
              :disabled="checkoutLoadingKey === p.key"
              @click="startCheckout(p.key)"
            >
              {{
                checkoutLoadingKey === p.key ? 'Redirecting…' : 'Choose plan'
              }}
            </button>

            <p class="mt-2 text-xs text-gray-500">
              You’ll be redirected to Stripe to complete payment securely.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

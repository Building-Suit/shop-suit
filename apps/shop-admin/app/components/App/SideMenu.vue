<script setup lang="ts">
const { isMobile, collapsed, menu: menuItems } = storeToRefs(useLayoutStore());

const route = useRoute();
const isActive = (item: MenuItem) => route.path.startsWith(item.to);

const auth = useAuthStore();
const { authUser } = storeToRefs(auth);

const logout = async () => await auth.logout();
</script>

<template>
  <aside
    :class="[
      'h-full flex flex-col bg-white dark:bg-zinc-900 shadow-md',
      'transition-all duration-300 overflow-hidden rounded-lg',
      collapsed ? 'md:w-20' : 'md:w-64',
      'w-full',
    ]"
  >
    <!-- Header -->
    <header
      class="hidden md:flex items-center justify-between px-4 h-[60px] border-b dark:border-gray-700"
    >
      <transition name="fade-fast">
        <h2
          v-if="!collapsed"
          class="font-semibold text-lg truncate text-gray-900 dark:text-white"
          v-text="authUser?.shopName?.toUpperCase()"
        />
      </transition>
    </header>

    <!-- Sections -->
    <nav class="flex-1 py-3 overflow-y-auto">
      <div
        v-for="(section, idx) in menuItems"
        :key="section.section"
        :class="[
          'px-2 mb-4 dark:border-gray-700',
          idx !== menuItems.length - 1 && 'border-b',
        ]"
      >
        <!-- Section Title -->
        <transition v-if="!collapsed" name="fade-fast">
          <h4
            class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 px-2"
            v-text="$t(section.section)"
          />
        </transition>

        <!-- Section Items -->
        <div v-for="item in section.items" :key="item.to">
          <NuxtLink
            :to="item.to"
            class="flex items-center gap-3 mx-1 mb-1 rounded-lg transition-all px-4 py-3"
            :class="[
              isActive(item)
                ? 'font-bold text-green-600 dark:text-green-400'
                : 'text-gray-700 dark:text-gray-200',
              'hover:bg-gray-200 dark:hover:bg-gray-700',
            ]"
          >
            <i :class="[item.icon, 'text-xl w-6 text-center shrink']" />

            <transition name="fade-fast">
              <span
                v-if="!collapsed || isMobile"
                class="whitespace-nowrap truncate flex-1 me-auto"
                v-text="$t(item.label)"
              />
            </transition>
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Logout -->
    <footer class="p-3 border-t dark:border-gray-700">
      <button
        @click="logout"
        class="w-full flex items-center gap-3 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-gray-700 transition"
        :class="collapsed ? 'justify-center p-3' : 'px-4 py-3'"
      >
        <i class="pi pi-sign-out text-xl" />

        <transition name="fade-fast">
          <span
            v-if="!collapsed"
            class="whitespace-nowrap"
            v-text="$t('logout')"
          />
        </transition>
      </button>
    </footer>
  </aside>
</template>

<style scoped>
.fade-fast-enter-active,
.fade-fast-leave-active {
  transition: opacity 0.3s ease-in-out;
}
.fade-fast-enter-from,
.fade-fast-leave-to {
  opacity: 0;
}
</style>

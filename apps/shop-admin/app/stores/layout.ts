import { useMediaQuery } from '@vueuse/core';

export const useLayoutStore = defineStore('layout', () => {
  const route = useRoute();
  const { t } = useI18n();
  const moduleStore = useModuleStore();
  const { isOwner } = storeToRefs(useAuthStore());

  const isMobile = useMediaQuery('(max-width: 768px)');
  const collapsed = useCookie<boolean>('collapsed');

  const pageTitle = computed(() => {
    const item = menu.value
      .flatMap(m => m.items)
      .find(m => route.path.startsWith(m.to));
    return item ? t(item.label) : 'CRM';
  });

  const menu = computed<MenuSection[]>(() => [
    {
      section: 'business_operations',
      items: [
        { label: 'dashboard', icon: 'pi pi-chart-line', to: '/dashboard' },
        ...(isOwner.value
          ? [{ label: 'employees', icon: 'pi pi-users', to: '/employees' }]
          : []),
        { label: 'services', icon: 'pi pi-barcode', to: '/services' },
        {
          label: 'invoices_clients',
          icon: 'pi pi-receipt',
          to: '/invoices/clients',
        },
        ...(isOwner.value
          ? [{ label: 'finance', icon: 'pi pi-money-bill', to: '/finance' }]
          : []),
      ],
    },

    ...(moduleStore.has('inventory')
      ? [
          {
            section: 'inventory_and_purchases',
            items: [
              { label: 'products', icon: 'pi pi-box', to: '/products' },
              {
                label: 'invoices_vendors',
                icon: 'pi pi-receipt',
                to: '/invoices/vendors',
              },
            ],
          },
        ]
      : []),
  ]);

  return { isMobile, collapsed, menu, pageTitle };
});

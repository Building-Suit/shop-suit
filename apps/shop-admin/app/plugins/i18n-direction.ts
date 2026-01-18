export default defineNuxtPlugin(nuxtApp => {
  const i18n = nuxtApp.$i18n; // the correct way in Nuxt 3 with @nuxtjs/i18n

  if (!i18n) return;

  const updateDir = () => {
    const currentLocale = i18n.locale.value;
    const isArabic = currentLocale === 'ar';

    document.documentElement.setAttribute('lang', isArabic ? 'ar' : 'en');
    document.documentElement.setAttribute('dir', isArabic ? 'rtl' : 'ltr');

    if (isArabic) {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  };

  // run once on mounted
  nuxtApp.hook('app:mounted', () => {
    updateDir();
  });

  // watch changes
  watch(
    () => i18n.locale.value,
    () => updateDir()
  );
});

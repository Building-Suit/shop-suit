import { useTimeAgo } from '@vueuse/core';

export const useLocalizationTimeAgo = (date: string) => {
  return new Date(date).toLocaleDateString();

  const { t } = useI18n();

  return useTimeAgo(date, {
    messages: {
      justNow: t('time.justNow'),
      past: n => t('time.past', { n }),
      future: n => t('time.future', { n }),
      invalid: t('time.invalid'),
      seconds: t('time.seconds'),
      minute: t('time.minute'),
      minutes: n => t('time.minutes', { n }),
      hour: t('time.hour'),
      hours: n => t('time.hours', { n }),
      day: t('time.day'),
      days: n => t('time.days', { n }),
      month: t('time.month'),
      months: n => t('time.months', { n }),
      year: t('time.year'),
      years: n => t('time.years', { n }),
    },
  });
};

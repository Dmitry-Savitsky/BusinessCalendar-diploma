import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale, type Locale } from '../i18n.config';

export default getRequestConfig(async ({ locale }) => {
  // Validate and ensure locale is always defined
  const validLocale = (locales.includes(locale as Locale) ? locale : defaultLocale) as Locale;
  
  return {
    messages: (await import(`../messages/${validLocale}.json`)).default,
    locale: validLocale,
    timeZone: 'Europe/Moscow'
  };
}); 
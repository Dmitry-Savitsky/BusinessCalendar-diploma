export const defaultLocale = 'en'
export const locales = ['en', 'ru']

export type Locale = typeof locales[number]
 
export function getLocale(pathname: string) {
  const segments = pathname.split('/')
  const locale = segments[1]
  return locales.includes(locale as Locale) ? (locale as Locale) : defaultLocale
} 
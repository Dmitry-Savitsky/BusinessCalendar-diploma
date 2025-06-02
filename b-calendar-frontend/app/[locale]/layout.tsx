import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { notFound } from "next/navigation"
import { NextIntlClientProvider } from "next-intl"
import { locales } from "@/i18n.config"
import "../globals.css"

// Generate static params for all supported locales
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

// Generate metadata for the page
export async function generateMetadata({
  params
}: {
  params: { locale: string }
}) {
  const { locale } = await params
  
  // Validate locale
  if (!locales.includes(locale)) {
    notFound()
  }

  return {
    title: "B-Calendar - Booking Management System",
    description: "A multi-user application for service booking management",
  }
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const { locale } = await params
  
  if (!locales.includes(locale)) {
    notFound()
  }

  let messages
  try {
    messages = (await import(`../../messages/${locale}.json`)).default
  } catch (error) {
    notFound()
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <>
        {children}
        <Toaster />
      </>
    </NextIntlClientProvider>
  )
} 
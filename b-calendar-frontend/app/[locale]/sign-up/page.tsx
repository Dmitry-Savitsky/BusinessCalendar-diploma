"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Building2, UserCog } from "lucide-react"
import { useLocale, useTranslations } from 'next-intl'

const CheckIcon = () => (
  <svg
    className="mr-2 h-4 w-4 text-teal-500"
    fill="none"
    height="24"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export default function SignUpPage() {
  const locale = useLocale()
  const t = useTranslations('auth.signUp')
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container max-w-5xl px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 mb-8">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{t('title')}</h1>
            <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              {t('description')}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="flex flex-col h-full">
              <CardHeader className="text-center">
                <CardTitle className="flex justify-center">
                  <Building2 className="h-10 w-10 mb-2 text-teal-500" />
                </CardTitle>
                <CardTitle className="text-2xl">{t('types.company.title')}</CardTitle>
                <CardDescription>{t('types.company.description')}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-4 mb-6 flex-1">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckIcon />
                      {t('types.company.features.manageServices')}
                    </li>
                    <li className="flex items-center">
                      <CheckIcon />
                      {t('types.company.features.manageExecutors')}
                    </li>
                    <li className="flex items-center">
                      <CheckIcon />
                      {t('types.company.features.manageBookings')}
                    </li>
                    <li className="flex items-center">
                      <CheckIcon />
                      {t('types.company.features.analytics')}
                    </li>
                  </ul>
                </div>
                <Link href={`/${locale}/sign-up/company`} className="mt-auto">
                  <Button className="w-full">{t('types.company.button')}</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="flex flex-col h-full">
              <CardHeader className="text-center">
                <CardTitle className="flex justify-center">
                  <UserCog className="h-10 w-10 mb-2 text-teal-500" />
                </CardTitle>
                <CardTitle className="text-2xl">{t('types.executor.title')}</CardTitle>
                <CardDescription>{t('types.executor.description')}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-4 mb-6 flex-1">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckIcon />
                      {t('types.executor.features.viewServices')}
                    </li>
                    <li className="flex items-center">
                      <CheckIcon />
                      {t('types.executor.features.manageSchedule')}
                    </li>
                    <li className="flex items-center">
                      <CheckIcon />
                      {t('types.executor.features.trackAppointments')}
                    </li>
                    <li className="flex items-center">
                      <CheckIcon />
                      {t('types.executor.features.clientInfo')}
                    </li>
                  </ul>
                </div>
                <Link href={`/${locale}/sign-up/executor`} className="mt-auto">
                  <Button className="w-full">{t('types.executor.button')}</Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('haveAccount')}{" "}
              <Link href={`/${locale}/sign-in`} className="font-medium text-teal-500 hover:underline">
                {t('signIn')}
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 
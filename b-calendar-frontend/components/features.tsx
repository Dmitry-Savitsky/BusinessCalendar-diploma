"use client"

import { Calendar, Users, Clock, BarChart, Globe, Shield } from "lucide-react"
import { useTranslations } from 'next-intl'

export default function Features() {
  const t = useTranslations('features')

  return (
    <section id="features" className="w-full bg-muted py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">{t('title')}</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              {t('subtitle')}
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm bg-background">
            <Calendar className="h-12 w-12 text-teal-500" />
            <h3 className="text-xl font-bold">{t('smartScheduling.title')}</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              {t('smartScheduling.description')}
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm bg-background">
            <Users className="h-12 w-12 text-teal-500" />
            <h3 className="text-xl font-bold">{t('teamManagement.title')}</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              {t('teamManagement.description')}
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm bg-background">
            <Clock className="h-12 w-12 text-teal-500" />
            <h3 className="text-xl font-bold">{t('realTimeBookings.title')}</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              {t('realTimeBookings.description')}
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm bg-background">
            <BarChart className="h-12 w-12 text-teal-500" />
            <h3 className="text-xl font-bold">{t('analytics.title')}</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              {t('analytics.description')}
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm bg-background">
            <Globe className="h-12 w-12 text-teal-500" />
            <h3 className="text-xl font-bold">{t('bookingWidget.title')}</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              {t('bookingWidget.description')}
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm bg-background">
            <Shield className="h-12 w-12 text-teal-500" />
            <h3 className="text-xl font-bold">{t('secureAccess.title')}</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              {t('secureAccess.description')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

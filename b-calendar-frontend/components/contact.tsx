"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin } from "lucide-react"
import { useTranslations } from 'next-intl'

export default function Contact() {
  const t = useTranslations('contact')

  return (
    <div className="w-full bg-muted">
      <section id="contact" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">{t('title')}</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                {t('subtitle')}
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 lg:grid-cols-2">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-teal-500" />
                <span>{t('info.email')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-teal-500" />
                <span>{t('info.phone')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-teal-500" />
                <span>{t('info.address')}</span>
              </div>
              <div className="mt-6 h-[300px] rounded-lg bg-gray-200 dark:bg-gray-800">
                {/* Map placeholder */}
                <div className="flex h-full items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400">Map Location</span>
                </div>
              </div>
            </div>
            <div className="space-y-4 rounded-lg border p-6 shadow-sm bg-background">
              <div className="space-y-2">
                <h3 className="text-xl font-bold">{t('title')}</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {t('subtitle')}
                </p>
              </div>
              <form className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Input placeholder={t('form.name')} />
                  </div>
                  <div className="space-y-2">
                    <Input placeholder={t('form.email')} type="email" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Input placeholder={t('form.subject')} />
                </div>
                <div className="space-y-2">
                  <Textarea placeholder={t('form.message')} className="min-h-[120px]" />
                </div>
                <Button type="submit" className="w-full">
                  {t('form.send')}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

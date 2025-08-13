"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslations } from 'next-intl'
import type { ExecutorServiceItem } from "../_hooks/useExecutorProfile"
import { Clock } from "lucide-react"

export default function MyServicesGrid({ services }: { services: ExecutorServiceItem[] }) {
  const t = useTranslations('executor.profile')
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('tabs.services.list.title')}</CardTitle>
        <CardDescription>{t('tabs.services.list.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.length > 0 ? (
            services.map((service) => (
              <Card key={service.servicePublicId} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-base">{service.serviceName}</h3>
                      <div className="mt-1 space-y-0.5 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{t('tabs.services.list.fields.durationUnit', { minutes: service.durationMinutes })}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-base">{service.servicePrice} BYN</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{t('tabs.services.list.fields.price')}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-8"><p className="text-muted-foreground">{t('tabs.services.list.empty')}</p></div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}



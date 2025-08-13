"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslations } from 'next-intl'
import type { Service } from "@/lib/api/service"
import type { Order } from "@/lib/api/orders"

export default function ServiceStatsCard({ service, bookings }: { service: Service, bookings: Order[] }) {
  const t = useTranslations('services.details')
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('stats.title')}</CardTitle>
        <CardDescription>{t('stats.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1"><p className="text-sm font-medium text-muted-foreground">{t('stats.metrics.totalBookings')}</p><p className="text-2xl font-bold">{bookings.length}</p></div>
          <div className="space-y-1"><p className="text-sm font-medium text-muted-foreground">{t('stats.metrics.revenue')}</p><p className="text-2xl font-bold">${(bookings.length * service.servicePrice).toFixed(2)}</p></div>
          <div className="space-y-1"><p className="text-sm font-medium text-muted-foreground">{t('stats.metrics.avgRating')}</p><p className="text-2xl font-bold">{t('stats.metrics.na')}</p></div>
          <div className="space-y-1"><p className="text-sm font-medium text-muted-foreground">{t('stats.metrics.popularity')}</p><p className="text-2xl font-bold">{t('stats.metrics.na')}</p></div>
        </div>
      </CardContent>
    </Card>
  )
}



"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, DollarSign, MapPin } from "lucide-react"
import { useTranslations } from 'next-intl'
import type { Service } from "@/lib/api/service"
import { getServiceTypeName } from "@/lib/api/service"

export default function ServiceInfoCard({ service }: { service: Service }) {
  const t = useTranslations('services.details')
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('info.title')}</CardTitle>
        <CardDescription>{t('info.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1"><p className="text-sm font-medium text-muted-foreground">{t('info.fields.type')}</p><p>{getServiceTypeName(service.serviceType)}</p></div>
          <div className="space-y-1"><p className="text-sm font-medium text-muted-foreground">{t('info.fields.price')}</p><p className="flex items-center"><DollarSign className="mr-1 h-4 w-4" />{service.servicePrice} BYN</p></div>
          <div className="space-y-1"><p className="text-sm font-medium text-muted-foreground">{t('info.fields.duration')}</p><p className="flex items-center"><Clock className="mr-1 h-4 w-4" />{service.durationMinutes} minutes</p></div>
          <div className="space-y-1"><p className="text-sm font-medium text-muted-foreground">{t('info.fields.location')}</p><p className="flex items-center"><MapPin className="mr-1 h-4 w-4" />{service.requiresAddress ? t('info.fields.onSite') : t('info.fields.inStore')}</p></div>
        </div>
      </CardContent>
    </Card>
  )
}



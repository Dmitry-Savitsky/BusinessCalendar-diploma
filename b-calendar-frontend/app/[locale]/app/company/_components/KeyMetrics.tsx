"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Clock, Package } from "lucide-react"
import { useTranslations } from "next-intl"

interface Props {
  statistics: {
    totalOrders: number
    confirmedOrders: number
    completedOrders: number
    pendingOrders: number
  }
  dateFilter: string
}

export function KeyMetrics({ statistics, dateFilter }: Props) {
  const t = useTranslations('dashboard')
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('metrics.totalOrders.title')}</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistics.totalOrders}</div>
          <p className="text-xs text-muted-foreground">
            {dateFilter === "today"
              ? t('metrics.totalOrders.period.today')
              : dateFilter === "week"
                ? t('metrics.totalOrders.period.week')
                : dateFilter === "month"
                  ? t('metrics.totalOrders.period.month')
                  : t('metrics.totalOrders.period.selected')}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('metrics.confirmedOrders.title')}</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistics.confirmedOrders}</div>
          <p className="text-xs text-muted-foreground">
            {((statistics.confirmedOrders / statistics.totalOrders) * 100 || 0).toFixed(1)}{t('metrics.confirmedOrders.ofTotal')}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('metrics.completedOrders.title')}</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistics.completedOrders}</div>
          <p className="text-xs text-muted-foreground">
            {((statistics.completedOrders / statistics.totalOrders) * 100 || 0).toFixed(1)}{t('metrics.completedOrders.ofTotal')}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('metrics.pendingOrders.title')}</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistics.pendingOrders}</div>
          <p className="text-xs text-muted-foreground">
            {((statistics.pendingOrders / statistics.totalOrders) * 100 || 0).toFixed(1)}{t('metrics.pendingOrders.ofTotal')}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default KeyMetrics


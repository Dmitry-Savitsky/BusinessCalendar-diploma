"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, CheckCircle, DollarSign } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useTranslations } from "next-intl"
import { formatTime } from "@/lib/api/orders"

interface Props {
  loading: boolean
  stats: {
    todaysOrders: any[]
    completedOrders: number
    totalOrders: number
    thisWeeksOrders: any[]
    upcomingOrders: number
    totalRevenue: number
    upcomingRevenue: number
  }
}

export function StatCards({ loading, stats }: Props) {
  const t = useTranslations('executor.dashboard')
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('metrics.todayAppointments.title')}</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.todaysOrders.length}</div>
          {stats.todaysOrders.length > 0 ? (
            <p className="text-xs text-muted-foreground">
              {t('metrics.todayAppointments.nextAt', { time: formatTime(stats.todaysOrders[0].orderStart) })}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">{t('metrics.todayAppointments.noAppointments')}</p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('metrics.completedOrders.title')}</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.completedOrders}</div>
          <p className="text-xs text-muted-foreground">
            {t('metrics.completedOrders.completionRate', { rate: ((stats.completedOrders / stats.totalOrders) * 100 || 0).toFixed(0) })}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('metrics.upcomingWeek.title')}</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.thisWeeksOrders.length}</div>
          <p className="text-xs text-muted-foreground">{t('metrics.upcomingWeek.totalUpcoming', { count: stats.upcomingOrders })}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('metrics.revenue.title')}</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalRevenue} BYN</div>
          <p className="text-xs text-muted-foreground">{t('metrics.revenue.upcoming', { amount: stats.upcomingRevenue })}</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default StatCards


"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { useTranslations } from "next-intl"

interface Props {
  loading: boolean
  stats: {
    serviceTypeData: { type: number; name: string; count: number }[]
    totalOrders: number
    completedOrders: number
    upcomingOrders: number
    pendingOrders: number
  }
}

export function Analytics({ loading, stats }: Props) {
  const t = useTranslations('executor.dashboard')
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{t('analytics.serviceDistribution.title')}</CardTitle>
          <CardDescription>{t('analytics.serviceDistribution.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : stats.serviceTypeData.length > 0 ? (
            <div className="space-y-4">
              {stats.serviceTypeData.map((service) => {
                const percentage = (service.count / stats.totalOrders) * 100
                return (
                  <div key={service.type} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{service.name}</span>
                      <span className="text-sm text-muted-foreground">{t('analytics.serviceDistribution.orders', { count: service.count })}</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-muted-foreground">{t('analytics.serviceDistribution.noData')}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('analytics.orderStatus.title')}</CardTitle>
          <CardDescription>{t('analytics.orderStatus.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{t('analytics.orderStatus.statuses.completed')}</span>
                  <span className="text-sm text-muted-foreground">{t('analytics.orderStatus.orders', { count: stats.completedOrders })}</span>
                </div>
                <Progress value={(stats.completedOrders / stats.totalOrders) * 100 || 0} className="h-2 bg-muted" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{t('analytics.orderStatus.statuses.upcoming')}</span>
                  <span className="text-sm text-muted-foreground">{t('analytics.orderStatus.orders', { count: stats.upcomingOrders })}</span>
                </div>
                <Progress value={(stats.upcomingOrders / stats.totalOrders) * 100 || 0} className="h-2 bg-muted" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{t('analytics.orderStatus.statuses.pending')}</span>
                  <span className="text-sm text-muted-foreground">{t('analytics.orderStatus.orders', { count: stats.pendingOrders })}</span>
                </div>
                <Progress value={(stats.pendingOrders / stats.totalOrders) * 100 || 0} className="h-2 bg-muted" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Analytics


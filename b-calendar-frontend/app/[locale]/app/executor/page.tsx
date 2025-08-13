"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { useTranslations } from 'next-intl'
import { formatDate, formatTime } from "@/lib/api/orders"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useExecutorDashboard } from "./_hooks/useExecutorDashboard"
import StatCards from "./_components/StatCards"
import Analytics from "./_components/Analytics"

export default function ExecutorDashboard() {
  const t = useTranslations('executor.dashboard')
  const [{ loading, orders, stats, executorName }] = useExecutorDashboard()

  const today = new Date()
  const todayFormatted = today.toLocaleDateString("ru-BY", { weekday: "long", year: "numeric", month: "long", day: "numeric" })

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>
          <p className="text-muted-foreground">{todayFormatted}</p>
        </div>
      </div>

      <StatCards loading={loading} stats={stats} />

      <Analytics loading={loading} stats={stats} />

      <Tabs defaultValue="today">
        <TabsList>
          <TabsTrigger value="today">{t('schedule.tabs.today')}</TabsTrigger>
          <TabsTrigger value="upcoming">{t('schedule.tabs.upcoming')}</TabsTrigger>
        </TabsList>
        <TabsContent value="today" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('schedule.today.title')}</CardTitle>
              <CardDescription>
                {stats.todaysOrders.length > 0
                  ? t('schedule.today.description.hasAppointments', { count: stats.todaysOrders.length })
                  : t('schedule.today.description.noAppointments')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 rounded-md border p-4">
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-8 w-24 rounded-full" />
                    </div>
                  ))}
                </div>
              ) : stats.todaysOrders.length > 0 ? (
                <div className="space-y-4">
                  {stats.todaysOrders
                    .sort((a, b) => new Date(a.orderStart).getTime() - new Date(b.orderStart).getTime())
                    .map((order) => (
                      <div key={order.publicId} className="flex items-center space-x-4 rounded-md border p-4">
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {t('schedule.appointment.time', { startTime: formatTime(order.orderStart), endTime: formatTime(order.orderEnd) })}
                          </p>
                          <p className="text-sm text-muted-foreground">{order.items.map((item) => item.serviceName).join(", ")}</p>
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">{t('schedule.appointment.client.title')}</p>
                          <p className="text-sm text-muted-foreground">{t('schedule.appointment.client.info', { name: order.clientName, phone: order.clientPhone })}</p>
                        </div>
                        <div>
                          {order.completed ? (
                            <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              {t('schedule.appointment.status.completed')}
                            </Badge>
                          ) : order.confirmed ? (
                            <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                              <Clock className="mr-1 h-3 w-3" />
                              {t('schedule.appointment.status.confirmed')}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                              <AlertCircle className="mr-1 h-3 w-3" />
                              {t('schedule.appointment.status.pending')}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">{t('schedule.noAppointments')}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('schedule.upcoming.title')}</CardTitle>
              <CardDescription>
                {stats.upcomingOrders > 0
                  ? t('schedule.upcoming.description.hasAppointments', { count: stats.upcomingOrders })
                  : t('schedule.upcoming.description.noAppointments')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {Array(5).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 rounded-md border p-4">
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <Skeleton className="h-8 w-24 rounded-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {orders
                    .filter((order) => {
                      const orderDate = new Date(order.orderStart)
                      return orderDate > new Date() && !order.completed
                    })
                    .sort((a, b) => new Date(a.orderStart).getTime() - new Date(b.orderStart).getTime())
                    .slice(0, 5)
                    .map((order) => (
                      <div key={order.publicId} className="flex items-center space-x-4 rounded-md border p-4">
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">{formatDate(order.orderStart)}</p>
                          <p className="text-sm text-muted-foreground">{formatTime(order.orderStart)}</p>
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">{order.items.map((item) => item.serviceName).join(", ")}</p>
                          <p className="text-sm text-muted-foreground">{order.clientName}</p>
                        </div>
                        <div>
                          {order.confirmed ? (
                            <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                              <Clock className="mr-1 h-3 w-3" />
                              {t('schedule.appointment.status.confirmed')}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                              <AlertCircle className="mr-1 h-3 w-3" />
                              {t('schedule.appointment.status.pending')}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

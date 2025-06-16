"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, CheckCircle, AlertCircle, DollarSign } from "lucide-react"
import { useEffect, useState } from "react"
import { useTranslations } from 'next-intl'
import { getToken, parseToken } from "@/lib/auth"
import { getMyOrders, calculateOrderStats } from "@/lib/api/executor-orders"
import type { Order } from "@/lib/api/orders"
import { formatDate, formatTime } from "@/lib/api/orders"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function ExecutorDashboard() {
  const t = useTranslations('executor.dashboard')
  const [executorName, setExecutorName] = useState("Executor")
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken()
        if (token) {
          const tokenData = parseToken(token)
          setExecutorName(tokenData.name || "Executor")

          const ordersData = await getMyOrders()
          setOrders(ordersData)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: t('errors.loadFailed.title'),
          description: t('errors.loadFailed.description'),
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [t])

  const stats = calculateOrderStats(orders)

  // Get today's date for display using Intl
  const today = new Date()
  const todayFormatted = today.toLocaleDateString("ru-BY", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>
          <p className="text-muted-foreground">{todayFormatted}</p>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
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
      ) : (
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
                {t('metrics.completedOrders.completionRate', {
                  rate: ((stats.completedOrders / stats.totalOrders) * 100 || 0).toFixed(0)
                })}
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
              <p className="text-xs text-muted-foreground">
                {t('metrics.upcomingWeek.totalUpcoming', { count: stats.upcomingOrders })}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('metrics.revenue.title')}</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRevenue} BYN</div>
              <p className="text-xs text-muted-foreground">
                {t('metrics.revenue.upcoming', { amount: stats.upcomingRevenue })}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Analytics Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('analytics.serviceDistribution.title')}</CardTitle>
            <CardDescription>{t('analytics.serviceDistribution.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
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
                        <span className="text-sm text-muted-foreground">
                          {t('analytics.serviceDistribution.orders', { count: service.count })}
                        </span>
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
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
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
                    <span className="text-sm text-muted-foreground">
                      {t('analytics.orderStatus.orders', { count: stats.completedOrders })}
                    </span>
                  </div>
                  <Progress value={(stats.completedOrders / stats.totalOrders) * 100 || 0} className="h-2 bg-muted" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{t('analytics.orderStatus.statuses.upcoming')}</span>
                    <span className="text-sm text-muted-foreground">
                      {t('analytics.orderStatus.orders', { count: stats.upcomingOrders })}
                    </span>
                  </div>
                  <Progress value={(stats.upcomingOrders / stats.totalOrders) * 100 || 0} className="h-2 bg-muted" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{t('analytics.orderStatus.statuses.pending')}</span>
                    <span className="text-sm text-muted-foreground">
                      {t('analytics.orderStatus.orders', { count: stats.pendingOrders })}
                    </span>
                  </div>
                  <Progress value={(stats.pendingOrders / stats.totalOrders) * 100 || 0} className="h-2 bg-muted" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

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
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
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
                            {t('schedule.appointment.time', {
                              startTime: formatTime(order.orderStart),
                              endTime: formatTime(order.orderEnd)
                            })}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {order.items.map((item) => item.serviceName).join(", ")}
                          </p>
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">{t('schedule.appointment.client.title')}</p>
                          <p className="text-sm text-muted-foreground">
                            {t('schedule.appointment.client.info', {
                              name: order.clientName,
                              phone: order.clientPhone
                            })}
                          </p>
                        </div>
                        <div>
                          {order.completed ? (
                            <Badge
                              variant="outline"
                              className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            >
                              <CheckCircle className="mr-1 h-3 w-3" />
                              {t('schedule.appointment.status.completed')}
                            </Badge>
                          ) : order.confirmed ? (
                            <Badge
                              variant="outline"
                              className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                            >
                              <Clock className="mr-1 h-3 w-3" />
                              {t('schedule.appointment.status.confirmed')}
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                            >
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
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
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
                          <p className="text-sm font-medium leading-none">
                            {order.items.map((item) => item.serviceName).join(", ")}
                          </p>
                          <p className="text-sm text-muted-foreground">{order.clientName}</p>
                        </div>
                        <div>
                          {order.confirmed ? (
                            <Badge
                              variant="outline"
                              className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                            >
                              <Clock className="mr-1 h-3 w-3" />
                              {t('schedule.appointment.status.confirmed')}
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                            >
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

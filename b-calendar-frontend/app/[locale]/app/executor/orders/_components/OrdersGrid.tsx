"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTranslations } from 'next-intl'
import type { Order } from "@/lib/api/orders"
import { formatDate, formatTime } from "@/lib/api/orders"
import { CheckCircle, Clock, AlertCircle, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getOrderStatusInfo } from "@/lib/api/executor-orders"

interface Props {
  loading: boolean
  orders: Order[]
  tab: "upcoming" | "pending" | "completed" | "all"
  onTabChange: (t: "upcoming" | "pending" | "completed" | "all") => void
  onDetails: (order: Order) => void
}

export function OrdersGrid({ loading, orders, tab, onTabChange, onDetails }: Props) {
  const t = useTranslations('executor.orders')

  const completedOrders = orders.filter((order) => order.completed === true)
  const upcomingOrders = orders.filter((order) => new Date(order.orderStart) > new Date() && !order.completed)
  const pendingOrders = orders.filter((order) => !order.confirmed && !order.completed)

  const data = tab === "upcoming" ? upcomingOrders : tab === "pending" ? pendingOrders : tab === "completed" ? completedOrders : orders

  return (
    <Tabs value={tab} onValueChange={(v) => onTabChange(v as any)}>
      <TabsList>
        <TabsTrigger value="upcoming">{t('tabs.upcoming', { count: upcomingOrders.length })}</TabsTrigger>
        <TabsTrigger value="pending">{t('tabs.pending', { count: pendingOrders.length })}</TabsTrigger>
        <TabsTrigger value="completed">{t('tabs.completed', { count: completedOrders.length })}</TabsTrigger>
        <TabsTrigger value="all">{t('tabs.all', { count: orders.length })}</TabsTrigger>
      </TabsList>

      <TabsContent value={tab} className="space-y-4">
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array(6).fill(0).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="pb-2"><Skeleton className="h-5 w-32 mb-1" /><Skeleton className="h-4 w-24" /></CardHeader>
                <CardContent className="pb-2"><div className="space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-3/4" /><Skeleton className="h-4 w-1/2" /></div></CardContent>
                <CardFooter><Skeleton className="h-9 w-full" /></CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data
              .sort((a, b) => new Date(a.orderStart).getTime() - new Date(b.orderStart).getTime())
              .map((order) => {
                const statusInfo = getOrderStatusInfo(order)
                return (
                  <Card key={order.publicId} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle>{formatDate(order.orderStart)}</CardTitle>
                        <Badge variant="outline" className={`bg-${statusInfo.color}-100 text-${statusInfo.color}-800 dark:bg-${statusInfo.color}-900/30 dark:text-${statusInfo.color}-400`}>
                          {statusInfo.icon === "check-circle" && <CheckCircle className="mr-1 h-3 w-3" />}
                          {statusInfo.icon === "clock" && <Clock className="mr-1 h-3 w-3" />}
                          {statusInfo.icon === "alert-circle" && <AlertCircle className="mr-1 h-3 w-3" />}
                          {statusInfo.label}
                        </Badge>
                      </div>
                      <CardDescription>
                        {t('orderCard.time.range', { startTime: formatTime(order.orderStart), endTime: formatTime(order.orderEnd) })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">{t('orderCard.client.services')}</p>
                            <ul className="text-xs text-muted-foreground">
                              {order.items.map((item, index) => (
                                <li key={index}>{item.serviceName} - {t('orderCard.service.price', { price: item.servicePrice })}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" onClick={() => onDetails(order)}>
                        {t('orderCard.viewDetails')}
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })}
          </div>
        )}

        {!loading && data.length === 0 && (
          <div className="text-center py-10"><p className="text-muted-foreground">{t('empty')}</p></div>
        )}
      </TabsContent>
    </Tabs>
  )
}

export default OrdersGrid



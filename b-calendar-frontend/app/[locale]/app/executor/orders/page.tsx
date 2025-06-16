"use client"

import { useEffect, useState } from "react"
import { getMyOrders, getOrderStatusInfo } from "@/lib/api/executor-orders"
import type { Order } from "@/lib/api/orders"
import { formatDate, formatTime } from "@/lib/api/orders"
import { config } from "@/lib/config"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { CheckCircle, Clock, AlertCircle, MapPin, Phone, User, Calendar, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useTranslations } from 'next-intl'

export default function ExecutorOrdersPage() {
  const t = useTranslations('executor.orders')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders()
        setOrders(data)
      } catch (error) {
        console.error("Error fetching orders:", error)
        toast({
          title: t('errors.loadFailed.title'),
          description: t('errors.loadFailed.description'),
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [t])

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setDialogOpen(true)
  }

  // Group orders by status
  const completedOrders = orders.filter((order) => order.completed === true)
  const upcomingOrders = orders.filter((order) => {
    const orderDate = new Date(order.orderStart)
    return orderDate > new Date() && !order.completed
  })
  const pendingOrders = orders.filter((order) => !order.confirmed && !order.completed)

  // Calculate total price for an order
  const calculateTotal = (order: Order) => {
    return order.items.reduce((total, item) => total + item.servicePrice, 0)
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">{t('tabs.upcoming', { count: upcomingOrders.length })}</TabsTrigger>
          <TabsTrigger value="pending">{t('tabs.pending', { count: pendingOrders.length })}</TabsTrigger>
          <TabsTrigger value="completed">{t('tabs.completed', { count: completedOrders.length })}</TabsTrigger>
          <TabsTrigger value="all">{t('tabs.all', { count: orders.length })}</TabsTrigger>
        </TabsList>

        {["upcoming", "pending", "completed", "all"].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            {loading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <Skeleton className="h-5 w-32 mb-1" />
                        <Skeleton className="h-4 w-24" />
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Skeleton className="h-9 w-full" />
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {(tab === "upcoming"
                  ? upcomingOrders
                  : tab === "pending"
                    ? pendingOrders
                    : tab === "completed"
                      ? completedOrders
                      : orders
                )
                  .sort((a, b) => new Date(a.orderStart).getTime() - new Date(b.orderStart).getTime())
                  .map((order) => {
                    const statusInfo = getOrderStatusInfo(order)
                    return (
                      <Card key={order.publicId} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle>{formatDate(order.orderStart)}</CardTitle>
                            <Badge
                              variant="outline"
                              className={`bg-${statusInfo.color}-100 text-${statusInfo.color}-800 dark:bg-${statusInfo.color}-900/30 dark:text-${statusInfo.color}-400`}
                            >
                              {statusInfo.icon === "check-circle" && <CheckCircle className="mr-1 h-3 w-3" />}
                              {statusInfo.icon === "clock" && <Clock className="mr-1 h-3 w-3" />}
                              {statusInfo.icon === "activity" && <Clock className="mr-1 h-3 w-3" />}
                              {statusInfo.icon === "alert-circle" && <AlertCircle className="mr-1 h-3 w-3" />}
                              {statusInfo.label}
                            </Badge>
                          </div>
                          <CardDescription>
                            {t('orderCard.time.range', {
                              startTime: formatTime(order.orderStart),
                              endTime: formatTime(order.orderEnd)
                            })}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="space-y-2">
                            <div className="flex items-start gap-2">
                              <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <div>
                                <p className="text-sm font-medium">{order.clientName}</p>
                                <p className="text-xs text-muted-foreground">{order.clientPhone}</p>
                              </div>
                            </div>

                            <div className="flex items-start gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <div>
                                <p className="text-sm font-medium">{t('orderCard.client.services')}</p>
                                <ul className="text-xs text-muted-foreground">
                                  {order.items.map((item, index) => (
                                    <li key={index}>
                                      {item.serviceName} - {t('orderCard.service.price', { price: item.servicePrice })}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            {order.clientAddress && (
                              <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <p className="text-sm">{order.clientAddress}</p>
                              </div>
                            )}

                            <div className="flex items-start gap-2">
                              <p className="text-sm font-medium">
                                {t('orderCard.total')}: {calculateTotal(order)} BYN
                              </p>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" className="w-full" onClick={() => handleViewDetails(order)}>
                            {t('orderCard.viewDetails')}
                          </Button>
                        </CardFooter>
                      </Card>
                    )
                  })}
              </div>
            )}

            {!loading &&
              (tab === "upcoming"
                ? upcomingOrders.length === 0
                : tab === "pending"
                  ? pendingOrders.length === 0
                  : tab === "completed"
                    ? completedOrders.length === 0
                    : orders.length === 0) && (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">{t('empty')}</p>
                </div>
              )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Order Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle>{t('orderDetails.title')}</DialogTitle>
                <DialogDescription>{t('orderDetails.orderId', { id: selectedOrder.publicId })}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{t('orderDetails.sections.dateTime.title')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t('orderDetails.sections.dateTime.date', { date: formatDate(selectedOrder.orderStart) })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t('orderDetails.sections.dateTime.time', {
                        startTime: formatTime(selectedOrder.orderStart),
                        endTime: formatTime(selectedOrder.orderEnd)
                      })}
                    </p>
                  </div>

                  {getOrderStatusInfo(selectedOrder).icon === "check-circle" ? (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      {t('orderDetails.sections.status.completed')}
                    </Badge>
                  ) : selectedOrder.confirmed ? (
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                      <Clock className="mr-1 h-3 w-3" />
                      {t('orderDetails.sections.status.confirmed')}
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                      <AlertCircle className="mr-1 h-3 w-3" />
                      {t('orderDetails.sections.status.pending')}
                    </Badge>
                  )}
                </div>

                <div>
                  <h4 className="font-medium">{t('orderDetails.sections.client.title')}</h4>
                  <div className="flex items-center gap-3 mt-2">
                    <Avatar>
                      <AvatarFallback>{selectedOrder.clientName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{selectedOrder.clientName}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {selectedOrder.clientPhone}
                      </p>
                    </div>
                  </div>
                  {selectedOrder.clientAddress && (
                    <div className="mt-2 text-sm flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span>{selectedOrder.clientAddress}</span>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-medium">{t('orderDetails.sections.services.title')}</h4>
                  <div className="mt-2 space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`${config.apiUrl}${item.executorImgPath}`} alt={item.executorName} />
                            <AvatarFallback>{item.executorName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{item.serviceName}</p>
                            <p className="text-xs text-muted-foreground">{item.executorName}</p>
                          </div>
                        </div>
                        <p className="text-sm font-medium">{t('orderCard.service.price', { price: item.servicePrice })}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedOrder.comment && (
                  <div>
                    <h4 className="font-medium">{t('orderDetails.sections.comments.title')}</h4>
                    <p className="text-sm mt-1">{selectedOrder.comment}</p>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2 border-t">
                  <h4 className="font-medium">{t('orderDetails.sections.total.title')}</h4>
                  <p className="text-lg font-bold">
                    {t('orderCard.total', { amount: calculateTotal(selectedOrder) })}
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

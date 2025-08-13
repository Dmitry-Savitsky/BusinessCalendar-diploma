"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar as CalendarIcon, Clock, User, Phone, Scissors, CheckCircle, AlertCircle, Activity } from "lucide-react"
import { formatDate, formatTime, calculateOrderTotal, type Order, getOrderStatusInfo } from "@/lib/api/orders"
import { useTranslations } from 'next-intl'

interface Props {
  orders: Order[]
  onClick: (order: Order) => void
}

export function OrdersList({ orders, onClick }: Props) {
  const t = useTranslations('orders')
  const renderStatus = (order: Order) => {
    const status = getOrderStatusInfo(order)
    const text = order.completed ? t('orderCard.status.completed') : order.confirmed ? t('orderCard.status.confirmed') : t('orderCard.status.pending')
    return (
      <Badge className={`
        ${status.color === "green" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : ""}
        ${status.color === "blue" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : ""}
        ${status.color === "yellow" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" : ""}
        ${status.color === "orange" ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" : ""}
      `}>
        {status.icon === "check-circle" && <CheckCircle className="mr-1 h-3 w-3" />}
        {status.icon === "clock" && <Clock className="mr-1 h-3 w-3" />}
        {status.icon === "alert-circle" && <AlertCircle className="mr-1 h-3 w-3" />}
        {status.icon === "activity" && <Activity className="mr-1 h-3 w-3" />}
        {text}
      </Badge>
    )
  }
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.publicId} className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => onClick(order)}>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{formatDate(order.orderStart)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{formatTime(order.orderStart)} - {formatTime(order.orderEnd)}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{order.clientName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{order.clientPhone}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-medium">
                  {order.items.length > 1 ? `${order.items[0].serviceName} +${order.items.length - 1} ${t('orderCard.more')}` : order.items[0]?.serviceName}
                </div>
                <div className="flex items-center gap-2">
                  <Scissors className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {order.items.length > 1 ? `${order.items[0].executorName} +${order.items.length - 1} ${t('orderCard.more')}` : order.items[0]?.executorName}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {renderStatus(order)}
                <div className="font-medium">{t('orderCard.total')}: {calculateOrderTotal(order)} BYN</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default OrdersList


"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTranslations } from 'next-intl'
import type { Order } from "@/lib/api/orders"
import { formatDate, formatTime } from "@/lib/api/orders"
import { getOrderStatusInfo } from "@/lib/api/executor-orders"
import { AlertCircle, CheckCircle, Clock, MapPin, Phone } from "lucide-react"
import { config } from "@/lib/config"

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
  order: Order | null
}

export function OrderDetailsDialog({ open, onOpenChange, order }: Props) {
  const t = useTranslations('executor.orders')
  if (!order) return null
  const status = getOrderStatusInfo(order)
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('orderDetails.title')}</DialogTitle>
          <DialogDescription>{t('orderDetails.orderId', { id: order.publicId })}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium">{t('orderDetails.sections.dateTime.title')}</h4>
              <p className="text-sm text-muted-foreground">{t('orderDetails.sections.dateTime.date', { date: formatDate(order.orderStart) })}</p>
              <p className="text-sm text-muted-foreground">{t('orderDetails.sections.dateTime.time', { startTime: formatTime(order.orderStart), endTime: formatTime(order.orderEnd) })}</p>
            </div>
            {status.icon === "check-circle" ? (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"><CheckCircle className="mr-1 h-3 w-3" />{t('orderDetails.sections.status.completed')}</Badge>
            ) : order.confirmed ? (
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"><Clock className="mr-1 h-3 w-3" />{t('orderDetails.sections.status.confirmed')}</Badge>
            ) : (
              <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"><AlertCircle className="mr-1 h-3 w-3" />{t('orderDetails.sections.status.pending')}</Badge>
            )}
          </div>

          <div>
            <h4 className="font-medium">{t('orderDetails.sections.client.title')}</h4>
            <div className="flex items-center gap-3 mt-2">
              <Avatar><AvatarFallback>{order.clientName.charAt(0)}</AvatarFallback></Avatar>
              <div>
                <p className="text-sm font-medium">{order.clientName}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3" /> {order.clientPhone}</p>
              </div>
            </div>
            {order.clientAddress && (<div className="mt-2 text-sm flex items-start gap-2"><MapPin className="h-4 w-4 text-muted-foreground mt-0.5" /><span>{order.clientAddress}</span></div>)}
          </div>

          <div>
            <h4 className="font-medium">{t('orderDetails.sections.services.title')}</h4>
            <div className="mt-2 space-y-2">
              {order.items.map((item, index) => (
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
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default OrderDetailsDialog



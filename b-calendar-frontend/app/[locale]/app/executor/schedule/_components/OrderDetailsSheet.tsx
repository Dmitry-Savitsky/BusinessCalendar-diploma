"use client"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar as CalendarIcon, Clock, User, Phone, MapPin, CheckCircle, Loader2 } from "lucide-react"
import { useTranslations } from 'next-intl'
import { formatDate, formatTime, calculateOrderTotal, type Order } from "@/lib/api/orders"
import { getOrderStatusInfo } from "@/lib/api/executor-orders"

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
  order: Order | null
  isCompleting: boolean
  onComplete: () => void
}

export default function OrderDetailsSheet({ open, onOpenChange, order, isCompleting, onComplete }: Props) {
  const t = useTranslations('executor.schedule')
  if (!order) return null
  const statusInfo = getOrderStatusInfo(order)
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{t('orderDetails.title')}</SheetTitle>
          <SheetDescription>{t('orderDetails.orderId', { id: order.publicId.substring(0, 8) })}...</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="flex justify-between items-center"><h3 className="text-lg font-medium">{t('orderDetails.sections.status')}</h3><Badge>{statusInfo.label}</Badge></div>
          <Separator />
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{t('orderDetails.sections.appointment.title')}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><p className="text-sm text-muted-foreground">{t('orderDetails.sections.appointment.date')}</p><div className="flex items-center gap-2"><CalendarIcon className="h-4 w-4 text-muted-foreground" /><p>{formatDate(order.orderStart)}</p></div></div>
              <div className="space-y-1"><p className="text-sm text-muted-foreground">{t('orderDetails.sections.appointment.time')}</p><div className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" /><p>{formatTime(order.orderStart)} - {formatTime(order.orderEnd)}</p></div></div>
            </div>
          </div>
          <Separator />
          <div className="space-y-4"><h3 className="text-lg font-medium">{t('orderDetails.sections.client.title')}</h3><div className="space-y-2"><div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" /><p className="font-medium">{order.clientName}</p></div><div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /><p>{order.clientPhone}</p></div>{order.clientAddress && (<div className="flex items-start gap-2"><MapPin className="h-4 w-4 text-muted-foreground mt-0.5" /><p>{order.clientAddress}</p></div>)}</div></div>
          <Separator />
          <div className="space-y-4"><h3 className="text-lg font-medium">{t('orderDetails.sections.services.title')}</h3><div className="space-y-4">{order.items.map((item, idx) => (<div key={idx} className="rounded-md border p-4"><div className="flex justify-between"><div className="space-y-1"><p className="font-medium">{item.serviceName}</p><div className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" /><p className="text-sm text-muted-foreground">{formatTime(item.start)}</p></div></div><p className="font-medium">{item.servicePrice} BYN</p></div></div>))}</div><div className="flex justify-between pt-2"><p className="font-medium">{t('orderDetails.sections.services.total')}</p><p className="font-bold">{calculateOrderTotal(order)} BYN</p></div></div>
          <Separator />
          {order.confirmed && !order.completed && (
            <Button onClick={onComplete} disabled={isCompleting} className="w-full">{isCompleting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('orderDetails.actions.complete.loading')}</>) : (<><CheckCircle className="mr-2 h-4 w-4" />{t('orderDetails.actions.complete.button')}</>)}</Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}




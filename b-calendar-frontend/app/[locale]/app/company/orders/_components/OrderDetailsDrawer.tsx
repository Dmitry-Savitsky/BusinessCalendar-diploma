"use client"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Calendar as CalendarIcon, Clock, User, Phone, MapPin, CheckCircle, Loader2, Trash2 } from "lucide-react"
import { useTranslations } from 'next-intl'
import { formatDate, formatTime, calculateOrderTotal, type Order, getOrderStatusInfo } from "@/lib/api/orders"

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
  order: Order | null
  isConfirming: boolean
  isCompleting: boolean
  isDeleting: boolean
  onConfirm: () => void
  onComplete: () => void
  onDelete: () => void
}

export function OrderDetailsDrawer({ open, onOpenChange, order, isConfirming, isCompleting, isDeleting, onConfirm, onComplete, onDelete }: Props) {
  const t = useTranslations('orders')
  if (!order) return null
  const statusInfo = getOrderStatusInfo(order)
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{t('details.title')}</SheetTitle>
          <SheetDescription>{t('details.orderId')}: {order.publicId.substring(0, 8)}...</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">{t('details.sections.status')}</h3>
            <Badge className={`bg-${statusInfo.color}-100 text-${statusInfo.color}-800 dark:bg-${statusInfo.color}-900/30 dark:text-${statusInfo.color}-400`}>
              {statusInfo.label}
            </Badge>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">{t('details.sections.appointment.title')}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{t('details.sections.appointment.date')}</p>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <p>{formatDate(order.orderStart)}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{t('details.sections.appointment.time')}</p>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <p>{formatTime(order.orderStart)} - {formatTime(order.orderEnd)}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">{t('details.sections.client.title')}</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" /><p className="font-medium">{order.clientName}</p></div>
              <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /><p>{order.clientPhone}</p></div>
              {order.clientAddress && (<div className="flex items-start gap-2"><MapPin className="h-4 w-4 text-muted-foreground mt-0.5" /><p>{order.clientAddress}</p></div>)}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">{t('details.sections.services.title')}</h3>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="rounded-md border p-4">
                  <div className="flex justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">{item.serviceName}</p>
                      <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" /><p className="text-sm text-muted-foreground">{formatTime(item.start)}</p></div>
                    </div>
                    <p className="font-medium">{item.servicePrice} BYN</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-2"><p className="font-medium">{t('details.sections.services.total')}</p><p className="font-bold">{calculateOrderTotal(order)} BYN</p></div>
          </div>

          {order.comment && (<><Separator /><div className="space-y-2"><h3 className="text-lg font-medium">{t('details.sections.comment')}</h3><p className="text-sm">{order.comment}</p></div></>)}

          <Separator />

          <div className="flex flex-wrap gap-2">
            {!order.confirmed && (
              <Button onClick={onConfirm} disabled={isConfirming} className="flex-1">
                {isConfirming ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('details.actions.confirm.confirming')}</>) : (<><CheckCircle className="mr-2 h-4 w-4" />{t('details.actions.confirm.button')}</>)}
              </Button>
            )}
            {order.confirmed && !order.completed && (
              <Button onClick={onComplete} disabled={isCompleting} className="flex-1">
                {isCompleting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('details.actions.complete.completing')}</>) : (<><CheckCircle className="mr-2 h-4 w-4" />{t('details.actions.complete.button')}</>)}
              </Button>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="flex-1"><Trash2 className="mr-2 h-4 w-4" />{t('details.actions.delete.button')}</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('details.actions.delete.title')}</AlertDialogTitle>
                  <AlertDialogDescription>{t('details.actions.delete.description')}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('details.actions.delete.cancel')}</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete} className="bg-red-500 hover:bg-red-600" disabled={isDeleting}>
                    {isDeleting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('details.actions.delete.deleting')}</>) : t('details.actions.delete.confirm')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default OrderDetailsDrawer


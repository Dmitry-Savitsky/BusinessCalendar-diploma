"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Calendar as CalendarIcon, Clock, Phone, User, CheckCircle, AlertCircle } from "lucide-react"
import { useTranslations } from 'next-intl'
import type { Order } from "@/lib/api/orders"

export default function ExecutorBookingsList({ bookings, loading }: { bookings: Order[]; loading: boolean }) {
  const t = useTranslations('executorDetails')
  if (loading) return (<div className="flex h-[200px] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>)
  if (bookings.length === 0) return (<div className="text-center py-8 text-muted-foreground">{t('bookings.empty')}</div>)
  return (
    <div className="space-y-4">
      {bookings.map((booking) => {
        const isUpcoming = new Date(booking.orderStart) > new Date()
        return (
          <div key={booking.publicId} className="rounded-md border p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2"><CalendarIcon className="h-4 w-4 text-muted-foreground" /><span className="font-medium">{new Date(booking.orderStart).toLocaleDateString()}</span></div>
                <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" /><span>{booking.items?.[0] ? `${new Date(booking.orderStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(booking.orderEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}</span></div>
              </div>
              <div className="space-y-2">
                <div className="font-medium">{t('bookings.details.client')}: {booking.clientName}</div>
                <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /><span>{booking.clientPhone}</span></div>
              </div>
              <div className="space-y-2">
                {booking.items.map((item) => (<div key={item.serviceGuid} className="text-sm"><div className="font-medium">{item.serviceName}</div><div className="text-muted-foreground">{item.servicePrice} BYN</div></div>))}
              </div>
              <div>
                {booking.completed === true ? (
                  <span className="flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400"><CheckCircle className="mr-1 h-3 w-3" />{t('bookings.status.completed')}</span>
                ) : isUpcoming ? (
                  <span className="flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"><Clock className="mr-1 h-3 w-3" />{t('bookings.status.upcoming')}</span>
                ) : (
                  <span className="flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"><AlertCircle className="mr-1 h-3 w-3" />{t('bookings.status.pending')}</span>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}




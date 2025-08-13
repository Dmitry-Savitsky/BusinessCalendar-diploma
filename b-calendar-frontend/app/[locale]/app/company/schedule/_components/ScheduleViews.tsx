"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { Calendar as CalendarIcon, Clock, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getOrderStatusInfo, type Order, calculateOrderTotal, formatDate, formatTime } from "@/lib/api/orders"
import type { Executor } from "@/lib/api/executor"
import { config } from "@/lib/config"
import { useTranslations } from 'next-intl'

export const TIMEZONE = "Europe/Minsk"

export function DayView({ executors, hours, ordersByExecutor, onOrderClick, getOrderCardStyle, getOrderCardColorClass, locale }: {
  executors: Executor[]
  hours: number[]
  ordersByExecutor: Record<string, Order[]>
  onOrderClick: (order: Order) => void
  getOrderCardStyle: (order: Order) => React.CSSProperties
  getOrderCardColorClass: (order: Order) => string
  locale: string
}) {
  return (
    <div className="flex relative">
      <div className="w-16 flex-shrink-0">
        {hours.map((hour) => (<div key={hour} className="h-20 border-b relative"><div className="absolute -top-2.5 left-0 text-xs text-muted-foreground">{hour}:00</div></div>))}
      </div>
      {executors.map((executor) => (
        <div key={executor.guid} className="flex-1 border-l relative">
          {hours.map((hour) => (<div key={hour} className="h-20 border-b"></div>))}
          {ordersByExecutor[executor.guid]?.map((order) => (
            <div key={order.publicId} className={cn("absolute left-1 right-1 rounded-md border p-2 overflow-hidden cursor-pointer transition-opacity hover:opacity-90 z-10", getOrderCardColorClass(order))} style={getOrderCardStyle(order)} onClick={() => onOrderClick(order)}>
              <div className="text-xs font-medium truncate">{formatTime(order.orderStart)} - {formatTime(order.orderEnd)}</div>
              <div className="font-medium truncate">{order.clientName}</div>
              <div className="text-xs truncate">{order.items.filter((i) => i.executorGuid === executor.guid).map((i) => i.serviceName).join(", ")}</div>
              <div className="text-xs text-muted-foreground truncate">{order.clientPhone}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export function WeekView({ executors, orders, weekDates, onOrderClick, getOrderCardColorClass, locale }: {
  executors: Executor[]
  orders: Order[]
  weekDates: Date[]
  onOrderClick: (order: Order) => void
  getOrderCardColorClass: (order: Order) => string
  locale: string
}) {
  return (
    <div className="grid" style={{ gridTemplateColumns: "auto repeat(7, 1fr)" }}>
      <div className="border-b border-r p-2"></div>
      {weekDates.map((date, index) => (
        <div key={index} className="border-b border-r p-2 text-center">
          <div className="font-medium">{date.toLocaleDateString(undefined, { weekday: 'short' })}</div>
          <div className="text-sm">{date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</div>
        </div>
      ))}
      {executors.map((executor) => (
        <React.Fragment key={executor.guid}>
          <div className="border-b border-r p-2 sticky left-0 bg-background">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full overflow-hidden bg-muted">
                {executor.imgPath ? (
                  <img src={`${config.apiUrl}${executor.imgPath}`} alt={executor.name} className="h-full w-full object-cover" />
                ) : (
                  <User className="h-full w-full p-1 text-muted-foreground" />
                )}
              </div>
              <div className="font-medium truncate">{executor.name}</div>
            </div>
          </div>
          {weekDates.map((date, dateIndex) => {
            const dayOrders = orders.filter((order) => {
              const orderDate = new Date(order.orderStart)
              return orderDate.toDateString() === date.toDateString() && order.items.some((item) => item.executorGuid === executor.guid)
            })
            return (
              <div key={dateIndex} className="border-b border-r p-1 min-h-[120px] relative">
                {dayOrders.map((order) => (
                  <div key={order.publicId} className={cn("mb-1 rounded-md border p-1 cursor-pointer transition-opacity hover:opacity-90 text-xs", getOrderCardColorClass(order))} onClick={() => onOrderClick(order)}>
                    <div className="font-medium truncate">{formatTime(order.orderStart)} - {formatTime(order.orderEnd)}</div>
                    <div className="truncate">{order.clientName}</div>
                    <div className="truncate">{order.items.filter((i) => i.executorGuid === executor.guid).map((i) => i.serviceName).join(", ")}</div>
                  </div>
                ))}
              </div>
            )
          })}
        </React.Fragment>
      ))}
    </div>
  )
}




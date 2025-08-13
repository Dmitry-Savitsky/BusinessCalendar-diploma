"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { Clock, User } from "lucide-react"
import type { Order } from "@/lib/api/orders"

export function DayView({ hours, orders, onOrderClick, getOrderCardStyle, getOrderCardColorClass }: {
  hours: number[]
  orders: Order[]
  onOrderClick: (order: Order) => void
  getOrderCardStyle: (order: Order) => React.CSSProperties
  getOrderCardColorClass: (order: Order) => string
}) {
  return (
    <div className="flex relative">
      <div className="w-16 flex-shrink-0">{hours.map((h) => (<div key={h} className="h-20 border-b relative"><div className="absolute -top-2.5 left-0 text-xs text-muted-foreground">{h}:00</div></div>))}</div>
      <div className="flex-1 border-l relative">
        {hours.map((h) => (<div key={h} className="h-20 border-b"></div>))}
        {orders.map((order) => (
          <div key={order.publicId} className={cn("absolute left-1 right-1 rounded-md border p-2 overflow-hidden cursor-pointer transition-opacity hover:opacity-90 z-10", getOrderCardColorClass(order))} style={getOrderCardStyle(order)} onClick={() => onOrderClick(order)}>
            <div className="text-xs font-medium truncate">{new Date(order.orderStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(order.orderEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            <div className="font-medium truncate">{order.clientName}</div>
            <div className="text-xs truncate">{order.items.map((i) => i.serviceName).join(', ')}</div>
            <div className="text-xs text-muted-foreground truncate">{order.clientPhone}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function WeekView({ weekDates, orders, onOrderClick, getOrderCardColorClass }: {
  weekDates: Date[]
  orders: Order[]
  onOrderClick: (order: Order) => void
  getOrderCardColorClass: (order: Order) => string
}) {
  return (
    <div className="grid" style={{ gridTemplateColumns: "auto repeat(7, 1fr)" }}>
      <div className="border-b border-r p-2"></div>
      {weekDates.map((date, idx) => (
        <div key={idx} className="border-b border-r p-2 text-center">
          <div className="font-medium">{date.toLocaleDateString(undefined, { weekday: 'short' })}</div>
          <div className="text-sm">{date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</div>
        </div>
      ))}
      <div className="border-b border-r p-2 sticky left-0 bg-background"><div className="font-medium">Services</div></div>
      {weekDates.map((date, i) => {
        const dayOrders = orders.filter((o) => new Date(o.orderStart).toDateString() === date.toDateString())
        return (
          <div key={i} className="border-b border-r p-1 min-h-[120px] relative">
            {dayOrders.map((order) => (
              <div key={order.publicId} className={cn("mb-1 rounded-md border p-1 cursor-pointer transition-opacity hover:opacity-90 text-xs", getOrderCardColorClass(order))} onClick={() => onOrderClick(order)}>
                <div className="font-medium truncate">{new Date(order.orderStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(order.orderEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                <div className="truncate">{order.clientName}</div>
                <div className="truncate">{order.items.map((i) => i.serviceName).join(', ')}</div>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}




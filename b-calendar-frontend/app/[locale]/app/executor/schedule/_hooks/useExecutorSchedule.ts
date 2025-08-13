"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { addDays, isSameDay, isWithinInterval, startOfDay, startOfWeek } from "date-fns"
import { useTranslations } from 'next-intl'
import { useToast } from "@/hooks/use-toast"
import { getMyExecutorInfo } from "@/lib/api/executor"
import { getMyOrders, getOrderStatusInfo } from "@/lib/api/executor-orders"
import type { Order } from "@/lib/api/orders"

export type ViewMode = "day" | "week"

export interface ExecutorScheduleState {
  loading: boolean
  selectedDate: Date
  executor: any
  orders: Order[]
  viewMode: ViewMode
  selectedOrder: Order | null
  isDrawerOpen: boolean
  isCompleting: boolean
}

export interface ExecutorScheduleApi {
  refresh: () => Promise<void>
  setViewMode: (m: ViewMode) => void
  prevDay: () => void
  nextDay: () => void
  today: () => void
  prevWeek: () => void
  nextWeek: () => void
  openOrder: (o: Order) => void
  closeDrawer: (open: boolean) => void
  complete: () => Promise<void>
}

export function useExecutorSchedule(): [ExecutorScheduleState, ExecutorScheduleApi] {
  const t = useTranslations('executor.schedule')
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [executor, setExecutor] = useState<any>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>("day")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const [executorData, ordersData] = await Promise.all([getMyExecutorInfo(), getMyOrders()])
      setExecutor(executorData)
      setOrders(ordersData)
    } catch {
      toast({ title: t('toast.loadError.title'), description: t('toast.loadError.description'), variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [t, toast])

  useEffect(() => { void refresh() }, [refresh])

  const prevDay = () => setSelectedDate((d) => addDays(d, -1))
  const nextDay = () => setSelectedDate((d) => addDays(d, 1))
  const today = () => setSelectedDate(new Date())
  const prevWeek = () => setSelectedDate((d) => addDays(d, -7))
  const nextWeek = () => setSelectedDate((d) => addDays(d, 7))

  const openOrder = (o: Order) => { setSelectedOrder(o); setIsDrawerOpen(true) }
  const closeDrawer = (open: boolean) => setIsDrawerOpen(open)

  const complete = async () => {
    if (!selectedOrder) return
    setIsCompleting(true)
    try {
      toast({ title: t('toast.completeSuccess.title'), description: t('toast.completeSuccess.description') })
      setOrders((os) => os.map((o) => o.publicId === selectedOrder.publicId ? { ...o, completed: true } : o))
      setSelectedOrder((o) => o ? { ...o, completed: true } : o)
    } catch {
      toast({ title: t('toast.completeError.title'), description: t('toast.completeError.description'), variant: 'destructive' })
    } finally { setIsCompleting(false) }
  }

  return [
    { loading, selectedDate, executor, orders, viewMode, selectedOrder, isDrawerOpen, isCompleting },
    { refresh, setViewMode, prevDay, nextDay, today, prevWeek, nextWeek, openOrder, closeDrawer, complete }
  ]
}

export const HOURS = Array.from({ length: 13 }, (_, i) => i + 8)

export function getWeekDates(date: Date) {
  const start = startOfWeek(date, { weekStartsOn: 1 })
  return Array.from({ length: 7 }, (_, i) => addDays(start, i))
}

export function filterOrders(orders: Order[], selectedDate: Date, viewMode: ViewMode, weekDates: Date[]) {
  if (viewMode === 'day') {
    return orders.filter((o) => isSameDay(new Date(o.orderStart), selectedDate))
  }
  const weekStart = startOfDay(weekDates[0])
  const weekEnd = new Date(weekDates[6]); weekEnd.setHours(23, 59, 59, 999)
  return orders.filter((o) => isWithinInterval(new Date(o.orderStart), { start: weekStart, end: weekEnd }))
}




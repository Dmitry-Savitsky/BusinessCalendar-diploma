"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { addDays, isSameDay, isWithinInterval, startOfDay, startOfWeek } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { useTranslations } from 'next-intl'
import { getExecutors, type Executor } from "@/lib/api/executor"
import { getAllOrders, type Order } from "@/lib/api/orders"

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8) // 8..20
const EXECUTORS_PER_PAGE = 4

export type ScheduleViewMode = "day" | "week"

export interface CompanyScheduleState {
  loading: boolean
  executors: Executor[]
  orders: Order[]
  selectedDate: Date
  viewMode: ScheduleViewMode
  currentPage: number
  selectedOrder: Order | null
  isDrawerOpen: boolean
}

export interface CompanyScheduleApi {
  refresh: () => Promise<void>
  setViewMode: (mode: ScheduleViewMode) => void
  setSelectedDate: (d: Date) => void
  prevDay: () => void
  nextDay: () => void
  today: () => void
  prevWeek: () => void
  nextWeek: () => void
  prevPage: () => void
  nextPage: () => void
  openOrder: (order: Order) => void
  closeDrawer: (open: boolean) => void
}

export function useCompanySchedule(): [CompanyScheduleState, CompanyScheduleApi, { HOURS: number[]; EXECUTORS_PER_PAGE: number }] {
  const t = useTranslations('schedule')
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [executors, setExecutors] = useState<Executor[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [viewMode, setViewMode] = useState<ScheduleViewMode>("day")
  const [currentPage, setCurrentPage] = useState(0)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const [executorsData, ordersData] = await Promise.all([getExecutors(), getAllOrders()])
      setExecutors(executorsData)
      setOrders(ordersData)
    } catch {
      toast({ title: "Error", description: t('toast.loadError'), variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }, [t, toast])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const prevDay = () => setSelectedDate((d) => addDays(d, -1))
  const nextDay = () => setSelectedDate((d) => addDays(d, 1))
  const today = () => setSelectedDate(new Date())
  const prevWeek = () => setSelectedDate((d) => addDays(d, -7))
  const nextWeek = () => setSelectedDate((d) => addDays(d, 7))

  const prevPage = () => setCurrentPage((p) => (p > 0 ? p - 1 : p))
  const nextPage = () => setCurrentPage((p) => p + 1)

  const openOrder = (order: Order) => { setSelectedOrder(order); setIsDrawerOpen(true) }
  const closeDrawer = (open: boolean) => setIsDrawerOpen(open)

  return [
    { loading, executors, orders, selectedDate, viewMode, currentPage, selectedOrder, isDrawerOpen },
    { refresh, setViewMode, setSelectedDate, prevDay, nextDay, today, prevWeek, nextWeek, prevPage, nextPage, openOrder, closeDrawer },
    { HOURS, EXECUTORS_PER_PAGE },
  ]
}

export function getWeekDates(date: Date) {
  const start = startOfWeek(date, { weekStartsOn: 1 })
  return Array.from({ length: 7 }, (_, i) => addDays(start, i))
}

export function filterOrdersByView(orders: Order[], selectedDate: Date, viewMode: ScheduleViewMode, weekDates: Date[]) {
  if (viewMode === "day") {
    return orders.filter((o) => isSameDay(new Date(o.orderStart), selectedDate))
  }
  const weekStart = startOfDay(weekDates[0])
  const weekEnd = new Date(weekDates[6])
  weekEnd.setHours(23, 59, 59, 999)
  return orders.filter((o) => isWithinInterval(new Date(o.orderStart), { start: weekStart, end: weekEnd }))
}




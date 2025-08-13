"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import type { DateRange } from "react-day-picker"
import {
  getAllOrders,
  getOrdersByDateRange,
  getOrdersForMonth,
  getOrdersForToday,
  getOrdersForWeek,
  processOrderStatistics,
  type Order,
} from "@/lib/api/orders"

export type DateFilter = "today" | "week" | "month" | "custom"

export interface CompanyDashboardState {
  loading: boolean
  orders: Order[]
  statistics: ReturnType<typeof processOrderStatistics> | null
  dateFilter: DateFilter
  dateRange: DateRange | undefined
}

export interface CompanyDashboardApi {
  setDateFilter: (filter: DateFilter) => void
  setDateRange: (range: DateRange | undefined) => void
  applyDateRange: () => Promise<void>
  refetch: () => Promise<void>
}

export function useCompanyDashboard(initialDateRange: DateRange | undefined): [CompanyDashboardState, CompanyDashboardApi] {
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [dateFilter, setDateFilter] = useState<DateFilter>("month")
  const [dateRange, setDateRange] = useState<DateRange | undefined>(initialDateRange)

  const statistics = useMemo(() => processOrderStatistics(orders), [orders])

  const fetchOrdersByFilter = useCallback(async (filter: DateFilter) => {
    setLoading(true)
    try {
      let ordersData: Order[]
      if (filter === "today") {
        ordersData = await getOrdersForToday()
      } else if (filter === "week") {
        ordersData = await getOrdersForWeek()
      } else if (filter === "month") {
        ordersData = await getOrdersForMonth()
      } else {
        if (dateRange?.from && dateRange?.to) {
          ordersData = await getOrdersByDateRange(dateRange.from, dateRange.to)
        } else {
          ordersData = await getAllOrders()
        }
      }
      setOrders(ordersData)
    } finally {
      setLoading(false)
    }
  }, [dateRange?.from, dateRange?.to])

  const applyDateRange = useCallback(async () => {
    if (dateRange?.from && dateRange?.to) {
      setDateFilter("custom")
      await fetchOrdersByFilter("custom")
    }
  }, [dateRange?.from, dateRange?.to, fetchOrdersByFilter])

  const refetch = useCallback(async () => {
    await fetchOrdersByFilter(dateFilter)
  }, [dateFilter, fetchOrdersByFilter])

  useEffect(() => {
    fetchOrdersByFilter(dateFilter)
  }, [dateFilter, fetchOrdersByFilter])

  return [
    { loading, orders, statistics, dateFilter, dateRange },
    { setDateFilter, setDateRange, applyDateRange, refetch },
  ]
}


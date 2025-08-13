"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { getMyOrders, calculateOrderStats } from "@/lib/api/executor-orders"
import type { Order } from "@/lib/api/orders"
import { getToken, parseToken } from "@/lib/auth"

export interface ExecutorDashboardState {
  loading: boolean
  orders: Order[]
  stats: ReturnType<typeof calculateOrderStats>
  executorName: string
}

export interface ExecutorDashboardApi {
  refetch: () => Promise<void>
}

const emptyStats = calculateOrderStats([])

export function useExecutorDashboard(): [ExecutorDashboardState, ExecutorDashboardApi] {
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [executorName, setExecutorName] = useState("Executor")

  const stats = useMemo(() => calculateOrderStats(orders), [orders])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const token = getToken()
      if (token) {
        const tokenData = parseToken(token)
        setExecutorName(tokenData?.name || "Executor")
        const ordersData = await getMyOrders()
        setOrders(ordersData)
      } else {
        setOrders([])
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return [
    { loading, orders, stats: stats ?? emptyStats, executorName },
    { refetch: fetchData },
  ]
}


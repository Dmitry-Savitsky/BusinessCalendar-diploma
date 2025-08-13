"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { getMyOrders, getOrderStatusInfo } from "@/lib/api/executor-orders"
import type { Order } from "@/lib/api/orders"

export type OrdersTab = "upcoming" | "pending" | "completed" | "all"

export interface ExecutorOrdersState {
  loading: boolean
  orders: Order[]
  selectedOrder: Order | null
  dialogOpen: boolean
  tab: OrdersTab
}

export interface ExecutorOrdersApi {
  refresh: () => Promise<void>
  openDetails: (order: Order) => void
  closeDetails: () => void
  setTab: (t: OrdersTab) => void
}

export function useExecutorOrders(): [ExecutorOrdersState, ExecutorOrdersApi] {
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [tab, setTab] = useState<OrdersTab>("upcoming")

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getMyOrders()
      setOrders(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const openDetails = useCallback((order: Order) => {
    setSelectedOrder(order)
    setDialogOpen(true)
  }, [])

  const closeDetails = useCallback(() => setDialogOpen(false), [])

  return [
    { loading, orders, selectedOrder, dialogOpen, tab },
    { refresh, openDetails, closeDetails, setTab },
  ]
}

export const statusInfo = getOrderStatusInfo



"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  confirmOrder,
  completeOrder,
  deleteOrder as deleteOrderApi,
  getAllOrders,
  getOrderStatusInfo,
  type Order,
} from "@/lib/api/orders"

export type StatusFilter = "all" | "pending" | "confirmed" | "completed"
export type DateFilter = "all" | "today" | "upcoming" | "thisWeek" | "past"

export interface UseCompanyOrdersState {
  loading: boolean
  orders: Order[]
  filteredOrders: Order[]
  searchQuery: string
  statusFilter: StatusFilter
  dateFilter: DateFilter
  selectedOrder: Order | null
  isDrawerOpen: boolean
  isConfirming: boolean
  isCompleting: boolean
  isDeleting: boolean
}

export interface UseCompanyOrdersApi {
  setSearchQuery: (q: string) => void
  setStatusFilter: (f: StatusFilter) => void
  setDateFilter: (f: DateFilter) => void
  refresh: () => Promise<void>
  openOrder: (order: Order) => void
  closeDrawer: () => void
  confirm: () => Promise<void>
  complete: () => Promise<void>
  deleteOrder: () => Promise<void>
}

export function useCompanyOrders(): [UseCompanyOrdersState, UseCompanyOrdersApi] {
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [dateFilter, setDateFilter] = useState<DateFilter>("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getAllOrders()
      setOrders(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const filteredOrders = useMemo(() => {
    let filtered = [...orders]
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter((order) =>
        order.clientName.toLowerCase().includes(q) ||
        order.clientPhone.toLowerCase().includes(q) ||
        order.items.some((i) => i.serviceName.toLowerCase().includes(q)) ||
        order.items.some((i) => i.executorName.toLowerCase().includes(q)),
      )
    }

    if (statusFilter !== "all") {
      if (statusFilter === "completed") filtered = filtered.filter((o) => o.completed === true)
      else if (statusFilter === "confirmed") filtered = filtered.filter((o) => o.confirmed === true && o.completed !== true)
      else if (statusFilter === "pending") filtered = filtered.filter((o) => o.confirmed !== true)
    }

    if (dateFilter !== "all") {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1)
      const nextWeek = new Date(today); nextWeek.setDate(nextWeek.getDate() + 7)
      if (dateFilter === "today") {
        filtered = filtered.filter((o) => {
          const d = new Date(o.orderStart)
          return d >= today && d < tomorrow
        })
      } else if (dateFilter === "upcoming") {
        filtered = filtered.filter((o) => new Date(o.orderStart) >= tomorrow)
      } else if (dateFilter === "thisWeek") {
        filtered = filtered.filter((o) => {
          const d = new Date(o.orderStart)
          return d >= today && d < nextWeek
        })
      } else if (dateFilter === "past") {
        filtered = filtered.filter((o) => new Date(o.orderStart) < today)
      }
    }

    filtered.sort((a, b) => new Date(b.orderStart).getTime() - new Date(a.orderStart).getTime())
    return filtered
  }, [orders, searchQuery, statusFilter, dateFilter])

  const openOrder = useCallback((order: Order) => {
    setSelectedOrder(order)
    setIsDrawerOpen(true)
  }, [])

  const closeDrawer = useCallback(() => setIsDrawerOpen(false), [])

  const confirm = useCallback(async () => {
    if (!selectedOrder) return
    setIsConfirming(true)
    try {
      await confirmOrder(selectedOrder.publicId)
      const updated = orders.map((o) => o.publicId === selectedOrder.publicId ? { ...o, confirmed: true } : o)
      setOrders(updated)
      setSelectedOrder({ ...selectedOrder, confirmed: true })
    } finally {
      setIsConfirming(false)
    }
  }, [orders, selectedOrder])

  const complete = useCallback(async () => {
    if (!selectedOrder) return
    setIsCompleting(true)
    try {
      await completeOrder(selectedOrder.publicId)
      const updated = orders.map((o) => o.publicId === selectedOrder.publicId ? { ...o, completed: true } : o)
      setOrders(updated)
      setSelectedOrder({ ...selectedOrder, completed: true })
    } finally {
      setIsCompleting(false)
    }
  }, [orders, selectedOrder])

  const deleteOrder = useCallback(async () => {
    if (!selectedOrder) return
    setIsDeleting(true)
    try {
      await deleteOrderApi(selectedOrder.publicId)
      const updated = orders.filter((o) => o.publicId !== selectedOrder.publicId)
      setOrders(updated)
      setSelectedOrder(null)
      setIsDrawerOpen(false)
    } finally {
      setIsDeleting(false)
    }
  }, [orders, selectedOrder])

  return [
    {
      loading,
      orders,
      filteredOrders,
      searchQuery,
      statusFilter,
      dateFilter,
      selectedOrder,
      isDrawerOpen,
      isConfirming,
      isCompleting,
      isDeleting,
    },
    {
      setSearchQuery,
      setStatusFilter,
      setDateFilter,
      refresh,
      openOrder,
      closeDrawer,
      confirm,
      complete,
      deleteOrder,
    },
  ]
}

export const orderStatusInfo = getOrderStatusInfo


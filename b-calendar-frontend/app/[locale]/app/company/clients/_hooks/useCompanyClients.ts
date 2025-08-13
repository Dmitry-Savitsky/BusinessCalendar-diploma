"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslations } from 'next-intl'
import { useToast } from "@/components/ui/use-toast"
import { getAllClients, type Client, processClientStatistics } from "@/lib/api/clients"
import { getAllOrders } from "@/lib/api/orders"

export interface CompanyClientsState {
  loading: boolean
  clients: Client[]
  orders: any[]
  statistics: ReturnType<typeof processClientStatistics> | null
  searchQuery: string
}

export interface CompanyClientsApi {
  refresh: () => Promise<void>
  setSearchQuery: (v: string) => void
}

export function useCompanyClients(): [CompanyClientsState, CompanyClientsApi] {
  const t = useTranslations('clients')
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [clients, setClients] = useState<Client[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [statistics, setStatistics] = useState<ReturnType<typeof processClientStatistics> | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const [ordersData, clientsData] = await Promise.all([getAllOrders(), getAllClients()])
      setOrders(ordersData)
      setClients(clientsData)
      setStatistics(processClientStatistics(ordersData))
    } catch (error) {
      toast({ title: "Error", description: t('errors.loadFailed'), variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }, [t, toast])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return [
    { loading, clients, orders, statistics, searchQuery },
    { refresh, setSearchQuery },
  ]
}



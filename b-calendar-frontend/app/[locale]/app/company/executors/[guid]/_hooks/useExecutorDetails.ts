"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useTranslations } from 'next-intl'
import { useParams } from "next/navigation"
import { getExecutorByGuid, type Executor } from "@/lib/api/executor"
import { getServices, type Service } from "@/lib/api/service"
import { getServicesForExecutor, assignExecutorToService, removeExecutorFromService, type ExecutorService } from "@/lib/api/executor-services"
import { getOrdersByExecutor, type Order } from "@/lib/api/orders"

export type ExecutorDetailsTab = "schedule" | "services" | "bookings"

export interface ExecutorDetailsState {
  loading: boolean
  executor: Executor | null
  activeTab: ExecutorDetailsTab
  // services
  executorServices: ExecutorService[]
  availableServices: Service[]
  servicesLoading: boolean
  isAddServiceDialogOpen: boolean
  selectedServiceId: string
  isSubmitting: boolean
  // bookings
  bookings: Order[]
  bookingsLoading: boolean
}

export interface ExecutorDetailsApi {
  setTab: (tab: ExecutorDetailsTab) => void
  openAddService: () => void
  closeAddService: () => void
  setSelectedServiceId: (id: string) => void
  assignSelectedService: () => Promise<void>
  removeService: (serviceId: string) => Promise<void>
  refreshServices: () => Promise<void>
  refreshBookings: () => Promise<void>
}

export function useExecutorDetails(): [ExecutorDetailsState, ExecutorDetailsApi] {
  const t = useTranslations('executorDetails')
  const { toast } = useToast()
  const params = useParams()
  const guid = params.guid as string

  const [loading, setLoading] = useState(true)
  const [executor, setExecutor] = useState<Executor | null>(null)
  const [activeTab, setActiveTab] = useState<ExecutorDetailsTab>("schedule")
  const [executorServices, setExecutorServices] = useState<ExecutorService[]>([])
  const [availableServices, setAvailableServices] = useState<Service[]>([])
  const [servicesLoading, setServicesLoading] = useState(true)
  const [isAddServiceDialogOpen, setIsAddServiceDialogOpen] = useState(false)
  const [selectedServiceId, setSelectedServiceId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookings, setBookings] = useState<Order[]>([])
  const [bookingsLoading, setBookingsLoading] = useState(true)

  const fetchExecutor = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getExecutorByGuid(guid)
      setExecutor(data)
    } catch {
      toast({ title: "Error", description: t('toast.loadError'), variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }, [guid, t, toast])

  const refreshServices = useCallback(async () => {
    setServicesLoading(true)
    try {
      const assignedData = await getServicesForExecutor(guid)
      setExecutorServices(assignedData)
      const allServices = await getServices()
      const assignedIds = assignedData.map((as) => as.servicePublicId)
      const available = allServices.filter((s) => !assignedIds.includes(s.publicId))
      setAvailableServices(available)
    } catch {
      toast({ title: "Error", description: t('toast.servicesLoadError'), variant: "destructive" })
    } finally {
      setServicesLoading(false)
    }
  }, [guid, t, toast])

  const refreshBookings = useCallback(async () => {
    setBookingsLoading(true)
    try {
      const data = await getOrdersByExecutor(guid)
      setBookings(data)
    } catch {
      toast({ title: "Error", description: t('toast.bookingsLoadError'), variant: "destructive" })
    } finally {
      setBookingsLoading(false)
    }
  }, [guid, t, toast])

  useEffect(() => {
    if (guid) void fetchExecutor()
  }, [guid, fetchExecutor])

  useEffect(() => {
    if (!guid) return
    if (activeTab === "services") void refreshServices()
    if (activeTab === "bookings") void refreshBookings()
  }, [guid, activeTab, refreshServices, refreshBookings])

  const assignSelectedService = async () => {
    if (!selectedServiceId) {
      toast({ title: "Error", description: t('toast.selectServiceError'), variant: "destructive" })
      return
    }
    setIsSubmitting(true)
    try {
      await assignExecutorToService(guid, selectedServiceId)
      toast({ title: "Success", description: t('toast.assignSuccess') })
      setSelectedServiceId("")
      setIsAddServiceDialogOpen(false)
      await refreshServices()
    } catch {
      toast({ title: "Error", description: t('toast.assignError'), variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const removeService = async (serviceId: string) => {
    try {
      await removeExecutorFromService(guid, serviceId)
      toast({ title: "Success", description: t('toast.removeSuccess') })
      await refreshServices()
    } catch {
      toast({ title: "Error", description: t('toast.removeError'), variant: "destructive" })
    }
  }

  return [
    {
      loading,
      executor,
      activeTab,
      executorServices,
      availableServices,
      servicesLoading,
      isAddServiceDialogOpen,
      selectedServiceId,
      isSubmitting,
      bookings,
      bookingsLoading,
    },
    {
      setTab: setActiveTab,
      openAddService: () => setIsAddServiceDialogOpen(true),
      closeAddService: () => setIsAddServiceDialogOpen(false),
      setSelectedServiceId,
      assignSelectedService,
      removeService,
      refreshServices,
      refreshBookings,
    },
  ]
}




"use client"

import { useCallback, useEffect, useState } from "react"
import { useTranslations } from 'next-intl'
import { useToast } from "@/hooks/use-toast"
import { getServiceById, type Service, getServiceTypeName } from "@/lib/api/service"
import { getExecutors, type Executor } from "@/lib/api/executor"
import { getExecutorsForService, assignExecutorToService, removeExecutorFromService, type ExecutorService } from "@/lib/api/executor-services"
import { getOrdersByService, type Order } from "@/lib/api/orders"

export interface ServiceDetailsState {
  loading: boolean
  service: Service | null
  assignedExecutors: ExecutorService[]
  availableExecutors: Executor[]
  executorsLoading: boolean
  bookings: Order[]
  bookingsLoading: boolean
  isAssignDialogOpen: boolean
  selectedExecutorId: string
  isSubmitting: boolean
  activeTab: 'executors' | 'bookings'
}

export interface ServiceDetailsApi {
  setActiveTab: (v: 'executors' | 'bookings') => void
  refreshService: () => Promise<void>
  refreshExecutors: () => Promise<void>
  refreshBookings: () => Promise<void>
  openAssignDialog: (open: boolean) => void
  selectExecutor: (id: string) => void
  assign: () => Promise<void>
  remove: (executorId: string) => Promise<void>
}

export function useServiceDetails(publicId: string): [ServiceDetailsState, ServiceDetailsApi] {
  const t = useTranslations('services.details')
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [service, setService] = useState<Service | null>(null)
  const [assignedExecutors, setAssignedExecutors] = useState<ExecutorService[]>([])
  const [availableExecutors, setAvailableExecutors] = useState<Executor[]>([])
  const [executorsLoading, setExecutorsLoading] = useState(true)
  const [bookings, setBookings] = useState<Order[]>([])
  const [bookingsLoading, setBookingsLoading] = useState(true)
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [selectedExecutorId, setSelectedExecutorId] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState<'executors' | 'bookings'>('executors')

  const refreshService = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getServiceById(publicId)
      setService(data)
    } catch {
      toast({ title: 'Error', description: t('toast.loadError'), variant: 'destructive' })
    } finally { setLoading(false) }
  }, [publicId, t, toast])

  const refreshExecutors = useCallback(async () => {
    setExecutorsLoading(true)
    try {
      const assigned = await getExecutorsForService(publicId)
      setAssignedExecutors(assigned)
      const all = await getExecutors()
      const assignedIds = assigned.map((ae) => ae.executorPublicId)
      setAvailableExecutors(all.filter((e) => !assignedIds.includes(e.guid)))
    } catch {
      toast({ title: 'Error', description: t('toast.executorsLoadError'), variant: 'destructive' })
    } finally { setExecutorsLoading(false) }
  }, [publicId, t, toast])

  const refreshBookings = useCallback(async () => {
    setBookingsLoading(true)
    try {
      const data = await getOrdersByService(publicId)
      setBookings(data)
    } catch {
      toast({ title: 'Error', description: t('toast.bookingsLoadError'), variant: 'destructive' })
    } finally { setBookingsLoading(false) }
  }, [publicId, t, toast])

  useEffect(() => { void refreshService(); void refreshExecutors() }, [refreshService, refreshExecutors])
  useEffect(() => { if (activeTab === 'bookings') { void refreshBookings() } }, [activeTab, refreshBookings])

  const openAssignDialog = (open: boolean) => setIsAssignDialogOpen(open)
  const selectExecutor = (id: string) => setSelectedExecutorId(id)

  const assign = async () => {
    if (!selectedExecutorId) {
      toast({ title: 'Error', description: t('toast.selectExecutorError'), variant: 'destructive' })
      return
    }
    setIsSubmitting(true)
    try {
      await assignExecutorToService(selectedExecutorId, publicId)
      setSelectedExecutorId("")
      setIsAssignDialogOpen(false)
      await refreshExecutors()
      toast({ title: 'Success', description: t('toast.assignSuccess') })
    } catch {
      toast({ title: 'Error', description: t('toast.assignError'), variant: 'destructive' })
    } finally { setIsSubmitting(false) }
  }

  const remove = async (executorId: string) => {
    try {
      await removeExecutorFromService(executorId, publicId)
      await refreshExecutors()
      toast({ title: 'Success', description: t('toast.removeSuccess') })
    } catch {
      toast({ title: 'Error', description: t('toast.removeError'), variant: 'destructive' })
    }
  }

  return [
    { loading, service, assignedExecutors, availableExecutors, executorsLoading, bookings, bookingsLoading, isAssignDialogOpen, selectedExecutorId, isSubmitting, activeTab },
    { setActiveTab, refreshService, refreshExecutors, refreshBookings, openAssignDialog, selectExecutor, assign, remove }
  ]
}



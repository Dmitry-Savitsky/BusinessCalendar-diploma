"use client"

import { useCallback, useEffect, useState } from "react"
import { getServices, addService as apiAddService, updateService as apiUpdateService, deleteService as apiDeleteService, type Service } from "@/lib/api/service"

export interface NewServicePayload {
  serviceName: string
  serviceType: number
  servicePrice: number
  durationMinutes: number
  requiresAddress: boolean
}

export interface UpdateServicePayload extends NewServicePayload {}

export interface CompanyServicesState {
  loading: boolean
  services: Service[]
  selectedService: Service | null
}

export interface CompanyServicesApi {
  refresh: () => Promise<void>
  selectForEdit: (service: Service | null) => void
  addService: (payload: NewServicePayload) => Promise<void>
  updateService: (publicId: string, payload: UpdateServicePayload) => Promise<void>
  deleteService: (publicId: string) => Promise<void>
}

export function useCompanyServices(): [CompanyServicesState, CompanyServicesApi] {
  const [loading, setLoading] = useState(true)
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getServices()
      setServices(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const selectForEdit = (service: Service | null) => setSelectedService(service)

  const addService = async (payload: NewServicePayload) => {
    await apiAddService(payload)
    await refresh()
  }

  const updateService = async (publicId: string, payload: UpdateServicePayload) => {
    await apiUpdateService(publicId, payload)
    await refresh()
  }

  const deleteService = async (publicId: string) => {
    await apiDeleteService(publicId)
    await refresh()
  }

  return [
    { loading, services, selectedService },
    { refresh, selectForEdit, addService, updateService, deleteService },
  ]
}




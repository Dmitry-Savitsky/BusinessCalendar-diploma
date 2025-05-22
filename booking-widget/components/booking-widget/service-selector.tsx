"use client"

import React, { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { useBookingWidget } from "./context"
import { fetchServices, fetchServicesForExecutor } from "@/services/booking-api"
import type { Service, ExecutorService } from "@/types/booking"

interface ServiceSelectorProps {
  onBack: () => void
  onComplete: () => void
}

export default function ServiceSelector({ onBack, onComplete }: ServiceSelectorProps) {
  const { mode, companyGuid, selectedExecutor, setSelectedService } = useBookingWidget()
  const [services, setServices] = useState<Service[] | ExecutorService[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true)

        if (mode === "executor" && selectedExecutor) {
          // Fetch services for the selected executor
          const data = await fetchServicesForExecutor(companyGuid, selectedExecutor.guid)
          setServices(data)
        } else {
          // Fetch all services
          const data = await fetchServices(companyGuid)
          setServices(data)
        }

        setError(null)
      } catch (err) {
        setError("Failed to load services. Please try again.")
        console.error("Error loading services:", err)
      } finally {
        setLoading(false)
      }
    }

    loadServices()
  }, [companyGuid, mode, selectedExecutor])

  const handleSelectService = (service: Service | ExecutorService) => {
    if ("servicePublicId" in service) {
      // It's an ExecutorService
      setSelectedService({
        publicId: service.servicePublicId,
        serviceName: service.serviceName,
        serviceType: 1, // Default value since it's not provided in ExecutorService
        servicePrice: service.servicePrice,
        durationMinutes: service.durationMinutes,
        requiresAddress: false // Default value since it's not provided in ExecutorService
      })
    } else {
      // It's a Service
      setSelectedService(service)
    }
    onComplete()
  }

  if (loading) {
    return (
      <div className="tw-flex tw-justify-center tw-items-center tw-py-12">
        <Loader2 className="tw-h-8 tw-w-8 tw-animate-spin" />
        <span className="tw-ml-2">Loading services...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="tw-text-center tw-py-8">
        <p className="tw-text-red-500 tw-mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="tw-bg-white tw-border tw-border-gray-200 tw-rounded-md tw-px-4 tw-py-2 tw-text-sm tw-font-medium tw-shadow-sm hover:tw-bg-gray-50"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="tw-space-y-4">
      <h3 className="tw-text-lg tw-font-medium">Select a Service</h3>

      <div className="tw-space-y-3">
        {services.map((service) => {
          const serviceData = "publicId" in service ? {
            id: service.publicId,
            name: service.serviceName,
            price: service.servicePrice,
            duration: service.durationMinutes
          } : {
            id: service.servicePublicId,
            name: service.serviceName,
            price: service.servicePrice,
            duration: service.durationMinutes
          }

          return (
            <div
              key={serviceData.id}
              className="tw-border tw-rounded-md tw-p-4 tw-cursor-pointer tw-bg-white tw-shadow-sm hover:tw-shadow-md tw-transition-all"
              onClick={() => handleSelectService(service)}
            >
              <div className="tw-flex tw-justify-between tw-items-start">
                <div>
                  <h4 className="tw-text-base tw-font-medium">{serviceData.name}</h4>
                  <p className="tw-text-sm tw-text-gray-500">{serviceData.duration} minutes</p>
                </div>
                <span className="tw-font-medium">${(serviceData.price / 100).toFixed(2)}</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="tw-pt-4">
        <button
          onClick={onBack}
          className="tw-w-full tw-bg-white tw-border tw-border-gray-200 tw-rounded-md tw-px-4 tw-py-2 tw-text-sm tw-font-medium tw-shadow-sm hover:tw-bg-gray-50"
        >
          Back
        </button>
      </div>
    </div>
  )
}

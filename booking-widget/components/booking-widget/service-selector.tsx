"use client"

import React, { useEffect, useState } from "react"
import { Loader2, Clock, MapPin } from "lucide-react"
import { useBookingWidget } from "./context"
import { fetchServices, fetchServicesForExecutor } from "@/services/booking-api"
import type { Service, ExecutorService } from "@/types/booking"
import "../../styles/modules/ServiceSelector.module.css"

interface ServiceSelectorProps {
  onBack: () => void
  onComplete: () => void
}

export default function ServiceSelector({ onBack, onComplete }: ServiceSelectorProps) {
  const { mode, companyGuid, selectedExecutor, setSelectedService, selectedService } = useBookingWidget()
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(price)
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
          className="booking-widget-service-selector__back-button"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="booking-widget-service-selector">
      <h3 className="booking-widget-service-selector__title">Select a Service</h3>
      <div className="booking-widget-service-selector__grid">
        {services.map((service) => {
          const isExecutorService = "servicePublicId" in service;
          const serviceId = isExecutorService ? service.servicePublicId : service.publicId;
          const serviceName = service.serviceName;
          const servicePrice = service.servicePrice;
          const durationMinutes = service.durationMinutes;
          const requiresAddress = !isExecutorService && "requiresAddress" in service && service.requiresAddress;

          return (
            <div
              key={serviceId}
              className={`booking-widget-service-selector__card ${
                selectedService?.publicId === serviceId ? "booking-widget-service-selector__card--selected" : ""
              }`}
              onClick={() => handleSelectService(service)}
            >
              <span className="booking-widget-service-selector__service-name">{serviceName}</span>
              <div className="booking-widget-service-selector__service-details">
                <span className="booking-widget-service-selector__service-detail">
                  <Clock className="tw-w-4 tw-h-4" />
                  {durationMinutes} min
                </span>
                {requiresAddress && (
                  <span className="booking-widget-service-selector__service-detail">
                    <MapPin className="tw-w-4 tw-h-4" />
                    At your place
                  </span>
                )}
              </div>
              <span className="booking-widget-service-selector__service-price">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                }).format(servicePrice)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  )
}

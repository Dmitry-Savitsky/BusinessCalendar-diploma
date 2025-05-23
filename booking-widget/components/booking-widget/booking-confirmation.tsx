"use client"

import React, { useState } from "react"
import { Loader2 } from "lucide-react"
import { useBookingWidget } from "./context"
import { createBooking } from "@/services/booking-api"
import { format } from "date-fns"
import "../../styles/modules/BookingConfirmation.module.css"

interface BookingConfirmationProps {
  onBack: () => void
  onComplete: () => void
}

export default function BookingConfirmation({ onBack, onComplete }: BookingConfirmationProps) {
  const {
    companyGuid,
    selectedService,
    selectedExecutor,
    selectedDate,
    selectedSlot,
    customerData,
    setBookingResponse,
  } = useBookingWidget()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConfirm = async () => {
    if (!selectedService || !selectedSlot || !customerData || !selectedDate) return

    try {
      setLoading(true)
      setError(null)

      const response = await createBooking({
        companyGuid,
        clientName: customerData.name,
        clientPhone: customerData.phone,
        clientAddress: null,
        notes: customerData.notes,
        items: [
          {
            serviceGuid: selectedService.publicId,
            executorGuid: selectedExecutor?.guid || null,
            start: selectedSlot.time,
            requiresAddress: false,
          },
        ],
      })

      setBookingResponse(response)
      onComplete()
    } catch (err) {
      console.error("Error creating booking:", err)
      setError("Failed to create booking. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="booking-widget-confirmation">
        <div className="booking-widget-confirmation__loading">
          <Loader2 className="tw-h-8 tw-w-8 tw-animate-spin" />
          <span className="tw-ml-2">Creating your booking...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="booking-widget-confirmation">
      <h3 className="booking-widget-confirmation__title">Confirm Your Booking</h3>

      {error && <div className="booking-widget-confirmation__error">{error}</div>}

      <div className="booking-widget-confirmation__content">
        <div className="booking-widget-confirmation__section">
          <span className="booking-widget-confirmation__section-title">Service</span>
          <span className="booking-widget-confirmation__section-content">
            {selectedService?.serviceName}
          </span>
          <span className="booking-widget-confirmation__price">
            {new Intl.NumberFormat("ru-RU", {
              style: "currency",
              currency: "RUB",
              minimumFractionDigits: 0,
            }).format(selectedService?.servicePrice || 0)}
          </span>
        </div>

        {selectedExecutor && (
          <div className="booking-widget-confirmation__section">
            <span className="booking-widget-confirmation__section-title">Specialist</span>
            <span className="booking-widget-confirmation__section-content">{selectedExecutor.name}</span>
          </div>
        )}

        <div className="booking-widget-confirmation__section">
          <span className="booking-widget-confirmation__section-title">Date & Time</span>
          <span className="booking-widget-confirmation__section-content">
            {selectedDate?.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}{" "}
            at {format(new Date(selectedSlot?.time || ""), "h:mm a")}
          </span>
        </div>

        <div className="booking-widget-confirmation__section">
          <span className="booking-widget-confirmation__section-title">Your Information</span>
          <span className="booking-widget-confirmation__section-content">{customerData?.name}</span>
          <span className="booking-widget-confirmation__section-content">{customerData?.phone}</span>
          {customerData?.notes && (
            <span className="booking-widget-confirmation__section-content">{customerData.notes}</span>
          )}
        </div>
      </div>

      <div className="booking-widget-confirmation__buttons">
        <button
          className="booking-widget-confirmation__submit"
          onClick={handleConfirm}
          disabled={loading}
        >
          Confirm Booking
        </button>
        <button className="booking-widget-confirmation__back" onClick={onBack} disabled={loading}>
          Back
        </button>
      </div>
    </div>
  )
}

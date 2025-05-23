"use client"

import React, { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { useBookingWidget } from "./context"
import { fetchTimeSlots } from "@/services/booking-api"
import { format } from "date-fns"
import type { TimeSlot } from "@/types/booking"
import "../../styles/modules/TimeSlotSelector.module.css"

interface TimeSlotSelectorProps {
  onBack: () => void
  onComplete: () => void
}

export default function TimeSlotSelector({ onBack, onComplete }: TimeSlotSelectorProps) {
  const { selectedDate, selectedService, selectedExecutor, setSelectedSlot, selectedSlot } = useBookingWidget()
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTimeSlots = async () => {
      if (!selectedDate || !selectedService) return

      try {
        setLoading(true)
        setError(null)

        const data = await fetchTimeSlots(
          selectedService.publicId,
          selectedExecutor?.guid || null,
          selectedDate
        )

        setTimeSlots(data)
      } catch (err) {
        setError("Failed to load time slots. Please try again.")
        console.error("Error loading time slots:", err)
      } finally {
        setLoading(false)
      }
    }

    loadTimeSlots()
  }, [selectedDate, selectedService, selectedExecutor])

  const handleTimeSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot)
    onComplete()
  }

  if (loading) {
    return (
      <div className="booking-widget-time-slot-selector">
        <div className="booking-widget-time-slot-selector__loading">
          <Loader2 className="tw-h-8 tw-w-8 tw-animate-spin" />
          <span className="tw-ml-2">Loading time slots...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="booking-widget-time-slot-selector">
        <div className="booking-widget-time-slot-selector__error">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="booking-widget-time-slot-selector__back-button"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="booking-widget-time-slot-selector">
      <h3 className="booking-widget-time-slot-selector__title">Select a Time</h3>
      {timeSlots.length > 0 ? (
        <div className="booking-widget-time-slot-selector__grid">
          {timeSlots.map((slot) => (
            <button
              key={slot.time}
              className={`booking-widget-time-slot-selector__slot ${
                !slot.available ? "booking-widget-time-slot-selector__slot--disabled" : ""
              } ${
                selectedSlot?.time === slot.time ? "booking-widget-time-slot-selector__slot--selected" : ""
              }`}
              onClick={() => slot.available && handleTimeSelect(slot)}
              disabled={!slot.available}
            >
              {format(new Date(slot.time), "h:mm a")}
            </button>
          ))}
        </div>
      ) : (
        <div className="booking-widget-time-slot-selector__no-slots">
          No available time slots for this date
        </div>
      )}
      <button className="booking-widget-time-slot-selector__back-button" onClick={onBack}>
        Back
      </button>
    </div>
  )
}

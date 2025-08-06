"use client"

import React, { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { useBookingWidget } from "./context"
import { fetchTimeSlots } from "@/services/booking-api"
import { format } from "date-fns"
import type { TimeSlot } from "@/types/booking"
//import "../../styles/modules/TimeSlotSelector.module.css"

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
        setError("Не удалось загрузить доступное время. Пожалуйста, попробуйте снова.")
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
          <span className="tw-ml-2">Загрузка доступного времени...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="booking-widget-time-slot-selector">
        <div className="booking-widget-time-slot-selector__error">{error}</div>
      </div>
    )
  }

  return (
    <div className="booking-widget-time-slot-selector">
      <h3 className="booking-widget-time-slot-selector__title">Выберите время</h3>
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
              {format(new Date(slot.time), "HH:mm")}
            </button>
          ))}
        </div>
      ) : (
        <div className="booking-widget-time-slot-selector__no-slots">
          На эту дату нет доступного времени
        </div>
      )}
    </div>
  )
}

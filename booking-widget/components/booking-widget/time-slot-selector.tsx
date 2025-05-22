"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useBookingWidget } from "./context"
import { fetchTimeSlots } from "@/services/booking-api"
import type { TimeSlot } from "@/types/booking"
import { Loader2 } from "lucide-react"

interface TimeSlotSelectorProps {
  onBack: () => void
  onComplete: () => void
}

export default function TimeSlotSelector({ onBack, onComplete }: TimeSlotSelectorProps) {
  const { selectedService, selectedExecutor, selectedDate, setSelectedSlot, anyExecutor } = useBookingWidget()

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTimeSlots = async () => {
      if (!selectedService || !selectedDate) return

      try {
        setLoading(true)

        // If anyExecutor is true, we need a valid executor
        if (anyExecutor && !selectedExecutor) {
          setError("Please select an executor or go back to select one")
          return
        }

        const executorGuid = selectedExecutor?.guid
        if (!executorGuid) {
          setError("An executor must be selected to view available time slots")
          return
        }

        const serviceGuid = selectedService.publicId

        console.log('Fetching time slots with params:', {
          serviceGuid,
          executorGuid,
          date: selectedDate.toISOString()
        })

        const data = await fetchTimeSlots(serviceGuid, executorGuid, selectedDate)
        console.log('Received time slots:', data)
        setTimeSlots(data)
        setError(null)
      } catch (err) {
        console.error("Error loading time slots:", err)
        setError("Failed to load available time slots. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadTimeSlots()
  }, [selectedService, selectedExecutor, selectedDate, anyExecutor])

  const handleSelectTimeSlot = (slot: TimeSlot) => {
    setSelectedSlot(slot)
    onComplete()
  }

  // Group time slots by hour for better display
  const groupedSlots: { [hour: string]: TimeSlot[] } = {}
  timeSlots.forEach((slot) => {
    const date = new Date(slot.time)
    const hour = date.getHours()
    const hourKey = `${hour}`

    if (!groupedSlots[hourKey]) {
      groupedSlots[hourKey] = []
    }

    groupedSlots[hourKey].push(slot)
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading available times...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  if (timeSlots.length === 0 || !timeSlots.some((slot) => slot.available)) {
    return (
      <div className="text-center py-8">
        <p className="mb-4">No available time slots for this date. Please select another date.</p>
        <Button onClick={onBack}>Select Another Date</Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Select a Time</h3>

      <p className="text-sm text-muted-foreground mb-4">
        {selectedDate?.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
      </p>

      <div className="space-y-4">
        {Object.entries(groupedSlots).map(([hour, slots]) => {
          const displayHour = Number.parseInt(hour)
          const amPm = displayHour >= 12 ? "PM" : "AM"
          const hour12 = displayHour % 12 || 12

          return (
            <div key={hour} className="space-y-2">
              <h4 className="text-sm font-medium">
                {hour12} {amPm}
              </h4>
              <div className="grid grid-cols-4 gap-2">
                {slots.map((slot) => {
                  const date = new Date(slot.time)
                  const minutes = date.getMinutes()
                  const timeDisplay = `${minutes === 0 ? "00" : minutes}`

                  return (
                    <Button
                      key={slot.time}
                      variant={slot.available ? "outline" : "ghost"}
                      className={`h-10 ${!slot.available ? "opacity-50 cursor-not-allowed" : "hover:bg-primary hover:text-primary-foreground"}`}
                      disabled={!slot.available}
                      onClick={() => slot.available && handleSelectTimeSlot(slot)}
                    >
                      {timeDisplay}
                    </Button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <div className="pt-4">
        <Button variant="outline" onClick={onBack} className="w-full">
          Back
        </Button>
      </div>
    </div>
  )
}

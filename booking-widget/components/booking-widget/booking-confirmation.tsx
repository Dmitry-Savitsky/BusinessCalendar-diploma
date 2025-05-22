"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { useBookingWidget } from "./context"
import { CheckCircle } from "lucide-react"

interface BookingConfirmationProps {
  onNewBooking: () => void
}

export default function BookingConfirmation({ onNewBooking }: BookingConfirmationProps) {
  const { bookingResponse, selectedService, selectedExecutor, selectedSlot, resetBooking } = useBookingWidget()

  if (!bookingResponse || !selectedService || !selectedSlot) {
    return (
      <div className="text-center py-8">
        <p className="mb-4">Booking information is missing. Please try again.</p>
        <Button onClick={() => resetBooking()}>Start Over</Button>
      </div>
    )
  }

  const bookingDate = new Date(selectedSlot.time)
  const formattedDate = bookingDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  const formattedTime = bookingDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })

  const handleNewBooking = () => {
    resetBooking()
    onNewBooking()
  }

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <CheckCircle className="h-16 w-16 text-green-500" />
      </div>

      <h3 className="text-xl font-bold">Booking Confirmed!</h3>

      <p className="text-muted-foreground">
        Your booking reference: <span className="font-medium text-foreground">{bookingResponse.publicId}</span>
      </p>

      <div className="bg-muted p-4 rounded-md text-left">
        <h4 className="font-medium mb-2">Booking Details</h4>
        <ul className="space-y-2 text-sm">
          <li>
            <span className="font-medium">Service:</span> {selectedService.serviceName}
          </li>
          {selectedExecutor && (
            <li>
              <span className="font-medium">Staff:</span> {selectedExecutor.name}
            </li>
          )}
          <li>
            <span className="font-medium">Date:</span> {formattedDate}
          </li>
          <li>
            <span className="font-medium">Time:</span> {formattedTime}
          </li>
          <li>
            <span className="font-medium">Duration:</span> {selectedService.durationMinutes} minutes
          </li>
          <li>
            <span className="font-medium">Price:</span> ${(selectedService.servicePrice / 100).toFixed(2)}
          </li>
        </ul>
      </div>

      {bookingResponse.comment && (
        <div className="bg-muted p-4 rounded-md text-left">
          <h4 className="font-medium mb-2">Your Comments</h4>
          <p className="text-sm">{bookingResponse.comment}</p>
        </div>
      )}

      <div className="pt-4">
        <Button onClick={handleNewBooking} className="w-full">
          Book Another Appointment
        </Button>
      </div>
    </div>
  )
}

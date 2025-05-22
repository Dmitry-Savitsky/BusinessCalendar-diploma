"use client"

import React, { useEffect, useState } from "react"
import { useBookingWidget } from "./context"
import ModeSelector from "./mode-selector"
import ServiceSelector from "./service-selector"
import ExecutorSelector from "./executor-selector"
import DateSelector from "./date-selector"
import TimeSlotSelector from "./time-slot-selector"
import CustomerForm from "./customer-form"
import BookingConfirmation from "./booking-confirmation"

type BookingStep = "mode" | "service" | "executor" | "date" | "time" | "customer" | "confirmation"

export default function BookingWidgetContent() {
  const { mode, selectedService, selectedExecutor, selectedDate, selectedSlot, bookingResponse, anyExecutor } = useBookingWidget()
  const [currentStep, setCurrentStep] = useState<BookingStep>("mode")

  // Determine the current step based on the booking state
  const determineStep = (): BookingStep => {
    if (bookingResponse) return "confirmation"
    if (selectedSlot) return "customer"
    if (selectedDate && selectedService && (selectedExecutor || anyExecutor)) return "time"
    if ((mode === "service" && selectedExecutor) || (mode === "executor" && selectedService)) return "date"
    if (mode === "service" && selectedService) return "executor"
    if (mode === "executor" && selectedExecutor) return "service"
    if (mode) return mode === "service" ? "service" : "executor"
    return "mode"
  }

  // Update the step whenever the booking state changes
  useEffect(() => {
    setCurrentStep(determineStep())
  }, [mode, selectedService, selectedExecutor, selectedDate, selectedSlot, bookingResponse, anyExecutor])

  const handleBack = (step: BookingStep) => {
    // Reset any data after the step we're going back to
    switch (step) {
      case "mode":
        setCurrentStep("mode")
        break
      case "service":
        setCurrentStep("service")
        break
      case "executor":
        setCurrentStep("executor")
        break
      case "date":
        setCurrentStep("date")
        break
      case "time":
        setCurrentStep("time")
        break
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Book an Appointment</h2>

      {currentStep === "mode" && (
        <ModeSelector onComplete={() => setCurrentStep(mode === "service" ? "service" : "executor")} />
      )}

      {currentStep === "service" && (
        <ServiceSelector 
          onBack={() => handleBack("mode")} 
          onComplete={() => setCurrentStep("executor")} 
        />
      )}

      {currentStep === "executor" && (
        <ExecutorSelector
          onBack={() => handleBack(mode === "service" ? "service" : "mode")}
          onComplete={() => setCurrentStep(mode === "service" ? "date" : "service")}
        />
      )}

      {currentStep === "date" && (
        <DateSelector
          onBack={() => handleBack(mode === "service" ? "executor" : "service")}
          onComplete={() => setCurrentStep("time")}
        />
      )}

      {currentStep === "time" && (
        <TimeSlotSelector 
          onBack={() => handleBack("date")} 
          onComplete={() => setCurrentStep("customer")} 
        />
      )}

      {currentStep === "customer" && (
        <CustomerForm 
          onBack={() => handleBack("time")} 
          onComplete={() => setCurrentStep("confirmation")} 
        />
      )}

      {currentStep === "confirmation" && (
        <BookingConfirmation
          onNewBooking={() => {
            setCurrentStep("mode")
          }}
        />
      )}
    </div>
  )
}

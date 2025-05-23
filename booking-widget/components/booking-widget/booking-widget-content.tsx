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

type BookingStep = "mode" | "service" | "executor" | "date" | "time" | "customer" | "confirmation" | "success"

export default function BookingWidgetContent() {
  const { 
    mode, 
    selectedService, 
    selectedExecutor, 
    selectedDate, 
    selectedSlot, 
    bookingResponse, 
    anyExecutor,
    setSelectedService,
    setSelectedExecutor,
    setSelectedDate,
    setSelectedSlot,
    setAnyExecutor,
    resetBooking,
    setMode
  } = useBookingWidget()
  
  const [currentStep, setCurrentStep] = useState<BookingStep>("mode")

  // Determine the current step based on the booking state
  const determineStep = (): BookingStep => {
    if (bookingResponse) return "confirmation"
    if (selectedSlot) return "customer"
    if (selectedDate && selectedService && (selectedExecutor || anyExecutor)) return "time"
    if (selectedService && (selectedExecutor || anyExecutor)) return "date"
    if (mode === "service") {
      if (!selectedService) return "service"
      if (!selectedExecutor && !anyExecutor) return "executor"
    }
    if (mode === "executor") {
      if (!selectedExecutor) return "executor"
      if (!selectedService) return "service"
    }
    return "mode"
  }

  const handleBack = (step: BookingStep) => {
    // Reset any data after the step we're going back to
    switch (step) {
      case "mode":
        resetBooking()
        break
      case "service":
        if (mode === "service") {
          resetBooking()
          setMode("service")
        } else {
          setSelectedService(null)
          setSelectedDate(null)
          setSelectedSlot(null)
        }
        break
      case "executor":
        if (mode === "executor") {
          resetBooking()
          setMode("executor")
        } else {
          setSelectedExecutor(null)
          setSelectedDate(null)
          setSelectedSlot(null)
          setAnyExecutor(false)
        }
        break
      case "date":
        setSelectedDate(null)
        setSelectedSlot(null)
        break
      case "time":
        setSelectedSlot(null)
        break
    }
    setCurrentStep(step)
  }

  const handleStepComplete = (nextStep: BookingStep) => {
    setCurrentStep(nextStep)
  }

  // Determine the current step based on state
  useEffect(() => {
    const nextStep = determineStep()
    if (nextStep !== currentStep) {
      setCurrentStep(nextStep)
    }
  }, [mode, selectedService, selectedExecutor, selectedDate, selectedSlot, bookingResponse, anyExecutor])

  const containerStyle: React.CSSProperties = {
    padding: "1.5rem",
  }

  const titleStyle: React.CSSProperties = {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "1.5rem",
    textAlign: "center",
  }

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Book an Appointment</h2>

      {currentStep === "mode" && (
        <ModeSelector 
          onComplete={() => handleStepComplete(mode === "service" ? "service" : "executor")} 
        />
      )}

      {currentStep === "service" && (
        <ServiceSelector 
          onBack={() => handleBack(mode === "service" ? "mode" : "executor")} 
          onComplete={() => handleStepComplete(mode === "service" ? "executor" : "date")} 
        />
      )}

      {currentStep === "executor" && (
        <ExecutorSelector
          onBack={() => handleBack(mode === "service" ? "service" : "mode")}
          onComplete={() => handleStepComplete(mode === "service" ? "date" : "service")}
        />
      )}

      {currentStep === "date" && (
        <DateSelector
          onBack={() => handleBack(mode === "service" ? "executor" : "service")}
          onComplete={() => handleStepComplete("time")}
        />
      )}

      {currentStep === "time" && (
        <TimeSlotSelector 
          onBack={() => handleBack("date")} 
          onComplete={() => handleStepComplete("customer")} 
        />
      )}

      {currentStep === "customer" && (
        <CustomerForm 
          onBack={() => handleBack("time")} 
          onComplete={() => handleStepComplete("confirmation")} 
        />
      )}

      {currentStep === "confirmation" && (
        <BookingConfirmation
          onBack={() => handleBack("customer")}
          onComplete={() => handleStepComplete("success")}
        />
      )}
    </div>
  )
}

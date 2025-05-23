"use client"

import React, { createContext, useContext, useState, type ReactNode } from "react"
import type { Service, Executor, TimeSlot, CustomerFormData, BookingResponse } from "@/types/booking"

type BookingMode = "service" | "executor"

interface BookingState {
  mode: BookingMode
  companyGuid: string
  selectedService: Service | null
  selectedExecutor: Executor | null
  selectedDate: Date | null
  selectedSlot: TimeSlot | null
  customerData: CustomerFormData | null
  bookingResponse: BookingResponse | null
  anyExecutor: boolean
}

interface BookingContextType extends BookingState {
  setMode: (mode: BookingMode) => void
  setSelectedService: (service: Service | null) => void
  setSelectedExecutor: (executor: Executor | null) => void
  setSelectedDate: (date: Date | null) => void
  setSelectedSlot: (slot: TimeSlot | null) => void
  setCustomerData: (data: CustomerFormData | null) => void
  setBookingResponse: (response: BookingResponse | null) => void
  setAnyExecutor: (value: boolean) => void
  resetBooking: () => void
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

export function BookingWidgetProvider({
  children,
  companyGuid,
}: {
  children: ReactNode
  companyGuid: string
}) {
  const [mode, setMode] = useState<BookingMode>("service")
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedExecutor, setSelectedExecutor] = useState<Executor | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [customerData, setCustomerData] = useState<CustomerFormData | null>(null)
  const [bookingResponse, setBookingResponse] = useState<BookingResponse | null>(null)
  const [anyExecutor, setAnyExecutor] = useState(false)

  const resetBooking = () => {
    setMode("service")
    setSelectedService(null)
    setSelectedExecutor(null)
    setSelectedDate(null)
    setSelectedSlot(null)
    setCustomerData(null)
    setBookingResponse(null)
    setAnyExecutor(false)
  }

  return (
    <BookingContext.Provider
      value={{
        mode,
        companyGuid,
        selectedService,
        selectedExecutor,
        selectedDate,
        selectedSlot,
        customerData,
        bookingResponse,
        anyExecutor,
        setMode,
        setSelectedService,
        setSelectedExecutor,
        setSelectedDate,
        setSelectedSlot,
        setCustomerData,
        setBookingResponse,
        setAnyExecutor,
        resetBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  )
}

export function useBookingWidget() {
  const context = useContext(BookingContext)
  if (context === undefined) {
    throw new Error("useBookingWidget must be used within a BookingWidgetProvider")
  }
  return context
}

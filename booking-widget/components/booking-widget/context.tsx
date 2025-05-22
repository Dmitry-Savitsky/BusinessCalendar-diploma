"use client"

import React, { createContext, useContext, useState, type ReactNode } from "react"
import type { Service, Executor, TimeSlot, BookingResponse } from "@/types/booking"

type BookingMode = "service" | "executor"

interface BookingState {
  mode: BookingMode
  companyGuid: string
  selectedService: Service | null
  selectedExecutor: Executor | null
  selectedDate: Date | null
  selectedSlot: TimeSlot | null
  clientName: string
  clientPhone: string
  clientAddress: string
  comment: string
  bookingResponse: BookingResponse | null
  anyExecutor: boolean
}

interface BookingContextType extends BookingState {
  setMode: (mode: BookingMode) => void
  setSelectedService: (service: Service | null) => void
  setSelectedExecutor: (executor: Executor | null) => void
  setSelectedDate: (date: Date | null) => void
  setSelectedSlot: (slot: TimeSlot | null) => void
  setClientName: (name: string) => void
  setClientPhone: (phone: string) => void
  setClientAddress: (address: string) => void
  setComment: (comment: string) => void
  setBookingResponse: (response: BookingResponse | null) => void
  setAnyExecutor: (any: boolean) => void
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
  const [clientName, setClientName] = useState("")
  const [clientPhone, setClientPhone] = useState("")
  const [clientAddress, setClientAddress] = useState("")
  const [comment, setComment] = useState("")
  const [bookingResponse, setBookingResponse] = useState<BookingResponse | null>(null)
  const [anyExecutor, setAnyExecutor] = useState(false)

  const resetBooking = () => {
    setSelectedService(null)
    setSelectedExecutor(null)
    setSelectedDate(null)
    setSelectedSlot(null)
    setClientName("")
    setClientPhone("")
    setClientAddress("")
    setComment("")
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
        clientName,
        clientPhone,
        clientAddress,
        comment,
        bookingResponse,
        anyExecutor,
        setMode,
        setSelectedService,
        setSelectedExecutor,
        setSelectedDate,
        setSelectedSlot,
        setClientName,
        setClientPhone,
        setClientAddress,
        setComment,
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

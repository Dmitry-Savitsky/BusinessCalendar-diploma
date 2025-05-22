"use client"

import React, { useState } from "react"
import { useBookingWidget } from "./context"
import { createBooking } from "@/services/booking-api"
import { Loader2 } from "lucide-react"
import type { BookingRequest } from "@/types/booking"

interface CustomerFormProps {
  onBack: () => void
  onComplete: () => void
}

export default function CustomerForm({ onBack, onComplete }: CustomerFormProps) {
  const {
    companyGuid,
    selectedService,
    selectedExecutor,
    selectedSlot,
    clientName,
    setClientName,
    clientPhone,
    setClientPhone,
    clientAddress,
    setClientAddress,
    comment,
    setComment,
    setBookingResponse,
    anyExecutor,
  } = useBookingWidget()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<{
    name?: string
    phone?: string
    address?: string
  }>({})

  const validateForm = () => {
    const errors: {
      name?: string
      phone?: string
      address?: string
    } = {}

    if (!clientName.trim()) {
      errors.name = "Name is required"
    }

    if (!clientPhone.trim()) {
      errors.phone = "Phone number is required"
    } else if (!/^\+?[0-9\s\-()]+$/.test(clientPhone)) {
      errors.phone = "Please enter a valid phone number"
    }

    if (selectedService?.requiresAddress && !clientAddress.trim()) {
      errors.address = "Address is required for this service"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedService || !selectedSlot) return

    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)

      const bookingData: BookingRequest = {
        companyGuid,
        clientName,
        clientPhone,
        clientAddress: selectedService.requiresAddress ? clientAddress : null,
        comment,
        items: [
          {
            serviceGuid: selectedService.publicId,
            executorGuid: selectedExecutor?.guid || null,
            start: selectedSlot.time,
            requiresAddress: selectedService.requiresAddress
          }
        ]
      }

      const response = await createBooking(bookingData)
      setBookingResponse(response)
      onComplete()
    } catch (err) {
      console.error("Error creating booking:", err)
      setError("Failed to create booking. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="tw-space-y-4">
      <h3 className="tw-text-lg tw-font-medium">Your Information</h3>

      {error && <div className="tw-p-3 tw-bg-red-50 tw-text-red-500 tw-rounded-md tw-mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="tw-space-y-4">
        <div className="tw-space-y-2">
          <label htmlFor="name" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700">
            Name <span className="tw-text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Your full name"
            className={`tw-w-full tw-px-3 tw-py-2 tw-border tw-rounded-md tw-shadow-sm tw-focus:outline-none tw-focus:ring-2 tw-focus:ring-blue-500 ${
              validationErrors.name ? "tw-border-red-500" : "tw-border-gray-300"
            }`}
          />
          {validationErrors.name && <p className="tw-text-sm tw-text-red-500">{validationErrors.name}</p>}
        </div>

        <div className="tw-space-y-2">
          <label htmlFor="phone" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700">
            Phone <span className="tw-text-red-500">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
            placeholder="+1 (555) 123-4567"
            className={`tw-w-full tw-px-3 tw-py-2 tw-border tw-rounded-md tw-shadow-sm tw-focus:outline-none tw-focus:ring-2 tw-focus:ring-blue-500 ${
              validationErrors.phone ? "tw-border-red-500" : "tw-border-gray-300"
            }`}
          />
          {validationErrors.phone && <p className="tw-text-sm tw-text-red-500">{validationErrors.phone}</p>}
        </div>

        {selectedService?.requiresAddress && (
          <div className="tw-space-y-2">
            <label htmlFor="address" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700">
              Address <span className="tw-text-red-500">*</span>
            </label>
            <input
              id="address"
              type="text"
              value={clientAddress}
              onChange={(e) => setClientAddress(e.target.value)}
              placeholder="Your address"
              className={`tw-w-full tw-px-3 tw-py-2 tw-border tw-rounded-md tw-shadow-sm tw-focus:outline-none tw-focus:ring-2 tw-focus:ring-blue-500 ${
                validationErrors.address ? "tw-border-red-500" : "tw-border-gray-300"
              }`}
            />
            {validationErrors.address && <p className="tw-text-sm tw-text-red-500">{validationErrors.address}</p>}
          </div>
        )}

        <div className="tw-space-y-2">
          <label htmlFor="comment" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700">
            Comments (optional)
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Any special requests or notes"
            rows={3}
            className="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-md tw-shadow-sm tw-focus:outline-none tw-focus:ring-2 tw-focus:ring-blue-500"
          />
        </div>

        <div className="tw-pt-4 tw-space-y-2">
          <button
            type="submit"
            disabled={loading}
            className="tw-w-full tw-bg-blue-600 tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-font-medium tw-hover:bg-blue-700 tw-focus:outline-none tw-focus:ring-2 tw-focus:ring-blue-500 tw-focus:ring-offset-2 disabled:tw-opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="tw-mr-2 tw-h-4 tw-w-4 tw-animate-spin" />
                Booking...
              </>
            ) : (
              "Complete Booking"
            )}
          </button>

          <button
            type="button"
            onClick={onBack}
            disabled={loading}
            className="tw-w-full tw-bg-white tw-text-gray-700 tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-rounded-md tw-font-medium tw-hover:bg-gray-50 tw-focus:outline-none tw-focus:ring-2 tw-focus:ring-blue-500 tw-focus:ring-offset-2 disabled:tw-opacity-50"
          >
            Back
          </button>
        </div>
      </form>
    </div>
  )
}

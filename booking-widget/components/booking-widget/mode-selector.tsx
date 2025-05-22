"use client"

import React from "react"
import { CalendarDays, Users } from "lucide-react"
import { useBookingWidget } from "./context"

interface ModeSelectorProps {
  onComplete: () => void
}

export default function ModeSelector({ onComplete }: ModeSelectorProps) {
  const { setMode } = useBookingWidget()

  const handleSelectMode = (mode: "service" | "executor") => {
    setMode(mode)
    onComplete()
  }

  return (
    <div className="tw-space-y-4">
      <h3 className="tw-text-lg tw-font-medium tw-text-center tw-mb-4">How would you like to book?</h3>

      <div className="tw-grid tw-grid-cols-1 tw-gap-4">
        <div
          className="tw-border tw-rounded-md tw-p-4 tw-cursor-pointer tw-bg-white tw-shadow-sm hover:tw-shadow-md tw-transition-all"
          onClick={() => handleSelectMode("service")}
        >
          <div className="tw-flex tw-items-center tw-pb-2">
            <CalendarDays className="tw-mr-2 tw-h-5 tw-w-5" />
            <h4 className="tw-text-lg tw-font-medium">By Service</h4>
          </div>
          <p className="tw-text-sm tw-text-muted-foreground">
            Choose a service first, then select from available staff members
          </p>
        </div>

        <div
          className="tw-border tw-rounded-md tw-p-4 tw-cursor-pointer tw-bg-white tw-shadow-sm hover:tw-shadow-md tw-transition-all"
          onClick={() => handleSelectMode("executor")}
        >
          <div className="tw-flex tw-items-center tw-pb-2">
            <Users className="tw-mr-2 tw-h-5 tw-w-5" />
            <h4 className="tw-text-lg tw-font-medium">By Staff Member</h4>
          </div>
          <p className="tw-text-sm tw-text-muted-foreground">
            Choose your preferred staff member first, then select a service
          </p>
        </div>
      </div>
    </div>
  )
}

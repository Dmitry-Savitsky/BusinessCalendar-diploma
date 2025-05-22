"use client"

import React from "react"
import { useBookingWidget } from "./context"
import { format } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface DateSelectorProps {
  onBack: () => void
  onComplete: () => void
}

export default function DateSelector({ onBack, onComplete }: DateSelectorProps) {
  const { setSelectedDate } = useBookingWidget()
  const [currentMonth, setCurrentMonth] = React.useState(new Date())

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date)
    onComplete()
  }

  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfMonth = new Date(year, month, 1).getDay()
    const days: Date[] = []

    // Add previous month's days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push(new Date(year, month, -i))
    }

    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    // Add next month's days to complete the grid
    const remainingDays = 42 - days.length // 6 rows * 7 days = 42
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i))
    }

    return days
  }

  const days = getDaysInMonth(currentMonth)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <div className="tw-space-y-4">
      <h3 className="tw-text-lg tw-font-medium">Select a Date</h3>

      <div className="tw-border tw-rounded-md tw-p-4 tw-bg-white">
        <div className="tw-flex tw-items-center tw-justify-between tw-mb-4">
          <button
            onClick={handlePreviousMonth}
            className="tw-p-2 tw-rounded-md hover:tw-bg-gray-100"
          >
            <ChevronLeft className="tw-h-4 tw-w-4" />
          </button>
          <h4 className="tw-font-medium">{format(currentMonth, "MMMM yyyy")}</h4>
          <button
            onClick={handleNextMonth}
            className="tw-p-2 tw-rounded-md hover:tw-bg-gray-100"
          >
            <ChevronRight className="tw-h-4 tw-w-4" />
          </button>
        </div>

        <div className="tw-grid tw-grid-cols-7 tw-gap-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="tw-text-center tw-text-sm tw-font-medium tw-text-gray-500 tw-p-2">
              {day}
            </div>
          ))}

          {days.map((date, index) => {
            const isCurrentMonth = date.getMonth() === currentMonth.getMonth()
            const isToday = date.getTime() === today.getTime()
            const isPast = date < today
            const isDisabled = isPast || !isCurrentMonth

            return (
              <button
                key={index}
                onClick={() => !isDisabled && handleSelectDate(date)}
                disabled={isDisabled}
                className={`
                  tw-text-center tw-p-2 tw-rounded-md tw-text-sm
                  ${isDisabled ? "tw-text-gray-300 tw-cursor-not-allowed" : "tw-cursor-pointer hover:tw-bg-gray-100"}
                  ${isToday ? "tw-border-2 tw-border-blue-500" : ""}
                  ${!isCurrentMonth ? "tw-text-gray-300" : ""}
                `}
              >
                {date.getDate()}
              </button>
            )
          })}
        </div>
      </div>

      <div className="tw-pt-4">
        <button
          onClick={onBack}
          className="tw-w-full tw-bg-white tw-border tw-border-gray-200 tw-rounded-md tw-px-4 tw-py-2 tw-text-sm tw-font-medium tw-shadow-sm hover:tw-bg-gray-50"
        >
          Back
        </button>
      </div>
    </div>
  )
}

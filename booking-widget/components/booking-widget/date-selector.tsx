"use client"

import React from "react"
import { useBookingWidget } from "./context"
import { addDays, startOfToday, format } from "date-fns"

interface DateSelectorProps {
  onBack: () => void
  onComplete: () => void
}

export default function DateSelector({ onBack, onComplete }: DateSelectorProps) {
  const { selectedDate, setSelectedDate } = useBookingWidget()

  // Generate array of next 30 days
  const dates = Array.from({ length: 30 }, (_, i) => {
    return addDays(startOfToday(), i)
  })

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    onComplete()
  }

  const containerStyle: React.CSSProperties = {
    padding: "1rem",
    backgroundColor: "#ffffff",
  }

  const titleStyle: React.CSSProperties = {
    fontSize: "1.5rem",
    fontWeight: 600,
    marginBottom: "1.5rem",
    textAlign: "center",
    color: "#0f172a",
  }

  const datesContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    maxHeight: "400px",
    overflowY: "auto",
    marginBottom: "1.5rem",
    padding: "0.5rem",
    backgroundColor: "#ffffff",
  }

  const dateButtonStyle = (isSelected: boolean): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    width: "100%",
    padding: "0.75rem",
    backgroundColor: isSelected ? "#2563eb" : "#ffffff",
    border: `1px solid ${isSelected ? "#2563eb" : "#e2e8f0"}`,
    borderRadius: "0.375rem",
    color: isSelected ? "#ffffff" : "#1e293b",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s",
    textAlign: "left",
  })

  const backButtonStyle: React.CSSProperties = {
    display: "block",
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "0.375rem",
    color: "#1e293b",
    fontWeight: 500,
    textAlign: "center",
    transition: "all 0.2s",
    cursor: "pointer",
  }

  return (
    <div className="booking-widget-date-selector">
      <h3 className="booking-widget-date-selector__title">Select a Date</h3>
      <div className="booking-widget-date-selector__grid">
        {dates.map((date) => (
          <div
            key={date.toISOString()}
            className={`booking-widget-date-selector__card ${
              selectedDate?.toDateString() === date.toDateString()
                ? "booking-widget-date-selector__card--selected"
                : ""
            }`}
            onClick={() => handleDateSelect(date)}
          >
            <span className="booking-widget-date-selector__date">
              {date.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

"use client"

import React from "react"
import { useBookingWidget } from "./context"

interface ModeSelectorProps {
  onComplete: () => void
}

export default function ModeSelector({ onComplete }: ModeSelectorProps) {
  const { setMode, mode } = useBookingWidget()

  const handleModeSelect = (selectedMode: "service" | "executor") => {
    setMode(selectedMode)
    onComplete()
  }

  const containerStyle: React.CSSProperties = {
    padding: "1.5rem",
  }

  const titleStyle: React.CSSProperties = {
    fontSize: "1.25rem",
    fontWeight: 600,
    marginBottom: "1.5rem",
    color: "#0f172a",
  }

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "1rem",
    marginBottom: "1.5rem",
  }

  const cardStyle = (isSelected: boolean): React.CSSProperties => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "1.5rem",
    background: "#ffffff",
    border: `1px solid ${isSelected ? "#2563eb" : "#e2e8f0"}`,
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    backgroundColor: isSelected ? "rgba(37, 99, 235, 0.05)" : undefined,
  })

  const iconStyle: React.CSSProperties = {
    width: "2.5rem",
    height: "2.5rem",
    marginBottom: "1rem",
    color: "#64748b",
  }

  const nameStyle = (isSelected: boolean): React.CSSProperties => ({
    fontSize: "1rem",
    fontWeight: 500,
    color: mode === "service" ? "#ffffff" : "#0f172a",
    marginBottom: "0.5rem",
    textAlign: "center",
  })

  const descriptionStyle = (isSelected: boolean): React.CSSProperties => ({
    fontSize: "0.875rem",
    color: mode === "service" ? "#e2e8f0" : "#000000",
    textAlign: "center",
    lineHeight: 1.4,
  })

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>Как вы хотите записаться?</h3>
      <div style={gridStyle}>
        <button
          style={cardStyle(mode === "service")}
          onClick={() => handleModeSelect("service")}
        >
          <svg
            xmlns="https://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={iconStyle}
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <div style={nameStyle(mode === "service")}>Просмотреть все услуги</div>
          <div style={descriptionStyle(mode === "service")}>
            Выберите услугу, а специалиста подберем позже
          </div>
        </button>
        <button
          style={cardStyle(mode === "service")}
          onClick={() => handleModeSelect("executor")}
        >
          <svg
            xmlns="https://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={iconStyle}
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <div style={nameStyle(mode === "service")}>Выбрать специалиста</div>
          <div style={descriptionStyle(mode === "service")}>
            Выберите конкретного специалиста и его услуги
          </div>
        </button>
      </div>
    </div>
  )
}

import React from "react"
import { CheckCircle2 } from "lucide-react"
import "../../styles/modules/BookingSuccess.module.css"

export default function BookingSuccess() {
  return (
    <div className="booking-widget-success">
      <div className="booking-widget-success__content">
        <CheckCircle2 className="booking-widget-success__icon" />
        <h3 className="booking-widget-success__title">Бронирование создано</h3>
        <p className="booking-widget-success__message">ожидайте подтверждения</p>
      </div>
    </div>
  )
} 
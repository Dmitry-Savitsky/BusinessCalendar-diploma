"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { useBookingWidget } from "./context"
import { zodResolver } from "@hookform/resolvers/zod"
import { customerFormSchema } from "@/lib/validations/booking"
import type { CustomerFormData } from "@/types/booking"
import "../../styles/modules/CustomerForm.module.css"

interface CustomerFormProps {
  onBack: () => void
  onComplete: () => void
}

export default function CustomerForm({ onBack, onComplete }: CustomerFormProps) {
  const { setCustomerData } = useBookingWidget()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerFormSchema),
  })

  const onSubmit = async (data: CustomerFormData) => {
    setCustomerData(data)
    onComplete()
  }

  return (
    <div className="booking-widget-customer-form">
      <h3 className="booking-widget-customer-form__title">Your Information</h3>
      <form className="booking-widget-customer-form__form" onSubmit={handleSubmit(onSubmit)}>
        <div className="booking-widget-customer-form__field">
          <label className="booking-widget-customer-form__label" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            className={`booking-widget-customer-form__input ${
              errors.name ? "booking-widget-customer-form__input--error" : ""
            }`}
            {...register("name")}
          />
          {errors.name && (
            <span className="booking-widget-customer-form__error">{errors.name.message}</span>
          )}
        </div>

        <div className="booking-widget-customer-form__field">
          <label className="booking-widget-customer-form__label" htmlFor="phone">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            className={`booking-widget-customer-form__input ${
              errors.phone ? "booking-widget-customer-form__input--error" : ""
            }`}
            {...register("phone")}
          />
          {errors.phone && (
            <span className="booking-widget-customer-form__error">{errors.phone.message}</span>
          )}
        </div>

        <div className="booking-widget-customer-form__field">
          <label className="booking-widget-customer-form__label" htmlFor="notes">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            className={`booking-widget-customer-form__input booking-widget-customer-form__textarea ${
              errors.notes ? "booking-widget-customer-form__input--error" : ""
            }`}
            {...register("notes")}
          />
          {errors.notes && (
            <span className="booking-widget-customer-form__error">{errors.notes.message}</span>
          )}
        </div>

        <button
          type="submit"
          className="booking-widget-customer-form__submit"
          disabled={isSubmitting}
        >
          Continue
        </button>
      </form>
    </div>
  )
}

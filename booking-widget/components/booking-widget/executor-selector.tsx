"use client"

import React, { useState, useEffect } from "react"
import { Loader2, User } from "lucide-react"
import { useBookingWidget } from "./context"
import { fetchExecutors, fetchExecutorsForService } from "@/services/booking-api"
import type { Executor, ExecutorService } from "@/types/booking"
import "../../styles/modules/ExecutorSelector.module.css"

const API_BASE_URL = "http://localhost:5221/api"
const STATIC_BASE_URL = "http://localhost:5221"

export default function ExecutorSelector({ onBack, onComplete }: { onBack: () => void, onComplete: () => void }) {
  const { selectedExecutor, setSelectedExecutor, setAnyExecutor, companyGuid, mode, selectedService } = useBookingWidget()
  const [executors, setExecutors] = useState<(Executor | ExecutorService)[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({})

  const handleImageError = (executorId: string) => {
    setImageErrors(prev => ({ ...prev, [executorId]: true }))
  }

  useEffect(() => {
    const loadExecutors = async () => {
      try {
        setLoading(true)
        setError(null)

        let data
        if (mode === "service" && selectedService) {
          data = await fetchExecutorsForService(companyGuid, selectedService.publicId)
        } else {
          data = await fetchExecutors(companyGuid)
        }
        
        setExecutors(data)
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load executors")
        setLoading(false)
      }
    }

    loadExecutors()
  }, [companyGuid, mode, selectedService])

  const handleExecutorSelect = (executor: Executor | null) => {
    setSelectedExecutor(executor)
    setAnyExecutor(executor === null)
    onComplete()
  }

  if (loading) {
    return (
      <div className="tw-flex tw-justify-center tw-items-center tw-py-12">
        <Loader2 className="tw-h-8 tw-w-8 tw-animate-spin" />
        <span className="tw-ml-2">Loading staff members...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="tw-text-center tw-py-8">
        <p className="tw-text-red-500 tw-mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="booking-widget-executor-selector__back-button"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="booking-widget-executor-selector">
      <h3 className="booking-widget-executor-selector__title">Select a Specialist</h3>
      <div className="booking-widget-executor-selector__grid">
        <button
          className="booking-widget-executor-selector__card"
          onClick={() => handleExecutorSelect(null)}
        >
          <div className="booking-widget-executor-selector__name">Any Available Specialist</div>
          <div className="booking-widget-executor-selector__description">First available specialist will be assigned</div>
        </button>
        {executors.map((executor) => {
          if ("executorPublicId" in executor) {
            // Convert ExecutorService to Executor
            const executorData: Executor = {
              guid: executor.executorPublicId,
              name: executor.executorName,
              imgPath: executor.executorImgPath,
              phone: "",
              description: ""
            }
            return (
              <button
                key={executorData.guid}
                className={`booking-widget-executor-selector__card ${
                  selectedExecutor?.guid === executorData.guid ? "booking-widget-executor-selector__card--selected" : ""
                }`}
                onClick={() => handleExecutorSelect(executorData)}
              >
                <div className="booking-widget-executor-selector__image-container">
                  {imageErrors[executorData.guid] ? (
                    <div className="booking-widget-executor-selector__fallback-image">
                      <User className="tw-h-12 tw-w-12 tw-text-gray-400" />
                    </div>
                  ) : (
                    <img 
                      src={`${STATIC_BASE_URL}${executorData.imgPath}`} 
                      alt={executorData.name}
                      className="booking-widget-executor-selector__image"
                      onError={() => handleImageError(executorData.guid)}
                    />
                  )}
                </div>
                <div className="booking-widget-executor-selector__name">{executorData.name}</div>
              </button>
            )
          }
          
          return (
            <button
              key={executor.guid}
              className={`booking-widget-executor-selector__card ${
                selectedExecutor?.guid === executor.guid ? "booking-widget-executor-selector__card--selected" : ""
              }`}
              onClick={() => handleExecutorSelect(executor)}
            >
              <div className="booking-widget-executor-selector__image-container">
                {imageErrors[executor.guid] ? (
                  <div className="booking-widget-executor-selector__fallback-image">
                    <User className="tw-h-12 tw-w-12 tw-text-gray-400" />
                  </div>
                ) : (
                  <img 
                    src={`${STATIC_BASE_URL}${executor.imgPath}`} 
                    alt={executor.name}
                    className="booking-widget-executor-selector__image"
                    onError={() => handleImageError(executor.guid)}
                  />
                )}
              </div>
              <div className="booking-widget-executor-selector__name">{executor.name}</div>
              {executor.description && (
                <div className="booking-widget-executor-selector__description">{executor.description}</div>
              )}
            </button>
          )
        })}
      </div>
      <button className="booking-widget-executor-selector__back-button" onClick={onBack}>
        Back
      </button>
    </div>
  )
}

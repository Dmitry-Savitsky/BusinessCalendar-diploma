"use client"

import React, { useState, useEffect } from "react"
import { Loader2, User } from "lucide-react"
import { useBookingWidget } from "./context"
import { fetchExecutors, fetchExecutorsForService } from "@/services/booking-api"
import type { Executor, ExecutorService } from "@/types/booking"
//import "../../styles/modules/ExecutorSelector.module.css"
import { config } from '../../lib/config'

export default function ExecutorSelector({ onBack, onComplete }: { onBack: () => void, onComplete: () => void }) {
  const { selectedExecutor, setSelectedExecutor, anyExecutor, setAnyExecutor, companyGuid, mode, selectedService } = useBookingWidget()
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
        setError(err instanceof Error ? err.message : "Не удалось загрузить специалистов")
        setLoading(false)
      }
    }

    loadExecutors()
  }, [companyGuid, mode, selectedService])

  const handleExecutorSelect = (executor: Executor | ExecutorService) => {
    const isExecutorService = "executorPublicId" in executor;
    const executorData: Executor = isExecutorService ? {
      guid: executor.executorPublicId,
      name: executor.executorName,
      imgPath: executor.executorImgPath || "",
      phone: "",
      description: executor.executorDescription || "Доступен для этой услуги"
    } : executor;
    
    setSelectedExecutor(executorData)
    setAnyExecutor(false)
    onComplete()
  }

  const handleAnyExecutorSelect = () => {
    setSelectedExecutor(null)
    setAnyExecutor(true)
    onComplete()
  }

  if (loading) {
    return (
      <div className="tw-flex tw-justify-center tw-items-center tw-py-12">
        <Loader2 className="tw-h-8 tw-w-8 tw-animate-spin" />
        <span className="tw-ml-2">Загрузка специалистов...</span>
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
          Повторить
        </button>
      </div>
    )
  }

  return (
    <div className="booking-widget-executor-selector">
      <h3 className="booking-widget-executor-selector__title">Выберите специалиста</h3>
      <div className="booking-widget-executor-selector__grid">
        {executors.map((executor) => {
          const isExecutorService = "executorPublicId" in executor;
          const executorId = isExecutorService ? executor.executorPublicId : executor.guid;
          const executorName = isExecutorService ? executor.executorName : executor.name;
          const executorDescription = isExecutorService ? (executor.executorDescription || "Доступен для этой услуги") : executor.description;
          const imgPath = isExecutorService ? executor.executorImgPath : executor.imgPath;
          const fullImgPath = imgPath ? `${config.staticBaseUrl}${imgPath}` : "";

          return (
            <div
              key={executorId}
              className={`booking-widget-executor-selector__card ${
                selectedExecutor?.guid === executorId ? "booking-widget-executor-selector__card--selected" : ""
              }`}
              onClick={() => handleExecutorSelect(executor)}
            >
              <div className="booking-widget-executor-selector__image-container">
                {fullImgPath ? (
                  <img
                    src={fullImgPath}
                    alt={executorName}
                    className="booking-widget-executor-selector__image"
                    onError={() => handleImageError(executorId)}
                  />
                ) : (
                  <div className="booking-widget-executor-selector__fallback-image">
                    {executorName.charAt(0)}
                  </div>
                )}
              </div>
              <span className="booking-widget-executor-selector__name">{executorName}</span>
              {executorDescription && (
                <span className="booking-widget-executor-selector__description">{executorDescription}</span>
              )}
            </div>
          );
        })}
        <div
          className={`booking-widget-executor-selector__card ${
            anyExecutor ? "booking-widget-executor-selector__card--selected" : ""
          }`}
          onClick={handleAnyExecutorSelect}
        >
          <div className="booking-widget-executor-selector__image-container">
            <div className="booking-widget-executor-selector__fallback-image">?</div>
          </div>
          <span className="booking-widget-executor-selector__name">Любой доступный специалист</span>
          <span className="booking-widget-executor-selector__description">
            Мы подберем лучшего доступного специалиста для вас
          </span>
        </div>
      </div>
    </div>
  )
}

"use client"

import React, { useEffect, useState } from "react"
import { Loader2, User } from "lucide-react"
import { useBookingWidget } from "./context"
import { fetchExecutors, fetchExecutorsForService } from "@/services/booking-api"
import type { Executor, ExecutorService } from "@/types/booking"

const API_BASE_URL = "http://localhost:5221"

interface ExecutorSelectorProps {
  onBack: () => void
  onComplete: () => void
}

export default function ExecutorSelector({ onBack, onComplete }: ExecutorSelectorProps) {
  const { mode, companyGuid, selectedService, setSelectedExecutor, setAnyExecutor } = useBookingWidget()
  const [executors, setExecutors] = useState<Executor[] | ExecutorService[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadExecutors = async () => {
      try {
        setLoading(true)

        if (mode === "service" && selectedService) {
          // Fetch executors for the selected service
          const data = await fetchExecutorsForService(companyGuid, selectedService.publicId)
          setExecutors(data)
        } else if (mode === "executor") {
          // Fetch all executors
          const data = await fetchExecutors(companyGuid)
          setExecutors(data)
        }

        setError(null)
      } catch (err) {
        setError("Failed to load staff members. Please try again.")
        console.error("Error loading executors:", err)
      } finally {
        setLoading(false)
      }
    }

    loadExecutors()
  }, [companyGuid, mode, selectedService])

  const handleSelectExecutor = (executor: Executor | ExecutorService) => {
    if ("executorPublicId" in executor) {
      // It's an ExecutorService
      setSelectedExecutor({
        guid: executor.executorPublicId,
        name: executor.executorName,
        imgPath: executor.executorImgPath,
        phone: "",
        description: "",
      })
    } else {
      // It's an Executor
      setSelectedExecutor(executor)
    }
    setAnyExecutor(false)
    onComplete()
  }

  const handleSelectAny = () => {
    setSelectedExecutor(null)
    setAnyExecutor(true)
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
          className="tw-bg-white tw-border tw-border-gray-200 tw-rounded-md tw-px-4 tw-py-2 tw-text-sm tw-font-medium tw-shadow-sm hover:tw-bg-gray-50"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="tw-space-y-4">
      <h3 className="tw-text-lg tw-font-medium">Select a Staff Member</h3>

      {mode === "service" && (
        <button
          onClick={handleSelectAny}
          className="tw-w-full tw-bg-white tw-border tw-border-gray-200 tw-rounded-md tw-px-4 tw-py-2 tw-text-sm tw-font-medium tw-shadow-sm hover:tw-bg-gray-50 tw-mb-4 tw-flex tw-items-center tw-justify-center"
        >
          <User className="tw-mr-2 tw-h-4 tw-w-4" />
          <span>Any Available Staff Member</span>
        </button>
      )}

      <div className="tw-space-y-3">
        {executors.map((executor) => {
          const id = "guid" in executor ? executor.guid : executor.executorPublicId
          const name = "name" in executor ? executor.name : executor.executorName
          const imgPath = "imgPath" in executor ? executor.imgPath : executor.executorImgPath

          return (
            <div
              key={id}
              className="tw-border tw-rounded-md tw-p-4 tw-cursor-pointer tw-bg-white tw-shadow-sm hover:tw-shadow-md tw-transition-all"
              onClick={() => handleSelectExecutor(executor)}
            >
              <div className="tw-flex tw-items-center tw-pb-2">
                <div className="tw-h-10 tw-w-10 tw-rounded-full tw-bg-gray-200 tw-mr-3 tw-flex tw-items-center tw-justify-center tw-overflow-hidden">
                  {imgPath ? (
                    <img src={`${API_BASE_URL}${imgPath}`} alt={name} className="tw-h-full tw-w-full tw-object-cover" />
                  ) : (
                    <span className="tw-text-sm tw-font-medium">{name.substring(0, 2).toUpperCase()}</span>
                  )}
                </div>
                <h4 className="tw-text-base tw-font-medium">{name}</h4>
              </div>
              {"description" in executor && executor.description && (
                <p className="tw-text-sm tw-text-gray-500">{executor.description}</p>
              )}
              {"serviceName" in executor && (
                <div className="tw-flex tw-justify-between tw-mt-2">
                  <span className="tw-text-sm">{executor.serviceName}</span>
                  <span className="tw-font-medium">${(executor.servicePrice / 100).toFixed(2)}</span>
                </div>
              )}
            </div>
          )
        })}
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

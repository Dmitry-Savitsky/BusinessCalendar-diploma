"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslations } from 'next-intl'
import { useToast } from "@/hooks/use-toast"
import { type Executor, getExecutors, addExecutor as apiAddExecutor, updateExecutor as apiUpdateExecutor, deleteExecutor as apiDeleteExecutor } from "@/lib/api/executor"

export interface AddExecutorPayload {
  executorName: string
  executorPhone: string
  description: string
}

export interface EditExecutorPayload {
  name: string
  phone: string
  description: string
  image?: File | null
  existingImgPath?: string | null
}

export interface CompanyExecutorsState {
  loading: boolean
  executors: Executor[]
  isSubmitting: boolean
  selectedExecutor: Executor | null
}

export interface CompanyExecutorsApi {
  refresh: () => Promise<void>
  select: (executor: Executor | null) => void
  add: (payload: AddExecutorPayload) => Promise<void>
  edit: (guid: string, payload: EditExecutorPayload) => Promise<void>
  remove: (guid: string) => Promise<void>
}

export function useCompanyExecutors(): [CompanyExecutorsState, CompanyExecutorsApi] {
  const t = useTranslations('executors')
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [executors, setExecutors] = useState<Executor[]>([])
  const [selectedExecutor, setSelectedExecutor] = useState<Executor | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getExecutors()
      setExecutors(data)
    } catch (error) {
      toast({ title: "Error", description: t('toast.loadError'), variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }, [t, toast])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const add = async (payload: AddExecutorPayload) => {
    setIsSubmitting(true)
    try {
      await apiAddExecutor(payload)
      toast({ title: "Success", description: t('toast.addSuccess') })
      await refresh()
    } catch {
      toast({ title: "Error", description: t('toast.addError'), variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const edit = async (guid: string, payload: EditExecutorPayload) => {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("ExecutorName", payload.name)
      formData.append("ExecutorPhone", payload.phone)
      formData.append("Description", payload.description)
      if (payload.image) {
        formData.append("image", payload.image)
      } else if (payload.existingImgPath) {
        formData.append("ImgPath", payload.existingImgPath)
      }
      await apiUpdateExecutor(guid, formData)
      toast({ title: "Success", description: t('toast.updateSuccess') })
      await refresh()
    } catch {
      toast({ title: "Error", description: t('toast.updateError'), variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const remove = async (guid: string) => {
    try {
      await apiDeleteExecutor(guid)
      toast({ title: "Success", description: t('toast.deleteSuccess') })
      await refresh()
    } catch {
      toast({ title: "Error", description: t('toast.deleteError'), variant: "destructive" })
    }
  }

  const api: CompanyExecutorsApi = useMemo(() => ({
    refresh,
    select: setSelectedExecutor,
    add,
    edit,
    remove,
  }), [refresh])

  return [
    { loading, executors, isSubmitting, selectedExecutor },
    api,
  ]
}




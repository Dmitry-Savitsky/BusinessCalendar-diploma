"use client"

import { useCallback, useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useTranslations } from 'next-intl'
import { config } from "@/lib/config"
import { getToken, parseToken } from "@/lib/auth"

export interface ExecutorProfile {
  guid: string
  name: string
  phone: string
  description: string
  imgPath: string
}

export interface ExecutorWorkTime {
  dayNo: number
  isWorking: boolean
  fromTime: string
  tillTime: string
  breakStart: string
  breakEnd: string
}

export interface ExecutorServiceItem {
  executorPublicId: string
  executorName: string
  executorImgPath: string
  servicePublicId: string
  serviceName: string
  servicePrice: number
  durationMinutes: number
}

export interface ExecutorProfileState {
  loading: boolean
  profile: ExecutorProfile | null
  workTime: ExecutorWorkTime[]
  services: ExecutorServiceItem[]
}

export interface ExecutorProfileApi {
  refresh: () => Promise<void>
}

export function useExecutorProfile(): [ExecutorProfileState, ExecutorProfileApi] {
  const t = useTranslations('executor.profile')
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<ExecutorProfile | null>(null)
  const [workTime, setWorkTime] = useState<ExecutorWorkTime[]>([])
  const [services, setServices] = useState<ExecutorServiceItem[]>([])

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const token = getToken()
      if (!token) throw new Error('No token')

      const headers = { Authorization: `Bearer ${token}` }

      const [profileResp, workTimeResp] = await Promise.all([
        fetch(`${config.apiUrl}api/Executor/me`, { headers }),
        fetch(`${config.apiUrl}api/Executor/me/worktime`, { headers })
      ])

      if (!profileResp.ok) throw new Error('profile')
      if (!workTimeResp.ok) throw new Error('worktime')

      const profileData = await profileResp.json()
      setProfile(profileData)

      const workTimeData = await workTimeResp.json()
      const sortedWorkTime = [...workTimeData].sort((a: ExecutorWorkTime, b: ExecutorWorkTime) => a.dayNo - b.dayNo)
      setWorkTime(sortedWorkTime)

      const tokenData = parseToken(token)
      const executorGuid = tokenData?.ExecutorGuid
      if (executorGuid) {
        const servicesResp = await fetch(`${config.apiUrl}api/executor-services/executor/${executorGuid}`, { headers })
        if (!servicesResp.ok) throw new Error('services')
        const servicesData = await servicesResp.json()
        setServices(servicesData)
      } else {
        setServices([])
      }
    } catch (e) {
      toast({ title: t('errors.loadFailed.title'), description: t('errors.loadFailed.description'), variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [t, toast])

  useEffect(() => { void refresh() }, [refresh])

  return [
    { loading, profile, workTime, services },
    { refresh }
  ]
}



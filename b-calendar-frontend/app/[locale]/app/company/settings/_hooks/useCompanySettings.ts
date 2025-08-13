"use client"

import { useCallback, useEffect, useState } from "react"
import { useTranslations } from 'next-intl'
import { useToast } from "@/components/ui/use-toast"
import { getCompanyProfile, updateCompanyProfile, type Company, type UpdateCompanyData } from "@/lib/api/company"

export interface CompanySettingsState {
  loading: boolean
  company: Company | null
}

export interface CompanySettingsApi {
  refresh: () => Promise<void>
  update: (payload: UpdateCompanyData) => Promise<void>
}

export function useCompanySettings(): [CompanySettingsState, CompanySettingsApi] {
  const t = useTranslations('settings')
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [company, setCompany] = useState<Company | null>(null)

  const refresh = useCallback(async () => {
    try {
      const data = await getCompanyProfile()
      setCompany(data)
    } catch {
      toast({ variant: 'destructive', title: t('form.toast.loadError.title'), description: t('form.toast.loadError.description') })
    }
  }, [t, toast])

  useEffect(() => { void refresh() }, [refresh])

  const update = async (payload: UpdateCompanyData) => {
    try {
      setLoading(true)
      await updateCompanyProfile(payload)
      toast({ title: t('form.toast.updateSuccess.title'), description: t('form.toast.updateSuccess.description') })
      await refresh()
    } catch {
      toast({ variant: 'destructive', title: t('form.toast.updateError.title'), description: t('form.toast.updateError.description') })
    } finally {
      setLoading(false)
    }
  }

  return [ { loading, company }, { refresh, update } ]
}




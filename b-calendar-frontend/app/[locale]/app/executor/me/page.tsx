"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Clock, CalendarIcon, Briefcase } from "lucide-react"
import { useTranslations } from 'next-intl'
import { useExecutorProfile } from "./_hooks/useExecutorProfile"
import ProfileCard from "./_components/ProfileCard"
import WorkSchedule from "./_components/WorkSchedule"
import MyServicesGrid from "./_components/MyServicesGrid"

export default function ExecutorMePage() {
  const t = useTranslations('executor.profile')
  const [state] = useExecutorProfile()

  if (state.loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>
      </div>

      <Tabs defaultValue="about" className="space-y-4">
        <TabsList>
          <TabsTrigger value="about" className="flex items-center gap-2"><CalendarIcon className="h-4 w-4" />{t('tabs.about.title')}</TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2"><Clock className="h-4 w-4" />{t('tabs.schedule.title')}</TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-2"><Briefcase className="h-4 w-4" />{t('tabs.services.title')}</TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="space-y-4">
          {state.profile && <ProfileCard profile={state.profile} />}
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <WorkSchedule workTime={state.workTime} />
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <MyServicesGrid services={state.services} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock } from "lucide-react"
import { useTranslations } from 'next-intl'
import ExecutorSchedule from "@/components/executor-schedule"
import ExecutorProfileCard from "./_components/ExecutorProfileCard"
import ExecutorServicesManager from "./_components/ExecutorServicesManager"
import ExecutorBookingsList from "./_components/ExecutorBookingsList"
import { useExecutorDetails } from "./_hooks/useExecutorDetails"

export default function ExecutorDetailsPage() {
  const t = useTranslations('executorDetails')
  const router = useRouter()
  const [state, api] = useExecutorDetails()

  if (state.loading) {
    return (<div className="flex h-[400px] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent"></div></div>)
  }

  if (!state.executor) {
    return (
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <Button variant="outline" onClick={() => router.back()}>{t('navigation.back')}</Button>
        <Card className="flex h-[400px] flex-col items-center justify-center text-center"><div className="p-6"><h3 className="text-lg font-medium">{t('notFound.title')}</h3><p className="mt-2 text-sm text-muted-foreground">{t('notFound.description')}</p><Button className="mt-4" onClick={() => router.push("/app/company/executors")}>{t('navigation.viewAll')}</Button></div></Card>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center space-x-2">
        <Button variant="outline" onClick={() => router.back()}>{t('navigation.back')}</Button>
        <h2 className="text-3xl font-bold tracking-tight">{state.executor.name}</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-1"><ExecutorProfileCard executor={state.executor} /></div>
        <Card className="md:col-span-2">
          <Tabs defaultValue="schedule" onValueChange={(v) => api.setTab(v as any)}>
            <div className="flex items-center justify-between p-6 pb-0">
              <div className="text-xl font-semibold">{t('management.title')}</div>
              <TabsList>
                <TabsTrigger value="schedule"><Calendar className="mr-2 h-4 w-4" />{t('management.tabs.schedule.title')}</TabsTrigger>
                <TabsTrigger value="services">{t('management.tabs.services.title')}</TabsTrigger>
                <TabsTrigger value="bookings"><Clock className="mr-2 h-4 w-4" />{t('management.tabs.bookings.title')}</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="schedule" className="p-6 pt-4"><ExecutorSchedule executorGuid={state.executor.guid} /></TabsContent>
            <TabsContent value="services" className="p-6 pt-4">
              <ExecutorServicesManager
                executorName={state.executor.name}
                servicesLoading={state.servicesLoading}
                executorServices={state.executorServices}
                availableServices={state.availableServices}
                isAddOpen={state.isAddServiceDialogOpen}
                onOpenAdd={api.openAddService}
                onCloseAdd={api.closeAddService}
                selectedServiceId={state.selectedServiceId}
                onSelectServiceId={api.setSelectedServiceId}
                onAssign={api.assignSelectedService}
                onRemove={api.removeService}
                isSubmitting={state.isSubmitting}
              />
            </TabsContent>
            <TabsContent value="bookings" className="p-6 pt-4"><ExecutorBookingsList bookings={state.bookings} loading={state.bookingsLoading} /></TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}




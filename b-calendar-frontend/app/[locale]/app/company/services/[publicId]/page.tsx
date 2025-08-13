"use client"

import { useParams, useRouter } from "next/navigation"
import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, Users } from "lucide-react"
import { useServiceDetails } from "./_hooks/useServiceDetails"
import ServiceInfoCard from "./_components/ServiceInfoCard"
import ServiceStatsCard from "./_components/ServiceStatsCard"
import ExecutorsManager from "./_components/ExecutorsManager"
import BookingsList from "./_components/BookingsList"

export default function ServiceDetailsPage() {
  const t = useTranslations('services.details')
  const router = useRouter()
  const params = useParams()
  const publicId = params.publicId as string
  const [state, api] = useServiceDetails(publicId)

  if (state.loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent"></div>
      </div>
    )
  }

  if (!state.service) {
    return (
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('navigation.back')}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center space-x-2">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('navigation.back')}
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">{state.service.serviceName}</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ServiceInfoCard service={state.service} />
        <ServiceStatsCard service={state.service} bookings={state.bookings} />
      </div>

      <Tabs defaultValue="executors" onValueChange={(v) => api.setActiveTab(v as 'executors' | 'bookings')}>
        <TabsList>
          <TabsTrigger value="executors"><Users className="mr-2 h-4 w-4" />{t('tabs.executors.title')}</TabsTrigger>
          <TabsTrigger value="bookings"><Calendar className="mr-2 h-4 w-4" />{t('tabs.bookings.title')}</TabsTrigger>
        </TabsList>
        <TabsContent value="executors" className="space-y-4">
          <ExecutorsManager
            assignedExecutors={state.assignedExecutors}
            availableExecutors={state.availableExecutors}
            loading={state.executorsLoading}
            isAssignDialogOpen={state.isAssignDialogOpen}
            selectedExecutorId={state.selectedExecutorId}
            isSubmitting={state.isSubmitting}
            onOpenChange={api.openAssignDialog}
            onSelectExecutor={api.selectExecutor}
            onAssign={api.assign}
            onRemove={api.remove}
            serviceName={state.service.serviceName}
          />
        </TabsContent>
        <TabsContent value="bookings" className="space-y-4">
          <BookingsList bookings={state.bookings} loading={state.bookingsLoading} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

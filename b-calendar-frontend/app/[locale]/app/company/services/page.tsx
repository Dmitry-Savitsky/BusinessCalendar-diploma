"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Scissors } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useCompanyServices } from "./_hooks/useCompanyServices"
import ServiceCard from "./_components/ServiceCard"
import AddEditServiceDialog from "./_components/AddEditServiceDialog"

export default function ServicesPage() {
  const t = useTranslations('services')
  const router = useRouter()
  const [state, api] = useCompanyServices()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>
        <Button onClick={() => setIsAddOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t('actions.add.button')}
            </Button>
      </div>

      {state.loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array(6).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : state.services.length === 0 ? (
        <Card className="flex h-[400px] flex-col items-center justify-center text-center">
          <CardContent className="pt-6">
            <Scissors className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">{t('empty.title')}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t('empty.description')}</p>
            <Button className="mt-4" onClick={() => setIsAddOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t('actions.add.button')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {state.services.map((service) => (
            <ServiceCard
              key={service.publicId}
              service={service}
              onDetails={(id) => router.push(`/app/company/services/${id}`)}
              onEdit={(s) => { api.selectForEdit(s); setIsEditOpen(true) }}
              onDelete={api.deleteService}
            />
          ))}
        </div>
      )}

      <AddEditServiceDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSubmit={api.addService}
        initial={null}
        submitLabel={t('form.submit.create')}
        title={t('actions.add.title')}
        description={t('actions.add.description')}
      />

      <AddEditServiceDialog
        open={isEditOpen}
        onOpenChange={(v) => { setIsEditOpen(v); if (!v) api.selectForEdit(null) }}
        onSubmit={async (p) => { if (state.selectedService) await api.updateService(state.selectedService.publicId, p) }}
        initial={state.selectedService ? {
          serviceName: state.selectedService.serviceName,
          serviceType: state.selectedService.serviceType,
          servicePrice: state.selectedService.servicePrice,
          durationMinutes: state.selectedService.durationMinutes,
          requiresAddress: state.selectedService.requiresAddress,
        } : null}
        submitLabel={t('form.submit.update')}
        title={t('actions.edit.title')}
        description={t('actions.edit.description')}
      />
    </div>
  )
}

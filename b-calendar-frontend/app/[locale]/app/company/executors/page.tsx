"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, User } from "lucide-react"
import { useTranslations } from 'next-intl'
import ExecutorCard from "./_components/ExecutorCard"
import AddEditExecutorDialog from "./_components/AddEditExecutorDialog"
import { useCompanyExecutors } from "./_hooks/useCompanyExecutors"
import ExecutorSchedule from "@/components/executor-schedule"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

export default function ExecutorsPage() {
  const t = useTranslations('executors')
  const router = useRouter()
  const [state, api] = useCompanyExecutors()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>
        <Button onClick={() => setIsAddOpen(true)}><Plus className="mr-2 h-4 w-4" />{t('actions.add.button')}</Button>
      </div>

      {state.loading ? (
        <div className="flex h-[400px] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent"></div></div>
      ) : state.executors.length === 0 ? (
        <Card className="flex h-[400px] flex-col items-center justify-center text-center">
          <CardContent className="pt-6">
            <User className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">{t('empty.title')}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t('empty.description')}</p>
            <Button className="mt-4" onClick={() => setIsAddOpen(true)}><Plus className="mr-2 h-4 w-4" />{t('actions.add.button')}</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {state.executors.map((executor) => (
            <ExecutorCard
              key={executor.guid}
              executor={executor}
              onDetails={(guid) => router.push(`/app/company/executors/${guid}`)}
              onEdit={(ex) => { api.select(ex); setIsEditOpen(true) }}
              onSchedule={(ex) => { api.select(ex); setIsScheduleOpen(true) }}
              onDelete={(guid) => api.remove(guid)}
            />
          ))}
        </div>
      )}

      <AddEditExecutorDialog
        mode="add"
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSubmit={api.add}
        submitting={state.isSubmitting}
      />

      <AddEditExecutorDialog
        mode="edit"
        open={isEditOpen}
        onOpenChange={(v) => { setIsEditOpen(v); if (!v) api.select(null) }}
        onSubmit={(p) => { if (state.selectedExecutor) return api.edit(state.selectedExecutor.guid, p) }}
        submitting={state.isSubmitting}
        initial={state.selectedExecutor ? { name: state.selectedExecutor.name, phone: state.selectedExecutor.phone, description: state.selectedExecutor.description ?? '', imgPath: state.selectedExecutor.imgPath ?? null } : null}
      />

      <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t('actions.schedule.title')}</DialogTitle>
            <DialogDescription>{state.selectedExecutor ? t('actions.schedule.description', { name: state.selectedExecutor.name }) : ''}</DialogDescription>
          </DialogHeader>
          {state.selectedExecutor && <ExecutorSchedule executorGuid={state.selectedExecutor.guid} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Loader2, Plus, Scissors, Trash2 } from "lucide-react"
import { useTranslations } from 'next-intl'
import type { ExecutorService } from "@/lib/api/executor-services"
import type { Service } from "@/lib/api/service"

interface Props {
  executorName: string
  servicesLoading: boolean
  executorServices: ExecutorService[]
  availableServices: Service[]
  isAddOpen: boolean
  onOpenAdd: () => void
  onCloseAdd: () => void
  selectedServiceId: string
  onSelectServiceId: (v: string) => void
  onAssign: () => void
  onRemove: (serviceId: string) => void
  isSubmitting: boolean
}

export default function ExecutorServicesManager(props: Props) {
  const t = useTranslations('executorDetails')
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{t('services.title')}</h3>
        <Dialog open={props.isAddOpen} onOpenChange={(v) => (v ? props.onOpenAdd() : props.onCloseAdd())}>
          <DialogTrigger asChild>
            <Button disabled={props.availableServices.length === 0}><Plus className="mr-2 h-4 w-4" />{t('services.add.button')}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('services.add.title')}</DialogTitle>
              <DialogDescription>{t('services.add.description', { name: props.executorName })}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Select value={props.selectedServiceId} onValueChange={props.onSelectServiceId}>
                <SelectTrigger><SelectValue placeholder={t('services.add.placeholder')} /></SelectTrigger>
                <SelectContent>
                  {props.availableServices.map((service) => (
                    <SelectItem key={service.publicId} value={service.publicId}>{service.serviceName} - {service.servicePrice} BYN</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button onClick={props.onAssign} disabled={props.isSubmitting || !props.selectedServiceId}>
                {props.isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('services.add.submitting')}</>) : t('services.add.submit')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {props.servicesLoading ? (
        <div className="flex h-[200px] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      ) : props.executorServices.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Scissors className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">{t('services.empty.title')}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{t('services.empty.description')}</p>
          {props.availableServices.length > 0 ? (
            <Button className="mt-4" onClick={props.onOpenAdd}><Plus className="mr-2 h-4 w-4" />{t('services.add.button')}</Button>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">{t('services.empty.noAvailable')}</p>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {props.executorServices.map((service) => (
            <div key={service.servicePublicId} className="flex items-center justify-between rounded-md border p-4">
              <div className="space-y-1">
                <p className="font-medium">{service.serviceName}</p>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>{service.servicePrice} BYN</span>
                  <span>{t('services.service.duration', { minutes: service.durationMinutes })}</span>
                </div>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600"><Trash2 className="mr-2 h-4 w-4" />{t('services.remove.button')}</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('services.remove.title')}</AlertDialogTitle>
                    <AlertDialogDescription>{t('services.remove.description', { serviceName: service.serviceName, executorName: props.executorName })}</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('services.remove.cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={() => props.onRemove(service.servicePublicId)} className="bg-red-500 hover:bg-red-600">{t('services.remove.confirm')}</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}




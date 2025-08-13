"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { DollarSign, Clock, MapPin, Edit, Trash2, ExternalLink } from "lucide-react"
import { useTranslations } from 'next-intl'
import { getServiceTypeName, type Service } from "@/lib/api/service"

interface Props {
  service: Service
  onDetails: (publicId: string) => void
  onEdit: (service: Service) => void
  onDelete: (publicId: string) => void
}

export function ServiceCard({ service, onDetails, onEdit, onDelete }: Props) {
  const t = useTranslations('services')
  return (
    <Card>
      <CardHeader>
        <CardTitle>{service.serviceName}</CardTitle>
        <CardDescription>{getServiceTypeName(service.serviceType)}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center"><DollarSign className="mr-2 h-4 w-4 text-muted-foreground" /><span>{t('card.price')}</span></div>
            <span className="font-medium">{service.servicePrice} BYN</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center"><Clock className="mr-2 h-4 w-4 text-muted-foreground" /><span>{t('card.duration')}</span></div>
            <span className="font-medium">{t('form.duration.display', { minutes: service.durationMinutes })}</span>
          </div>
          {service.requiresAddress && (
            <div className="flex items-center mt-2"><MapPin className="mr-2 h-4 w-4 text-muted-foreground" /><span className="text-sm text-muted-foreground">{t('card.requiresAddress')}</span></div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => onDetails(service.publicId)}><ExternalLink className="mr-2 h-4 w-4" />{t('actions.details')}</Button>
        <Button variant="outline" size="sm" onClick={() => onEdit(service)}><Edit className="mr-2 h-4 w-4" />{t('actions.edit.button')}</Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600"><Trash2 className="mr-2 h-4 w-4" />{t('actions.delete.button')}</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('actions.delete.title')}</AlertDialogTitle>
              <AlertDialogDescription>{t('actions.delete.description', { name: service.serviceName })}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('actions.delete.cancel')}</AlertDialogCancel>
              <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={() => onDelete(service.publicId)}>{t('actions.delete.confirm')}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  )
}

export default ServiceCard




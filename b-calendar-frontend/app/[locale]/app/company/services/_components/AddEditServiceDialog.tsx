"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2, DollarSign, Clock } from "lucide-react"
import { useTranslations } from 'next-intl'

interface BaseProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  onSubmit: (payload: { serviceName: string; serviceType: number; servicePrice: number; durationMinutes: number; requiresAddress: boolean }) => Promise<void>
  initial?: { serviceName: string; serviceType: number; servicePrice: number; durationMinutes: number; requiresAddress: boolean } | null
  submitLabel: string
  title: string
  description: string
}

export function AddEditServiceDialog({ open, onOpenChange, onSubmit, initial, submitLabel, title, description }: BaseProps) {
  const t = useTranslations('services')
  const [serviceName, setServiceName] = useState("")
  const [serviceType, setServiceType] = useState<string>("1")
  const [servicePrice, setServicePrice] = useState("")
  const [durationMinutes, setDurationMinutes] = useState("")
  const [requiresAddress, setRequiresAddress] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setServiceName(initial?.serviceName || "")
      setServiceType((initial?.serviceType ?? 1).toString())
      setServicePrice(initial?.servicePrice?.toString() || "")
      setDurationMinutes(initial?.durationMinutes?.toString() || "")
      setRequiresAddress(initial?.requiresAddress || false)
    }
  }, [open, initial])

  const handleSubmit = async () => {
    if (!serviceName || !servicePrice || !durationMinutes) return
    setSubmitting(true)
    try {
      await onSubmit({
        serviceName,
        serviceType: Number.parseInt(serviceType),
        servicePrice: Number.parseFloat(servicePrice),
        durationMinutes: Number.parseInt(durationMinutes),
        requiresAddress,
      })
      onOpenChange(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">{t('form.name.label')}</Label>
            <Input id="name" placeholder={t('form.name.placeholder')} value={serviceName} onChange={(e) => setServiceName(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">{t('form.type.label')}</Label>
            <Select value={serviceType} onValueChange={setServiceType}>
              <SelectTrigger><SelectValue placeholder={t('form.type.placeholder')} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">{t('form.type.options.haircut')}</SelectItem>
                <SelectItem value="2">{t('form.type.options.styling')}</SelectItem>
                <SelectItem value="3">{t('form.type.options.coloring')}</SelectItem>
                <SelectItem value="4">{t('form.type.options.treatment')}</SelectItem>
                <SelectItem value="5">{t('form.type.options.consultation')}</SelectItem>
                <SelectItem value="6">{t('form.type.options.other')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="price">{t('form.price.label')}</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="price" type="number" placeholder={t('form.price.placeholder')} className="pl-10" value={servicePrice} onChange={(e) => setServicePrice(e.target.value)} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="duration">{t('form.duration.label')}</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="duration" type="number" placeholder={t('form.duration.placeholder')} className="pl-10" value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value)} />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="requires-address" checked={requiresAddress} onCheckedChange={setRequiresAddress} />
            <Label htmlFor="requires-address">{t('form.requiresAddress.label')}</Label>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={submitting}>
            {submitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('actions.add.creating')}</>) : submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddEditServiceDialog




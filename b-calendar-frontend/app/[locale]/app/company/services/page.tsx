"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import {
  type Service,
  getServices,
  addService,
  updateService,
  deleteService,
  getServiceTypeName,
} from "@/lib/api/service"
import { Clock, DollarSign, Edit, Trash2, Plus, Scissors, MapPin, Loader2, ExternalLink } from "lucide-react"

export default function ServicesPage() {
  const t = useTranslations('services')
  const { toast } = useToast()
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form states for new service
  const [newServiceName, setNewServiceName] = useState("")
  const [newServiceType, setNewServiceType] = useState<string>("1") // Default to type 1
  const [newServicePrice, setNewServicePrice] = useState("")
  const [newServiceDuration, setNewServiceDuration] = useState("")
  const [newServiceRequiresAddress, setNewServiceRequiresAddress] = useState(false)

  // Form states for edit service
  const [editServiceName, setEditServiceName] = useState("")
  const [editServiceType, setEditServiceType] = useState<string>("1")
  const [editServicePrice, setEditServicePrice] = useState("")
  const [editServiceDuration, setEditServiceDuration] = useState("")
  const [editServiceRequiresAddress, setEditServiceRequiresAddress] = useState(false)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    setLoading(true)
    try {
      const data = await getServices()
      setServices(data)
    } catch (error) {
      toast({
        title: "Error",
        description: t('toast.loadError'),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddService = async () => {
    // Validate form
    if (!newServiceName || !newServicePrice || !newServiceDuration) {
      toast({
        title: t('toast.validation.title'),
        description: t('toast.validation.description'),
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const serviceData = {
        serviceName: newServiceName,
        serviceType: Number.parseInt(newServiceType),
        servicePrice: Number.parseFloat(newServicePrice),
        durationMinutes: Number.parseInt(newServiceDuration),
        requiresAddress: newServiceRequiresAddress,
      }

      await addService(serviceData)

      toast({
        title: "Success",
        description: t('toast.addSuccess'),
      })

      // Reset form and close dialog
      resetAddForm()
      setIsAddDialogOpen(false)

      // Refresh services list
      fetchServices()
    } catch (error) {
      toast({
        title: "Error",
        description: t('toast.addError'),
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditService = async () => {
    if (!selectedService) return

    // Validate form
    if (!editServiceName || !editServicePrice || !editServiceDuration) {
      toast({
        title: t('toast.validation.title'),
        description: t('toast.validation.description'),
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const serviceData = {
        serviceName: editServiceName,
        serviceType: Number.parseInt(editServiceType),
        servicePrice: Number.parseFloat(editServicePrice),
        durationMinutes: Number.parseInt(editServiceDuration),
        requiresAddress: editServiceRequiresAddress,
      }

      await updateService(selectedService.publicId, serviceData)

      toast({
        title: "Success",
        description: t('toast.updateSuccess'),
      })

      // Reset form and close dialog
      resetEditForm()
      setIsEditDialogOpen(false)
      setSelectedService(null)

      // Refresh services list
      fetchServices()
    } catch (error) {
      toast({
        title: "Error",
        description: t('toast.updateError'),
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteService = async (publicId: string) => {
    try {
      await deleteService(publicId)

      toast({
        title: "Success",
        description: t('toast.deleteSuccess'),
      })

      // Refresh services list
      fetchServices()
    } catch (error) {
      toast({
        title: "Error",
        description: t('toast.deleteError'),
        variant: "destructive",
      })
    }
  }

  const handleEditClick = (service: Service) => {
    setSelectedService(service)
    setEditServiceName(service.serviceName)
    setEditServiceType(service.serviceType.toString())
    setEditServicePrice(service.servicePrice.toString())
    setEditServiceDuration(service.durationMinutes.toString())
    setEditServiceRequiresAddress(service.requiresAddress)
    setIsEditDialogOpen(true)
  }

  const handleViewDetails = (publicId: string) => {
    router.push(`/app/company/services/${publicId}`)
  }

  const resetAddForm = () => {
    setNewServiceName("")
    setNewServiceType("1")
    setNewServicePrice("")
    setNewServiceDuration("")
    setNewServiceRequiresAddress(false)
  }

  const resetEditForm = () => {
    setEditServiceName("")
    setEditServiceType("1")
    setEditServicePrice("")
    setEditServiceDuration("")
    setEditServiceRequiresAddress(false)
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t('actions.add.button')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('actions.add.title')}</DialogTitle>
              <DialogDescription>{t('actions.add.description')}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">{t('form.name.label')}</Label>
                <Input
                  id="name"
                  placeholder={t('form.name.placeholder')}
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">{t('form.type.label')}</Label>
                <Select value={newServiceType} onValueChange={setNewServiceType}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('form.type.placeholder')} />
                  </SelectTrigger>
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
                  <Input
                    id="price"
                    type="number"
                    placeholder={t('form.price.placeholder')}
                    className="pl-10"
                    value={newServicePrice}
                    onChange={(e) => setNewServicePrice(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="duration">{t('form.duration.label')}</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="duration"
                    type="number"
                    placeholder={t('form.duration.placeholder')}
                    className="pl-10"
                    value={newServiceDuration}
                    onChange={(e) => setNewServiceDuration(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="requires-address"
                  checked={newServiceRequiresAddress}
                  onCheckedChange={setNewServiceRequiresAddress}
                />
                <Label htmlFor="requires-address">{t('form.requiresAddress.label')}</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddService} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('actions.add.creating')}
                  </>
                ) : (
                  t('form.submit.create')
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex h-[400px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent"></div>
        </div>
      ) : services.length === 0 ? (
        <Card className="flex h-[400px] flex-col items-center justify-center text-center">
          <CardContent className="pt-6">
            <Scissors className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">{t('empty.title')}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {t('empty.description')}
            </p>
            <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t('actions.add.button')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.publicId}>
              <CardHeader>
                <CardTitle>{service.serviceName}</CardTitle>
                <CardDescription>{getServiceTypeName(service.serviceType)}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{t('card.price')}</span>
                    </div>
                    <span className="font-medium">{service.servicePrice} BYN</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{t('card.duration')}</span>
                    </div>
                    <span className="font-medium">{t('form.duration.display', { minutes: service.durationMinutes })}</span>
                  </div>
                  {service.requiresAddress && (
                    <div className="flex items-center mt-2">
                      <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{t('card.requiresAddress')}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => handleViewDetails(service.publicId)}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  {t('actions.details')}
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleEditClick(service)}>
                  <Edit className="mr-2 h-4 w-4" />
                  {t('actions.edit.button')}
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      {t('actions.delete.button')}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t('actions.delete.title')}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t('actions.delete.description', { name: service.serviceName })}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t('actions.delete.cancel')}</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteService(service.publicId)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        {t('actions.delete.confirm')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Service Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('actions.edit.title')}</DialogTitle>
            <DialogDescription>{t('actions.edit.description')}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">{t('form.name.label')}</Label>
              <Input
                id="edit-name"
                placeholder={t('form.name.placeholder')}
                value={editServiceName}
                onChange={(e) => setEditServiceName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-type">{t('form.type.label')}</Label>
              <Select value={editServiceType} onValueChange={setEditServiceType}>
                <SelectTrigger>
                  <SelectValue placeholder={t('form.type.placeholder')} />
                </SelectTrigger>
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
              <Label htmlFor="edit-price">{t('form.price.label')}</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="edit-price"
                  type="number"
                  placeholder={t('form.price.placeholder')}
                  className="pl-10"
                  value={editServicePrice}
                  onChange={(e) => setEditServicePrice(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-duration">{t('form.duration.label')}</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="edit-duration"
                  type="number"
                  placeholder={t('form.duration.placeholder')}
                  className="pl-10"
                  value={editServiceDuration}
                  onChange={(e) => setEditServiceDuration(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-requires-address"
                checked={editServiceRequiresAddress}
                onCheckedChange={setEditServiceRequiresAddress}
              />
              <Label htmlFor="edit-requires-address">{t('form.requiresAddress.label')}</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleEditService} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('actions.edit.updating')}
                </>
              ) : (
                t('form.submit.update')
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

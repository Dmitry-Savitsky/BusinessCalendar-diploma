"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
        description: "Failed to load services. Please try again.",
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
        title: "Validation Error",
        description: "Please fill in all required fields.",
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
        description: "Service added successfully",
      })

      // Reset form and close dialog
      resetAddForm()
      setIsAddDialogOpen(false)

      // Refresh services list
      fetchServices()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add service. Please try again.",
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
        title: "Validation Error",
        description: "Please fill in all required fields.",
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
        description: "Service updated successfully",
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
        description: "Failed to update service. Please try again.",
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
        description: "Service deleted successfully",
      })

      // Refresh services list
      fetchServices()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete service. Please try again.",
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
        <h2 className="text-3xl font-bold tracking-tight">Services</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
              <DialogDescription>Create a new service that clients can book.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Service Name</Label>
                <Input
                  id="name"
                  placeholder="Enter service name"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Service Type</Label>
                <Select value={newServiceType} onValueChange={setNewServiceType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Haircut</SelectItem>
                    <SelectItem value="2">Styling</SelectItem>
                    <SelectItem value="3">Coloring</SelectItem>
                    <SelectItem value="4">Treatment</SelectItem>
                    <SelectItem value="5">Consultation</SelectItem>
                    <SelectItem value="6">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="price"
                    type="number"
                    placeholder="Enter price"
                    className="pl-10"
                    value={newServicePrice}
                    onChange={(e) => setNewServicePrice(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="duration"
                    type="number"
                    placeholder="Enter duration in minutes"
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
                <Label htmlFor="requires-address">Requires client address (for on-site services)</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddService} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Service"
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
            <h3 className="mt-4 text-lg font-medium">No Services Found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              You haven't added any services yet. Add your first service to get started.
            </p>
            <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Service
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
                      <span>Price</span>
                    </div>
                    <span className="font-medium">${service.servicePrice.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Duration</span>
                    </div>
                    <span className="font-medium">{service.durationMinutes} minutes</span>
                  </div>
                  {service.requiresAddress && (
                    <div className="flex items-center mt-2">
                      <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Requires client address</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => handleViewDetails(service.publicId)}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Details
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleEditClick(service)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the service "{service.serviceName}". This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteService(service.publicId)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Delete
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
            <DialogTitle>Edit Service</DialogTitle>
            <DialogDescription>Update the service information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Service Name</Label>
              <Input
                id="edit-name"
                placeholder="Enter service name"
                value={editServiceName}
                onChange={(e) => setEditServiceName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-type">Service Type</Label>
              <Select value={editServiceType} onValueChange={setEditServiceType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Haircut</SelectItem>
                  <SelectItem value="2">Styling</SelectItem>
                  <SelectItem value="3">Coloring</SelectItem>
                  <SelectItem value="4">Treatment</SelectItem>
                  <SelectItem value="5">Consultation</SelectItem>
                  <SelectItem value="6">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-price">Price</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="edit-price"
                  type="number"
                  placeholder="Enter price"
                  className="pl-10"
                  value={editServicePrice}
                  onChange={(e) => setEditServicePrice(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-duration">Duration (minutes)</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="edit-duration"
                  type="number"
                  placeholder="Enter duration in minutes"
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
              <Label htmlFor="edit-requires-address">Requires client address (for on-site services)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleEditService} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Service"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

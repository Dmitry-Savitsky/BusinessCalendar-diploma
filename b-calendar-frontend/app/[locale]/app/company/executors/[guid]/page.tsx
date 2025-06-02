"use client"

import { AlertDialogFooter } from "@/components/ui/alert-dialog"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { getExecutorByGuid, type Executor } from "@/lib/api/executor"
import { getServices, type Service } from "@/lib/api/service"
import {
  getServicesForExecutor,
  assignExecutorToService,
  removeExecutorFromService,
  type ExecutorService,
} from "@/lib/api/executor-services"
import { getOrdersByExecutor, type Order, formatDate, formatTime } from "@/lib/api/orders"
import {
  ArrowLeft,
  User,
  Phone,
  Calendar,
  Scissors,
  Trash2,
  Plus,
  Loader2,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import ExecutorSchedule from "@/components/executor-schedule"

// Import the config at the top of the file
import { config } from "@/lib/config"

export default function ExecutorDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [executor, setExecutor] = useState<Executor | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("schedule")

  // Services state
  const [executorServices, setExecutorServices] = useState<ExecutorService[]>([])
  const [availableServices, setAvailableServices] = useState<Service[]>([])
  const [servicesLoading, setServicesLoading] = useState(true)
  const [isAddServiceDialogOpen, setIsAddServiceDialogOpen] = useState(false)
  const [selectedServiceId, setSelectedServiceId] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Bookings state
  const [bookings, setBookings] = useState<Order[]>([])
  const [bookingsLoading, setBookingsLoading] = useState(true)

  const guid = params.guid as string

  useEffect(() => {
    if (guid) {
      fetchExecutor()
    }
  }, [guid])

  useEffect(() => {
    if (guid && activeTab === "services") {
      fetchExecutorServices()
    } else if (guid && activeTab === "bookings") {
      fetchExecutorBookings()
    }
  }, [guid, activeTab])

  const fetchExecutor = async () => {
    setLoading(true)
    try {
      const data = await getExecutorByGuid(guid)
      setExecutor(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load executor details. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchExecutorServices = async () => {
    setServicesLoading(true)
    try {
      const assignedData = await getServicesForExecutor(guid)
      setExecutorServices(assignedData)

      // Fetch all services to determine which ones are available to assign
      const allServices = await getServices()

      // Filter out services that are already assigned to this executor
      const assignedIds = assignedData.map((as) => as.servicePublicId)
      const available = allServices.filter((service) => !assignedIds.includes(service.publicId))

      setAvailableServices(available)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load executor services. Please try again.",
        variant: "destructive",
      })
    } finally {
      setServicesLoading(false)
    }
  }

  const fetchExecutorBookings = async () => {
    setBookingsLoading(true)
    try {
      const data = await getOrdersByExecutor(guid)
      setBookings(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load executor bookings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setBookingsLoading(false)
    }
  }

  const handleAssignService = async () => {
    if (!selectedServiceId) {
      toast({
        title: "Error",
        description: "Please select a service to assign.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await assignExecutorToService(guid, selectedServiceId)

      toast({
        title: "Success",
        description: "Service assigned to executor successfully.",
      })

      // Reset and close dialog
      setSelectedServiceId("")
      setIsAddServiceDialogOpen(false)

      // Refresh assigned services
      fetchExecutorServices()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign service to executor. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRemoveService = async (serviceId: string) => {
    try {
      await removeExecutorFromService(guid, serviceId)

      toast({
        title: "Success",
        description: "Service removed from executor successfully.",
      })

      // Refresh assigned services
      fetchExecutorServices()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove service from executor. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent"></div>
      </div>
    )
  }

  if (!executor) {
    return (
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Card className="flex h-[400px] flex-col items-center justify-center text-center">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium">Executor Not Found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              The executor you're looking for doesn't exist or has been deleted.
            </p>
            <Button className="mt-4" onClick={() => router.push("/app/company/executors")}>
              View All Executors
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center space-x-2">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">{executor.name}</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Executor information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-square w-full overflow-hidden rounded-md">
              {executor.imgPath ? (
                <img
                  src={`${config.apiUrl}${executor.imgPath}`}
                  alt={executor.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted">
                  <User className="h-24 w-24 text-muted-foreground" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{executor.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{executor.phone}</span>
              </div>
              {executor.description && (
                <div className="pt-2">
                  <h4 className="text-sm font-medium">Description</h4>
                  <p className="text-sm text-muted-foreground">{executor.description}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <Tabs defaultValue="schedule" onValueChange={setActiveTab}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Executor Management</CardTitle>
                <TabsList>
                  <TabsTrigger value="schedule">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule
                  </TabsTrigger>
                  <TabsTrigger value="services">
                    <Scissors className="mr-2 h-4 w-4" />
                    Services
                  </TabsTrigger>
                  <TabsTrigger value="bookings">
                    <Clock className="mr-2 h-4 w-4" />
                    Bookings
                  </TabsTrigger>
                </TabsList>
              </div>
              <CardDescription>
                {activeTab === "schedule"
                  ? "Manage work schedule"
                  : activeTab === "services"
                    ? "Manage services this executor can perform"
                    : "View all bookings for this executor"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TabsContent value="schedule" className="mt-0">
                <ExecutorSchedule executorGuid={executor.guid} />
              </TabsContent>
              <TabsContent value="services" className="mt-0">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Assigned Services</h3>
                    <Dialog open={isAddServiceDialogOpen} onOpenChange={setIsAddServiceDialogOpen}>
                      <DialogTrigger asChild>
                        <Button disabled={availableServices.length === 0}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Service
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Assign Service to Executor</DialogTitle>
                          <DialogDescription>Select a service that {executor.name} can perform.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Select value={selectedServiceId} onValueChange={setSelectedServiceId}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a service" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableServices.map((service) => (
                                  <SelectItem key={service.publicId} value={service.publicId}>
                                    {service.serviceName} - ${service.servicePrice.toFixed(2)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleAssignService} disabled={isSubmitting || !selectedServiceId}>
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Assigning...
                              </>
                            ) : (
                              "Assign Service"
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {servicesLoading ? (
                    <div className="flex h-[200px] items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : executorServices.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Scissors className="h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">No Services Assigned</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Assign services to this executor to allow them to perform them.
                      </p>
                      {availableServices.length > 0 ? (
                        <Button className="mt-4" onClick={() => setIsAddServiceDialogOpen(true)}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Service
                        </Button>
                      ) : (
                        <p className="mt-4 text-sm text-muted-foreground">
                          No available services to assign. All services are already assigned to this executor.
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {executorServices.map((service) => (
                        <div
                          key={service.servicePublicId}
                          className="flex items-center justify-between rounded-md border p-4"
                        >
                          <div className="space-y-1">
                            <p className="font-medium">{service.serviceName}</p>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span>${service.servicePrice.toFixed(2)}</span>
                              <span>{service.durationMinutes} minutes</span>
                            </div>
                          </div>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will remove the service "{service.serviceName}" from {executor.name}. They will
                                  no longer be able to perform this service.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleRemoveService(service.servicePublicId)}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Remove
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="bookings" className="mt-0">
                <div className="space-y-4">
                  {bookingsLoading ? (
                    <div className="flex h-[200px] items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : bookings.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">No bookings found for this executor.</div>
                  ) : (
                    <div className="space-y-4">
                      {bookings.map((booking) => {
                        const isUpcoming = new Date(booking.orderStart) > new Date()
                        return (
                          <div key={booking.publicId} className="rounded-md border p-4">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium">{formatDate(booking.orderStart)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span>
                                    {formatTime(booking.orderStart)} - {formatTime(booking.orderEnd)}
                                  </span>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="font-medium">Client: {booking.clientName}</div>
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                  <span>{booking.clientPhone}</span>
                                </div>
                              </div>

                              <div className="space-y-2">
                                {booking.items.map((item) => (
                                  <div key={item.serviceGuid} className="text-sm">
                                    <div className="font-medium">{item.serviceName}</div>
                                    <div className="text-muted-foreground">${item.servicePrice.toFixed(2)}</div>
                                  </div>
                                ))}
                              </div>

                              <div>
                                {booking.completed === true ? (
                                  <span className="flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                    <CheckCircle className="mr-1 h-3 w-3" />
                                    Completed
                                  </span>
                                ) : isUpcoming ? (
                                  <span className="flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                    <Clock className="mr-1 h-3 w-3" />
                                    Upcoming
                                  </span>
                                ) : (
                                  <span className="flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                                    <AlertCircle className="mr-1 h-3 w-3" />
                                    Pending
                                  </span>
                                )}
                              </div>
                            </div>

                            {booking.comment && (
                              <div className="mt-4 pt-4 border-t">
                                <div className="text-sm font-medium">Comment:</div>
                                <div className="text-sm text-muted-foreground">{booking.comment}</div>
                              </div>
                            )}

                            {booking.clientAddress && (
                              <div className="mt-2">
                                <div className="text-sm font-medium">Address:</div>
                                <div className="text-sm text-muted-foreground">{booking.clientAddress}</div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}

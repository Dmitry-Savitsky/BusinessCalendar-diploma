"use client"

import { CardFooter } from "@/components/ui/card"

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
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { getServiceById, type Service, getServiceTypeName } from "@/lib/api/service"
import { getExecutors, type Executor } from "@/lib/api/executor"
import {
  getExecutorsForService,
  assignExecutorToService,
  removeExecutorFromService,
  type ExecutorService,
} from "@/lib/api/executor-services"
import { getOrdersByService, type Order, formatDate, formatTime } from "@/lib/api/orders"
import {
  ArrowLeft,
  Clock,
  DollarSign,
  MapPin,
  Calendar,
  Users,
  Trash2,
  Loader2,
  UserPlus,
  User,
  Phone,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

// Import the config at the top of the file
import { config } from "@/lib/config"

export default function ServiceDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [service, setService] = useState<Service | null>(null)
  const [assignedExecutors, setAssignedExecutors] = useState<ExecutorService[]>([])
  const [availableExecutors, setAvailableExecutors] = useState<Executor[]>([])
  const [loading, setLoading] = useState(true)
  const [executorsLoading, setExecutorsLoading] = useState(true)
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [selectedExecutorId, setSelectedExecutorId] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Bookings state
  const [bookings, setBookings] = useState<Order[]>([])
  const [bookingsLoading, setBookingsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("executors")

  const publicId = params.publicId as string

  useEffect(() => {
    if (publicId) {
      fetchService()
      fetchAssignedExecutors()
    }
  }, [publicId])

  useEffect(() => {
    if (publicId && activeTab === "bookings") {
      fetchServiceBookings()
    }
  }, [publicId, activeTab])

  const fetchService = async () => {
    setLoading(true)
    try {
      const data = await getServiceById(publicId)
      setService(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load service details. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchAssignedExecutors = async () => {
    setExecutorsLoading(true)
    try {
      const assignedData = await getExecutorsForService(publicId)
      setAssignedExecutors(assignedData)

      // Fetch all executors to determine which ones are available to assign
      const allExecutors = await getExecutors()

      // Filter out executors that are already assigned to this service
      const assignedIds = assignedData.map((ae) => ae.executorPublicId)
      const available = allExecutors.filter((exec) => !assignedIds.includes(exec.guid))

      setAvailableExecutors(available)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load assigned executors. Please try again.",
        variant: "destructive",
      })
    } finally {
      setExecutorsLoading(false)
    }
  }

  const fetchServiceBookings = async () => {
    setBookingsLoading(true)
    try {
      const data = await getOrdersByService(publicId)
      setBookings(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load service bookings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setBookingsLoading(false)
    }
  }

  const handleAssignExecutor = async () => {
    if (!selectedExecutorId) {
      toast({
        title: "Error",
        description: "Please select an executor to assign.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await assignExecutorToService(selectedExecutorId, publicId)

      toast({
        title: "Success",
        description: "Executor assigned to service successfully.",
      })

      // Reset and close dialog
      setSelectedExecutorId("")
      setIsAssignDialogOpen(false)

      // Refresh assigned executors
      fetchAssignedExecutors()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign executor to service. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRemoveExecutor = async (executorId: string) => {
    try {
      await removeExecutorFromService(executorId, publicId)

      toast({
        title: "Success",
        description: "Executor removed from service successfully.",
      })

      // Refresh assigned executors
      fetchAssignedExecutors()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove executor from service. Please try again.",
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

  if (!service) {
    return (
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Card className="flex h-[400px] flex-col items-center justify-center text-center">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium">Service Not Found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              The service you're looking for doesn't exist or has been deleted.
            </p>
            <Button className="mt-4" onClick={() => router.push("/app/company/services")}>
              View All Services
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
        <h2 className="text-3xl font-bold tracking-tight">{service.serviceName}</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
            <CardDescription>Basic information about this service</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Service Type</p>
                <p>{getServiceTypeName(service.serviceType)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Price</p>
                <p className="flex items-center">
                  <DollarSign className="mr-1 h-4 w-4" />
                  {service.servicePrice.toFixed(2)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Duration</p>
                <p className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  {service.durationMinutes} minutes
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Location</p>
                <p className="flex items-center">
                  <MapPin className="mr-1 h-4 w-4" />
                  {service.requiresAddress ? "On-site (at client's location)" : "In-store"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Statistics</CardTitle>
            <CardDescription>Performance metrics for this service</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                <p className="text-2xl font-bold">{bookings.length}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">${(bookings.length * service.servicePrice).toFixed(2)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Avg. Rating</p>
                <p className="text-2xl font-bold">N/A</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Popularity</p>
                <p className="text-2xl font-bold">N/A</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="executors" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="executors">
            <Users className="mr-2 h-4 w-4" />
            Assigned Executors
          </TabsTrigger>
          <TabsTrigger value="bookings">
            <Calendar className="mr-2 h-4 w-4" />
            Bookings
          </TabsTrigger>
        </TabsList>
        <TabsContent value="executors" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Assigned Executors</CardTitle>
                <CardDescription>Executors who can perform this service</CardDescription>
              </div>
              <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
                <DialogTrigger asChild>
                  <Button disabled={availableExecutors.length === 0}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Assign Executor
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Assign Executor to Service</DialogTitle>
                    <DialogDescription>
                      Select an executor to assign to the service "{service.serviceName}".
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Select value={selectedExecutorId} onValueChange={setSelectedExecutorId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an executor" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableExecutors.map((executor) => (
                            <SelectItem key={executor.guid} value={executor.guid}>
                              {executor.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAssignExecutor} disabled={isSubmitting || !selectedExecutorId}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Assigning...
                        </>
                      ) : (
                        "Assign Executor"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {executorsLoading ? (
                <div className="flex h-[200px] items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : assignedExecutors.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <User className="h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No Executors Assigned</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Assign executors to this service to allow them to perform it.
                  </p>
                  {availableExecutors.length > 0 ? (
                    <Button className="mt-4" onClick={() => setIsAssignDialogOpen(true)}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Assign Executor
                    </Button>
                  ) : (
                    <p className="mt-4 text-sm text-muted-foreground">
                      No available executors to assign. All executors are already assigned to this service.
                    </p>
                  )}
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {assignedExecutors.map((executor) => (
                    <Card key={executor.executorPublicId}>
                      <div className="aspect-square w-full overflow-hidden">
                        {executor.executorImgPath ? (
                          <img
                            src={`${config.apiUrl}${executor.executorImgPath}`}
                            alt={executor.executorName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-muted">
                            <User className="h-16 w-16 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <CardHeader>
                        <CardTitle>{executor.executorName}</CardTitle>
                      </CardHeader>
                      <CardFooter>
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
                                This will remove {executor.executorName} from the service "{service.serviceName}". They
                                will no longer be able to perform this service.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleRemoveExecutor(executor.executorPublicId)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Remove
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bookings</CardTitle>
              <CardDescription>All bookings for this service</CardDescription>
            </CardHeader>
            <CardContent>
              {bookingsLoading ? (
                <div className="flex h-[200px] items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No bookings found for this service.</div>
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
                              <div key={item.executorGuid} className="text-sm">
                                <div className="font-medium">Executor: {item.executorName}</div>
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

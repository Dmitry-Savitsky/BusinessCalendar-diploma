"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import {
  getAllOrders,
  confirmOrder,
  completeOrder,
  deleteOrder,
  formatDate,
  formatTime,
  calculateOrderTotal,
  getOrderStatusInfo,
  type Order,
} from "@/lib/api/orders"
import { getServices, type Service } from "@/lib/api/service"
import { getExecutorsForService, type ExecutorService } from "@/lib/api/executor-services"
import {
  getAvailableTimeSlots,
  createOrder,
  type TimeSlot,
  type CreateOrderRequest,
  type OrderItem,
} from "@/lib/api/booking"
import {
  ShoppingBag,
  CalendarIcon,
  Clock,
  User,
  Phone,
  MapPin,
  Scissors,
  CheckCircle,
  AlertCircle,
  Search,
  Loader2,
  Filter,
  RefreshCw,
  Activity,
  Trash2,
  CheckSquare,
  Plus,
  ChevronRight,
  ChevronLeft,
  X,
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { config } from "@/lib/config"

export default function OrdersPage() {
  const t = useTranslations('orders')
  const router = useRouter()
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Create order state
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [createStep, setCreateStep] = useState(1)
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [executors, setExecutors] = useState<ExecutorService[]>([])
  const [selectedExecutor, setSelectedExecutor] = useState<ExecutorService | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [clientName, setClientName] = useState("")
  const [clientPhone, setClientPhone] = useState("")
  const [clientAddress, setClientAddress] = useState("")
  const [orderComment, setOrderComment] = useState("")
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [currentOrderItem, setCurrentOrderItem] = useState<OrderItem | null>(null)
  const [servicesLoading, setServicesLoading] = useState(false)
  const [executorsLoading, setExecutorsLoading] = useState(false)
  const [timeSlotsLoading, setTimeSlotsLoading] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, searchQuery, statusFilter, dateFilter])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const data = await getAllOrders()
      setOrders(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load orders. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterOrders = () => {
    let filtered = [...orders]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (order) =>
          order.clientName.toLowerCase().includes(query) ||
          order.clientPhone.toLowerCase().includes(query) ||
          order.items.some((item) => item.serviceName.toLowerCase().includes(query)) ||
          order.items.some((item) => item.executorName.toLowerCase().includes(query)),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      if (statusFilter === "completed") {
        filtered = filtered.filter((order) => order.completed === true)
      } else if (statusFilter === "confirmed") {
        filtered = filtered.filter((order) => order.confirmed === true && order.completed !== true)
      } else if (statusFilter === "pending") {
        filtered = filtered.filter((order) => order.confirmed !== true)
      }
    }

    // Apply date filter
    if (dateFilter !== "all") {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      const nextWeek = new Date(today)
      nextWeek.setDate(nextWeek.getDate() + 7)

      if (dateFilter === "today") {
        filtered = filtered.filter((order) => {
          const orderDate = new Date(order.orderStart)
          return orderDate >= today && orderDate < tomorrow
        })
      } else if (dateFilter === "upcoming") {
        filtered = filtered.filter((order) => {
          const orderDate = new Date(order.orderStart)
          return orderDate >= tomorrow
        })
      } else if (dateFilter === "thisWeek") {
        filtered = filtered.filter((order) => {
          const orderDate = new Date(order.orderStart)
          return orderDate >= today && orderDate < nextWeek
        })
      } else if (dateFilter === "past") {
        filtered = filtered.filter((order) => {
          const orderDate = new Date(order.orderStart)
          return orderDate < today
        })
      }
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.orderStart).getTime() - new Date(a.orderStart).getTime())

    setFilteredOrders(filtered)
  }

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order)
    setIsDrawerOpen(true)
  }

  const handleConfirmOrder = async () => {
    if (!selectedOrder) return

    setIsConfirming(true)
    try {
      await confirmOrder(selectedOrder.publicId)

      toast({
        title: "Success",
        description: t('toast.confirmSuccess'),
      })

      // Update the order in the state
      const updatedOrders = orders.map((order) =>
        order.publicId === selectedOrder.publicId ? { ...order, confirmed: true } : order,
      )
      setOrders(updatedOrders)
      setSelectedOrder({ ...selectedOrder, confirmed: true })
    } catch (error) {
      toast({
        title: "Error",
        description: t('toast.confirmError'),
        variant: "destructive",
      })
    } finally {
      setIsConfirming(false)
    }
  }

  const handleCompleteOrder = async () => {
    if (!selectedOrder) return

    setIsCompleting(true)
    try {
      await completeOrder(selectedOrder.publicId)

      toast({
        title: "Success",
        description: t('toast.completeSuccess'),
      })

      // Update the order in the state
      const updatedOrders = orders.map((order) =>
        order.publicId === selectedOrder.publicId ? { ...order, completed: true } : order,
      )
      setOrders(updatedOrders)
      setSelectedOrder({ ...selectedOrder, completed: true })
    } catch (error) {
      toast({
        title: "Error",
        description: t('toast.completeError'),
        variant: "destructive",
      })
    } finally {
      setIsCompleting(false)
    }
  }

  const handleDeleteOrder = async () => {
    if (!selectedOrder) return

    setIsDeleting(true)
    try {
      await deleteOrder(selectedOrder.publicId)

      toast({
        title: "Success",
        description: t('toast.deleteSuccess'),
      })

      // Remove the order from the state
      const updatedOrders = orders.filter((order) => order.publicId !== selectedOrder.publicId)
      setOrders(updatedOrders)
      setIsDrawerOpen(false)
      setSelectedOrder(null)
    } catch (error) {
      toast({
        title: "Error",
        description: t('toast.deleteError'),
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const renderStatusBadge = (order: Order) => {
    const status = getOrderStatusInfo(order)
    let statusText = ""

    if (order.completed) {
      statusText = t('orderCard.status.completed')
    } else if (order.confirmed) {
      statusText = t('orderCard.status.confirmed')
    } else {
      statusText = t('orderCard.status.pending')
    }

    return (
      <Badge
        className={`
          ${status.color === "green" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : ""}
          ${status.color === "blue" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : ""}
          ${status.color === "yellow" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" : ""}
          ${status.color === "orange" ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" : ""}
        `}
      >
        {status.icon === "check-circle" && <CheckCircle className="mr-1 h-3 w-3" />}
        {status.icon === "clock" && <Clock className="mr-1 h-3 w-3" />}
        {status.icon === "alert-circle" && <AlertCircle className="mr-1 h-3 w-3" />}
        {status.icon === "activity" && <Activity className="mr-1 h-3 w-3" />}
        {statusText}
      </Badge>
    )
  }

  // Create order functions
  const openCreateOrderDialog = async () => {
    setCreateStep(1)
    setSelectedService(null)
    setSelectedExecutor(null)
    setSelectedDate(undefined)
    setSelectedTimeSlot(null)
    setClientName("")
    setClientPhone("")
    setClientAddress("")
    setOrderComment("")
    setOrderItems([])
    setCurrentOrderItem(null)

    // Fetch services
    setServicesLoading(true)
    try {
      const servicesData = await getServices()
      setServices(servicesData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load services. Please try again.",
        variant: "destructive",
      })
    } finally {
      setServicesLoading(false)
    }

    setIsCreateDialogOpen(true)
  }

  const handleServiceSelect = async (service: Service) => {
    setSelectedService(service)

    // Fetch executors for this service
    setExecutorsLoading(true)
    try {
      const executorsData = await getExecutorsForService(service.publicId)
      setExecutors(executorsData)
      setCreateStep(2)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load executors. Please try again.",
        variant: "destructive",
      })
    } finally {
      setExecutorsLoading(false)
    }
  }

  const handleExecutorSelect = (executor: ExecutorService) => {
    setSelectedExecutor(executor)
    setCreateStep(3)
  }

  const handleDateSelect = async (date: Date | undefined) => {
    if (!date) return

    setSelectedDate(date)

    if (!selectedService || !selectedExecutor) return

    // Fetch available time slots
    setTimeSlotsLoading(true)
    try {
      const formattedDate = date.toISOString()
      const slotsData = await getAvailableTimeSlots(
        selectedService.publicId,
        selectedExecutor.executorPublicId,
        formattedDate,
      )
      setTimeSlots(slotsData.filter((slot) => slot.available))
      setCreateStep(4)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load available time slots. Please try again.",
        variant: "destructive",
      })
    } finally {
      setTimeSlotsLoading(false)
    }
  }

  const handleTimeSlotSelect = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot)

    if (!selectedService || !selectedExecutor) return

    // Create current order item
    setCurrentOrderItem({
      serviceGuid: selectedService.publicId,
      executorGuid: selectedExecutor.executorPublicId,
      start: timeSlot,
      requiresAddress: selectedService.requiresAddress,
    })

    setCreateStep(5)
  }

  const handleAddServiceToOrder = () => {
    if (!currentOrderItem) return

    // Add current item to order items
    setOrderItems([...orderItems, currentOrderItem])

    // Reset selection for adding another service
    setSelectedService(null)
    setSelectedExecutor(null)
    setSelectedTimeSlot(null)
    setCurrentOrderItem(null)
    setCreateStep(1)
  }

  const handleRemoveOrderItem = (index: number) => {
    const newItems = [...orderItems]
    newItems.splice(index, 1)
    setOrderItems(newItems)
  }

  const handleProceedToClientInfo = () => {
    if (orderItems.length === 0 && !currentOrderItem) {
      toast({
        title: "Error",
        description: "Please add at least one service to the order.",
        variant: "destructive",
      })
      return
    }

    // If there's a current item that hasn't been added yet, add it
    if (currentOrderItem) {
      setOrderItems([...orderItems, currentOrderItem])
      setCurrentOrderItem(null)
    }

    setCreateStep(6)
  }

  const handleCreateOrder = async () => {
    // Validate client information
    if (!clientName || !clientPhone) {
      toast({
        title: "Error",
        description: t('toast.createError'),
        variant: "destructive",
      })
      return
    }

    setIsCreatingOrder(true)
    try {
      const orderData: CreateOrderRequest = {
        clientName,
        clientPhone,
        clientAddress: clientAddress || null,
        comment: orderComment || null,
        items: orderItems,
      }

      const result = await createOrder(orderData)

      toast({
        title: "Success",
        description: t('toast.createSuccess'),
      })

      // Close dialog and refresh orders
      setIsCreateDialogOpen(false)
      fetchOrders()
    } catch (error) {
      toast({
        title: "Error",
        description: t('toast.createError'),
        variant: "destructive",
      })
    } finally {
      setIsCreatingOrder(false)
    }
  }

  const renderCreateOrderStep = () => {
    switch (createStep) {
      case 1: // Select service
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Select a Service</h3>
            {servicesLoading ? (
              <div className="flex h-[300px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid gap-3 max-h-[400px] overflow-y-auto pr-2">
                {services.map((service) => (
                  <Card
                    key={service.publicId}
                    className={`cursor-pointer hover:bg-muted/50 transition-colors ${
                      selectedService?.publicId === service.publicId ? "border-primary" : ""
                    }`}
                    onClick={() => handleServiceSelect(service)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{service.serviceName}</h4>
                          <p className="text-sm text-muted-foreground">{service.durationMinutes} minutes</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{service.servicePrice} BYN</p>
                          {service.requiresAddress && (
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              On-site
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )

      case 2: // Select executor
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Select an Executor</h3>
              <Button variant="ghost" size="sm" onClick={() => setCreateStep(1)}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            </div>

            {selectedService && (
              <div className="bg-muted p-3 rounded-md">
                <p className="font-medium">Selected Service:</p>
                <p>
                  {selectedService.serviceName} - {selectedService.servicePrice} BYN
                </p>
              </div>
            )}

            {executorsLoading ? (
              <div className="flex h-[300px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : executors.length === 0 ? (
              <div className="text-center py-8">
                <p>No executors available for this service.</p>
                <Button variant="outline" className="mt-4" onClick={() => setCreateStep(1)}>
                  Select Another Service
                </Button>
              </div>
            ) : (
              <div className="grid gap-3 max-h-[400px] overflow-y-auto pr-2">
                {executors.map((executor) => (
                  <Card
                    key={executor.executorPublicId}
                    className={`cursor-pointer hover:bg-muted/50 transition-colors ${
                      selectedExecutor?.executorPublicId === executor.executorPublicId ? "border-primary" : ""
                    }`}
                    onClick={() => handleExecutorSelect(executor)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full overflow-hidden bg-muted">
                          {executor.executorImgPath ? (
                            <img
                              src={`${config.apiUrl}${executor.executorImgPath}`}
                              alt={executor.executorName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <User className="h-full w-full p-2 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{executor.executorName}</h4>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )

      case 3: // Select date
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Select a Date</h3>
              <Button variant="ghost" size="sm" onClick={() => setCreateStep(2)}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            </div>

            <div className="bg-muted p-3 rounded-md space-y-2">
              {selectedService && (
                <div>
                  <p className="font-medium">Service:</p>
                  <p>
                    {selectedService.serviceName} - {selectedService.servicePrice} BYN
                  </p>
                </div>
              )}
              {selectedExecutor && (
                <div>
                  <p className="font-medium">Executor:</p>
                  <p>{selectedExecutor.executorName}</p>
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={(date) => {
                  // Allow selecting today and future dates, but not dates more than 3 months in the future
                  const today = new Date()
                  today.setHours(0, 0, 0, 0) // Set to start of day for proper comparison
                  const threeMonthsLater = new Date()
                  threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3)
                  return date < today || date > threeMonthsLater
                }}
                className="rounded-md border"
              />
            </div>
          </div>
        )

      case 4: // Select time slot
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Select a Time Slot</h3>
              <Button variant="ghost" size="sm" onClick={() => setCreateStep(3)}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            </div>

            <div className="bg-muted p-3 rounded-md space-y-2">
              {selectedService && (
                <div>
                  <p className="font-medium">Service:</p>
                  <p>
                    {selectedService.serviceName} - {selectedService.servicePrice} BYN
                  </p>
                </div>
              )}
              {selectedExecutor && (
                <div>
                  <p className="font-medium">Executor:</p>
                  <p>{selectedExecutor.executorName}</p>
                </div>
              )}
              {selectedDate && (
                <div>
                  <p className="font-medium">Date:</p>
                  <p>{format(selectedDate, "PPP")}</p>
                </div>
              )}
            </div>

            {timeSlotsLoading ? (
              <div className="flex h-[200px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : timeSlots.length === 0 ? (
              <div className="text-center py-8">
                <p>No available time slots for this date.</p>
                <Button variant="outline" className="mt-4" onClick={() => setCreateStep(3)}>
                  Select Another Date
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto pr-2">
                {timeSlots.map((slot) => {
                  const time = new Date(slot.time)
                  return (
                    <Button
                      key={slot.time}
                      variant={selectedTimeSlot === slot.time ? "default" : "outline"}
                      className="h-auto py-2"
                      onClick={() => handleTimeSlotSelect(slot.time)}
                    >
                      {format(time, "h:mm a")}
                    </Button>
                  )
                })}
              </div>
            )}
          </div>
        )

      case 5: // Review service and add more or proceed
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Review Service</h3>
              <Button variant="ghost" size="sm" onClick={() => setCreateStep(4)}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            </div>

            <div className="space-y-4">
              {/* Current service being added */}
              {currentOrderItem && selectedService && selectedExecutor && selectedTimeSlot && (
                <Card className="border-primary">
                  <CardContent className="p-4">
                    <h4 className="font-medium">Service to Add:</h4>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span>Service:</span>
                        <span className="font-medium">{selectedService.serviceName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Executor:</span>
                        <span className="font-medium">{selectedExecutor.executorName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Date:</span>
                        <span className="font-medium">{selectedDate ? format(selectedDate, "PPP") : ""}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time:</span>
                        <span className="font-medium">{format(new Date(selectedTimeSlot), "h:mm a")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Price:</span>
                        <span className="font-medium">{selectedService.servicePrice} BYN</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Already added services */}
              {orderItems.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Services in Order:</h4>
                  {orderItems.map((item, index) => {
                    const service = services.find((s) => s.publicId === item.serviceGuid)
                    const executor = executors.find((e) => e.executorPublicId === item.executorGuid)

                    return (
                      <div key={index} className="flex justify-between items-center p-3 border rounded-md">
                        <div>
                          <p className="font-medium">{service?.serviceName}</p>
                          <p className="text-sm text-muted-foreground">
                            {executor?.executorName} • {format(new Date(item.start), "PPP h:mm a")}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>{service?.servicePrice} BYN</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRemoveOrderItem(index)
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={handleAddServiceToOrder}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Another Service
                </Button>
                <Button onClick={handleProceedToClientInfo}>
                  <ChevronRight className="mr-2 h-4 w-4" />
                  Continue
                </Button>
              </div>
            </div>
          </div>
        )

      case 6: // Enter client information
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Client Information</h3>
              <Button variant="ghost" size="sm" onClick={() => setCreateStep(5)}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            </div>

            {/* Order summary */}
            <div className="bg-muted p-3 rounded-md">
              <h4 className="font-medium">Order Summary:</h4>
              <p>{orderItems.length} service(s)</p>
              <p className="font-medium mt-1">
                Total: {orderItems.reduce((total, item) => {
                  const service = services.find((s) => s.publicId === item.serviceGuid)
                  return total + (service?.servicePrice || 0)
                }, 0)} BYN
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client-name">Client Name *</Label>
                <Input
                  id="client-name"
                  placeholder="Enter client name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="client-phone">Client Phone *</Label>
                <Input
                  id="client-phone"
                  placeholder="Enter client phone number"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  required
                />
              </div>

              {orderItems.some((item) => {
                const service = services.find((s) => s.publicId === item.serviceGuid)
                return service?.requiresAddress
              }) && (
                <div className="space-y-2">
                  <Label htmlFor="client-address">Client Address *</Label>
                  <Input
                    id="client-address"
                    placeholder="Enter client address"
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">* Required for on-site services</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="order-comment">Comment (Optional)</Label>
                <Textarea
                  id="order-comment"
                  placeholder="Add any additional notes or comments"
                  value={orderComment}
                  onChange={(e) => setOrderComment(e.target.value)}
                  rows={3}
                />
              </div>

              <Button
                className="w-full"
                onClick={handleCreateOrder}
                disabled={
                  isCreatingOrder ||
                  !clientName ||
                  !clientPhone ||
                  (orderItems.some((item) => {
                    const service = services.find((s) => s.publicId === item.serviceGuid)
                    return service?.requiresAddress
                  }) &&
                    !clientAddress)
                }
              >
                {isCreatingOrder ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Order...
                  </>
                ) : (
                  "Create Order"
                )}
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchOrders}>
            <RefreshCw className="mr-2 h-4 w-4" />
            {t('actions.refresh')}
          </Button>
          <Button onClick={openCreateOrderDialog}>
            <Plus className="mr-2 h-4 w-4" />
            {t('actions.create')}
          </Button>
        </div>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:items-end md:space-x-4 md:space-y-0">
        <div className="flex-1 space-y-2">
          <label htmlFor="search" className="text-sm font-medium">
            {t('filters.search.label')}
          </label>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search"
              placeholder={t('filters.search.placeholder')}
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="w-full md:w-[180px] space-y-2">
          <label htmlFor="status-filter" className="text-sm font-medium">
            {t('filters.status.label')}
          </label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger id="status-filter">
              <SelectValue placeholder={t('filters.status.placeholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('filters.status.options.all')}</SelectItem>
              <SelectItem value="pending">{t('filters.status.options.pending')}</SelectItem>
              <SelectItem value="confirmed">{t('filters.status.options.confirmed')}</SelectItem>
              <SelectItem value="completed">{t('filters.status.options.completed')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-[180px] space-y-2">
          <label htmlFor="date-filter" className="text-sm font-medium">
            {t('filters.date.label')}
          </label>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger id="date-filter">
              <SelectValue placeholder={t('filters.date.placeholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('filters.date.options.all')}</SelectItem>
              <SelectItem value="today">{t('filters.date.options.today')}</SelectItem>
              <SelectItem value="upcoming">{t('filters.date.options.upcoming')}</SelectItem>
              <SelectItem value="thisWeek">{t('filters.date.options.thisWeek')}</SelectItem>
              <SelectItem value="past">{t('filters.date.options.past')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex h-[400px] items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">{t('toast.loadError')}</p>
          </div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="flex h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">{t('empty.title')}</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {searchQuery || statusFilter !== "all" || dateFilter !== "all"
              ? t('empty.withFilters')
              : t('empty.description')}
          </p>
          {(searchQuery || statusFilter !== "all" || dateFilter !== "all") && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery("")
                setStatusFilter("all")
                setDateFilter("all")
              }}
            >
              <Filter className="mr-2 h-4 w-4" />
              {t('empty.clearFilters')}
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card
              key={order.publicId}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleOrderClick(order)}
            >
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{formatDate(order.orderStart)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {formatTime(order.orderStart)} - {formatTime(order.orderEnd)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{order.clientName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{order.clientPhone}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="font-medium">
                      {order.items.length > 1
                        ? `${order.items[0].serviceName} +${order.items.length - 1} ${t('orderCard.more')}`
                        : order.items[0]?.serviceName}
                    </div>
                    <div className="flex items-center gap-2">
                      <Scissors className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {order.items.length > 1
                          ? `${order.items[0].executorName} +${order.items.length - 1} ${t('orderCard.more')}`
                          : order.items[0]?.executorName}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {renderStatusBadge(order)}
                    <div className="font-medium">
                      {t('orderCard.total')}: {calculateOrderTotal(order)} BYN
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Order Detail Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto">
          {selectedOrder && (
            <>
              <SheetHeader>
                <SheetTitle>{t('details.title')}</SheetTitle>
                <SheetDescription>{t('details.orderId')}: {selectedOrder.publicId.substring(0, 8)}...</SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">{t('details.sections.status')}</h3>
                  {renderStatusBadge(selectedOrder)}
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{t('details.sections.appointment.title')}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{t('details.sections.appointment.date')}</p>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <p>{formatDate(selectedOrder.orderStart)}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{t('details.sections.appointment.time')}</p>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <p>
                          {formatTime(selectedOrder.orderStart)} - {formatTime(selectedOrder.orderEnd)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{t('details.sections.client.title')}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{selectedOrder.clientName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <p>{selectedOrder.clientPhone}</p>
                    </div>
                    {selectedOrder.clientAddress && (
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <p>{selectedOrder.clientAddress}</p>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{t('details.sections.services.title')}</h3>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="rounded-md border p-4">
                        <div className="flex justify-between">
                          <div className="space-y-1">
                            <p className="font-medium">{item.serviceName}</p>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">{formatTime(item.start)}</p>
                            </div>
                          </div>
                          <p className="font-medium">{item.servicePrice} BYN</p>
                        </div>
                        <div className="mt-2 pt-2 border-t">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm">{t('details.sections.services.executor')}: {item.executorName}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between pt-2">
                    <p className="font-medium">{t('details.sections.services.total')}</p>
                    <p className="font-bold">{calculateOrderTotal(selectedOrder)} BYN</p>
                  </div>
                </div>

                {selectedOrder.comment && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">{t('details.sections.comment')}</h3>
                      <p className="text-sm">{selectedOrder.comment}</p>
                    </div>
                  </>
                )}

                <Separator />

                <div className="flex flex-wrap gap-2">
                  {!selectedOrder.confirmed && (
                    <Button onClick={handleConfirmOrder} disabled={isConfirming} className="flex-1">
                      {isConfirming ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('details.actions.confirm.confirming')}
                        </>
                      ) : (
                        <>
                          <CheckSquare className="mr-2 h-4 w-4" />
                          {t('details.actions.confirm.button')}
                        </>
                      )}
                    </Button>
                  )}

                  {selectedOrder.confirmed && !selectedOrder.completed && (
                    <Button onClick={handleCompleteOrder} disabled={isCompleting} className="flex-1">
                      {isCompleting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('details.actions.complete.completing')}
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          {t('details.actions.complete.button')}
                        </>
                      )}
                    </Button>
                  )}

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="flex-1">
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t('details.actions.delete.button')}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t('details.actions.delete.title')}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {t('details.actions.delete.description')}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t('details.actions.delete.cancel')}</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteOrder}
                          className="bg-red-500 hover:bg-red-600"
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              {t('details.actions.delete.deleting')}
                            </>
                          ) : (
                            t('details.actions.delete.confirm')
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Create Order Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md md:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t('create.title')}</DialogTitle>
            <DialogDescription>
              {t('create.description')}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {/* Progress indicator */}
            <div className="flex items-center justify-between mb-6">
              <div className="w-full flex items-center">
                {[1, 2, 3, 4, 5, 6].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-medium",
                        createStep >= step
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted bg-muted text-muted-foreground",
                      )}
                    >
                      {step}
                    </div>
                    {step < 6 && <div className={cn("h-0.5 w-10", createStep > step ? "bg-primary" : "bg-muted")} />}
                  </div>
                ))}
              </div>
            </div>

            {renderCreateOrderStep()}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

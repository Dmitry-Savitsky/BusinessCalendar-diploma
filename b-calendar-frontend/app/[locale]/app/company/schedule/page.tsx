"use client"

import React from "react"

import { useState, useEffect, useMemo } from "react"
import { format, addDays, startOfDay, isSameDay, startOfWeek, isWithinInterval } from "date-fns"
import { formatInTimeZone } from 'date-fns-tz'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
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
import { useToast } from "@/hooks/use-toast"
import { getExecutors, type Executor } from "@/lib/api/executor"
import {
  getAllOrders,
  confirmOrder,
  completeOrder,
  deleteOrder,
  calculateOrderTotal,
  getOrderStatusInfo,
  type Order,
} from "@/lib/api/orders"
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Phone,
  MapPin,
  CheckCircle,
  AlertCircle,
  Loader2,
  Activity,
  Trash2,
  CheckSquare,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { config } from "@/lib/config"

// Hours to display in the calendar (from 8:00 to 20:00)
const HOURS = Array.from({ length: 13 }, (_, i) => i + 8)
// Number of executors to display at once
const EXECUTORS_PER_PAGE = 4

// Timezone
const TIMEZONE = "Europe/Minsk"

// Function to format dates with timezone
const formatDate = (dateStr: string) => {
  try {
    const date = new Date(dateStr)
    return formatInTimeZone(date, TIMEZONE, 'PPP')
  } catch (error) {
    console.error("Error formatting date:", error)
    return "Invalid Date"
  }
}

// Function to format times with timezone
const formatTime = (dateStr: string) => {
  try {
    const date = new Date(dateStr)
    return formatInTimeZone(date, TIMEZONE, 'HH:mm')
  } catch (error) {
    console.error("Error formatting time:", error)
    return "Invalid Time"
  }
}

export default function SchedulePage() {
  const { toast } = useToast()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [executors, setExecutors] = useState<Executor[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [viewMode, setViewMode] = useState<"day" | "week">("day")
  const [currentPage, setCurrentPage] = useState(0)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [executorsData, ordersData] = await Promise.all([getExecutors(), getAllOrders()])
      setExecutors(executorsData)
      setOrders(ordersData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load schedule data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePrevDay = () => {
    setSelectedDate((prev) => addDays(prev, -1))
  }

  const handleNextDay = () => {
    setSelectedDate((prev) => addDays(prev, 1))
  }

  const handleToday = () => {
    setSelectedDate(new Date())
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
        description: "Order has been confirmed successfully.",
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
        description: "Failed to confirm order. Please try again.",
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
        description: "Order has been marked as completed.",
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
        description: "Failed to complete order. Please try again.",
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
        description: "Order has been deleted successfully.",
      })

      // Remove the order from the state
      const updatedOrders = orders.filter((order) => order.publicId !== selectedOrder.publicId)
      setOrders(updatedOrders)
      setIsDrawerOpen(false)
      setSelectedOrder(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const renderStatusBadge = (order: Order) => {
    const status = getOrderStatusInfo(order)
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
        {status.label}
      </Badge>
    )
  }

  // Get dates for the current week
  const getWeekDates = (date: Date) => {
    const start = startOfWeek(date, { weekStartsOn: 1 }) // Start week on Monday
    return Array.from({ length: 7 }, (_, i) => addDays(start, i))
  }

  // Week dates
  const weekDates = useMemo(() => getWeekDates(selectedDate), [selectedDate])

  // Handle previous week
  const handlePrevWeek = () => {
    setSelectedDate((prev) => addDays(prev, -7))
  }

  // Handle next week
  const handleNextWeek = () => {
    setSelectedDate((prev) => addDays(prev, 7))
  }

  // Get color class based on service type
  const getServiceColorClass = (serviceType: number) => {
    const colorClasses = [
      "bg-blue-100 border-blue-300 dark:bg-blue-900/30 dark:border-blue-700",
      "bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-700",
      "bg-purple-100 border-purple-300 dark:bg-purple-900/30 dark:border-purple-700",
      "bg-pink-100 border-pink-300 dark:bg-pink-900/30 dark:border-pink-700",
      "bg-orange-100 border-orange-300 dark:bg-orange-900/30 dark:border-orange-700",
      "bg-cyan-100 border-cyan-300 dark:bg-cyan-900/30 dark:border-cyan-700",
    ]

    return colorClasses[(serviceType - 1) % colorClasses.length]
  }

  // Get color class based on order status and service type
  const getOrderCardColorClass = (order: Order) => {
    // If completed, always show green
    if (order.completed) {
      return "bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-700"
    }

    // Otherwise, use service type for color
    const serviceType = order.items[0]?.serviceType || 1
    return getServiceColorClass(serviceType)
  }

  // Filter orders for the selected date or week
  const filteredOrders = useMemo(() => {
    if (viewMode === "day") {
      return orders.filter((order) => {
        const orderDate = new Date(order.orderStart)
        return isSameDay(orderDate, selectedDate)
      })
    } else {
      // Week view - get orders for the entire week
      const weekStart = startOfDay(weekDates[0])
      const weekEnd = new Date(weekDates[6])
      weekEnd.setHours(23, 59, 59, 999)

      return orders.filter((order) => {
        const orderDate = new Date(order.orderStart)
        return isWithinInterval(orderDate, { start: weekStart, end: weekEnd })
      })
    }
  }, [orders, selectedDate, viewMode, weekDates])

  // Group orders by executor
  const ordersByExecutor = useMemo(() => {
    const result: Record<string, Order[]> = {}

    executors.forEach((executor) => {
      result[executor.guid] = []
    })

    filteredOrders.forEach((order) => {
      order.items.forEach((item) => {
        if (result[item.executorGuid]) {
          // Check if this order is already added for this executor
          const alreadyAdded = result[item.executorGuid].some((o) => o.publicId === order.publicId)
          if (!alreadyAdded) {
            result[item.executorGuid].push(order)
          }
        }
      })
    })

    return result
  }, [executors, filteredOrders])

  // Calculate position and height for an order card
  const getOrderCardStyle = (order: Order) => {
    const startTime = new Date(order.orderStart)
    const endTime = new Date(order.orderEnd)

    // Calculate position from top (in percentage)
    const dayStart = startOfDay(startTime)
    const hourHeight = 100 / HOURS.length // Height of one hour in percentage

    const startHour = startTime.getHours()
    const startMinute = startTime.getMinutes()
    const topPosition = (startHour - HOURS[0] + startMinute / 60) * hourHeight

    // Calculate height (in percentage)
    const durationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)
    const height = Math.max(durationHours * hourHeight, 10) // Minimum height of 10%

    return {
      top: `${topPosition}%`,
      height: `${height}%`,
      minHeight: "60px", // Minimum absolute height
    }
  }

  // Calculate total pages for carousel
  const totalPages = Math.ceil(executors.length / EXECUTORS_PER_PAGE)

  // Get current page executors
  const currentExecutors = useMemo(() => {
    const startIndex = currentPage * EXECUTORS_PER_PAGE
    return executors.slice(startIndex, startIndex + EXECUTORS_PER_PAGE)
  }, [executors, currentPage])

  // Handle carousel navigation
  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev))
  }

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading schedule...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Schedule</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button variant={viewMode === "day" ? "default" : "outline"} size="sm" onClick={() => setViewMode("day")}>
              Day
            </Button>
            <Button variant={viewMode === "week" ? "default" : "outline"} size="sm" onClick={() => setViewMode("week")}>
              Week
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={viewMode === "day" ? handlePrevDay : handlePrevWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={handleToday}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={viewMode === "day" ? handleNextDay : handleNextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center">
        {viewMode === "day" ? (
          <h3 className="text-xl font-medium">{format(selectedDate, "EEEE, MMMM d, yyyy")}</h3>
        ) : (
          <h3 className="text-xl font-medium">
            {format(weekDates[0], "MMMM d")} - {format(weekDates[6], "MMMM d, yyyy")}
          </h3>
        )}
      </div>

      {/* Executor Carousel Navigation */}
      {executors.length > EXECUTORS_PER_PAGE && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>
          <div className="text-sm text-muted-foreground">
            Page {currentPage + 1} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages - 1}
            className="flex items-center gap-1"
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="relative overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header with executors */}
          <div className="flex border-b">
            {/* Time column */}
            <div className="w-16 flex-shrink-0"></div>

            {/* Executor columns */}
            {currentExecutors.map((executor) => (
              <div key={executor.guid} className="flex-1 p-2 text-center border-l">
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full overflow-hidden bg-muted mb-2">
                    {executor.imgPath ? (
                      <img
                        src={`${config.apiUrl}${executor.imgPath}`}
                        alt={executor.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-full w-full p-2 text-muted-foreground" />
                    )}
                  </div>
                  <div className="font-medium truncate w-full">{executor.name}</div>
                  <div className="text-xs text-muted-foreground truncate w-full">
                    {executor.description || "Executor"}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          {viewMode === "day" ? (
            <DayView
              executors={currentExecutors}
              ordersByExecutor={ordersByExecutor}
              handleOrderClick={handleOrderClick}
              getOrderCardStyle={getOrderCardStyle}
              getOrderCardColorClass={getOrderCardColorClass}
            />
          ) : (
            <WeekView
              executors={currentExecutors}
              orders={filteredOrders}
              weekDates={weekDates}
              handleOrderClick={handleOrderClick}
              getOrderCardColorClass={getOrderCardColorClass}
            />
          )}
        </div>
      </div>

      {/* Order Detail Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto">
          {selectedOrder && (
            <>
              <SheetHeader>
                <SheetTitle>Order Details</SheetTitle>
                <SheetDescription>Order ID: {selectedOrder.publicId.substring(0, 8)}...</SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Status</h3>
                  {renderStatusBadge(selectedOrder)}
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Appointment</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Date</p>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <p>{formatDate(selectedOrder.orderStart)}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Time</p>
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
                  <h3 className="text-lg font-medium">Client Information</h3>
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
                  <h3 className="text-lg font-medium">Services</h3>
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
                          <p className="font-medium">${item.servicePrice.toFixed(2)}</p>
                        </div>
                        <div className="mt-2 pt-2 border-t">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm">Executor: {item.executorName}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between pt-2">
                    <p className="font-medium">Total</p>
                    <p className="font-bold">${calculateOrderTotal(selectedOrder).toFixed(2)}</p>
                  </div>
                </div>

                {selectedOrder.comment && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Comment</h3>
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
                          Confirming...
                        </>
                      ) : (
                        <>
                          <CheckSquare className="mr-2 h-4 w-4" />
                          Confirm
                        </>
                      )}
                    </Button>
                  )}

                  {selectedOrder.confirmed && !selectedOrder.completed && (
                    <Button onClick={handleCompleteOrder} disabled={isCompleting} className="flex-1">
                      {isCompleting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Completing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark as Completed
                        </>
                      )}
                    </Button>
                  )}

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="flex-1">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete this order. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteOrder}
                          className="bg-red-500 hover:bg-red-600"
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            "Delete"
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
    </div>
  )
}

// Day View Component
const DayView = ({
  executors,
  ordersByExecutor,
  handleOrderClick,
  getOrderCardStyle,
  getOrderCardColorClass,
}: {
  executors: Executor[]
  ordersByExecutor: Record<string, Order[]>
  handleOrderClick: (order: Order) => void
  getOrderCardStyle: (order: Order) => React.CSSProperties
  getOrderCardColorClass: (order: Order) => string
}) => {
  return (
    <div className="flex relative">
      {/* Time column */}
      <div className="w-16 flex-shrink-0">
        {HOURS.map((hour) => (
          <div key={hour} className="h-20 border-b relative">
            <div className="absolute -top-2.5 left-0 text-xs text-muted-foreground">{hour}:00</div>
          </div>
        ))}
      </div>

      {/* Executor columns with appointments */}
      {executors.map((executor) => (
        <div key={executor.guid} className="flex-1 border-l relative">
          {/* Hour grid lines */}
          {HOURS.map((hour) => (
            <div key={hour} className="h-20 border-b"></div>
          ))}

          {/* Appointment cards */}
          {ordersByExecutor[executor.guid]?.map((order) => (
            <div
              key={order.publicId}
              className={cn(
                "absolute left-1 right-1 rounded-md border p-2 overflow-hidden cursor-pointer transition-opacity hover:opacity-90 z-10",
                getOrderCardColorClass(order),
              )}
              style={getOrderCardStyle(order)}
              onClick={() => handleOrderClick(order)}
            >
              <div className="text-xs font-medium truncate">
                {formatTime(order.orderStart)} - {formatTime(order.orderEnd)}
              </div>
              <div className="font-medium truncate">{order.clientName}</div>
              <div className="text-xs truncate">
                {order.items
                  .filter((item) => item.executorGuid === executor.guid)
                  .map((item) => item.serviceName)
                  .join(", ")}
              </div>
              <div className="text-xs text-muted-foreground truncate">{order.clientPhone}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

// Week View Component
const WeekView = ({
  executors,
  orders,
  weekDates,
  handleOrderClick,
  getOrderCardColorClass,
}: {
  executors: Executor[]
  orders: Order[]
  weekDates: Date[]
  handleOrderClick: (order: Order) => void
  getOrderCardColorClass: (order: Order) => string
}) => {
  return (
    <div className="grid" style={{ gridTemplateColumns: "auto repeat(7, 1fr)" }}>
      {/* Empty cell in top-left corner */}
      <div className="border-b border-r p-2"></div>

      {/* Day headers */}
      {weekDates.map((date, index) => (
        <div key={index} className="border-b border-r p-2 text-center">
          <div className="font-medium">{format(date, "EEE")}</div>
          <div className="text-sm">{format(date, "MMM d")}</div>
        </div>
      ))}

      {/* Executor rows */}
      {executors.map((executor) => (
        <React.Fragment key={executor.guid}>
          {/* Executor name */}
          <div className="border-b border-r p-2 sticky left-0 bg-background">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full overflow-hidden bg-muted">
                {executor.imgPath ? (
                  <img
                    src={`${config.apiUrl}${executor.imgPath}`}
                    alt={executor.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-full w-full p-1 text-muted-foreground" />
                )}
              </div>
              <div className="font-medium truncate">{executor.name}</div>
            </div>
          </div>

          {/* Day cells with appointments */}
          {weekDates.map((date, dateIndex) => {
            // Filter orders for this executor and date
            const dayOrders = orders.filter((order) => {
              const orderDate = new Date(order.orderStart)
              return isSameDay(orderDate, date) && order.items.some((item) => item.executorGuid === executor.guid)
            })

            return (
              <div key={dateIndex} className="border-b border-r p-1 min-h-[120px] relative">
                {dayOrders.map((order) => (
                  <div
                    key={order.publicId}
                    className={cn(
                      "mb-1 rounded-md border p-1 cursor-pointer transition-opacity hover:opacity-90 text-xs",
                      getOrderCardColorClass(order),
                    )}
                    onClick={() => handleOrderClick(order)}
                  >
                    <div className="font-medium truncate">
                      {formatTime(order.orderStart)} - {formatTime(order.orderEnd)}
                    </div>
                    <div className="truncate">{order.clientName}</div>
                    <div className="truncate">
                      {order.items
                        .filter((item) => item.executorGuid === executor.guid)
                        .map((item) => item.serviceName)
                        .join(", ")}
                    </div>
                  </div>
                ))}
              </div>
            )
          })}
        </React.Fragment>
      ))}
    </div>
  )
}

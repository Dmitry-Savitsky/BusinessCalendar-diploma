"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { format, addDays, startOfDay, isSameDay, startOfWeek, isWithinInterval } from "date-fns"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { getMyExecutorInfo } from "@/lib/api/executor"
import { getMyOrders, getOrderStatusInfo } from "@/lib/api/executor-orders"
import { formatDate, formatTime, calculateOrderTotal, type Order } from "@/lib/api/orders"
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
} from "lucide-react"
import { cn } from "@/lib/utils"
import { config } from "@/lib/config"
import { useTranslations } from 'next-intl'

type TranslationFunction = ReturnType<typeof useTranslations>

// Hours to display in the calendar (from 8:00 to 20:00)
const HOURS = Array.from({ length: 13 }, (_, i) => i + 8)

const TIMEZONE = "Europe/Minsk"

export default function ExecutorSchedulePage() {
  const t = useTranslations('executor.schedule')
  const { toast } = useToast()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [executor, setExecutor] = useState<any>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const [viewMode, setViewMode] = useState<"day" | "week">("day")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [executorData, ordersData] = await Promise.all([getMyExecutorInfo(), getMyOrders()])
      setExecutor(executorData)
      setOrders(ordersData)
    } catch (error) {
      toast({
        title: t('toast.loadError.title'),
        description: t('toast.loadError.description'),
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

  const handleCompleteOrder = async () => {
    if (!selectedOrder) return

    setIsCompleting(true)
    try {
      // In a real implementation, you would call an API to mark the order as completed
      toast({
        title: t('toast.completeSuccess.title'),
        description: t('toast.completeSuccess.description'),
      })

      // Update the order in the state
      const updatedOrders = orders.map((order) =>
        order.publicId === selectedOrder.publicId ? { ...order, completed: true } : order,
      )
      setOrders(updatedOrders)
      setSelectedOrder({ ...selectedOrder, completed: true })
    } catch (error) {
      toast({
        title: t('toast.completeError.title'),
        description: t('toast.completeError.description'),
        variant: "destructive",
      })
    } finally {
      setIsCompleting(false)
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
        const tzDate = new Date(orderDate.toLocaleString("en-US", { timeZone: TIMEZONE }))
        return isSameDay(tzDate, selectedDate)
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

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button variant={viewMode === "day" ? "default" : "outline"} size="sm" onClick={() => setViewMode("day")}>
              {t('viewMode.day')}
            </Button>
            <Button variant={viewMode === "week" ? "default" : "outline"} size="sm" onClick={() => setViewMode("week")}>
              {t('viewMode.week')}
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={viewMode === "day" ? handlePrevDay : handlePrevWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={handleToday}>
              {t('navigation.today')}
            </Button>
            <Button variant="outline" size="sm" onClick={viewMode === "day" ? handleNextDay : handleNextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center">
        {viewMode === "day" ? (
          <h3 className="text-xl font-medium">{format(selectedDate, t('navigation.dateFormat.day'))}</h3>
        ) : (
          <h3 className="text-xl font-medium">
            {t('navigation.dateFormat.weekRange', {
              startDate: format(weekDates[0], 'MMMM d'),
              endDate: format(weekDates[6], 'MMMM d, yyyy')
            })}
          </h3>
        )}
      </div>

      {/* Executor info card */}
      {executor && (
        <div className="bg-background border rounded-lg p-4 flex items-center gap-4 mb-4">
          <div className="h-16 w-16 rounded-full overflow-hidden bg-muted">
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
          <div>
            <h3 className="text-lg font-medium">{executor.name}</h3>
            <p className="text-sm text-muted-foreground">{executor.description || t('executor.defaultRole')}</p>
            <p className="text-sm text-muted-foreground">{executor.phone}</p>
          </div>
        </div>
      )}

      <div className="relative overflow-x-auto">
        {viewMode === "day" ? (
          <DayView
            orders={filteredOrders}
            handleOrderClick={handleOrderClick}
            getOrderCardStyle={getOrderCardStyle}
            getOrderCardColorClass={getOrderCardColorClass}
            t={t}
          />
        ) : (
          <WeekView
            orders={filteredOrders}
            weekDates={weekDates}
            handleOrderClick={handleOrderClick}
            getOrderCardColorClass={getOrderCardColorClass}
            t={t}
          />
        )}
      </div>

      {/* Order Detail Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto">
          {selectedOrder && (
            <>
              <SheetHeader>
                <SheetTitle>{t('orderDetails.title')}</SheetTitle>
                <SheetDescription>
                  {t('orderDetails.orderId', { id: selectedOrder.publicId.substring(0, 8) })}...
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">{t('orderDetails.sections.status')}</h3>
                  {renderStatusBadge(selectedOrder)}
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{t('orderDetails.sections.appointment.title')}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{t('orderDetails.sections.appointment.date')}</p>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <p>{formatDate(selectedOrder.orderStart)}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{t('orderDetails.sections.appointment.time')}</p>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <p>
                          {t('orderCard.time.range', {
                            startTime: formatTime(selectedOrder.orderStart),
                            endTime: formatTime(selectedOrder.orderEnd)
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{t('orderDetails.sections.client.title')}</h3>
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
                  <h3 className="text-lg font-medium">{t('orderDetails.sections.services.title')}</h3>
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
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between pt-2">
                    <p className="font-medium">{t('orderDetails.sections.services.total')}</p>
                    <p className="font-bold">${calculateOrderTotal(selectedOrder).toFixed(2)}</p>
                  </div>
                </div>

                {selectedOrder.comment && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">{t('orderDetails.sections.comments')}</h3>
                      <p className="text-sm">{selectedOrder.comment}</p>
                    </div>
                  </>
                )}

                <Separator />

                <div className="flex flex-wrap gap-2">
                  {selectedOrder.confirmed && !selectedOrder.completed && (
                    <Button onClick={handleCompleteOrder} disabled={isCompleting} className="flex-1">
                      {isCompleting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('orderDetails.actions.complete.loading')}
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          {t('orderDetails.actions.complete.button')}
                        </>
                      )}
                    </Button>
                  )}
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
  orders,
  handleOrderClick,
  getOrderCardStyle,
  getOrderCardColorClass,
  t,
}: {
  orders: Order[]
  handleOrderClick: (order: Order) => void
  getOrderCardStyle: (order: Order) => React.CSSProperties
  getOrderCardColorClass: (order: Order) => string
  t: TranslationFunction
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

      {/* Appointments column */}
      <div className="flex-1 border-l relative">
        {/* Hour grid lines */}
        {HOURS.map((hour) => (
          <div key={hour} className="h-20 border-b"></div>
        ))}

        {/* Appointment cards */}
        {orders.map((order) => (
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
              {t('orderCard.time.range', {
                startTime: formatTime(order.orderStart),
                endTime: formatTime(order.orderEnd)
              })}
            </div>
            <div className="font-medium truncate">{order.clientName}</div>
            <div className="text-xs truncate">{order.items.map((item) => item.serviceName).join(", ")}</div>
            <div className="text-xs text-muted-foreground truncate">{order.clientPhone}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Week View Component
const WeekView = ({
  orders,
  weekDates,
  handleOrderClick,
  getOrderCardColorClass,
  t,
}: {
  orders: Order[]
  weekDates: Date[]
  handleOrderClick: (order: Order) => void
  getOrderCardColorClass: (order: Order) => string
  t: TranslationFunction
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

      {/* Appointments row */}
      <div className="border-b border-r p-2 sticky left-0 bg-background">
        <div className="font-medium">{t('orderCard.services')}</div>
      </div>

      {/* Day cells with appointments */}
      {weekDates.map((date, dateIndex) => {
        // Filter orders for this date
        const dayOrders = orders.filter((order) => {
          const orderDate = new Date(order.orderStart)
          const tzDate = new Date(orderDate.toLocaleString("en-US", { timeZone: TIMEZONE }))
          return isSameDay(tzDate, date)
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
                  {t('orderCard.time.range', {
                    startTime: formatTime(order.orderStart),
                    endTime: formatTime(order.orderEnd)
                  })}
                </div>
                <div className="truncate">{order.clientName}</div>
                <div className="truncate">{order.items.map((item) => item.serviceName).join(", ")}</div>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}

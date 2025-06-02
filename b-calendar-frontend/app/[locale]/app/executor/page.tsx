"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, CheckCircle, AlertCircle, DollarSign } from "lucide-react"
import { useEffect, useState } from "react"
import { getToken, parseToken } from "@/lib/auth"
import { getMyOrders, calculateOrderStats } from "@/lib/api/executor-orders"
import type { Order } from "@/lib/api/orders"
import { formatDate, formatTime } from "@/lib/api/orders"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function ExecutorDashboard() {
  const [executorName, setExecutorName] = useState("Executor")
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken()
        if (token) {
          const tokenData = parseToken(token)
          setExecutorName(tokenData.name || "Executor")

          const ordersData = await getMyOrders()
          setOrders(ordersData)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load your orders. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const stats = calculateOrderStats(orders)

  // Get today's date for display
  const today = new Date()
  const todayFormatted = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">{todayFormatted}</p>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todaysOrders.length}</div>
              {stats.todaysOrders.length > 0 ? (
                <p className="text-xs text-muted-foreground">Next at {formatTime(stats.todaysOrders[0].orderStart)}</p>
              ) : (
                <p className="text-xs text-muted-foreground">No appointments today</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedOrders}</div>
              <p className="text-xs text-muted-foreground">
                {((stats.completedOrders / stats.totalOrders) * 100 || 0).toFixed(0)}% completion rate
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming This Week</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.thisWeeksOrders.length}</div>
              <p className="text-xs text-muted-foreground">{stats.upcomingOrders} total upcoming</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue}</div>
              <p className="text-xs text-muted-foreground">${stats.upcomingRevenue} upcoming</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Analytics Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Service Distribution</CardTitle>
            <CardDescription>Breakdown of your services by type</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="space-y-1">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
              </div>
            ) : stats.serviceTypeData.length > 0 ? (
              <div className="space-y-4">
                {stats.serviceTypeData.map((service) => {
                  const percentage = (service.count / stats.totalOrders) * 100
                  return (
                    <div key={service.type} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{service.name}</span>
                        <span className="text-sm text-muted-foreground">{service.count} orders</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-muted-foreground">No service data available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
            <CardDescription>Overview of your order statuses</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="space-y-1">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Completed</span>
                    <span className="text-sm text-muted-foreground">{stats.completedOrders} orders</span>
                  </div>
                  <Progress value={(stats.completedOrders / stats.totalOrders) * 100 || 0} className="h-2 bg-muted" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Upcoming</span>
                    <span className="text-sm text-muted-foreground">{stats.upcomingOrders} orders</span>
                  </div>
                  <Progress value={(stats.upcomingOrders / stats.totalOrders) * 100 || 0} className="h-2 bg-muted" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Pending</span>
                    <span className="text-sm text-muted-foreground">{stats.pendingOrders} orders</span>
                  </div>
                  <Progress value={(stats.pendingOrders / stats.totalOrders) * 100 || 0} className="h-2 bg-muted" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="today">
        <TabsList>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        </TabsList>
        <TabsContent value="today" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>
                {stats.todaysOrders.length > 0
                  ? `You have ${stats.todaysOrders.length} appointments scheduled for today`
                  : "You have no appointments scheduled for today"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-center space-x-4 rounded-md border p-4">
                        <div className="flex-1 space-y-1">
                          <Skeleton className="h-5 w-20" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <Skeleton className="h-5 w-16" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="h-8 w-24 rounded-full" />
                      </div>
                    ))}
                </div>
              ) : stats.todaysOrders.length > 0 ? (
                <div className="space-y-4">
                  {stats.todaysOrders
                    .sort((a, b) => new Date(a.orderStart).getTime() - new Date(b.orderStart).getTime())
                    .map((order) => (
                      <div key={order.publicId} className="flex items-center space-x-4 rounded-md border p-4">
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {formatTime(order.orderStart)} - {formatTime(order.orderEnd)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {order.items.map((item) => item.serviceName).join(", ")}
                          </p>
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">Client</p>
                          <p className="text-sm text-muted-foreground">
                            {order.clientName} • {order.clientPhone}
                          </p>
                        </div>
                        <div>
                          {order.completed ? (
                            <Badge
                              variant="outline"
                              className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            >
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Completed
                            </Badge>
                          ) : order.confirmed ? (
                            <Badge
                              variant="outline"
                              className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                            >
                              <Clock className="mr-1 h-3 w-3" />
                              Confirmed
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                            >
                              <AlertCircle className="mr-1 h-3 w-3" />
                              Pending
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No appointments scheduled for today</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>
                {stats.upcomingOrders > 0
                  ? `You have ${stats.upcomingOrders} upcoming appointments`
                  : "You have no upcoming appointments"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-center space-x-4 rounded-md border p-4">
                        <div className="flex-1 space-y-1">
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <Skeleton className="h-5 w-24" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-8 w-24 rounded-full" />
                      </div>
                    ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {orders
                    .filter((order) => {
                      const orderDate = new Date(order.orderStart)
                      return orderDate > new Date() && !order.completed
                    })
                    .sort((a, b) => new Date(a.orderStart).getTime() - new Date(b.orderStart).getTime())
                    .slice(0, 5)
                    .map((order) => (
                      <div key={order.publicId} className="flex items-center space-x-4 rounded-md border p-4">
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">{formatDate(order.orderStart)}</p>
                          <p className="text-sm text-muted-foreground">{formatTime(order.orderStart)}</p>
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {order.items.map((item) => item.serviceName).join(", ")}
                          </p>
                          <p className="text-sm text-muted-foreground">{order.clientName}</p>
                        </div>
                        <div>
                          {order.confirmed ? (
                            <Badge
                              variant="outline"
                              className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                            >
                              <Clock className="mr-1 h-3 w-3" />
                              Confirmed
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                            >
                              <AlertCircle className="mr-1 h-3 w-3" />
                              Pending
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

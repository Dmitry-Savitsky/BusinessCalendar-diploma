"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import type { DateRange } from "react-day-picker"
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts"
import {
  Package,
  CheckCircle,
  Clock,
  AlertCircle,
  CalendarIcon,
  BarChart3,
  PieChartIcon,
  TrendingUp,
  Users,
  Filter,
  ChevronDown,
} from "lucide-react"
import {
  getAllOrders,
  processOrderStatistics,
  getOrderCalendarData,
  getOrdersForToday,
  getOrdersForWeek,
  getOrdersForMonth,
  getOrdersByDateRange,
  type Order,
} from "@/lib/api/orders"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { config } from "@/lib/config"
import { useTranslations } from 'next-intl'

export default function DashboardPage() {
  const t = useTranslations('dashboard')
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [statistics, setStatistics] = useState<any>(null)
  const [dateFilter, setDateFilter] = useState<string>("month")
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  })
  const { toast } = useToast()

  const fetchOrdersByFilter = async (filter: string) => {
    try {
      setLoading(true)
      let ordersData

      switch (filter) {
        case "today":
          ordersData = await getOrdersForToday()
          setDateRange({
            from: new Date(),
            to: new Date(),
          })
          break
        case "week":
          ordersData = await getOrdersForWeek()
          setDateRange({
            from: startOfWeek(new Date()),
            to: endOfWeek(new Date()),
          })
          break
        case "month":
          ordersData = await getOrdersForMonth()
          setDateRange({
            from: startOfMonth(new Date()),
            to: endOfMonth(new Date()),
          })
          break
        case "custom":
          if (dateRange?.from && dateRange?.to) {
            ordersData = await getOrdersByDateRange(dateRange.from, dateRange.to)
          } else {
            ordersData = await getAllOrders()
          }
          break
        default:
          ordersData = await getAllOrders()
      }

      setOrders(ordersData)
      const stats = processOrderStatistics(ordersData)
      setStatistics(stats)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to load order data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrdersByFilter(dateFilter)
  }, [dateFilter, toast])

  // Apply custom date range
  const applyDateRange = async () => {
    if (dateRange?.from && dateRange?.to) {
      setDateFilter("custom")
      await fetchOrdersByFilter("custom")
    }
  }

  // Colors for charts
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#8dd1e1",
    "#a4de6c",
    "#d0ed57",
  ]

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                {dateFilter === "today"
                  ? t('filters.today')
                  : dateFilter === "week"
                    ? t('filters.thisWeek')
                    : dateFilter === "month"
                      ? t('filters.thisMonth')
                      : t('filters.customRange')}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setDateFilter("today")}>{t('filters.today')}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateFilter("week")}>{t('filters.thisWeek')}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateFilter("month")}>{t('filters.thisMonth')}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  t('filters.pickDate')
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
              <div className="flex items-center justify-end gap-2 p-3 border-t">
                <Button variant="outline" size="sm" onClick={() => setDateRange(undefined)}>
                  {t('filters.reset')}
                </Button>
                <Button size="sm" onClick={applyDateRange}>
                  {t('filters.apply')}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      ) : statistics ? (
        <>
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('metrics.totalOrders.title')}</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.totalOrders}</div>
                <p className="text-xs text-muted-foreground">
                  {dateFilter === "today"
                    ? t('metrics.totalOrders.period.today')
                    : dateFilter === "week"
                      ? t('metrics.totalOrders.period.week')
                      : dateFilter === "month"
                        ? t('metrics.totalOrders.period.month')
                        : t('metrics.totalOrders.period.selected')}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('metrics.confirmedOrders.title')}</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.confirmedOrders}</div>
                <p className="text-xs text-muted-foreground">
                  {((statistics.confirmedOrders / statistics.totalOrders) * 100 || 0).toFixed(1)}{t('metrics.confirmedOrders.ofTotal')}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('metrics.completedOrders.title')}</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.completedOrders}</div>
                <p className="text-xs text-muted-foreground">
                  {((statistics.completedOrders / statistics.totalOrders) * 100 || 0).toFixed(1)}{t('metrics.completedOrders.ofTotal')}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('metrics.pendingOrders.title')}</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.pendingOrders}</div>
                <p className="text-xs text-muted-foreground">
                  {((statistics.pendingOrders / statistics.totalOrders) * 100 || 0).toFixed(1)}{t('metrics.pendingOrders.ofTotal')}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - 3 Columns */}
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
            {/* Column 1: Performers */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    {t('charts.topPerformers.title')}
                  </CardTitle>
                  <CardDescription>{t('charts.topPerformers.description')}</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ChartContainer
                    config={{
                      revenue: {
                        label: t('charts.topPerformers.revenue'),
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={statistics.topPerformers}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis
                          type="category"
                          dataKey="name"
                          width={100}
                          tickFormatter={(value) => (value.length > 12 ? `${value.substring(0, 12)}...` : value)}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5" />
                    {t('charts.orderDistribution.title')}
                  </CardTitle>
                  <CardDescription>{t('charts.orderDistribution.description')}</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ChartContainer
                    config={{
                      value: {
                        label: t('charts.orderDistribution.orders'),
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statistics.orderDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {statistics.orderDistribution.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Column 2: Orders */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    {t('charts.orderDynamics.title')}
                  </CardTitle>
                  <CardDescription>{t('charts.orderDynamics.description')}</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ChartContainer
                    config={{
                      orders: {
                        label: t('charts.orderDynamics.orders'),
                        color: "hsl(var(--chart-1))",
                      },
                      revenue: {
                        label: t('charts.orderDynamics.revenue'),
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={statistics.ordersByDay} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="orders"
                          stroke="#8884d8"
                          activeDot={{ r: 8 }}
                          name="Orders"
                        />
                        <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#82ca9d" name="Revenue" />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    {t('charts.orderStatusFunnel.title')}
                  </CardTitle>
                  <CardDescription>{t('charts.orderStatusFunnel.description')}</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <div className="flex flex-col h-full justify-center">
                    <div className="relative h-[200px] mx-auto">
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[250px] h-[60px] bg-primary/20 rounded-t-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="font-medium">{t('charts.orderStatusFunnel.allOrders')}</div>
                          <div className="text-sm">{statistics.orderStatusMap.all}</div>
                        </div>
                      </div>

                      <div className="absolute top-[70px] left-1/2 transform -translate-x-1/2 w-[200px] h-[60px] bg-primary/40 flex items-center justify-center">
                        <div className="text-center">
                          <div className="font-medium">{t('charts.orderStatusFunnel.confirmed')}</div>
                          <div className="text-sm">
                            {statistics.orderStatusMap.confirmed}
                            <span className="text-xs ml-1">
                              ({((statistics.orderStatusMap.confirmed / statistics.orderStatusMap.all) * 100).toFixed(0)}%)
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="absolute top-[140px] left-1/2 transform -translate-x-1/2 w-[150px] h-[60px] bg-primary/60 rounded-b-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="font-medium">{t('charts.orderStatusFunnel.completed')}</div>
                          <div className="text-sm">
                            {statistics.orderStatusMap.completed}
                            <span className="text-xs ml-1">
                              ({((statistics.orderStatusMap.completed / statistics.orderStatusMap.all) * 100).toFixed(0)}%)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Column 3: Services */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    {t('charts.topServices.title')}
                  </CardTitle>
                  <CardDescription>{t('charts.topServices.description')}</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ChartContainer
                    config={{
                      count: {
                        label: t('charts.orderDistribution.orders'),
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={statistics.topServices}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis
                          type="category"
                          dataKey="name"
                          width={100}
                          tickFormatter={(value) => (value.length > 12 ? `${value.substring(0, 12)}...` : value)}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="count" fill="#82ca9d" name="Orders" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    {t('charts.pricePopularity.title')}
                  </CardTitle>
                  <CardDescription>{t('charts.pricePopularity.description')}</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ChartContainer
                    config={{
                      price: {
                        label: t('charts.pricePopularity.price'),
                        color: "hsl(var(--chart-1))",
                      },
                      popularity: {
                        label: t('charts.pricePopularity.popularity'),
                        color: "hsl(var(--chart-2))",
                      },
                      revenue: {
                        label: t('charts.pricePopularity.revenue'),
                        color: "hsl(var(--chart-3))",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid />
                        <XAxis type="number" dataKey="price" name="Price" unit="$" />
                        <YAxis type="number" dataKey="popularity" name="Popularity" unit=" orders" />
                        <ZAxis type="number" dataKey="revenue" range={[60, 400]} name="Revenue" unit="$" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Scatter name="Services" data={statistics.priceVsPopularity} fill="#8884d8" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-10">
          <p>{t('errors.loadFailed')}</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            {t('errors.refresh')}
          </Button>
        </div>
      )}
    </div>
  )
}

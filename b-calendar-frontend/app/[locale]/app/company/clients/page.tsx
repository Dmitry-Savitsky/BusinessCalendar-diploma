"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"
import { Search, Phone, MapPin, User, Package, DollarSign, TrendingUp, BarChart3, PieChartIcon } from "lucide-react"
import { getAllOrders } from "@/lib/api/orders"
import { getAllClients, processClientStatistics } from "@/lib/api/clients"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { useTranslations } from 'next-intl'

export default function ClientsPage() {
  const t = useTranslations('clients')
  const [loading, setLoading] = useState(true)
  const [clients, setClients] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [statistics, setStatistics] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [ordersData, clientsData] = await Promise.all([getAllOrders(), getAllClients()])

        setOrders(ordersData)
        setClients(clientsData)

        // Process statistics
        const stats = processClientStatistics(ordersData)
        setStatistics(stats)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: t('errors.loadFailed'),
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast, t])

  // Filter clients based on search query
  const filteredClients = clients.filter(
    (client) =>
      client.clientName.toLowerCase().includes(searchQuery.toLowerCase()) || client.clientPhone.includes(searchQuery),
  )

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
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      ) : statistics ? (
        <>
          {/* Overview Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('metrics.totalClients.title')}</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.totalClients}</div>
                <p className="text-xs text-muted-foreground">{t('metrics.totalClients.description')}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('metrics.totalOrders.title')}</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.totalOrders}</div>
                <p className="text-xs text-muted-foreground">{t('metrics.totalOrders.description')}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('metrics.totalRevenue.title')}</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${statistics.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">{t('metrics.totalRevenue.description')}</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <Tabs defaultValue="charts" className="space-y-4">
            <TabsList>
              <TabsTrigger value="charts" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                {t('tabs.analytics')}
              </TabsTrigger>
              <TabsTrigger value="clients" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {t('tabs.clientList')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="charts" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Service Distribution Pie Chart */}
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChartIcon className="h-5 w-5" />
                      {t('charts.serviceDistribution.title')}
                    </CardTitle>
                    <CardDescription>{t('charts.serviceDistribution.description')}</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[350px] overflow-hidden">
                    <ChartContainer
                      config={{
                        services: {
                          label: t('charts.serviceDistribution.label'),
                          color: "hsl(var(--chart-1))",
                        },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={statistics.serviceDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {statistics.serviceDistribution.map((entry: any, index: number) => (
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

                {/* Top Clients Bar Chart */}
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      {t('charts.topCustomers.title')}
                    </CardTitle>
                    <CardDescription>{t('charts.topCustomers.description')}</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[350px] overflow-hidden">
                    <ChartContainer
                      config={{
                        orders: {
                          label: t('charts.topCustomers.label'),
                          color: "hsl(var(--chart-1))",
                        },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={statistics.topClients}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="orders" fill="#8884d8" name={t('charts.topCustomers.label')} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Orders and Revenue Line Chart */}
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    {t('charts.ordersDynamics.title')}
                  </CardTitle>
                  <CardDescription>{t('charts.ordersDynamics.description')}</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <ChartContainer
                    config={{
                      orders: {
                        label: t('charts.ordersDynamics.orders'),
                        color: "hsl(var(--chart-1))",
                      },
                      revenue: {
                        label: t('charts.ordersDynamics.revenue'),
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={statistics.ordersByDay}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
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
                          name={t('charts.ordersDynamics.orders')}
                        />
                        <Line 
                          yAxisId="right" 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#82ca9d" 
                          name={t('charts.ordersDynamics.revenue')} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="clients">
              <Card>
                <CardHeader>
                  <CardTitle>{t('clientList.title')}</CardTitle>
                  <CardDescription>{t('clientList.description')}</CardDescription>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder={t('clientList.search')}
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredClients.length === 0 ? (
                      <p className="text-center text-muted-foreground py-4">
                        {searchQuery ? t('clientList.noResults.withSearch') : t('clientList.noResults.noClients')}
                      </p>
                    ) : (
                      filteredClients.map((client) => (
                        <Card key={client.publicId} className="overflow-hidden">
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                              <div>
                                <h3 className="font-medium">{client.clientName}</h3>
                                <div className="flex items-center text-sm text-muted-foreground mt-1">
                                  <Phone className="mr-1 h-3.5 w-3.5" />
                                  <span>{client.clientPhone}</span>
                                </div>
                                {client.addresses && client.addresses.length > 0 && (
                                  <div className="flex items-start text-sm text-muted-foreground mt-1">
                                    <MapPin className="mr-1 h-3.5 w-3.5 mt-0.5" />
                                    <div>
                                      {client.addresses.map((addr: any, i: number) => (
                                        <div key={addr.id || i}>{addr.address}</div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">
                                  {t('clientList.buttons.viewOrders')}
                                </Button>
                                <Button variant="outline" size="sm">
                                  {t('clientList.buttons.edit')}
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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

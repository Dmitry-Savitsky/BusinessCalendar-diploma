"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, CartesianGrid, XAxis, YAxis, BarChart, Bar, LineChart, Line } from "recharts"
import { Search, Phone, MapPin, User, TrendingUp, BarChart3, PieChartIcon } from "lucide-react"
import { useTranslations } from 'next-intl'
import type { Client } from "@/lib/api/clients"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658", "#8dd1e1", "#a4de6c", "#d0ed57"]

interface Props {
  statistics: any
  searchQuery: string
  onSearchChange: (v: string) => void
  clients: Client[]
}

export default function ClientsAnalytics({ statistics, searchQuery, onSearchChange, clients }: Props) {
  const t = useTranslations('clients')
  const filteredClients = clients.filter((c) => c.clientName.toLowerCase().includes(searchQuery.toLowerCase()) || c.clientPhone.includes(searchQuery))

  return (
    <Tabs defaultValue="charts" className="space-y-4">
      <TabsList>
        <TabsTrigger value="charts" className="flex items-center gap-2"><BarChart3 className="h-4 w-4" />{t('tabs.analytics')}</TabsTrigger>
        <TabsTrigger value="clients" className="flex items-center gap-2"><User className="h-4 w-4" />{t('tabs.clientList')}</TabsTrigger>
      </TabsList>

      <TabsContent value="charts" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><PieChartIcon className="h-5 w-5" />{t('charts.serviceDistribution.title')}</CardTitle>
              <CardDescription>{t('charts.serviceDistribution.description')}</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px] overflow-hidden">
              <ChartContainer config={{ services: { label: t('charts.serviceDistribution.label'), color: "hsl(var(--chart-1))" } }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statistics.serviceDistribution} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                      {statistics.serviceDistribution.map((_: any, i: number) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" />{t('charts.topCustomers.title')}</CardTitle>
              <CardDescription>{t('charts.topCustomers.description')}</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px] overflow-hidden">
              <ChartContainer config={{ orders: { label: t('charts.topCustomers.label'), color: "hsl(var(--chart-1))" } }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statistics.topClients} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />{t('charts.ordersDynamics.title')}</CardTitle>
            <CardDescription>{t('charts.ordersDynamics.description')}</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ChartContainer config={{ orders: { label: t('charts.ordersDynamics.orders'), color: "hsl(var(--chart-1))" }, revenue: { label: t('charts.ordersDynamics.revenue'), color: "hsl(var(--chart-2))" } }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={statistics.ordersByDay} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line yAxisId="left" type="monotone" dataKey="orders" stroke="#8884d8" activeDot={{ r: 6 }} name={t('charts.ordersDynamics.orders')} />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#82ca9d" name={t('charts.ordersDynamics.revenue')} />
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
              <Input type="search" placeholder={t('clientList.search')} className="pl-8" value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredClients.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">{searchQuery ? t('clientList.noResults.withSearch') : t('clientList.noResults.noClients')}</p>
              ) : (
                filteredClients.map((client) => (
                  <Card key={client.publicId} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div>
                          <h3 className="font-medium">{client.clientName}</h3>
                          <div className="flex items-center text-sm text-muted-foreground mt-1"><Phone className="mr-1 h-3.5 w-3.5" /><span>{client.clientPhone}</span></div>
                          {client.addresses && client.addresses.length > 0 && (
                            <div className="flex items-start text-sm text-muted-foreground mt-1">
                              <MapPin className="mr-1 h-3.5 w-3.5 mt-0.5" />
                              <div>
                                {client.addresses.map((addr, i) => (<div key={addr.id || i}>{addr.address}</div>))}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">{t('clientList.buttons.viewOrders')}</Button>
                          <Button variant="outline" size="sm">{t('clientList.buttons.edit')}</Button>
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
  )
}




"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis, ZAxis, Pie, PieChart } from "recharts"
import { BarChart3, PieChart as PieChartIcon, TrendingUp } from "lucide-react"
import { useTranslations } from "next-intl"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658", "#8dd1e1", "#a4de6c", "#d0ed57"]

interface Props {
  statistics: any
}

export function Charts({ statistics }: Props) {
  const t = useTranslations('dashboard')
  return (
    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
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
            <ChartContainer config={{ revenue: { label: t('charts.topPerformers.revenue'), color: "hsl(var(--chart-1))" } }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statistics.topPerformers} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={100} tickFormatter={(value) => (value.length > 12 ? `${value.substring(0, 12)}...` : value)} />
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
            <ChartContainer config={{ value: { label: t('charts.orderDistribution.orders'), color: "hsl(var(--chart-1))" } }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statistics.orderDistribution} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
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
            <ChartContainer config={{
              orders: { label: t('charts.orderDynamics.orders'), color: "hsl(var(--chart-1))" },
              revenue: { label: t('charts.orderDynamics.revenue'), color: "hsl(var(--chart-2))" },
            }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={statistics.ordersByDay} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="orders" stroke="#8884d8" activeDot={{ r: 8 }} name="Orders" />
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
                    <div className="text-sm">{statistics.orderStatusMap.confirmed}<span className="text-xs ml-1">({((statistics.orderStatusMap.confirmed / statistics.orderStatusMap.all) * 100).toFixed(0)}%)</span></div>
                  </div>
                </div>
                <div className="absolute top-[140px] left-1/2 transform -translate-x-1/2 w-[150px] h-[60px] bg-primary/60 rounded-b-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="font-medium">{t('charts.orderStatusFunnel.completed')}</div>
                    <div className="text-sm">{statistics.orderStatusMap.completed}<span className="text-xs ml-1">({((statistics.orderStatusMap.completed / statistics.orderStatusMap.all) * 100).toFixed(0)}%)</span></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
            <ChartContainer config={{ count: { label: t('charts.orderDistribution.orders'), color: "hsl(var(--chart-1))" } }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statistics.topServices} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={100} tickFormatter={(value) => (value.length > 12 ? `${value.substring(0, 12)}...` : value)} />
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
            <ChartContainer config={{
              price: { label: t('charts.pricePopularity.price'), color: "hsl(var(--chart-1))" },
              popularity: { label: t('charts.pricePopularity.popularity'), color: "hsl(var(--chart-2))" },
              revenue: { label: t('charts.pricePopularity.revenue'), color: "hsl(var(--chart-3))" },
            }}>
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
  )
}

export default Charts


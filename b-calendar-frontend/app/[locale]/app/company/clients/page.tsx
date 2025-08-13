"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useTranslations } from 'next-intl'
import { useCompanyClients } from "./_hooks/useCompanyClients"
import ClientsAnalytics from "./_components/ClientsAnalytics" 
import { User, Package, DollarSign } from "lucide-react"

export default function ClientsPage() {
  const t = useTranslations('clients')
  const [state, api] = useCompanyClients()

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>
      </div>

      {state.loading ? (
        <div className="grid gap-4 md:grid-cols-3"><Skeleton className="h-32" /><Skeleton className="h-32" /><Skeleton className="h-32" /></div>
      ) : state.statistics ? (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('metrics.totalClients.title')}</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{state.statistics.totalClients}</div>
                <p className="text-xs text-muted-foreground">{t('metrics.totalClients.description')}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('metrics.totalOrders.title')}</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{state.statistics.totalOrders}</div>
                <p className="text-xs text-muted-foreground">{t('metrics.totalOrders.description')}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('metrics.totalRevenue.title')}</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{state.statistics.totalRevenue.toLocaleString()} BYN</div>
                <p className="text-xs text-muted-foreground">{t('metrics.totalRevenue.description')}</p>
              </CardContent>
            </Card>
          </div>

          <ClientsAnalytics statistics={state.statistics} searchQuery={state.searchQuery} onSearchChange={api.setSearchQuery} clients={state.clients} />
        </>
      ) : null}
    </div>
  )
}

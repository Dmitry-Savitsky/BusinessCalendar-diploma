"use client"

import { useState } from "react"
import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus } from "lucide-react"
import { useCompanyOrders } from "./_hooks/useCompanyOrders"
import OrdersFilters, { OrdersControls, EmptyState } from "./_components/OrdersFilters"
import OrdersList from "./_components/OrdersList"
import OrderDetailsDrawer from "./_components/OrderDetailsDrawer"
import CreateOrderDialog from "./_components/CreateOrderDialog"

export default function OrdersPage() {
  const t = useTranslations('orders')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [state, api] = useCompanyOrders()

  const hasFilters = !!state.searchQuery || state.statusFilter !== "all" || state.dateFilter !== "all"

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <OrdersFilters
        searchQuery={state.searchQuery}
        onSearchChange={api.setSearchQuery}
        statusFilter={state.statusFilter}
        onStatusChange={(v) => api.setStatusFilter(v as any)}
        dateFilter={state.dateFilter}
        onDateChange={(v) => api.setDateFilter(v as any)}
        onRefresh={() => api.refresh()}
      />

      <OrdersControls
        searchQuery={state.searchQuery}
        onSearchChange={api.setSearchQuery}
        statusFilter={state.statusFilter}
        onStatusChange={(v) => api.setStatusFilter(v as any)}
        dateFilter={state.dateFilter}
        onDateChange={(v) => api.setDateFilter(v as any)}
      />

      {state.loading ? (
        <div className="flex h-[200px] items-center justify-center">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      ) : state.filteredOrders.length === 0 ? (
        <EmptyState
          hasFilters={hasFilters}
          onClear={() => {
            api.setSearchQuery("")
            api.setStatusFilter("all")
            api.setDateFilter("all")
          }}
        />
      ) : (
        <OrdersList orders={state.filteredOrders} onClick={api.openOrder} />
      )}

      <div className="flex justify-end">
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t('actions.create')}
                      </Button>
            </div>

      <OrderDetailsDrawer
        open={state.isDrawerOpen}
        onOpenChange={api.closeDrawer}
        order={state.selectedOrder}
        isConfirming={state.isConfirming}
        isCompleting={state.isCompleting}
        isDeleting={state.isDeleting}
        onConfirm={api.confirm}
        onComplete={api.complete}
        onDelete={api.deleteOrder}
      />

      <CreateOrderDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} onCreated={api.refresh} />
    </div>
  )
}



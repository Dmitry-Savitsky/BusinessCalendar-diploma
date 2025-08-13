"use client"

import { useTranslations } from 'next-intl'
import OrdersGrid from "./_components/OrdersGrid"
import OrderDetailsDialog from "./_components/OrderDetailsDialog"
import { useExecutorOrders } from "./_hooks/useExecutorOrders"

export default function ExecutorOrdersPage() {
  const t = useTranslations('executor.orders')
  const [state, api] = useExecutorOrders()

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>
      </div>

      <OrdersGrid
        loading={state.loading}
        orders={state.orders}
        tab={state.tab}
        onTabChange={api.setTab}
        onDetails={api.openDetails}
      />

      <OrderDetailsDialog
        open={state.dialogOpen}
        onOpenChange={api.closeDetails}
        order={state.selectedOrder}
      />
    </div>
  )
}



"use client"

import React, { useMemo } from "react"
import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Loader2, User } from "lucide-react"
import { useParams } from 'next/navigation'
import { config } from "@/lib/config"
import { useCompanySchedule, getWeekDates, filterOrdersByView } from "./_hooks/useCompanySchedule"
import { DayView, WeekView } from "./_components/ScheduleViews"
import OrderDetailsSheet from "./_components/OrderDetailsSheet"
import { getOrderStatusInfo, type Order } from "@/lib/api/orders"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, AlertCircle, Activity } from "lucide-react"

export default function SchedulePage() {
  const t = useTranslations('schedule')
  const [state, api, constants] = useCompanySchedule()
  const params = useParams()
  const locale = params.locale as string

  const weekDates = useMemo(() => getWeekDates(state.selectedDate), [state.selectedDate])
  const filteredOrders = useMemo(() => filterOrdersByView(state.orders, state.selectedDate, state.viewMode, weekDates), [state.orders, state.selectedDate, state.viewMode, weekDates])

  const totalPages = Math.ceil(state.executors.length / constants.EXECUTORS_PER_PAGE)
  const currentExecutors = useMemo(() => {
    const startIndex = state.currentPage * constants.EXECUTORS_PER_PAGE
    return state.executors.slice(startIndex, startIndex + constants.EXECUTORS_PER_PAGE)
  }, [state.executors, state.currentPage, constants.EXECUTORS_PER_PAGE])

  const ordersByExecutor = useMemo(() => {
    const result: Record<string, Order[]> = {}
    currentExecutors.forEach((e) => { result[e.guid] = [] })
    filteredOrders.forEach((order) => {
      order.items.forEach((item) => {
        if (result[item.executorGuid]) {
          const already = result[item.executorGuid].some((o) => o.publicId === order.publicId)
          if (!already) result[item.executorGuid].push(order)
        }
      })
    })
    return result
  }, [currentExecutors, filteredOrders])

  if (state.loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">{t('loading.schedule')}</p>
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
            <Button variant={state.viewMode === "day" ? "default" : "outline"} size="sm" onClick={() => api.setViewMode("day")}>{t('viewMode.day')}</Button>
            <Button variant={state.viewMode === "week" ? "default" : "outline"} size="sm" onClick={() => api.setViewMode("week")}>{t('viewMode.week')}</Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={state.viewMode === "day" ? api.prevDay : api.prevWeek}><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" onClick={api.today}>{t('navigation.today')}</Button>
            <Button variant="outline" size="sm" onClick={state.viewMode === "day" ? api.nextDay : api.nextWeek}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center">
        {state.viewMode === "day" ? (
          <h3 className="text-xl font-medium">{state.selectedDate.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</h3>
        ) : (
          <h3 className="text-xl font-medium">{weekDates[0].toLocaleDateString(undefined, { day: 'numeric', month: 'long' })} - {weekDates[6].toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</h3>
        )}
      </div>

      {state.executors.length > constants.EXECUTORS_PER_PAGE && (
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={api.prevPage} disabled={state.currentPage === 0} className="flex items-center gap-1"><ChevronLeft className="h-4 w-4" /> {t('navigation.previous')}</Button>
          <div className="text-sm text-muted-foreground">{t('navigation.page', { number: state.currentPage + 1, total: totalPages })}</div>
          <Button variant="outline" size="sm" onClick={api.nextPage} disabled={state.currentPage >= totalPages - 1} className="flex items-center gap-1">{t('navigation.next')} <ChevronRight className="h-4 w-4" /></Button>
        </div>
      )}

      <div className="relative overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="flex border-b">
            <div className="w-16 flex-shrink-0"></div>
            {currentExecutors.map((executor) => (
              <div key={executor.guid} className="flex-1 p-2 text-center border-l">
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full overflow-hidden bg-muted mb-2">
                    {executor.imgPath ? (<img src={`${config.apiUrl}${executor.imgPath}`} alt={executor.name} className="h-full w-full object-cover" />) : (<User className="h-full w-full p-2 text-muted-foreground" />)}
                  </div>
                  <div className="font-medium truncate w-full">{executor.name}</div>
                  <div className="text-xs text-muted-foreground truncate w-full">{executor.description || "Executor"}</div>
                </div>
              </div>
            ))}
          </div>

          {state.viewMode === "day" ? (
            <DayView executors={currentExecutors} hours={constants.HOURS} ordersByExecutor={ordersByExecutor} onOrderClick={api.openOrder} getOrderCardStyle={(order) => {
              const startTime = new Date(order.orderStart)
              const endTime = new Date(order.orderEnd)
              const hourHeight = 100 / constants.HOURS.length
              const startHour = startTime.getHours()
              const startMinute = startTime.getMinutes()
              const top = (startHour - constants.HOURS[0] + startMinute / 60) * hourHeight
              const height = Math.max(((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)) * hourHeight, 10)
              return { top: `${top}%`, height: `${height}%`, minHeight: "60px" }
            }} getOrderCardColorClass={(order) => {
              if (order.completed) return "bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-700"
              const serviceType = order.items[0]?.serviceType || 1
              const colorClasses = [
                "bg-blue-100 border-blue-300 dark:bg-blue-900/30 dark:border-blue-700",
                "bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-700",
                "bg-purple-100 border-purple-300 dark:bg-purple-900/30 dark:border-purple-700",
                "bg-pink-100 border-pink-300 dark:bg-pink-900/30 dark:border-pink-700",
                "bg-orange-100 border-orange-300 dark:bg-orange-900/30 dark:border-orange-700",
                "bg-cyan-100 border-cyan-300 dark:bg-cyan-900/30 dark:border-cyan-700",
              ]
              return colorClasses[(serviceType - 1) % colorClasses.length]
            }} locale={locale} />
          ) : (
            <WeekView executors={currentExecutors} orders={filteredOrders} weekDates={weekDates} onOrderClick={api.openOrder} getOrderCardColorClass={(order) => {
              if (order.completed) return "bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-700"
              const serviceType = order.items[0]?.serviceType || 1
              const colorClasses = [
                "bg-blue-100 border-blue-300 dark:bg-blue-900/30 dark:border-blue-700",
                "bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-700",
                "bg-purple-100 border-purple-300 dark:bg-purple-900/30 dark:border-purple-700",
                "bg-pink-100 border-pink-300 dark:bg-pink-900/30 dark:border-pink-700",
                "bg-orange-100 border-orange-300 dark:bg-orange-900/30 dark:border-orange-700",
                "bg-cyan-100 border-cyan-300 dark:bg-cyan-900/30 dark:border-cyan-700",
              ]
              return colorClasses[(serviceType - 1) % colorClasses.length]
            }} locale={locale} />
          )}
        </div>
      </div>

      <OrderDetailsSheet
        open={state.isDrawerOpen}
        onOpenChange={api.closeDrawer}
        order={state.selectedOrder}
        isConfirming={false}
        isCompleting={false}
        isDeleting={false}
        onConfirm={() => {}}
        onComplete={() => {}}
        onDelete={() => {}}
      />
    </div>
  )
}

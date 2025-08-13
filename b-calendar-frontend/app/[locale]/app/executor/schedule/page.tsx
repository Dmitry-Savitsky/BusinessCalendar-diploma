"use client"

import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Loader2, User } from "lucide-react"
import { useTranslations } from 'next-intl'
import { config } from "@/lib/config"
import { DayView, WeekView } from "./_components/ScheduleViews"
import OrderDetailsSheet from "./_components/OrderDetailsSheet"
import { useExecutorSchedule, HOURS, getWeekDates, filterOrders } from "./_hooks/useExecutorSchedule"
import type { Order } from "@/lib/api/orders"

export default function ExecutorSchedulePage() {
	const t = useTranslations('executor.schedule')
	const [state, api] = useExecutorSchedule()

	const weekDates = useMemo(() => getWeekDates(state.selectedDate), [state.selectedDate])
	const filteredOrders = useMemo(() => filterOrders(state.orders, state.selectedDate, state.viewMode, weekDates), [state.orders, state.selectedDate, state.viewMode, weekDates])

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

	const getOrderCardColorClass = (order: Order) => {
 		if (order.completed) return "bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-700"
 		const serviceType = order.items[0]?.serviceType || 1
 		return getServiceColorClass(serviceType)
 	}

	const getOrderCardStyle = (order: Order) => {
 		const startTime = new Date(order.orderStart)
 		const endTime = new Date(order.orderEnd)
 		const hourHeight = 100 / HOURS.length
 		const startHour = startTime.getHours()
 		const startMinute = startTime.getMinutes()
 		const topPosition = (startHour - HOURS[0] + startMinute / 60) * hourHeight
 		const durationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)
 		const height = Math.max(durationHours * hourHeight, 10)
 		return { top: `${topPosition}%`, height: `${height}%`, minHeight: "60px" }
 	}

	if (state.loading) {
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
 						<Button variant={state.viewMode === "day" ? "default" : "outline"} size="sm" onClick={() => api.setViewMode("day")}>
 							{t('viewMode.day')}
 						</Button>
 						<Button variant={state.viewMode === "week" ? "default" : "outline"} size="sm" onClick={() => api.setViewMode("week")}>
 							{t('viewMode.week')}
 						</Button>
 					</div>
 					<div className="flex items-center space-x-2">
 						<Button variant="outline" size="sm" onClick={state.viewMode === "day" ? api.prevDay : api.prevWeek}>
 							<ChevronLeft className="h-4 w-4" />
 						</Button>
 						<Button variant="outline" onClick={api.today}>
 							{t('navigation.today')}
 						</Button>
 						<Button variant="outline" size="sm" onClick={state.viewMode === "day" ? api.nextDay : api.nextWeek}>
 							<ChevronRight className="h-4 w-4" />
 						</Button>
 					</div>
 				</div>
 			</div>

 			{state.executor && (
 				<div className="bg-background border rounded-lg p-4 flex items-center gap-4 mb-4">
 					<div className="h-16 w-16 rounded-full overflow-hidden bg-muted">
 						{state.executor.imgPath ? (
 							<img src={`${config.apiUrl}${state.executor.imgPath}`} alt={state.executor.name} className="h-full w-full object-cover" />
 						) : (
 							<User className="h-full w-full p-2 text-muted-foreground" />
 						)}
 					</div>
 					<div>
 						<h3 className="text-lg font-medium">{state.executor.name}</h3>
 						<p className="text-sm text-muted-foreground">{state.executor.description || t('executor.defaultRole')}</p>
 						<p className="text-sm text-muted-foreground">{state.executor.phone}</p>
 					</div>
 				</div>
 			)}

 			<div className="relative overflow-x-auto">
 				{state.viewMode === "day" ? (
 					<DayView hours={HOURS} orders={filteredOrders} onOrderClick={api.openOrder} getOrderCardStyle={getOrderCardStyle} getOrderCardColorClass={getOrderCardColorClass} />
 				) : (
 					<WeekView weekDates={weekDates} orders={filteredOrders} onOrderClick={api.openOrder} getOrderCardColorClass={getOrderCardColorClass} />
 				)}
 			</div>

 			<OrderDetailsSheet open={state.isDrawerOpen} onOpenChange={api.closeDrawer} order={state.selectedOrder} isCompleting={state.isCompleting} onComplete={api.complete} />
 		</div>
 	)
}

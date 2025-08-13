"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import type { DateRange } from "react-day-picker"
import { format, startOfMonth, endOfMonth } from "date-fns"
import { CalendarIcon, ChevronDown, Filter } from "lucide-react"
import { useTranslations } from 'next-intl'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"
import { useCompanyDashboard } from "./_hooks/useCompanyDashboard"
import KeyMetrics from "./_components/KeyMetrics"
import Charts from "./_components/Charts"

export default function DashboardPage() {
  const t = useTranslations('dashboard')
  const [initialRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  })
  const [{ loading, statistics, dateFilter, dateRange }, { setDateFilter, setDateRange, applyDateRange }] = useCompanyDashboard(initialRange)

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
          <KeyMetrics statistics={statistics} dateFilter={dateFilter} />
          <Charts statistics={statistics} />
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

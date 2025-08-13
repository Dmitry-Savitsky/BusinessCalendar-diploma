"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, RefreshCw, Search } from "lucide-react"
import { useTranslations } from 'next-intl'

interface Props {
  searchQuery: string
  onSearchChange: (v: string) => void
  statusFilter: string
  onStatusChange: (v: string) => void
  dateFilter: string
  onDateChange: (v: string) => void
  onRefresh: () => void
}

export function OrdersFilters({ searchQuery, onSearchChange, statusFilter, onStatusChange, dateFilter, onDateChange, onRefresh }: Props) {
  const t = useTranslations('orders')
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          {t('actions.refresh')}
        </Button>
      </div>
    </div>
  )
}

interface ControlsProps {
  searchQuery: string
  onSearchChange: (v: string) => void
  statusFilter: string
  onStatusChange: (v: string) => void
  dateFilter: string
  onDateChange: (v: string) => void
}

export function OrdersControls({ searchQuery, onSearchChange, statusFilter, onStatusChange, dateFilter, onDateChange }: ControlsProps) {
  const t = useTranslations('orders')
  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-end md:space-x-4 md:space-y-0">
      <div className="flex-1 space-y-2">
        <label htmlFor="search" className="text-sm font-medium">{t('filters.search.label')}</label>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input id="search" placeholder={t('filters.search.placeholder')} className="pl-8" value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} />
        </div>
      </div>
      <div className="w-full md:w-[180px] space-y-2">
        <label htmlFor="status-filter" className="text-sm font-medium">{t('filters.status.label')}</label>
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger id="status-filter"><SelectValue placeholder={t('filters.status.placeholder')} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('filters.status.options.all')}</SelectItem>
            <SelectItem value="pending">{t('filters.status.options.pending')}</SelectItem>
            <SelectItem value="confirmed">{t('filters.status.options.confirmed')}</SelectItem>
            <SelectItem value="completed">{t('filters.status.options.completed')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="w-full md:w-[180px] space-y-2">
        <label htmlFor="date-filter" className="text-sm font-medium">{t('filters.date.label')}</label>
        <Select value={dateFilter} onValueChange={onDateChange}>
          <SelectTrigger id="date-filter"><SelectValue placeholder={t('filters.date.placeholder')} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('filters.date.options.all')}</SelectItem>
            <SelectItem value="today">{t('filters.date.options.today')}</SelectItem>
            <SelectItem value="upcoming">{t('filters.date.options.upcoming')}</SelectItem>
            <SelectItem value="thisWeek">{t('filters.date.options.thisWeek')}</SelectItem>
            <SelectItem value="past">{t('filters.date.options.past')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export function EmptyState({ hasFilters, onClear }: { hasFilters: boolean; onClear: () => void }) {
  const t = useTranslations('orders')
  return (
    <div className="flex h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
      <Filter className="h-12 w-12 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-medium">{t('empty.title')}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{hasFilters ? t('empty.withFilters') : t('empty.description')}</p>
      {hasFilters && (
        <Button variant="outline" className="mt-4" onClick={onClear}>
          <Filter className="mr-2 h-4 w-4" />
          {t('empty.clearFilters')}
        </Button>
      )}
    </div>
  )
}

export default OrdersFilters


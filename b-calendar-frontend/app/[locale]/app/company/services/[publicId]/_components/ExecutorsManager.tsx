"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Loader2, User, UserPlus, Trash2 } from "lucide-react"
import { useTranslations } from 'next-intl'
import type { Executor } from "@/lib/api/executor"
import type { ExecutorService } from "@/lib/api/executor-services"
import { config } from "@/lib/config"

interface Props {
  assignedExecutors: ExecutorService[]
  availableExecutors: Executor[]
  loading: boolean
  isAssignDialogOpen: boolean
  selectedExecutorId: string
  isSubmitting: boolean
  onOpenChange: (open: boolean) => void
  onSelectExecutor: (id: string) => void
  onAssign: () => void
  onRemove: (executorId: string) => void
  serviceName: string
}

export default function ExecutorsManager(props: Props) {
  const t = useTranslations('services.details')
  const {
    assignedExecutors, availableExecutors, loading, isAssignDialogOpen, selectedExecutorId, isSubmitting,
    onOpenChange, onSelectExecutor, onAssign, onRemove, serviceName
  } = props

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{t('tabs.executors.title')}</CardTitle>
          <CardDescription>{t('tabs.executors.description')}</CardDescription>
        </div>
        <Dialog open={isAssignDialogOpen} onOpenChange={onOpenChange}>
          <DialogTrigger asChild>
            <Button disabled={availableExecutors.length === 0}><UserPlus className="mr-2 h-4 w-4" />{t('tabs.executors.assign.button')}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('tabs.executors.assign.title')}</DialogTitle>
              <DialogDescription>{t('tabs.executors.assign.description', { name: serviceName })}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Select value={selectedExecutorId} onValueChange={onSelectExecutor}>
                  <SelectTrigger><SelectValue placeholder={t('tabs.executors.assign.placeholder')} /></SelectTrigger>
                  <SelectContent>
                    {availableExecutors.map((executor) => (<SelectItem key={executor.guid} value={executor.guid}>{executor.name}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={onAssign} disabled={isSubmitting || !selectedExecutorId}>{isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('tabs.executors.assign.submitting')}</>) : (t('tabs.executors.assign.submit'))}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-[200px] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
        ) : assignedExecutors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <User className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">{t('tabs.executors.empty.title')}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t('tabs.executors.empty.description')}</p>
            {availableExecutors.length > 0 ? (
              <Button className="mt-4" onClick={() => onOpenChange(true)}><UserPlus className="mr-2 h-4 w-4" />{t('tabs.executors.assign.button')}</Button>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">{t('tabs.executors.empty.noAvailable')}</p>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {assignedExecutors.map((executor) => (
              <Card key={executor.executorPublicId}>
                <div className="aspect-square w-full overflow-hidden">
                  {executor.executorImgPath ? (
                    <img src={`${config.apiUrl}${executor.executorImgPath}`} alt={executor.executorName} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted"><User className="h-16 w-16 text-muted-foreground" /></div>
                  )}
                </div>
                <CardHeader><CardTitle>{executor.executorName}</CardTitle></CardHeader>
                <CardFooter>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600"><Trash2 className="mr-2 h-4 w-4" />{t('tabs.executors.remove.button')}</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t('tabs.executors.remove.title')}</AlertDialogTitle>
                        <AlertDialogDescription>{t('tabs.executors.remove.description', { executorName: executor.executorName, serviceName })}</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t('tabs.executors.remove.cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onRemove(executor.executorPublicId)} className="bg-red-500 hover:bg-red-600">{t('tabs.executors.remove.confirm')}</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}



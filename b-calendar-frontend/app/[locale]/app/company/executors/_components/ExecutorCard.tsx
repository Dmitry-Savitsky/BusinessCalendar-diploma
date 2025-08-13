"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Phone, User, Calendar, Edit, Trash2, ExternalLink } from "lucide-react"
import { config } from "@/lib/config"
import { type Executor } from "@/lib/api/executor"
import { useTranslations } from 'next-intl'

interface Props {
  executor: Executor
  onDetails: (guid: string) => void
  onEdit: (executor: Executor) => void
  onSchedule: (executor: Executor) => void
  onDelete: (guid: string) => void
}

export default function ExecutorCard({ executor, onDetails, onEdit, onSchedule, onDelete }: Props) {
  const t = useTranslations('executors')
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video w-full overflow-hidden">
        {executor.imgPath ? (
          <img src={`${config.apiUrl}${executor.imgPath}`} alt={executor.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <User className="h-16 w-16 text-muted-foreground" />
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle>{executor.name}</CardTitle>
        <CardDescription>{executor.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center"><Phone className="mr-2 h-4 w-4 text-muted-foreground" /><span className="text-sm">{executor.phone}</span></div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={() => onDetails(executor.guid)}>
          <ExternalLink className="mr-2 h-4 w-4" />{t('actions.details')}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm"><MoreVertical className="h-4 w-4" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(executor)}><Edit className="mr-2 h-4 w-4" />{t('actions.edit.button')}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSchedule(executor)}><Calendar className="mr-2 h-4 w-4" />{t('actions.schedule.button')}</DropdownMenuItem>
            <DropdownMenuItem className="text-red-500 focus:text-red-500" onClick={() => onDelete(executor.guid)}>
              <Trash2 className="mr-2 h-4 w-4" />{t('actions.delete.button')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  )
}




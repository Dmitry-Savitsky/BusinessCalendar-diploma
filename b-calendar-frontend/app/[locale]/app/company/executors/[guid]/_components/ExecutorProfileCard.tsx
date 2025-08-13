"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from "lucide-react"
import { config } from "@/lib/config"
import type { Executor } from "@/lib/api/executor"
import { useTranslations } from 'next-intl'

export default function ExecutorProfileCard({ executor }: { executor: Executor }) {
  const t = useTranslations('executorDetails')
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('profile.title')}</CardTitle>
        <CardDescription>{t('profile.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-square w-full overflow-hidden rounded-md">
          {executor.imgPath ? (
            <img src={`${config.apiUrl}${executor.imgPath}`} alt={executor.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted"><User className="h-24 w-24 text-muted-foreground" /></div>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2"><User className="h-4 w-4 text-muted-foreground" /><span>{executor.name}</span></div>
          <div className="flex items-center space-x-2"><span>{executor.phone}</span></div>
          {executor.description && (<div className="pt-2"><h4 className="text-sm font-medium">{t('profile.description_label')}</h4><p className="text-sm text-muted-foreground">{executor.description}</p></div>)}
        </div>
      </CardContent>
    </Card>
  )
}




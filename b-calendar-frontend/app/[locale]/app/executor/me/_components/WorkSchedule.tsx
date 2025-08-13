"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useTranslations } from 'next-intl'
import type { ExecutorWorkTime } from "../_hooks/useExecutorProfile"

export default function WorkSchedule({ workTime }: { workTime: ExecutorWorkTime[] }) {
  const t = useTranslations('executor.profile')
  const getDayName = (dayNo: number) => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    return t(`tabs.schedule.workSchedule.days.${days[dayNo]}`)
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('tabs.schedule.workSchedule.title')}</CardTitle>
        <CardDescription>{t('tabs.schedule.workSchedule.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {workTime.map((day) => (
            <div key={day.dayNo} className="rounded-md border p-4">
              <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
                <div className="flex items-center space-x-2 md:w-1/5">
                  <Checkbox id={`working-${day.dayNo}`} checked={day.isWorking} disabled />
                  <Label htmlFor={`working-${day.dayNo}`} className="font-medium">{getDayName(day.dayNo)}</Label>
                </div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:w-4/5">
                  <div className="space-y-2"><Label className="text-xs">{t('tabs.schedule.workSchedule.fields.from')}</Label><div className="rounded-md border px-3 py-2 text-sm">{day.fromTime.substring(0, 5)}</div></div>
                  <div className="space-y-2"><Label className="text-xs">{t('tabs.schedule.workSchedule.fields.till')}</Label><div className="rounded-md border px-3 py-2 text-sm">{day.tillTime.substring(0, 5)}</div></div>
                  <div className="space-y-2"><Label className="text-xs">{t('tabs.schedule.workSchedule.fields.breakStart')}</Label><div className="rounded-md border px-3 py-2 text-sm">{day.breakStart.substring(0, 5)}</div></div>
                  <div className="space-y-2"><Label className="text-xs">{t('tabs.schedule.workSchedule.fields.breakEnd')}</Label><div className="rounded-md border px-3 py-2 text-sm">{day.breakEnd.substring(0, 5)}</div></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}



"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { getExecutorWorkTime, updateExecutorWorkTime, type ExecutorWorkTime } from "@/lib/api/executor"
import { Loader2 } from "lucide-react"

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

interface ExecutorScheduleProps {
  executorGuid: string
}

export default function ExecutorSchedule({ executorGuid }: ExecutorScheduleProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [workTime, setWorkTime] = useState<ExecutorWorkTime[]>([])

  useEffect(() => {
    fetchWorkTime()
  }, [executorGuid])

  const fetchWorkTime = async () => {
    setLoading(true)
    try {
      const data = await getExecutorWorkTime(executorGuid)

      // Sort by dayNo to ensure correct order
      const sortedData = [...data].sort((a, b) => a.dayNo - b.dayNo)
      setWorkTime(sortedData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load executor schedule. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSchedule = async () => {
    setSaving(true)
    try {
      await updateExecutorWorkTime(executorGuid, workTime)
      toast({
        title: "Success",
        description: "Schedule updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update schedule. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleWorkingChange = (dayNo: number, isWorking: boolean) => {
    setWorkTime((prev) => prev.map((day) => (day.dayNo === dayNo ? { ...day, isWorking } : day)))
  }

  const handleTimeChange = (dayNo: number, field: keyof ExecutorWorkTime, value: string) => {
    setWorkTime((prev) => prev.map((day) => (day.dayNo === dayNo ? { ...day, [field]: value } : day)))
  }

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {workTime.map((day) => (
          <Card key={day.dayNo}>
            <CardContent className="pt-6">
              <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
                <div className="flex items-center space-x-2 md:w-1/5">
                  <Checkbox
                    id={`working-${day.dayNo}`}
                    checked={day.isWorking}
                    onCheckedChange={(checked) => handleWorkingChange(day.dayNo, checked === true)}
                  />
                  <Label htmlFor={`working-${day.dayNo}`} className="font-medium">
                    {DAYS_OF_WEEK[day.dayNo]}
                  </Label>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:w-4/5">
                  <div className="space-y-2">
                    <Label htmlFor={`from-${day.dayNo}`} className="text-xs">
                      From
                    </Label>
                    <Input
                      id={`from-${day.dayNo}`}
                      type="time"
                      value={day.fromTime.substring(0, 5)}
                      onChange={(e) => handleTimeChange(day.dayNo, "fromTime", e.target.value)}
                      disabled={!day.isWorking}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`till-${day.dayNo}`} className="text-xs">
                      Till
                    </Label>
                    <Input
                      id={`till-${day.dayNo}`}
                      type="time"
                      value={day.tillTime.substring(0, 5)}
                      onChange={(e) => handleTimeChange(day.dayNo, "tillTime", e.target.value)}
                      disabled={!day.isWorking}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`break-start-${day.dayNo}`} className="text-xs">
                      Break Start
                    </Label>
                    <Input
                      id={`break-start-${day.dayNo}`}
                      type="time"
                      value={day.breakStart.substring(0, 5)}
                      onChange={(e) => handleTimeChange(day.dayNo, "breakStart", e.target.value)}
                      disabled={!day.isWorking}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`break-end-${day.dayNo}`} className="text-xs">
                      Break End
                    </Label>
                    <Input
                      id={`break-end-${day.dayNo}`}
                      type="time"
                      value={day.breakEnd.substring(0, 5)}
                      onChange={(e) => handleTimeChange(day.dayNo, "breakEnd", e.target.value)}
                      disabled={!day.isWorking}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSaveSchedule} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Schedule"
          )}
        </Button>
      </div>
    </div>
  )
}

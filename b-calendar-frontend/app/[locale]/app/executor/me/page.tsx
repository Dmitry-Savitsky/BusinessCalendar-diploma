"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Clock, CalendarIcon, Briefcase } from "lucide-react"
import { getToken, parseToken } from "@/lib/auth"
import { config } from "@/lib/config"
import { useTranslations } from 'next-intl'

// Types
interface ExecutorProfile {
  guid: string
  name: string
  phone: string
  description: string
  imgPath: string
}

interface ExecutorWorkTime {
  dayNo: number
  isWorking: boolean
  fromTime: string
  tillTime: string
  breakStart: string
  breakEnd: string
}

interface ExecutorService {
  executorPublicId: string
  executorName: string
  executorImgPath: string
  servicePublicId: string
  serviceName: string
  servicePrice: number
  durationMinutes: number
}

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export default function ExecutorMePage() {
  const t = useTranslations('executor.profile')
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<ExecutorProfile | null>(null)
  const [workTime, setWorkTime] = useState<ExecutorWorkTime[]>([])
  const [services, setServices] = useState<ExecutorService[]>([])
  const [executorGuid, setExecutorGuid] = useState<string>("")

  useEffect(() => {
    const token = getToken()
    if (token) {
      const tokenData = parseToken(token)
      if (tokenData && tokenData.ExecutorGuid) {
        setExecutorGuid(tokenData.ExecutorGuid)
        fetchExecutorData(token)
      }
    }
  }, [])

  const fetchExecutorData = async (token: string) => {
    setLoading(true)
    try {
      // Fetch profile data
      const profileResponse = await fetch(`${config.apiUrl}api/Executor/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!profileResponse.ok) {
        throw new Error("Failed to fetch profile data")
      }

      const profileData = await profileResponse.json()
      setProfile(profileData)

      // Fetch work time data
      const workTimeResponse = await fetch(`${config.apiUrl}api/Executor/me/worktime`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!workTimeResponse.ok) {
        throw new Error("Failed to fetch work time data")
      }

      const workTimeData = await workTimeResponse.json()
      // Sort by dayNo to ensure correct order
      const sortedWorkTime = [...workTimeData].sort((a, b) => a.dayNo - b.dayNo)
      setWorkTime(sortedWorkTime)

      // Fetch services data
      const tokenData = parseToken(token)
      if (tokenData && tokenData.ExecutorGuid) {
        const servicesResponse = await fetch(
          `${config.apiUrl}api/executor-services/executor/${tokenData.ExecutorGuid}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        if (!servicesResponse.ok) {
          throw new Error("Failed to fetch services data")
        }

        const servicesData = await servicesResponse.json()
        setServices(servicesData)
      }
    } catch (error) {
      console.error("Error fetching executor data:", error)
      toast({
        title: t('errors.loadFailed.title'),
        description: t('errors.loadFailed.description'),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getDayName = (dayNo: number) => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    return t(`tabs.schedule.workSchedule.days.${days[dayNo]}`)
  }

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
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
      </div>

      <Tabs defaultValue="about" className="space-y-4">
        <TabsList>
          <TabsTrigger value="about" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            {t('tabs.about.title')}
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {t('tabs.schedule.title')}
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            {t('tabs.services.title')}
          </TabsTrigger>
        </TabsList>

        {/* About Me Tab */}
        <TabsContent value="about" className="space-y-4">
          {profile && (
            <Card>
              <CardHeader>
                <CardTitle>{t('tabs.about.personalInfo.title')}</CardTitle>
                <CardDescription>{t('tabs.about.personalInfo.description')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col gap-6 md:flex-row">
                  <div className="flex flex-col items-center gap-4">
                    <Avatar className="h-32 w-32">
                      <AvatarImage
                        src={profile.imgPath ? `${config.apiUrl}${profile.imgPath}` : ""}
                        alt={profile.name}
                      />
                      <AvatarFallback className="text-2xl">
                        {profile.name?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">{t('tabs.about.personalInfo.fields.name')}</Label>
                      <Input id="name" value={profile.name || ""} readOnly />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="phone">{t('tabs.about.personalInfo.fields.phone')}</Label>
                      <Input id="phone" value={profile.phone || ""} readOnly />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="description">{t('tabs.about.personalInfo.fields.description')}</Label>
                      <Textarea id="description" value={profile.description || ""} readOnly />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-4">
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
                        <Label htmlFor={`working-${day.dayNo}`} className="font-medium">
                          {getDayName(day.dayNo)}
                        </Label>
                      </div>

                      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:w-4/5">
                        <div className="space-y-2">
                          <Label className="text-xs">{t('tabs.schedule.workSchedule.fields.from')}</Label>
                          <div className="rounded-md border px-3 py-2 text-sm">{day.fromTime.substring(0, 5)}</div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs">{t('tabs.schedule.workSchedule.fields.till')}</Label>
                          <div className="rounded-md border px-3 py-2 text-sm">{day.tillTime.substring(0, 5)}</div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs">{t('tabs.schedule.workSchedule.fields.breakStart')}</Label>
                          <div className="rounded-md border px-3 py-2 text-sm">{day.breakStart.substring(0, 5)}</div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs">{t('tabs.schedule.workSchedule.fields.breakEnd')}</Label>
                          <div className="rounded-md border px-3 py-2 text-sm">{day.breakEnd.substring(0, 5)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('tabs.services.list.title')}</CardTitle>
              <CardDescription>{t('tabs.services.list.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {services.length > 0 ? (
                  services.map((service) => (
                    <Card key={service.servicePublicId} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-base">{service.serviceName}</h3>
                            <div className="mt-1 space-y-0.5 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {t('tabs.services.list.fields.durationUnit', { minutes: service.durationMinutes })}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-base">{service.servicePrice} BYN</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{t('tabs.services.list.fields.price')}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-muted-foreground">{t('tabs.services.list.empty')}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

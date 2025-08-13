"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useTranslations } from 'next-intl'
import { config } from "@/lib/config"
import type { ExecutorProfile } from "../_hooks/useExecutorProfile"

export default function ProfileCard({ profile }: { profile: ExecutorProfile }) {
  const t = useTranslations('executor.profile')
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('tabs.about.personalInfo.title')}</CardTitle>
        <CardDescription>{t('tabs.about.personalInfo.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-32 w-32">
              <AvatarImage src={profile.imgPath ? `${config.apiUrl}${profile.imgPath}` : ""} alt={profile.name} />
              <AvatarFallback className="text-2xl">{profile.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
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
  )
}



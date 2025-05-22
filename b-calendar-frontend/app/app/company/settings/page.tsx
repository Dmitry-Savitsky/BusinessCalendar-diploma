"use client"

import { CompanySettingsForm } from "@/components/company/company-settings-form"

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Company Settings</h1>
        <p className="text-muted-foreground">Manage your company profile and information.</p>
      </div>
      <CompanySettingsForm />
    </div>
  )
} 
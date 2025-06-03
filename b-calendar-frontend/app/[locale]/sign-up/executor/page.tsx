"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useLocale, useTranslations } from 'next-intl'

// Update imports to include our API functions
import { executorRegister } from "@/lib/api/auth"

export default function ExecutorSignUpPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const locale = useLocale()
  const t = useTranslations('auth.signUp.executor')
  const commonT = useTranslations('auth.signUp')

  const [executorGuid, setExecutorGuid] = useState("")
  const [executorPhone, setExecutorPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Replace the handleSubmit function with:
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate passwords match
    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await executorRegister(executorGuid, executorPhone, password)

      toast({
        title: "Registration successful",
        description: "Your executor account has been created",
      })

      // Redirect to executor dashboard
      router.push(`/${locale}/app/executor`)
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "An error occurred during registration.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container max-w-md px-4 md:px-6">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">{t('title')}</CardTitle>
              <CardDescription className="text-center">{t('description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="executorGuid">{t('guid')}</Label>
                  <Input
                    id="executorGuid"
                    placeholder={t('guid')}
                    value={executorGuid}
                    onChange={(e) => setExecutorGuid(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">{t('guidDescription')}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="executorPhone">{t('phone')}</Label>
                  <Input
                    id="executorPhone"
                    placeholder={t('phone')}
                    value={executorPhone}
                    onChange={(e) => setExecutorPhone(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">{t('phoneDescription')}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t('password')}</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder={t('password')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">{t('confirmPassword')}</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder={t('confirmPassword')}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? t('creatingAccount') : t('createAccount')}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col">
              <div className="mt-4 text-center text-sm">
                {commonT('haveAccount')}{" "}
                <Link href={`/${locale}/sign-in`} className="text-teal-500 hover:underline">
                  {commonT('signIn')}
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
} 
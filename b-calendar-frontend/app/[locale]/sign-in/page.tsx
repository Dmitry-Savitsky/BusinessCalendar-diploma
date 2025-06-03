"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useLocale, useTranslations } from 'next-intl'

// Update imports to include our API functions
import { executorLogin, companyLogin } from "@/lib/api/auth"

export default function SignInPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const locale = useLocale()
  const t = useTranslations('auth.signIn')

  // Company login state
  const [companyLoginId, setCompanyLoginId] = useState("")
  const [companyPassword, setCompanyPassword] = useState("")

  // Executor login state
  const [executorPhone, setExecutorPhone] = useState("")
  const [executorPassword, setExecutorPassword] = useState("")

  // Replace the handleCompanyLogin function with:
  const handleCompanyLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await companyLogin(companyLoginId, companyPassword)

      toast({
        title: "Login successful",
        description: "You have been logged in as a company",
      })

      // Redirect to company dashboard
      router.push(`/${locale}/app/company`)
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Replace the handleExecutorLogin function with:
  const handleExecutorLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await executorLogin(executorPhone, executorPassword)

      toast({
        title: "Login successful",
        description: "You have been logged in as an executor",
      })

      // Redirect to executor dashboard
      router.push(`/${locale}/app/executor`)
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid credentials. Please try again.",
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
              <Tabs defaultValue="company" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="company">{t('company')}</TabsTrigger>
                  <TabsTrigger value="executor">{t('executor')}</TabsTrigger>
                </TabsList>
                <TabsContent value="company">
                  <form onSubmit={handleCompanyLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="company-login">{t('login')}</Label>
                      <Input
                        id="company-login"
                        placeholder={t('login')}
                        value={companyLoginId}
                        onChange={(e) => setCompanyLoginId(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="company-password">{t('password')}</Label>
                        <Link href={`/${locale}/forgot-password`} className="text-sm text-teal-500 hover:underline">
                          {t('forgotPassword')}
                        </Link>
                      </div>
                      <Input
                        id="company-password"
                        type="password"
                        placeholder={t('password')}
                        value={companyPassword}
                        onChange={(e) => setCompanyPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? t('signingIn') : t('signInButton')}
                    </Button>
                  </form>
                </TabsContent>
                <TabsContent value="executor">
                  <form onSubmit={handleExecutorLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="executor-phone">{t('phone')}</Label>
                      <Input
                        id="executor-phone"
                        placeholder={t('phone')}
                        value={executorPhone}
                        onChange={(e) => setExecutorPhone(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="executor-password">{t('password')}</Label>
                        <Link href={`/${locale}/forgot-password`} className="text-sm text-teal-500 hover:underline">
                          {t('forgotPassword')}
                        </Link>
                      </div>
                      <Input
                        id="executor-password"
                        type="password"
                        placeholder={t('password')}
                        value={executorPassword}
                        onChange={(e) => setExecutorPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? t('signingIn') : t('signInButton')}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col">
              <div className="mt-4 text-center text-sm">
                {t('noAccount')}{" "}
                <Link href={`/${locale}/sign-up`} className="text-teal-500 hover:underline">
                  {t('signUp')}
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
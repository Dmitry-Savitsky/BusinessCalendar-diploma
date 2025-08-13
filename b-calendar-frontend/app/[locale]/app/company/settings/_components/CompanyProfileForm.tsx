"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Building2, Loader2 } from "lucide-react"
import { config } from "@/lib/config"
import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import type { Company, UpdateCompanyData } from "@/lib/api/company"

interface Props {
  company: Company | null
  loading: boolean
  onSubmit: (data: UpdateCompanyData) => Promise<void>
}

export default function CompanyProfileForm({ company, loading, onSubmit }: Props) {
  const t = useTranslations('settings')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")

  const formSchema = z.object({
    CompanyName: z.string().min(2, t('form.fields.companyName.validation')),
    CompanyPhone: z.string().min(5, t('form.fields.phone.validation')),
    CompanyAddress: z.string().min(5, t('form.fields.address.validation')),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { CompanyName: '', CompanyPhone: '', CompanyAddress: '' },
  })

  useEffect(() => {
    if (!company) return
    form.reset({ CompanyName: company.companyName, CompanyPhone: company.companyPhone, CompanyAddress: company.companyAddress })
    setImagePreview(company.imgPath)
  }, [company, form])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedImage(file)
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const submit = async (values: z.infer<typeof formSchema>) => {
    const payload: UpdateCompanyData = { ...values, image: selectedImage || undefined }
    await onSubmit(payload)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-[200px_1fr]">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-32 w-32 overflow-hidden rounded-full">
              {selectedImage ? (
                <img src={imagePreview} alt={t('form.logo.preview')} className="h-full w-full object-cover" />
              ) : imagePreview ? (
                <img src={`${config.apiUrl}${imagePreview}`} alt={t('form.logo.placeholder')} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted"><Building2 className="h-16 w-16 text-muted-foreground" /></div>
              )}
            </div>
            <FormItem>
              <FormLabel className="cursor-pointer">
                <Button type="button" variant="outline" size="sm">{t('form.logo.change')}</Button>
                <Input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </FormLabel>
            </FormItem>
          </div>

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField control={form.control} name="CompanyName" render={({ field }) => (
                <FormItem><FormLabel>{t('form.fields.companyName.label')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="CompanyPhone" render={({ field }) => (
                <FormItem><FormLabel>{t('form.fields.phone.label')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <FormField control={form.control} name="CompanyAddress" render={({ field }) => (
              <FormItem><FormLabel>{t('form.fields.address.label')}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="flex justify-end"><Button type="submit" disabled={loading}>{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{loading ? t('form.saving') : t('form.submit')}</Button></div>
          </div>
        </div>
      </form>
    </Form>
  )
}




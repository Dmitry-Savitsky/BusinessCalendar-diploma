"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Building2, Loader2 } from "lucide-react"
import { config } from "@/lib/config"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Company, UpdateCompanyData, getCompanyProfile, updateCompanyProfile } from "@/lib/api/company"

const formSchema = z.object({
  CompanyName: z.string().min(2, "Company name must be at least 2 characters"),
  CompanyPhone: z.string().min(5, "Phone number must be at least 5 characters"),
  CompanyAddress: z.string().min(5, "Address must be at least 5 characters"),
})

export function CompanySettingsForm() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [company, setCompany] = useState<Company | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      CompanyName: "",
      CompanyPhone: "",
      CompanyAddress: "",
    },
  })

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const data = await getCompanyProfile()
        setCompany(data)
        form.reset({
          CompanyName: data.companyName,
          CompanyPhone: data.companyPhone,
          CompanyAddress: data.companyAddress,
        })
        setImagePreview(data.imgPath)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load company profile",
        })
      }
    }
    fetchCompany()
  }, [form, toast])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true)
      const updateData: UpdateCompanyData = {
        ...values,
        image: selectedImage || undefined,
      }
      await updateCompanyProfile(updateData)
      toast({
        title: "Success",
        description: "Company profile updated successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update company profile",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-32 w-32 overflow-hidden rounded-full">
              {selectedImage ? (
                <img
                  src={imagePreview}
                  alt="Company logo preview"
                  className="h-full w-full object-cover"
                />
              ) : imagePreview ? (
                <img
                src={`${config.apiUrl}${imagePreview}`}
                  alt="Company logo"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted">
                  <Building2 className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
            </div>
            <FormItem>
              <FormLabel className="cursor-pointer">
                <Button type="button" variant="outline">
                  Change Logo
                </Button>
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </FormLabel>
            </FormItem>
          </div>

          <FormField
            control={form.control}
            name="CompanyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="CompanyPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="CompanyAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </form>
    </Form>
  )
} 
"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Building2, Loader2, Copy, Check, ChevronDown, ChevronUp } from "lucide-react"
import { config } from "@/lib/config"
import Script from "next/script"

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface BookingWidgetElement extends HTMLElement {
  'company-guid'?: string;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'booking-widget': React.DetailedHTMLProps<
        React.HTMLAttributes<BookingWidgetElement>,
        BookingWidgetElement
      >;
    }
  }
}

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
  const [copied, setCopied] = useState(false)
  const [showWidget, setShowWidget] = useState(false)
  const [isReactLoaded, setIsReactLoaded] = useState(false)
  const [isWidgetLoaded, setIsWidgetLoaded] = useState(false)
  const [showFullCode, setShowFullCode] = useState(false)

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

  useEffect(() => {
    const loadReactAndWidget = async () => {
      try {
        // Load React first
        if (!window.React) {
          console.log('Loading React...');
          const reactScript = document.createElement('script');
          reactScript.src = 'https://unpkg.com/react@18/umd/react.development.js';
          reactScript.crossOrigin = '';
          await new Promise<void>((resolve, reject) => {
            reactScript.onload = () => resolve();
            reactScript.onerror = reject;
            document.head.appendChild(reactScript);
          });
          console.log('React loaded successfully');
        }

        // Then load ReactDOM
        if (!window.ReactDOM) {
          console.log('Loading ReactDOM...');
          const reactDOMScript = document.createElement('script');
          reactDOMScript.src = 'https://unpkg.com/react-dom@18/umd/react-dom.development.js';
          reactDOMScript.crossOrigin = '';
          await new Promise<void>((resolve, reject) => {
            reactDOMScript.onload = () => resolve();
            reactDOMScript.onerror = reject;
            document.head.appendChild(reactDOMScript);
          });
          console.log('ReactDOM loaded successfully');
        }

        // Load CSS
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = 'http://localhost:3001/booking-widget.css';
        document.head.appendChild(cssLink);

        // Set React as loaded
        setIsReactLoaded(true);

        // Finally load the widget
        console.log('Loading widget...');
        const widgetScript = document.createElement('script');
        widgetScript.src = 'http://localhost:3001/booking-widget.js';
        await new Promise<void>((resolve, reject) => {
          widgetScript.onload = () => {
            console.log('Widget loaded successfully');
            setIsWidgetLoaded(true);
            resolve();
          };
          widgetScript.onerror = reject;
          document.head.appendChild(widgetScript);
        });
      } catch (error) {
        console.error('Error loading scripts:', error);
      }
    };

    loadReactAndWidget();
  }, []);

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

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: "Copied!",
        description: "The embedding code has been copied to your clipboard.",
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy to clipboard",
      })
    }
  }

  const getEssentialEmbeddingCode = () => {
    if (!company?.publicId) return ""
    return `<!-- Контейнер для виджета -->
<div id="booking-container" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); justify-content: center; align-items: center; z-index: 1000;">
    <div style="position: relative; background: transparent; border-radius: 0.5rem; max-width: 100%; width: 600px; max-height: 90vh; overflow: auto;">
        <button id="close-btn" style="position: absolute; right: 1rem; top: 1rem; background: none; border: none; color: white; font-size: 24px; cursor: pointer; z-index: 1001;">×</button>
        <booking-widget company-guid="${company.publicId}"></booking-widget>
    </div>
</div>

<!-- Кнопка открытия -->
<button id="open-btn" style="padding: 0.5rem 1rem; background-color: #0284c7; color: white; border: none; border-radius: 0.375rem; cursor: pointer;">
    Забронировать услугу
</button>

<!-- Подключение зависимостей... -->`
  }

  const getEmbeddingCode = () => {
    if (!company?.publicId) return ""
    return `<!-- Контейнер для виджета -->
<div id="booking-container" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); justify-content: center; align-items: center; z-index: 1000;">
    <div style="position: relative; background: transparent; border-radius: 0.5rem; max-width: 100%; width: 600px; max-height: 90vh; overflow: auto;">
        <button id="close-btn" style="position: absolute; right: 1rem; top: 1rem; background: none; border: none; color: white; font-size: 24px; cursor: pointer; z-index: 1001;">×</button>
        <booking-widget company-guid="${company.publicId}"></booking-widget>
    </div>
</div>

<!-- Кнопка открытия -->
<button id="open-btn" style="padding: 0.5rem 1rem; background-color: #0284c7; color: white; border: none; border-radius: 0.375rem; cursor: pointer;">
    Забронировать услугу
</button>

<!-- Подключение зависимостей -->
<script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>

<!-- Подключение виджета -->
<link rel="stylesheet" href="http://localhost:3001/booking-widget.css">
<script src="http://localhost:3001/booking-widget.js"></script>

<script>
    // Инициализация после загрузки всех скриптов
    window.addEventListener('load', () => {
        const openBtn = document.getElementById('open-btn');
        const closeBtn = document.getElementById('close-btn');
        const container = document.getElementById('booking-container');

        openBtn.addEventListener('click', () => {
            container.style.display = 'flex';
        });
        closeBtn.addEventListener('click', () => {
            container.style.display = 'none';
        });
    });
</script>`
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-6 md:grid-cols-[200px_1fr]">
            {/* Левая колонка с логотипом */}
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
                  <Button type="button" variant="outline" size="sm">
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

            {/* Правая колонка с полями формы */}
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
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
              </div>

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

              <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Booking Widget Integration</CardTitle>
          <CardDescription>
            Use this code to embed the booking widget on your website. The widget will appear in a modal window with a responsive layout.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="text-sm font-medium mb-2">Features:</h4>
            <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1 mb-4">
              <li>Responsive modal window with dark overlay</li>
              <li>Maximum width of 600px, adapts to smaller screens</li>
              <li>Scrollable content for tall widgets</li>
              <li>Close button always visible at the top</li>
              <li>Styled button to open the widget</li>
            </ul>
          </div>

          <div className="relative">
            <div className="relative">
              <pre className="mt-4 rounded-lg bg-muted p-4 overflow-x-auto">
                <code className="text-sm">{showFullCode ? getEmbeddingCode() : getEssentialEmbeddingCode()}</code>
              </pre>
              <div className="absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-muted to-transparent pb-4 pt-10">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFullCode(!showFullCode)}
                  className="flex items-center gap-1"
                >
                  {showFullCode ? (
                    <>
                      Show less <ChevronUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Show full code <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-6 top-6"
                onClick={() => copyToClipboard(showFullCode ? getEmbeddingCode() : getEssentialEmbeddingCode())}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Preview</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Here's how the booking widget will look on your website:
            </p>
            <div className="flex flex-col items-center gap-4">
              <Button 
                variant="default" 
                onClick={() => setShowWidget(!showWidget)}
              >
                Забронировать услугу
              </Button>
              <div className="text-sm text-muted-foreground">
                Status: {!isReactLoaded ? 'Loading React...' : !isWidgetLoaded ? 'Loading Widget...' : 'Ready'}
              </div>
            </div>

            {company?.publicId && (
              <div 
                id="booking-container" 
                style={{ 
                  display: showWidget ? 'flex' : 'none',
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'rgba(0, 0, 0, 0.5)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 1000
                }}
              >
                <div style={{ 
                  position: 'relative',
                  background: 'transparent',
                  borderRadius: '0.5rem',
                  maxWidth: '100%',
                  width: '600px',
                  maxHeight: '90vh',
                  overflow: 'auto'
                }}>
                  <button 
                    onClick={() => setShowWidget(false)}
                    style={{
                      position: 'absolute',
                      right: '1rem',
                      top: '1rem',
                      background: 'none',
                      border: 'none',
                      color: 'white',
                      fontSize: '24px',
                      cursor: 'pointer',
                      zIndex: 1001
                    }}
                  >
                    ×
                  </button>
                  {isReactLoaded && isWidgetLoaded && (
                    // @ts-ignore - Custom web component
                    <booking-widget company-guid={company.publicId}></booking-widget>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  )
} 
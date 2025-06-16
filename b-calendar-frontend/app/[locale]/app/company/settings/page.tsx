"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Building2, Loader2, Copy, Check, ChevronDown, ChevronUp } from "lucide-react"
import { config } from "@/lib/config"
import { useTranslations } from 'next-intl'
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

export default function SettingsPage() {
  const t = useTranslations('settings')
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

  const formSchema = z.object({
    CompanyName: z.string().min(2, t('form.fields.companyName.validation')),
    CompanyPhone: z.string().min(5, t('form.fields.phone.validation')),
    CompanyAddress: z.string().min(5, t('form.fields.address.validation')),
  })

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
          title: t('form.toast.loadError.title'),
          description: t('form.toast.loadError.description'),
        })
      }
    }
    fetchCompany()
  }, [form, toast, t])

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
        title: t('form.toast.updateSuccess.title'),
        description: t('form.toast.updateSuccess.description'),
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: t('form.toast.updateError.title'),
        description: t('form.toast.updateError.description'),
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
        title: t('widget.code.copy.success.title'),
        description: t('widget.code.copy.success.description'),
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: t('widget.code.copy.error.title'),
        description: t('widget.code.copy.error.description'),
      })
    }
  }

  const getEssentialEmbeddingCode = () => {
    if (!company?.publicId) return ""
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Widget Test</title>
    <style>
        body{margin:0;padding:20px;font-family:system-ui,-apple-system,sans-serif;overflow-x:hidden}
        #booking-container{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);justify-content:center;align-items:center;z-index:1000;overflow:hidden}
        .modal-content{position:relative;width:600px;max-width:95%;max-height:95vh;overflow:hidden}
        #close-btn{position:absolute;right:1rem;top:1rem;background:none;border:none;color:#fff;font-size:24px;cursor:pointer;z-index:1001}
        #open-btn{padding:.5rem 1rem;background:#0284c7;color:#fff;border:none;border-radius:.375rem;cursor:pointer}
        .modal-content ::-webkit-scrollbar{display:none}
    </style>
</head>
<body>
    <h1>Пример встраивания виджета</h1>
    <p>Нажмите на кнопку, чтобы вызвать форму бронирования.</p>
    <div id="booking-container">
        <div class="modal-content">
            <button id="close-btn">×</button>
        <booking-widget company-guid="${company.publicId}"></booking-widget>
    </div>
</div>
    <button id="open-btn">Забронировать услугу</button>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <link rel="stylesheet" href="http://localhost:3001/booking-widget.css">
    <script src="http://localhost:3001/booking-widget.js"></script>
    <script>
        window.addEventListener('load',()=>{const e=document.getElementById('open-btn'),t=document.getElementById('close-btn'),n=document.getElementById('booking-container'),o=e=>{document.body.style.overflow=e?'auto':'hidden',document.documentElement.style.overflow=e?'auto':'hidden'};e.addEventListener('click',()=>{n.style.display='flex',o(!1)}),t.addEventListener('click',()=>{n.style.display='none',o(!0)}),n.addEventListener('click',e=>{e.target===n&&(n.style.display='none',o(!0))})});
    </script>
</body>
</html>`
  }

  const getEmbeddingCode = () => {
    if (!company?.publicId) return ""
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Widget Test</title>
    <style>
        /* Базовые стили для страницы */
        body {
            margin: 0;
            padding: 20px;
            font-family: system-ui, -apple-system, sans-serif;
            overflow-x: hidden;
        }

        /* Контейнер модального окна */
        #booking-container {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.5);
            justify-content: center;
            align-items: center;
            z-index: 1000;
            overflow: hidden;
        }

        /* Контент модального окна */
        .modal-content {
            position: relative;
            width: 600px;
            max-width: 95%;
            max-height: 95vh;
            overflow: hidden;
        }

        /* Кнопка закрытия */
        #close-btn {
            position: absolute;
            right: 1rem;
            top: 1rem;
            background: none;
            border: none;
            color: #fff;
            font-size: 24px;
            cursor: pointer;
            z-index: 1001;
        }

        /* Кнопка открытия */
        #open-btn {
            padding: 0.5rem 1rem;
            background: #0284c7;
            color: #fff;
            border: none;
            border-radius: 0.375rem;
            cursor: pointer;
        }

        /* Скрываем скроллбар в модальном окне */
        .modal-content ::-webkit-scrollbar {
            display: none;
        }
    </style>
</head>
<body>
    <h1>Пример встраивания виджета</h1>
    <p>Нажмите на кнопку, чтобы вызвать форму бронирования.</p>

    <!-- Контейнер для виджета -->
    <div id="booking-container">
        <div class="modal-content">
            <button id="close-btn">×</button>
        <booking-widget company-guid="${company.publicId}"></booking-widget>
    </div>
</div>

<!-- Кнопка открытия -->
    <button id="open-btn">Забронировать услугу</button>

<!-- Подключение зависимостей -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<link rel="stylesheet" href="http://localhost:3001/booking-widget.css">
<script src="http://localhost:3001/booking-widget.js"></script>

    <!-- Инициализация виджета -->
<script>
    window.addEventListener('load', () => {
        const openBtn = document.getElementById('open-btn');
        const closeBtn = document.getElementById('close-btn');
        const container = document.getElementById('booking-container');

            // Функция для управления скроллом страницы
            const toggleScroll = (enable) => {
                document.body.style.overflow = enable ? 'auto' : 'hidden';
                document.documentElement.style.overflow = enable ? 'auto' : 'hidden';
            };

            // Открытие виджета
        openBtn.addEventListener('click', () => {
            container.style.display = 'flex';
                toggleScroll(false);
        });

            // Закрытие виджета по кнопке
        closeBtn.addEventListener('click', () => {
            container.style.display = 'none';
                toggleScroll(true);
            });

            // Закрытие виджета по клику вне контента
            container.addEventListener('click', (e) => {
                if (e.target === container) {
                    container.style.display = 'none';
                    toggleScroll(true);
                }
        });
    });
    </script>
</body>
</html>`
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground">{t('description')}</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-6 md:grid-cols-[200px_1fr]">
            <div className="flex flex-col items-center space-y-4">
              <div className="h-32 w-32 overflow-hidden rounded-full">
                {selectedImage ? (
                  <img
                    src={imagePreview}
                    alt={t('form.logo.preview')}
                    className="h-full w-full object-cover"
                  />
                ) : imagePreview ? (
                  <img
                    src={`${config.apiUrl}${imagePreview}`}
                    alt={t('form.logo.placeholder')}
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
                    {t('form.logo.change')}
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

            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="CompanyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('form.fields.companyName.label')}</FormLabel>
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
                      <FormLabel>{t('form.fields.phone.label')}</FormLabel>
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
                    <FormLabel>{t('form.fields.address.label')}</FormLabel>
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
                  {loading ? t('form.saving') : t('form.submit')}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>

      <Card>
        <CardHeader>
          <CardTitle>{t('widget.title')}</CardTitle>
          <CardDescription>{t('widget.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="text-sm font-medium mb-2">{t('widget.features.title')}</h4>
            <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1 mb-4">
              <li>{t('widget.features.list.responsive')}</li>
              <li>{t('widget.features.list.width')}</li>
              <li>{t('widget.features.list.scroll')}</li>
              <li>{t('widget.features.list.close')}</li>
              <li>{t('widget.features.list.button')}</li>
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
                      {t('widget.code.showLess')} <ChevronUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      {t('widget.code.showMore')} <ChevronDown className="h-4 w-4" />
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
            <h3 className="text-lg font-semibold mb-2">{t('widget.preview.title')}</h3>
            <p className="text-sm text-muted-foreground mb-4">{t('widget.preview.description')}</p>
            <div className="flex flex-col items-center gap-4">
              <Button 
                variant="default" 
                onClick={() => setShowWidget(!showWidget)}
              >
                {t('widget.preview.button')}
              </Button>
              <div className="text-sm text-muted-foreground">
                {!isReactLoaded ? t('widget.preview.status.loading.react') : 
                  !isWidgetLoaded ? t('widget.preview.status.loading.widget') : 
                  t('widget.preview.status.ready')}
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
    </div>
  )
} 
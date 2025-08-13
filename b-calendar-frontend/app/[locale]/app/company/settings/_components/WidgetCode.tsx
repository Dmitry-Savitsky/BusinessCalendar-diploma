"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Check, Copy } from "lucide-react"
import { useTranslations } from 'next-intl'
import { useToast } from "@/components/ui/use-toast"

export default function WidgetCode({ companyPublicId }: { companyPublicId: string | undefined }) {
  const t = useTranslations('settings')
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const [showFullCode, setShowFullCode] = useState(false)

  const essential = () => {
    if (!companyPublicId) return ""
    return `<!DOCTYPE html>\n<html>\n<head>\n  <meta charset=\"UTF-8\"/>\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"/>\n  <title>Booking</title>\n  <style>#booking-container{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);justify-content:center;align-items:center;z-index:1000;overflow:hidden}.modal-content{position:relative;width:600px;max-width:95%;max-height:95vh;overflow:hidden}#close-btn{position:absolute;right:1rem;top:1rem;background:none;border:none;color:#fff;font-size:24px;cursor:pointer;z-index:1001}#open-btn{padding:.5rem 1rem;background:#0284c7;color:#fff;border:none;border-radius:.375rem;cursor:pointer}.modal-content ::-webkit-scrollbar{display:none}</style>\n</head>\n<body>\n  <h1>Виджет бронирования</h1>\n  <div id=\"booking-container\"><div class=\"modal-content\"><button id=\"close-btn\">×</button><booking-widget company-guid=\"${companyPublicId}\"></booking-widget></div></div>\n  <button id=\"open-btn\">Забронировать услугу</button>\n  <script crossorigin src=\"https://unpkg.com/react@18/umd/react.production.min.js\"></script>\n  <script crossorigin src=\"https://unpkg.com/react-dom@18/umd/react-dom.production.min.js\"></script>\n  <link rel=\"stylesheet\" href=\"https://jobplanner.ru/widget/booking-widget.css\"/>\n  <script src=\"https://jobplanner.ru/widget/booking-widget.js\"></script>\n  <script>window.addEventListener('load',()=>{const e=document.getElementById('open-btn'),t=document.getElementById('close-btn'),n=document.getElementById('booking-container'),o=e=>{document.body.style.overflow=e?'auto':'hidden',document.documentElement.style.overflow=e?'auto':'hidden'};e.addEventListener('click',()=>{n.style.display='flex',o(!1)}),t.addEventListener('click',()=>{n.style.display='none',o(!0)}),n.addEventListener('click',e=>{e.target===n&&(n.style.display='none',o(!0))})});</script>\n</body>\n</html>`
  }

  const full = () => {
    if (!companyPublicId) return ""
    return essential()
  }

  const copy = async (text: string) => {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); toast({ title: t('widget.code.copy.success.title'), description: t('widget.code.copy.success.description') }) } catch { toast({ variant: 'destructive', title: t('widget.code.copy.error.title'), description: t('widget.code.copy.error.description') }) }
  }

  const code = showFullCode ? full() : essential()

  return (
    <Card>
      <CardHeader><CardTitle>{t('widget.title')}</CardTitle><CardDescription>{t('widget.description')}</CardDescription></CardHeader>
      <CardContent className="space-y-6">
        <div className="relative">
          <pre className="mt-4 rounded-lg bg-muted p-4 overflow-x-auto"><code className="text-sm">{code}</code></pre>
          <div className="absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-muted to-transparent pb-4 pt-10">
            <Button variant="outline" size="sm" onClick={() => setShowFullCode(!showFullCode)} className="flex items-center gap-1">{showFullCode ? (<>{t('widget.code.showLess')} <ChevronUp className="h-4 w-4" /></>) : (<>{t('widget.code.showMore')} <ChevronDown className="h-4 w-4" /></>)}</Button>
          </div>
          <Button variant="outline" size="icon" className="absolute right-6 top-6" onClick={() => copy(code)}>{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</Button>
        </div>
      </CardContent>
    </Card>
  )
}




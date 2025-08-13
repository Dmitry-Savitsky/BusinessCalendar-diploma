"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useTranslations } from 'next-intl'

export default function WidgetPreview({ companyPublicId }: { companyPublicId: string | undefined }) {
  const t = useTranslations('settings')
  const [showWidget, setShowWidget] = useState(false)
  const [isReactLoaded, setIsReactLoaded] = useState(false)
  const [isWidgetLoaded, setIsWidgetLoaded] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        if (!(window as any).React) {
          const s = document.createElement('script'); s.src = 'https://unpkg.com/react@18/umd/react.development.js'; s.crossOrigin = ''
          await new Promise<void>((res, rej) => { s.onload = () => res(); s.onerror = rej; document.head.appendChild(s) })
        }
        if (!(window as any).ReactDOM) {
          const s = document.createElement('script'); s.src = 'https://unpkg.com/react-dom@18/umd/react-dom.development.js'; s.crossOrigin = ''
          await new Promise<void>((res, rej) => { s.onload = () => res(); s.onerror = rej; document.head.appendChild(s) })
        }
        const css = document.createElement('link'); css.rel = 'stylesheet'; css.href = 'https://jobplanner.ru/widget/booking-widget.css'; document.head.appendChild(css)
        setIsReactLoaded(true)
        const w = document.createElement('script'); w.src = 'https://jobplanner.ru/widget/booking-widget.js'
        await new Promise<void>((res, rej) => { w.onload = () => { setIsWidgetLoaded(true); res() }; w.onerror = rej; document.head.appendChild(w) })
      } catch (e) { console.error(e) }
    }
    load()
  }, [])

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">{t('widget.preview.title')}</h3>
      <p className="text-sm text-muted-foreground mb-4">{t('widget.preview.description')}</p>
      <div className="flex flex-col items-center gap-4">
        <Button variant="default" onClick={() => setShowWidget(!showWidget)}>{t('widget.preview.button')}</Button>
        <div className="text-sm text-muted-foreground">{!isReactLoaded ? t('widget.preview.status.loading.react') : !isWidgetLoaded ? t('widget.preview.status.loading.widget') : t('widget.preview.status.ready')}</div>
      </div>
      {companyPublicId && (
        <div id="booking-container" style={{ display: showWidget ? 'flex' : 'none', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ position: 'relative', background: 'transparent', borderRadius: '0.5rem', maxWidth: '100%', width: '600px', maxHeight: '90vh', overflow: 'auto' }}>
            <button onClick={() => setShowWidget(false)} style={{ position: 'absolute', right: '1rem', top: '1rem', background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer', zIndex: 1001 }}>×</button>
            {(isReactLoaded && isWidgetLoaded) && (
              // @ts-ignore custom element
              <booking-widget company-guid={companyPublicId}></booking-widget>
            )}
          </div>
        </div>
      )}
    </div>
  )
}




"use client"

import { useEffect, useRef } from "react"

interface BookingWidgetPreviewProps {
  companyGuid: string
}

export default function BookingWidgetPreview({ companyGuid }: BookingWidgetPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // This simulates loading the widget from an external script
    // In a real environment, this would be loaded from the CDN
    if (containerRef.current) {
      const widget = document.createElement("booking-widget")
      widget.setAttribute("company-guid", companyGuid)
      containerRef.current.appendChild(widget)
    }

    return () => {
      if (containerRef.current && containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild)
      }
    }
  }, [companyGuid])

  return <div ref={containerRef} className="w-full"></div>
}

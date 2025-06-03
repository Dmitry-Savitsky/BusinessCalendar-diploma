"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { useLocale } from 'next-intl'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { locales } from "@/i18n.config"
import Image from "next/image"

const languages = [
  { 
    code: "en", 
    name: "English", 
    flag: (
      <Image
        src="/flags/gb.svg"
        alt="English"
        width={24}
        height={24}
        className="rounded-sm"
      />
    )
  },
  { 
    code: "ru", 
    name: "Русский", 
    flag: (
      <Image
        src="/flags/ru.svg"
        alt="Русский"
        width={24}
        height={24}
        className="rounded-sm"
      />
    )
  },
]

export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = useLocale()

  const switchLanguage = (locale: string) => {
    const segments = pathname.split('/')
    segments[1] = locale
    router.push(segments.join('/'))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="w-9 px-0">
          {languages.find(l => l.code === currentLocale)?.flag}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => switchLanguage(lang.code)}
            className="cursor-pointer flex items-center"
          >
            <span className="mr-2 flex items-center">{lang.flag}</span>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 
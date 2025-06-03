"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useTranslations } from 'next-intl'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const t = useTranslations('navbar')

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">B-Calendar</span>
          </Link>
            <ThemeToggle />
            <LanguageSwitcher />
          </div>

          <nav className="hidden md:flex md:items-center md:space-x-6">
            <Link href="/#features" className="text-sm font-medium transition-colors hover:text-primary">
              {t('features')}
            </Link>
            <Link href="/#faq" className="text-sm font-medium transition-colors hover:text-primary">
              {t('faq')}
            </Link>
            <Link href="/#about" className="text-sm font-medium transition-colors hover:text-primary">
              {t('about')}
            </Link>
            <Link href="/#contact" className="text-sm font-medium transition-colors hover:text-primary">
              {t('contact')}
            </Link>
          </nav>

          <div className="hidden md:flex md:items-center md:space-x-2">
            <Link href="/sign-in">
              <Button variant="outline">{t('signIn')}</Button>
            </Link>
            <Link href="/sign-up">
              <Button>{t('signUp')}</Button>
            </Link>
          </div>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl pb-4 md:hidden">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/#features"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('features')}
            </Link>
            <Link
              href="/#faq"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('faq')}
            </Link>
            <Link
              href="/#about"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('about')}
            </Link>
            <Link
              href="/#contact"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('contact')}
            </Link>
            <div className="flex flex-col space-y-2 pt-2">
              <Link href="/sign-in">
                <Button variant="outline" className="w-full">
                  {t('signIn')}
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="w-full">
                  {t('signUp')}
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

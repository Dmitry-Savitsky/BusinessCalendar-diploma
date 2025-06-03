"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { logout } from "@/lib/auth"
import {
  LayoutDashboard,
  Users,
  Calendar,
  Scissors,
  Settings,
  LogOut,
  Menu,
  X,
  ShoppingBag,
  UserRound,
} from "lucide-react"
import { useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useTranslations } from 'next-intl'

export default function CompanySidebar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const t = useTranslations('sidebar')

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const navItems = [
    {
      title: t('nav.dashboard'),
      href: "/app/company",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: t('nav.executors'),
      href: "/app/company/executors",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: t('nav.services'),
      href: "/app/company/services",
      icon: <Scissors className="h-5 w-5" />,
    },
    {
      title: t('nav.orders'),
      href: "/app/company/orders",
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      title: t('nav.schedule'),
      href: "/app/company/schedule",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      title: t('nav.clients'),
      href: "/app/company/clients",
      icon: <UserRound className="h-5 w-5" />,
    },
    {
      title: t('nav.settings'),
      href: "/app/company/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-background rounded-md p-2 shadow-md"
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar for desktop */}
      <div
        className={`
        fixed inset-y-0 left-0 z-40 w-64 transform bg-background border-r transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0
      `}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b px-6">
            <Link href="/app/company" className="flex items-center gap-2">
              <span className="text-xl font-bold">{t('title')}</span>
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
          </div>
          <div className="flex-1 overflow-auto py-6 px-4">
            <nav className="flex flex-col gap-2">
              {navItems.map((item, index) => (
                <Link key={index} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant={pathname === item.href ? "default" : "ghost"} className="w-full justify-start gap-2">
                    {item.icon}
                    {item.title}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>
          <div className="border-t p-4">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
              onClick={logout}
            >
              <LogOut className="h-5 w-5" />
              {t('logout')}
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Content padding for mobile */}
      <div className="md:pl-64"></div>
    </>
  )
}

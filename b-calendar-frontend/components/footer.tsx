import Link from "next/link"

export default function Footer() {
  return (
    <footer className="w-full border-t py-6 md:py-8">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-lg font-bold">B-Calendar</span>
            </Link>
            <nav className="flex gap-4 md:gap-6">
              <Link href="/#features" className="text-sm font-medium transition-colors hover:text-primary">
                Features
              </Link>
              <Link href="/#faq" className="text-sm font-medium transition-colors hover:text-primary">
                FAQ
              </Link>
              <Link href="/#about" className="text-sm font-medium transition-colors hover:text-primary">
                About Us
              </Link>
              <Link href="/#contact" className="text-sm font-medium transition-colors hover:text-primary">
                Contact
              </Link>
            </nav>
          </div>
          <div className="text-center text-sm text-muted-foreground md:text-right">
            &copy; {new Date().getFullYear()} B-Calendar. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}

import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import Features from "@/components/features"
import FAQ from "@/components/faq"
import Contact from "@/components/contact"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
          <Hero />
        </div>
        <Features />
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
          <FAQ />
        </div>
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

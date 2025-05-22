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
        <Hero />
        <Features />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

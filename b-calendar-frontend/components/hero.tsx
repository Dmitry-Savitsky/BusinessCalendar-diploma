import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container mx-auto">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Streamline Your Service Booking
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                B-Calendar helps service providers manage bookings, schedules, and clients all in one place. Perfect for
                cleaning services, photographers, hairdressers, and more.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/sign-up">
                <Button size="lg" className="w-full">
                  Get Started
                </Button>
              </Link>
              <Link href="/#features">
                <Button size="lg" variant="outline" className="w-full">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[350px] w-[350px] sm:h-[400px] sm:w-[400px] lg:h-[500px] lg:w-[500px]">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full opacity-20 blur-3xl"></div>
              <div className="relative h-full w-full rounded-xl border bg-background p-4 shadow-xl">
                <div className="h-full w-full rounded-lg bg-muted p-4">
                  <div className="space-y-2">
                    <div className="h-4 w-3/4 rounded bg-muted-foreground/20"></div>
                    <div className="h-4 w-1/2 rounded bg-muted-foreground/20"></div>
                  </div>
                  <div className="mt-6 grid grid-cols-7 gap-2">
                    {Array.from({ length: 31 }).map((_, i) => (
                      <div
                        key={i}
                        className={`aspect-square rounded p-2 text-center text-xs font-medium ${
                          i % 7 === 0 || i % 7 === 6
                            ? "bg-muted-foreground/10"
                            : i === 15
                              ? "bg-teal-500 text-white"
                              : "bg-muted-foreground/20"
                        }`}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import BookingWidgetPreview from "@/components/booking-widget-preview"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-3xl font-bold mb-8">Booking Widget Preview</h1>
      <div className="w-full max-w-md">
        <BookingWidgetPreview companyGuid="5134b320-8436-4445-a690-97959bd569fb" />
      </div>
    </main>
  )
}

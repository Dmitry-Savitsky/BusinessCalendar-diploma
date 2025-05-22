import { Calendar, Users, Clock, BarChart, Globe, Shield } from "lucide-react"

export default function Features() {
  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Features</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Everything you need to manage your service bookings efficiently
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <Calendar className="h-12 w-12 text-teal-500" />
            <h3 className="text-xl font-bold">Smart Scheduling</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Manage your service schedule with an intuitive calendar interface
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <Users className="h-12 w-12 text-teal-500" />
            <h3 className="text-xl font-bold">Team Management</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Assign services to specific executors and manage their schedules
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <Clock className="h-12 w-12 text-teal-500" />
            <h3 className="text-xl font-bold">Real-time Bookings</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Allow clients to book services in real-time with instant confirmation
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <BarChart className="h-12 w-12 text-teal-500" />
            <h3 className="text-xl font-bold">Analytics</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Track performance and gain insights into your business operations
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <Globe className="h-12 w-12 text-teal-500" />
            <h3 className="text-xl font-bold">Booking Widget</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Embed a booking widget on your website for seamless client experience
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <Shield className="h-12 w-12 text-teal-500" />
            <h3 className="text-xl font-bold">Secure Access</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Role-based access control for companies and executors
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

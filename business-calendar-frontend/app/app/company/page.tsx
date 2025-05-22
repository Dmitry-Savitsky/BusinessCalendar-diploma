"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Users, Package, Clock } from "lucide-react"
import { useEffect, useState } from "react"
import { getToken, parseToken } from "@/lib/auth"

export default function CompanyDashboard() {
  const [companyName, setCompanyName] = useState("Company")

  useEffect(() => {
    const token = getToken()
    if (token) {
      const tokenData = parseToken(token)
      // In a real app, you would fetch company data from the API using the token
      // For now, we'll just use a placeholder
      setCompanyName("Best Haircuts")
    }
  }, [])

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Executors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">+1 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+5 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Service Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.5h</div>
            <p className="text-xs text-muted-foreground">-15min from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Bookings</TabsTrigger>
          <TabsTrigger value="recent">Recent Bookings</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Bookings</CardTitle>
              <CardDescription>You have 24 upcoming bookings for the next 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Placeholder for upcoming bookings */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Haircut & Styling</CardTitle>
                        <CardDescription>
                          {new Date(Date.now() + 86400000 * (i + 1)).toLocaleDateString()} at{" "}
                          {["9:00 AM", "10:30 AM", "1:00 PM", "3:30 PM", "5:00 PM", "6:30 PM"][i]}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm">
                          <div className="font-medium">Client: John Doe</div>
                          <div className="text-muted-foreground">Executor: Sarah Johnson</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>You had 18 bookings in the past 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Placeholder for recent bookings */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                          {["Haircut", "Color Treatment", "Manicure", "Facial", "Massage", "Hair Styling"][i]}
                        </CardTitle>
                        <CardDescription>
                          {new Date(Date.now() - 86400000 * (i + 1)).toLocaleDateString()} at{" "}
                          {["2:00 PM", "11:30 AM", "4:00 PM", "10:00 AM", "1:30 PM", "5:30 PM"][i]}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm">
                          <div className="font-medium">
                            Client:{" "}
                            {
                              [
                                "Jane Smith",
                                "Robert Johnson",
                                "Emily Davis",
                                "Michael Brown",
                                "Sarah Wilson",
                                "David Miller",
                              ][i]
                            }
                          </div>
                          <div className="text-muted-foreground">
                            Executor:{" "}
                            {
                              [
                                "Mark Taylor",
                                "Lisa Anderson",
                                "James Wilson",
                                "Sarah Johnson",
                                "Thomas Moore",
                                "Jennifer Lee",
                              ][i]
                            }
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

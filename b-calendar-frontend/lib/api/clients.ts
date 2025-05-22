import { $authHost } from "./index"

// Types for client data
export interface ClientAddress {
  id: number
  address: string
}

export interface Client {
  publicId: string
  clientName: string
  clientPhone: string
  addresses: ClientAddress[]
}

// Get all clients for the company
export const getAllClients = async (): Promise<Client[]> => {
  try {
    const { data } = await $authHost.get("/api/company/clients")
    return data
  } catch (error) {
    console.error("Get all clients error:", error)
    throw error
  }
}

// Get a specific client by ID
export const getClientById = async (clientId: string): Promise<Client> => {
  try {
    const { data } = await $authHost.get(`/api/company/clients/${clientId}`)
    return data
  } catch (error) {
    console.error(`Get client ${clientId} error:`, error)
    throw error
  }
}

// Process orders to get client statistics
export const processClientStatistics = (orders: any[]) => {
  // Service distribution
  const serviceDistribution: Record<string, { count: number; revenue: number }> = {}

  // Orders by day
  const ordersByDay: Record<string, { count: number; revenue: number }> = {}

  // Client order counts
  const clientOrderCounts: Record<string, { count: number; revenue: number; name: string }> = {}

  orders.forEach((order) => {
    // Process service distribution
    order.items.forEach((item: any) => {
      if (!serviceDistribution[item.serviceName]) {
        serviceDistribution[item.serviceName] = { count: 0, revenue: 0 }
      }
      serviceDistribution[item.serviceName].count += 1
      serviceDistribution[item.serviceName].revenue += item.servicePrice
    })

    // Process orders by day
    const orderDate = new Date(order.orderStart).toISOString().split("T")[0]
    if (!ordersByDay[orderDate]) {
      ordersByDay[orderDate] = { count: 0, revenue: 0 }
    }
    ordersByDay[orderDate].count += 1

    // Calculate total order revenue
    const orderRevenue = order.items.reduce((total: number, item: any) => total + item.servicePrice, 0)
    ordersByDay[orderDate].revenue += orderRevenue

    // Process client order counts
    if (!clientOrderCounts[order.clientPublicId]) {
      clientOrderCounts[order.clientPublicId] = {
        count: 0,
        revenue: 0,
        name: order.clientName,
      }
    }
    clientOrderCounts[order.clientPublicId].count += 1
    clientOrderCounts[order.clientPublicId].revenue += orderRevenue
  })

  // Convert to arrays for charts
  const serviceDistributionData = Object.entries(serviceDistribution).map(([name, data]) => ({
    name,
    value: data.count,
    revenue: data.revenue,
  }))

  const ordersByDayData = Object.entries(ordersByDay)
    .map(([date, data]) => ({
      date,
      orders: data.count,
      revenue: data.revenue,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const topClientsData = Object.entries(clientOrderCounts)
    .map(([id, data]) => ({
      id,
      name: data.name,
      orders: data.count,
      revenue: data.revenue,
    }))
    .sort((a, b) => b.orders - a.orders)
    .slice(0, 10)

  return {
    serviceDistribution: serviceDistributionData,
    ordersByDay: ordersByDayData,
    topClients: topClientsData,
    totalClients: Object.keys(clientOrderCounts).length,
    totalOrders: orders.length,
    totalRevenue: Object.values(clientOrderCounts).reduce((total, client) => total + client.revenue, 0),
  }
}

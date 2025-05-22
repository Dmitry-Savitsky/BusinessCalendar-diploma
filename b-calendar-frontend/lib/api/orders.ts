import { $authHost } from "./index"

// Type for order/booking data
export interface OrderItem {
  serviceGuid: string
  serviceName: string
  serviceType: number
  servicePrice: number
  executorGuid: string
  executorName: string
  executorImgPath: string
  start: string
  requiresAddress: boolean
}

export interface Order {
  publicId: string
  comment: string | null
  confirmed: boolean
  completed: boolean | null
  orderStart: string
  orderEnd: string
  clientPublicId: string
  clientName: string
  clientPhone: string
  clientAddress: string | null
  items: OrderItem[]
}

// Get all orders for the company
export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const { data } = await $authHost.get("/api/orders")
    return data
  } catch (error) {
    console.error("Get all orders error:", error)
    throw error
  }
}

// Get orders/bookings for a specific executor
export const getOrdersByExecutor = async (executorId: string): Promise<Order[]> => {
  try {
    const { data } = await $authHost.get(`/api/orders/by-executor/${executorId}`)
    return data
  } catch (error) {
    console.error(`Get orders for executor ${executorId} error:`, error)
    throw error
  }
}

// Get orders/bookings for a specific service
export const getOrdersByService = async (serviceId: string): Promise<Order[]> => {
  try {
    const { data } = await $authHost.get(`/api/orders/by-service/${serviceId}`)
    return data
  } catch (error) {
    console.error(`Get orders for service ${serviceId} error:`, error)
    throw error
  }
}

// Get a specific order by ID
export const getOrderById = async (orderId: string): Promise<Order> => {
  try {
    const { data } = await $authHost.get(`/api/orders/${orderId}`)
    return data
  } catch (error) {
    console.error(`Get order ${orderId} error:`, error)
    throw error
  }
}

// Update order status (confirm)
export const confirmOrder = async (orderId: string): Promise<any> => {
  try {
    const { data } = await $authHost.put(`/api/orders/${orderId}`, {
      confirmed: true,
      completed: null,
    })
    return data
  } catch (error) {
    console.error(`Confirm order ${orderId} error:`, error)
    throw error
  }
}

// Update order status (complete)
export const completeOrder = async (orderId: string): Promise<any> => {
  try {
    const { data } = await $authHost.put(`/api/orders/${orderId}`, {
      confirmed: true,
      completed: true,
    })
    return data
  } catch (error) {
    console.error(`Complete order ${orderId} error:`, error)
    throw error
  }
}

// Update order status directly
export const updateOrderStatus = async (
  orderId: string,
  confirmed: boolean,
  completed: boolean | null,
): Promise<any> => {
  try {
    const { data } = await $authHost.put(`/api/orders/${orderId}`, {
      confirmed,
      completed,
    })
    return data
  } catch (error) {
    console.error(`Update order ${orderId} status error:`, error)
    throw error
  }
}

// Delete an order
export const deleteOrder = async (orderId: string): Promise<any> => {
  try {
    const { data } = await $authHost.delete(`/api/orders/${orderId}`)
    return data
  } catch (error) {
    console.error(`Delete order ${orderId} error:`, error)
    throw error
  }
}

// Format date for display
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "Europe/Minsk",
  })
}

// Format time for display
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Minsk",
  })
}

// Calculate total price of an order
export const calculateOrderTotal = (order: Order): number => {
  return order.items.reduce((total, item) => total + item.servicePrice, 0)
}

// Get order status display information
export const getOrderStatusInfo = (order: Order): { label: string; color: string; icon: string } => {
  if (order.completed) {
    return {
      label: "Completed",
      color: "green",
      icon: "check-circle",
    }
  } else if (order.confirmed) {
    const now = new Date()
    const orderDate = new Date(order.orderStart)
    if (orderDate > now) {
      return {
        label: "Confirmed",
        color: "blue",
        icon: "clock",
      }
    } else {
      return {
        label: "In Progress",
        color: "orange",
        icon: "activity",
      }
    }
  } else {
    return {
      label: "Pending",
      color: "yellow",
      icon: "alert-circle",
    }
  }
}

// Process order data to generate statistics for the dashboard
export const processOrderStatistics = (orders: Order[]) => {
  if (!orders || orders.length === 0) {
    return {
      totalOrders: 0,
      confirmedOrders: 0,
      completedOrders: 0,
      pendingOrders: 0,
      orderStatusMap: { all: 0, confirmed: 0, completed: 0 },
      orderDistribution: [],
      ordersByDay: [],
      topPerformers: [],
      topServices: [],
      priceVsPopularity: [],
      servicesByType: [],
    }
  }

  // Basic counts
  const totalOrders = orders.length
  const confirmedOrders = orders.filter((order) => order.confirmed).length
  const completedOrders = orders.filter((order) => order.completed).length
  const pendingOrders = orders.filter((order) => !order.confirmed && !order.completed).length

  // Order status map for funnel
  const orderStatusMap = {
    all: totalOrders,
    confirmed: confirmedOrders,
    completed: completedOrders,
  }

  // Order distribution for pie chart
  const orderDistribution = [
    { name: "Completed", value: completedOrders },
    { name: "Confirmed", value: confirmedOrders - completedOrders },
    { name: "Pending", value: pendingOrders },
  ].filter((item) => item.value > 0)

  // Group orders by day for line chart
  const ordersByDayMap = new Map()
  orders.forEach((order) => {
    const date = new Date(order.orderStart).toISOString().split("T")[0]
    if (!ordersByDayMap.has(date)) {
      ordersByDayMap.set(date, { date, orders: 0, revenue: 0 })
    }
    const dayData = ordersByDayMap.get(date)
    dayData.orders++
    dayData.revenue += calculateOrderTotal(order)
    ordersByDayMap.set(date, dayData)
  })
  const ordersByDay = Array.from(ordersByDayMap.values()).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )

  // Top performers by revenue
  const performersMap = new Map()
  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (!performersMap.has(item.executorGuid)) {
        performersMap.set(item.executorGuid, {
          id: item.executorGuid,
          name: item.executorName,
          image: item.executorImgPath,
          revenue: 0,
          orders: 0,
        })
      }
      const performer = performersMap.get(item.executorGuid)
      performer.revenue += item.servicePrice
      performer.orders++
      performersMap.set(item.executorGuid, performer)
    })
  })
  const topPerformers = Array.from(performersMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

  // Top services by popularity
  const servicesMap = new Map()
  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (!servicesMap.has(item.serviceGuid)) {
        servicesMap.set(item.serviceGuid, {
          id: item.serviceGuid,
          name: item.serviceName,
          count: 0,
          revenue: 0,
          price: item.servicePrice,
          type: item.serviceType,
        })
      }
      const service = servicesMap.get(item.serviceGuid)
      service.count++
      service.revenue += item.servicePrice
      servicesMap.set(item.serviceGuid, service)
    })
  })
  const topServices = Array.from(servicesMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // Price vs popularity scatter plot data
  const priceVsPopularity = Array.from(servicesMap.values()).map((service) => ({
    name: service.name,
    price: service.price,
    popularity: service.count,
    revenue: service.revenue,
  }))

  // Services by type
  const serviceTypeMap = new Map()
  Array.from(servicesMap.values()).forEach((service) => {
    const typeName = getServiceTypeName(service.type)
    if (!serviceTypeMap.has(typeName)) {
      serviceTypeMap.set(typeName, { name: typeName, count: 0 })
    }
    const typeData = serviceTypeMap.get(typeName)
    typeData.count += service.count
    serviceTypeMap.set(typeName, typeData)
  })
  const servicesByType = Array.from(serviceTypeMap.values())

  return {
    totalOrders,
    confirmedOrders,
    completedOrders,
    pendingOrders,
    orderStatusMap,
    orderDistribution,
    ordersByDay,
    topPerformers,
    topServices,
    priceVsPopularity,
    servicesByType,
  }
}

// Helper function to get service type name
const getServiceTypeName = (typeId: number): string => {
  const types: Record<number, string> = {
    1: "Haircut",
    2: "Coloring",
    3: "Styling",
    4: "Treatment",
    5: "Consultation",
  }
  return types[typeId] || `Type ${typeId}`
}

// Get order data for calendar display
export const getOrderCalendarData = (orders: Order[]) => {
  const calendarData = new Map()

  orders.forEach((order) => {
    const date = new Date(order.orderStart).toISOString().split("T")[0]
    if (!calendarData.has(date)) {
      calendarData.set(date, { date, count: 0 })
    }
    const dayData = calendarData.get(date)
    dayData.count++
    calendarData.set(date, dayData)
  })

  return Array.from(calendarData.values())
}

// Get orders for today
export const getOrdersForToday = async (): Promise<Order[]> => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const { data } = await $authHost.get("/api/orders", {
      params: {
        startDate: today.toISOString(),
        endDate: tomorrow.toISOString(),
      },
    })

    return data
  } catch (error) {
    console.error("Get orders for today error:", error)
    throw error
  }
}

// Get orders for current week
export const getOrdersForWeek = async (): Promise<Order[]> => {
  try {
    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay()) // Start of week (Sunday)
    startOfWeek.setHours(0, 0, 0, 0)

    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 7) // End of week (next Sunday)

    const { data } = await $authHost.get("/api/orders", {
      params: {
        startDate: startOfWeek.toISOString(),
        endDate: endOfWeek.toISOString(),
      },
    })

    return data
  } catch (error) {
    console.error("Get orders for week error:", error)
    throw error
  }
}

// Get orders for current month
export const getOrdersForMonth = async (): Promise<Order[]> => {
  try {
    const today = new Date()
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999)

    const { data } = await $authHost.get("/api/orders", {
      params: {
        startDate: startOfMonth.toISOString(),
        endDate: endOfMonth.toISOString(),
      },
    })

    return data
  } catch (error) {
    console.error("Get orders for month error:", error)
    throw error
  }
}

// Get orders for a specific date range
export const getOrdersByDateRange = async (startDate: Date, endDate: Date): Promise<Order[]> => {
  try {
    // Ensure end date includes the full day
    const adjustedEndDate = new Date(endDate)
    adjustedEndDate.setHours(23, 59, 59, 999)

    const { data } = await $authHost.get("/api/orders", {
      params: {
        startDate: startDate.toISOString(),
        endDate: adjustedEndDate.toISOString(),
      },
    })

    return data
  } catch (error) {
    console.error("Get orders by date range error:", error)
    throw error
  }
}

import { $authHost } from "./index"
import type { Order } from "./orders"

// Get all orders for the current executor
export const getMyOrders = async (): Promise<Order[]> => {
  try {
    const { data } = await $authHost.get("/api/orders/my")
    return data
  } catch (error) {
    console.error("Get my orders error:", error)
    throw error
  }
}

// Calculate statistics from orders
export const calculateOrderStats = (orders: Order[]) => {
  const now = new Date()

  // Basic counts
  const totalOrders = orders.length
  const completedOrders = orders.filter((order) => order.completed === true).length
  const upcomingOrders = orders.filter((order) => {
    const orderDate = new Date(order.orderStart)
    return orderDate > now && !order.completed
  }).length
  const pendingOrders = orders.filter((order) => !order.confirmed && !order.completed).length

  // Revenue statistics
  const totalRevenue = orders.reduce((sum, order) => {
    return sum + order.items.reduce((itemSum, item) => itemSum + item.servicePrice, 0)
  }, 0)

  const completedRevenue = orders
    .filter((order) => order.completed === true)
    .reduce((sum, order) => {
      return sum + order.items.reduce((itemSum, item) => itemSum + item.servicePrice, 0)
    }, 0)

  const upcomingRevenue = orders
    .filter((order) => {
      const orderDate = new Date(order.orderStart)
      return orderDate > now && !order.completed
    })
    .reduce((sum, order) => {
      return sum + order.items.reduce((itemSum, item) => itemSum + item.servicePrice, 0)
    }, 0)

  // Service type distribution
  const serviceTypes = new Map<number, { count: number; name: string }>()
  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (!serviceTypes.has(item.serviceType)) {
        serviceTypes.set(item.serviceType, { count: 0, name: item.serviceName })
      }
      const current = serviceTypes.get(item.serviceType)!
      serviceTypes.set(item.serviceType, { ...current, count: current.count + 1 })
    })
  })

  // Format for chart data
  const serviceTypeData = Array.from(serviceTypes.entries()).map(([type, data]) => ({
    type,
    name: data.name,
    count: data.count,
  }))

  // Today's orders
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const todaysOrders = orders.filter((order) => {
    const orderDate = new Date(order.orderStart)
    return orderDate >= today && orderDate < tomorrow
  })

  // This week's orders
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay())
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 7)

  const thisWeeksOrders = orders.filter((order) => {
    const orderDate = new Date(order.orderStart)
    return orderDate >= startOfWeek && orderDate < endOfWeek
  })

  return {
    totalOrders,
    completedOrders,
    upcomingOrders,
    pendingOrders,
    totalRevenue,
    completedRevenue,
    upcomingRevenue,
    serviceTypeData,
    todaysOrders,
    thisWeeksOrders,
  }
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

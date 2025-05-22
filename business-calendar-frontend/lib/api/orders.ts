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

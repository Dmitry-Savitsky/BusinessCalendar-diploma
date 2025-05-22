import { $authHost } from "./index"

// Type for available time slot
export interface TimeSlot {
  time: string
  available: boolean
}

// Get available time slots for a service and executor on a specific date
export const getAvailableTimeSlots = async (
  serviceGuid: string,
  executorGuid: string,
  date: string,
): Promise<TimeSlot[]> => {
  try {
    const { data } = await $authHost.get(
      `/api/booking/slots?serviceGuid=${serviceGuid}&executorGuid=${executorGuid}&date=${date}`,
    )
    return data
  } catch (error) {
    console.error("Get available time slots error:", error)
    throw error
  }
}

// Create a new order
export interface OrderItem {
  serviceGuid: string
  executorGuid: string
  start: string
  requiresAddress: boolean
}

export interface CreateOrderRequest {
  companyGuid?: string // Optional, will be taken from token if not provided
  clientName: string
  clientPhone: string
  clientAddress: string | null
  comment: string | null
  items: OrderItem[]
}

export const createOrder = async (orderData: CreateOrderRequest): Promise<any> => {
  try {
    const { data } = await $authHost.post("/api/orders/company", orderData)
    return data
  } catch (error) {
    console.error("Create order error:", error)
    throw error
  }
}

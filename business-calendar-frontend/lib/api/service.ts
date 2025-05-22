import { $authHost } from "./index"

// Types for service data
export interface Service {
  publicId: string
  serviceName: string
  serviceType: number
  servicePrice: number
  durationMinutes: number
  requiresAddress: boolean
}

// Get all services for the company
export const getServices = async (): Promise<Service[]> => {
  try {
    const { data } = await $authHost.get("/api/service")
    return data
  } catch (error) {
    console.error("Get services error:", error)
    throw error
  }
}

// Get a specific service by publicId
export const getServiceById = async (publicId: string): Promise<Service> => {
  try {
    const { data } = await $authHost.get(`/api/service/${publicId}`)
    return data
  } catch (error) {
    console.error(`Get service ${publicId} error:`, error)
    throw error
  }
}

// Add a new service
export const addService = async (service: Omit<Service, "publicId">): Promise<Service> => {
  try {
    const { data } = await $authHost.post("/api/service", service)
    return data
  } catch (error) {
    console.error("Add service error:", error)
    throw error
  }
}

// Update a service
export const updateService = async (publicId: string, service: Omit<Service, "publicId">): Promise<Service> => {
  try {
    const { data } = await $authHost.put(`/api/service/${publicId}`, service)
    return data
  } catch (error) {
    console.error(`Update service ${publicId} error:`, error)
    throw error
  }
}

// Delete a service
export const deleteService = async (publicId: string): Promise<void> => {
  try {
    await $authHost.delete(`/api/service/${publicId}`)
  } catch (error) {
    console.error(`Delete service ${publicId} error:`, error)
    throw error
  }
}

// Service type mapping
export const serviceTypeMap: Record<number, string> = {
  1: "Haircut",
  2: "Styling",
  3: "Coloring",
  4: "Treatment",
  5: "Consultation",
  6: "Other",
}

// Get service type name
export const getServiceTypeName = (type: number): string => {
  return serviceTypeMap[type] || "Unknown"
}

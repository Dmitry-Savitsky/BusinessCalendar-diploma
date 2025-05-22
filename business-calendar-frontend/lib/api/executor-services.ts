import { $authHost } from "./index"

// Type for executor-service relationship
export interface ExecutorService {
  executorPublicId: string
  executorName: string
  executorImgPath: string
  servicePublicId: string
  serviceName: string
  servicePrice: number
  durationMinutes: number
}

// Get executors assigned to a service
export const getExecutorsForService = async (serviceId: string): Promise<ExecutorService[]> => {
  try {
    const { data } = await $authHost.get(`/api/executor-services/service/${serviceId}`)
    return data
  } catch (error) {
    console.error(`Get executors for service ${serviceId} error:`, error)
    throw error
  }
}

// Assign an executor to a service
export const assignExecutorToService = async (executorGuid: string, serviceGuid: string): Promise<any> => {
  try {
    const { data } = await $authHost.post("/api/executor-services", {
      executorGuid,
      serviceGuid,
    })
    return data
  } catch (error) {
    console.error(`Assign executor ${executorGuid} to service ${serviceGuid} error:`, error)
    throw error
  }
}

// Remove an executor from a service (if API supports this)
export const removeExecutorFromService = async (executorGuid: string, serviceGuid: string): Promise<any> => {
  try {
    const { data } = await $authHost.delete("/api/executor-services", {
      data: {
        executorGuid,
        serviceGuid,
      },
    })
    return data
  } catch (error) {
    console.error(`Remove executor ${executorGuid} from service ${serviceGuid} error:`, error)
    throw error
  }
}

// Get services assigned to an executor
export const getServicesForExecutor = async (executorId: string): Promise<ExecutorService[]> => {
  try {
    const { data } = await $authHost.get(`/api/executor-services/executor/${executorId}`)
    return data
  } catch (error) {
    console.error(`Get services for executor ${executorId} error:`, error)
    throw error
  }
}

import { $authHost } from "./index"

// Types for executor data
export interface Executor {
  guid: string
  name: string
  phone: string
  description: string
  imgPath: string
}

// Type for executor work time
export interface ExecutorWorkTime {
  dayNo: number
  isWorking: boolean
  fromTime: string
  tillTime: string
  breakStart: string
  breakEnd: string
}

// Get all executors for the company
export const getExecutors = async (): Promise<Executor[]> => {
  try {
    const { data } = await $authHost.get("/api/Executor")
    return data
  } catch (error) {
    console.error("Get executors error:", error)
    throw error
  }
}

// Get current executor information
export const getMyExecutorInfo = async (): Promise<Executor> => {
  try {
    const { data } = await $authHost.get("/api/Executor/me")
    return data
  } catch (error) {
    console.error("Get my executor info error:", error)
    throw error
  }
}

// Get a specific executor by GUID
export const getExecutorByGuid = async (guid: string): Promise<Executor> => {
  try {
    const { data } = await $authHost.get(`/api/Executor/${guid}`)
    return data
  } catch (error) {
    console.error(`Get executor ${guid} error:`, error)
    throw error
  }
}

// Add a new executor
export const addExecutor = async (executorData: {
  executorName: string
  executorPhone: string
  description: string
}) => {
  try {
    const { data } = await $authHost.post("/api/Executor/add", executorData)
    return data
  } catch (error) {
    console.error("Add executor error:", error)
    throw error
  }
}

// Update an executor with image
export const updateExecutor = async (guid: string, formData: FormData) => {
  try {
    const { data } = await $authHost.put(`/api/Executor/update/${guid}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return data
  } catch (error) {
    console.error(`Update executor ${guid} error:`, error)
    throw error
  }
}

// Delete an executor
export const deleteExecutor = async (guid: string) => {
  try {
    const { data } = await $authHost.delete(`/api/Executor/${guid}`)
    return data
  } catch (error) {
    console.error(`Delete executor ${guid} error:`, error)
    throw error
  }
}

// Get executor work time
export const getExecutorWorkTime = async (guid: string): Promise<ExecutorWorkTime[]> => {
  try {
    const { data } = await $authHost.get(`/api/Executor/${guid}/worktime`)
    return data
  } catch (error) {
    console.error(`Get executor ${guid} work time error:`, error)
    throw error
  }
}

// Get current executor work time
export const getMyWorkTime = async (): Promise<ExecutorWorkTime[]> => {
  try {
    const { data } = await $authHost.get("/api/Executor/me/worktime")
    return data
  } catch (error) {
    console.error("Get my work time error:", error)
    throw error
  }
}

// Update executor work time
export const updateExecutorWorkTime = async (guid: string, workTime: ExecutorWorkTime[]) => {
  try {
    const { data } = await $authHost.put(`/api/Executor/${guid}/worktime`, workTime)
    return data
  } catch (error) {
    console.error(`Update executor ${guid} work time error:`, error)
    throw error
  }
}

import { $authHost } from "./index"

// Types for company data
export interface Company {
  guid: string
  name: string
  phone: string
  address: string
}

// Get company profile
export const getCompanyProfile = async (): Promise<Company> => {
  try {
    const { data } = await $authHost.get("/api/Company/Profile")
    return data
  } catch (error) {
    console.error("Get company profile error:", error)
    throw error
  }
}

// Update company profile
export const updateCompanyProfile = async (profile: Partial<Company>) => {
  try {
    const { data } = await $authHost.put("/api/Company/Profile", profile)
    return data
  } catch (error) {
    console.error("Update company profile error:", error)
    throw error
  }
}

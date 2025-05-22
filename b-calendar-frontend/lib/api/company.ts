import { $authHost } from "./index"

// Types for company data
export interface Company {
  publicId: string
  companyName: string
  companyPhone: string
  companyAddress: string
  imgPath: string
  login: string
}

export interface UpdateCompanyData {
  CompanyName: string
  CompanyPhone: string
  CompanyAddress: string
  image?: File
}

// Get company profile
export const getCompanyProfile = async (): Promise<Company> => {
  try {
    const { data } = await $authHost.get("/api/Company/me")
    return data
  } catch (error) {
    console.error("Get company profile error:", error)
    throw error
  }
}

// Update company profile
export const updateCompanyProfile = async (profile: UpdateCompanyData) => {
  try {
    const formData = new FormData()
    formData.append("CompanyName", profile.CompanyName)
    formData.append("CompanyPhone", profile.CompanyPhone)
    formData.append("CompanyAddress", profile.CompanyAddress)
    
    if (profile.image) {
      formData.append("image", profile.image)
    }

    const { data } = await $authHost.put("/api/Company/update", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return data
  } catch (error) {
    console.error("Update company profile error:", error)
    throw error
  }
}

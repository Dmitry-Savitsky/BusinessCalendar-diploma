import { $host } from "./index"

// Company authentication
export const companyLogin = async (login: string, password: string) => {
  try {
    const { data } = await $host.post("/api/Company/Login", {
      login,
      password,
    })

    if (data.token) {
      localStorage.setItem("token", data.token)
      localStorage.setItem("userRole", "company")
    }

    return data
  } catch (error) {
    console.error("Company login error:", error)
    throw error
  }
}

export const companyRegister = async (
  companyName: string,
  companyPhone: string,
  companyAddress: string,
  login: string,
  password: string,
) => {
  try {
    const { data } = await $host.post("/api/Company/Register", {
      companyName,
      companyPhone,
      companyAddress,
      login,
      password,
    })

    if (data.token) {
      localStorage.setItem("token", data.token)
      localStorage.setItem("userRole", "company")
    }

    return data
  } catch (error) {
    console.error("Company registration error:", error)
    throw error
  }
}

// Executor authentication
export const executorLogin = async (executorPhone: string, password: string) => {
  try {
    const { data } = await $host.post("/api/Executor/Login", {
      executorPhone,
      password,
    })

    if (data.token) {
      localStorage.setItem("token", data.token)
      localStorage.setItem("userRole", "executor")
    }

    return data
  } catch (error) {
    console.error("Executor login error:", error)
    throw error
  }
}

export const executorRegister = async (executorGuid: string, executorPhone: string, password: string) => {
  try {
    const { data } = await $host.post("/api/Executor/Register", {
      executorGuid,
      executorPhone,
      password,
    })

    if (data.token) {
      localStorage.setItem("token", data.token)
      localStorage.setItem("userRole", "executor")
    }

    return data
  } catch (error) {
    console.error("Executor registration error:", error)
    throw error
  }
}

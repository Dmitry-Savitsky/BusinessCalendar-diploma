import axios from "axios"
import { config } from "@/lib/config"

const $host = axios.create({
  baseURL: config.apiUrl,
})

const $authHost = axios.create({
  baseURL: config.apiUrl,
})

const authInterceptor = (config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.authorization = `Bearer ${token}`
  }
  return config
}

$authHost.interceptors.request.use(authInterceptor)

export { $host, $authHost }

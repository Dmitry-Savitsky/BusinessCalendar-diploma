// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false

  const token = localStorage.getItem("token")
  return !!token
}

// Get user role
export const getUserRole = (): string | null => {
  if (typeof window === "undefined") return null

  return localStorage.getItem("userRole")
}

// Get auth token
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null

  return localStorage.getItem("token")
}

// Logout user
export const logout = (): void => {
  if (typeof window === "undefined") return

  localStorage.removeItem("token")
  localStorage.removeItem("userRole")

  // Redirect to home page
  window.location.href = "/"
}

// Parse JWT token to get user info
export const parseToken = (token: string): any => {
  try {
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    return null
  }
}
